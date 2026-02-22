from gaia_pipeline.assets.deforestation import parse_gfw_response, classify_alert_severity

SAMPLE_GFW = {
    "data": [
        {
            "latitude": -3.5,
            "longitude": -52.3,
            "alert_count": 45,
            "alert_area__ha": 23.4,
            "confidence": "high",
        },
        {
            "latitude": 2.1,
            "longitude": 14.5,
            "alert_count": 3,
            "alert_area__ha": 0.5,
            "confidence": "low",
        }
    ]
}

def test_parse_gfw_response():
    events = parse_gfw_response(SAMPLE_GFW)
    assert len(events) == 2
    assert events[0]['area_ha'] == 23.4
    assert events[0]['confidence'] == 'high'

def test_classify_alert_severity_high_area():
    assert classify_alert_severity(alert_count=45, area_ha=23.4, confidence='high') == 'HIGH'

def test_classify_alert_severity_low():
    assert classify_alert_severity(alert_count=3, area_ha=0.5, confidence='low') == 'LOW'

def test_classify_alert_severity_critical():
    assert classify_alert_severity(alert_count=200, area_ha=100.0, confidence='high') == 'CRITICAL'
