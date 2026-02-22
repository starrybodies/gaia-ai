import os
import requests
from datetime import datetime, timezone
from dagster import asset, get_dagster_logger
from gaia_pipeline.resources import DatabaseResource

OPENAQ_API_KEY = os.getenv("OPENAQ_API_KEY", "")

AQI_THRESHOLDS = {
    'pm25': [
        (12.0, 'GOOD'), (35.4, 'MODERATE'), (54.9, 'UNHEALTHY_SENSITIVE'),
        (150.4, 'UNHEALTHY'), (249.9, 'VERY_UNHEALTHY'), (float('inf'), 'HAZARDOUS')
    ],
    'pm10': [
        (54, 'GOOD'), (154, 'MODERATE'), (254, 'UNHEALTHY_SENSITIVE'),
        (354, 'UNHEALTHY'), (424, 'VERY_UNHEALTHY'), (float('inf'), 'HAZARDOUS')
    ],
    'o3': [
        (54, 'GOOD'), (70, 'MODERATE'), (85, 'UNHEALTHY_SENSITIVE'),
        (105, 'UNHEALTHY'), (200, 'VERY_UNHEALTHY'), (float('inf'), 'HAZARDOUS')
    ],
}

def classify_aqi(metric: str, value: float) -> str:
    thresholds = AQI_THRESHOLDS.get(metric, AQI_THRESHOLDS['pm25'])
    for threshold, label in thresholds:
        if value <= threshold:
            return label
    return 'HAZARDOUS'

def parse_openaq_response(response: dict) -> list[dict]:
    readings = []
    for result in response.get('results', []):
        coords = result.get('coordinates', {})
        lat = coords.get('latitude')
        lon = coords.get('longitude')
        if lat is None or lon is None:
            continue
        for measurement in result.get('measurements', []):
            readings.append({
                'sensor_id': result.get('id'),
                'name': result.get('name'),
                'lat': lat,
                'lon': lon,
                'metric': measurement.get('parameter'),
                'value': measurement.get('value'),
                'unit': measurement.get('unit', 'µg/m³'),
            })
    return readings

@asset(
    description="Ingest air quality measurements from OpenAQ v3",
    group_name="air_quality",
)
def openaq_asset(context, db: DatabaseResource) -> dict:
    logger = get_dagster_logger()

    headers = {"X-API-Key": OPENAQ_API_KEY}
    params = {"limit": 1000, "page": 1, "order_by": "lastUpdated", "sort": "desc"}
    resp = requests.get(
        "https://api.openaq.org/v3/locations",
        headers=headers, params=params, timeout=30
    )
    resp.raise_for_status()

    readings = parse_openaq_response(resp.json())

    conn = db.get_connection()
    inserted = 0
    with conn.cursor() as cur:
        for r in readings:
            if r['value'] is None or r['metric'] is None:
                continue
            cur.execute("""
                INSERT INTO sensor_readings (time, sensor_id, metric, value, unit, location, h3_resolution5)
                VALUES (%s, %s, %s, %s, %s, ST_MakePoint(%s, %s)::geometry, NULL)
            """, (
                datetime.now(timezone.utc),
                r['sensor_id'], r['metric'], r['value'], r['unit'],
                r['lon'], r['lat'],
            ))
            inserted += cur.rowcount
    conn.commit()
    conn.close()

    logger.info(f"Ingested {inserted} air quality readings from OpenAQ")
    return {"inserted": inserted}
