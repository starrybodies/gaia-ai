import io
import csv
import os
import json
import h3
import requests
from datetime import datetime, timezone
from dagster import asset, get_dagster_logger

FIRMS_MAP_KEY = os.getenv("FIRMS_MAP_KEY", "")

SEVERITY_THRESHOLDS = [
    ('CRITICAL', 360),
    ('HIGH', 330),
    ('MEDIUM', 310),
    ('LOW', 0),
]

def parse_firms_csv(csv_text: str) -> list[dict]:
    """Parse FIRMS API CSV response into list of raw fire dicts."""
    reader = csv.DictReader(io.StringIO(csv_text.strip()))
    events = []
    for row in reader:
        try:
            confidence_raw = row.get('confidence', '50')
            # FIRMS returns confidence as 0-100 integer or 'l'/'n'/'h' string
            if confidence_raw in ('l', 'low'):
                confidence = 0.3
            elif confidence_raw in ('n', 'nominal'):
                confidence = 0.6
            elif confidence_raw in ('h', 'high'):
                confidence = 0.9
            else:
                conf_val = float(confidence_raw)
                confidence = conf_val / 100.0 if conf_val > 1.0 else conf_val

            events.append({
                'lat': float(row['latitude']),
                'lon': float(row['longitude']),
                'brightness': float(row.get('brightness', row.get('bright_ti4', '300'))),
                'confidence': confidence,
                'acq_date': row.get('acq_date', ''),
                'frp': float(row.get('frp', '0')),
            })
        except (ValueError, KeyError):
            continue
    return events

def normalize_fire_event(raw: dict) -> dict:
    """Normalize a raw fire dict: assign H3 index and severity."""
    h3_index = h3.latlng_to_cell(raw['lat'], raw['lon'], 5)

    brightness = raw.get('brightness', 300)
    severity = 'LOW'
    for sev, threshold in SEVERITY_THRESHOLDS:
        if brightness >= threshold:
            severity = sev
            break

    return {
        'lat': raw['lat'],
        'lon': raw['lon'],
        'h3_index': h3_index,
        'brightness': brightness,
        'confidence': raw.get('confidence', 0.5),
        'frp': raw.get('frp', 0),
        'severity': severity,
        'source': 'NASA_FIRMS',
        'event_type': 'fire',
        'timestamp': datetime.now(timezone.utc).isoformat(),
    }

@asset(
    description="Ingest near-real-time fire detections from NASA FIRMS VIIRS",
    group_name="fires",
)
def nasa_fires_asset(context, db, redis) -> dict:
    logger = get_dagster_logger()

    url = f"https://firms.modaps.eosdis.nasa.gov/api/area/csv/{FIRMS_MAP_KEY}/VIIRS_NOAA20_NRT/-180,-90,180,90/1"
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()

    raw_events = parse_firms_csv(resp.text)
    normalized = [normalize_fire_event(e) for e in raw_events]

    conn = db.get_connection()
    inserted = 0
    with conn.cursor() as cur:
        for event in normalized:
            cur.execute("""
                INSERT INTO events (time, event_type, severity, location, h3_resolution5, properties, source, confidence)
                VALUES (%s, 'fire', %s, ST_MakePoint(%s, %s)::geometry, %s, %s::jsonb, 'NASA_FIRMS', %s)
                ON CONFLICT DO NOTHING
            """, (
                event['timestamp'],
                event['severity'],
                event['lon'],
                event['lat'],
                event['h3_index'],
                json.dumps({'brightness': event['brightness'], 'frp': event['frp']}),
                event['confidence'],
            ))
            inserted += 1
    conn.commit()
    conn.close()

    logger.info(f"Ingested {inserted} fire events from NASA FIRMS")
    return {"inserted": inserted, "total_raw": len(raw_events)}
