from gaia_pipeline.assets.fires import parse_firms_csv, normalize_fire_event

SAMPLE_CSV = """latitude,longitude,brightness,acq_date,acq_time,satellite,confidence,frp
-3.456,52.123,340.5,2026-02-22,1200,N,90,45.2
10.789,-72.456,310.2,2026-02-22,1215,N,80,22.1
"""

def test_parse_firms_csv():
    events = parse_firms_csv(SAMPLE_CSV)
    assert len(events) == 2
    assert events[0]['lat'] == -3.456
    assert abs(events[0]['confidence'] - 0.9) < 0.01

def test_normalize_fire_event_assigns_h3():
    raw = {'lat': -3.456, 'lon': 52.123, 'brightness': 340.5, 'confidence': 0.9}
    normalized = normalize_fire_event(raw)
    assert 'h3_index' in normalized
    assert len(normalized['h3_index']) > 0
    assert normalized['severity'] == 'HIGH'  # brightness > 330 but < 360

def test_normalize_assigns_severity_correctly():
    low = normalize_fire_event({'lat': 0, 'lon': 0, 'brightness': 280, 'confidence': 0.6})
    critical = normalize_fire_event({'lat': 0, 'lon': 0, 'brightness': 380, 'confidence': 0.95})
    assert low['severity'] == 'LOW'
    assert critical['severity'] == 'CRITICAL'
