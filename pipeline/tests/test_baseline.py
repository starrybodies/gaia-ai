from gaia_pipeline.convergence.baseline import WelfordBaseline

def test_welford_basic_stats():
    wb = WelfordBaseline()
    for v in [2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0]:
        wb.update(v)
    assert abs(wb.mean - 5.0) < 0.01
    assert abs(wb.variance - 4.571) < 0.01

def test_welford_zscore_close_to_mean():
    wb = WelfordBaseline()
    values = [10, 11, 9, 10, 12, 8, 11, 10, 9, 11] * 5
    for v in values:
        wb.update(float(v))
    z = wb.zscore(10.5)
    assert z < 1.0

def test_welford_zscore_anomalous():
    wb = WelfordBaseline()
    values = [10, 11, 9, 10, 12, 8, 11, 10, 9, 11] * 10
    for v in values:
        wb.update(float(v))
    z = wb.zscore(25.0)
    assert z > 3.0

def test_welford_serialization():
    wb = WelfordBaseline()
    for v in range(100):
        wb.update(float(v))
    state = wb.to_dict()
    wb2 = WelfordBaseline.from_dict(state)
    assert abs(wb2.mean - wb.mean) < 0.001
    assert abs(wb2.variance - wb.variance) < 0.001

def test_welford_insufficient_data_returns_zero_zscore():
    wb = WelfordBaseline()
    for v in range(5):  # fewer than 10 data points
        wb.update(float(v))
    assert wb.zscore(100.0) == 0.0
