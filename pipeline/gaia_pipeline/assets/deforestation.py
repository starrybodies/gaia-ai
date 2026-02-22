import os
import json
import requests
import h3
from datetime import datetime, timezone
from dagster import asset, get_dagster_logger
from gaia_pipeline.resources import DatabaseResource

GFW_API_KEY = os.getenv("GFW_API_KEY", "")
GFW_BASE_URL = "https://data-api.globalforestwatch.org"

def classify_alert_severity(alert_count: int, area_ha: float, confidence: str) -> str:
    score = 0
    if area_ha >= 50:
        score += 3
    elif area_ha >= 10:
        score += 2
    elif area_ha >= 1:
        score += 1

    if alert_count >= 100:
        score += 3
    elif alert_count >= 30:
        score += 2
    elif alert_count >= 10:
        score += 1

    if confidence == 'high':
        score += 2
    elif confidence == 'medium':
        score += 1

    if score >= 7:
        return 'CRITICAL'
    elif score >= 4:
        return 'HIGH'
    elif score >= 2:
        return 'MEDIUM'
    return 'LOW'

def parse_gfw_response(response: dict) -> list[dict]:
    events = []
    for item in response.get('data', []):
        lat = item.get('latitude')
        lon = item.get('longitude')
        if lat is None or lon is None:
            continue
        events.append({
            'lat': float(lat),
            'lon': float(lon),
            'alert_count': item.get('alert_count', 0),
            'area_ha': float(item.get('alert_area__ha', 0)),
            'confidence': item.get('confidence', 'low'),
        })
    return events

@asset(
    description="Ingest deforestation alerts from Global Forest Watch integrated alerts",
    group_name="deforestation",
)
def gfw_alerts_asset(context, db: DatabaseResource) -> dict:
    logger = get_dagster_logger()

    headers = {"x-api-key": GFW_API_KEY}
    payload = {
        "sql": "SELECT latitude, longitude, alert_count, alert_area__ha, confidence FROM data WHERE alert__date >= CURRENT_DATE - INTERVAL '1 day'",
        "format": "json"
    }

    resp = requests.post(
        f"{GFW_BASE_URL}/dataset/gfw_integrated_alerts/latest/query",
        json=payload, headers=headers, timeout=60
    )
    resp.raise_for_status()

    events = parse_gfw_response(resp.json())

    conn = db.get_connection()
    inserted = 0
    try:
        with conn.cursor() as cur:
            for e in events:
                severity = classify_alert_severity(e['alert_count'], e['area_ha'], e['confidence'])
                h3_index = h3.latlng_to_cell(e['lat'], e['lon'], 5)
                confidence_val = 1.0 if e['confidence'] == 'high' else 0.6 if e['confidence'] == 'medium' else 0.3
                cur.execute("""
                    INSERT INTO events (time, event_type, severity, location, h3_resolution5, properties, source, confidence)
                    VALUES (%s, 'deforestation', %s, ST_MakePoint(%s, %s)::geometry, %s, %s::jsonb, 'GFW', %s)
                """, (
                    datetime.now(timezone.utc),
                    severity,
                    e['lon'], e['lat'],
                    h3_index,
                    json.dumps({'alert_count': e['alert_count'], 'area_ha': e['area_ha']}),
                    confidence_val,
                ))
                inserted += cur.rowcount
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

    logger.info(f"Ingested {inserted} deforestation alerts from GFW")
    return {"inserted": inserted}
