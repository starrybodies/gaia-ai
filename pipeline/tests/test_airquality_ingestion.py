from gaia_pipeline.assets.airquality import parse_openaq_response, classify_aqi

SAMPLE_RESPONSE = {
    "results": [
        {
            "id": 12345,
            "name": "London - Marylebone Road",
            "coordinates": {"latitude": 51.5, "longitude": -0.12},
            "measurements": [{"parameter": "pm25", "value": 45.2, "unit": "µg/m³"}]
        }
    ]
}

def test_parse_openaq_response():
    readings = parse_openaq_response(SAMPLE_RESPONSE)
    assert len(readings) == 1
    assert readings[0]['metric'] == 'pm25'
    assert readings[0]['value'] == 45.2
    assert readings[0]['lat'] == 51.5

def test_classify_aqi_good():
    assert classify_aqi('pm25', 5.0) == 'GOOD'

def test_classify_aqi_unhealthy():
    assert classify_aqi('pm25', 55.0) == 'UNHEALTHY'

def test_classify_aqi_hazardous():
    assert classify_aqi('pm25', 250.0) == 'HAZARDOUS'
