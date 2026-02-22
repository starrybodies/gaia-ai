from gaia_pipeline.assets.evs import (
    compute_evs_component,
    aggregate_evs_score,
    assign_confidence_grade,
    EVS_WEIGHTS,
)

def test_compute_evs_component_normal():
    # Forest cover: current = 85%, reference = 100%
    score = compute_evs_component(current=85, reference=100)
    assert abs(score - 85.0) < 0.01

def test_compute_evs_component_exceeds_reference():
    # Should cap at 100
    score = compute_evs_component(current=105, reference=100)
    assert score == 100.0

def test_compute_evs_component_below_zero():
    # Should floor at 0
    score = compute_evs_component(current=-5, reference=100)
    assert score == 0.0

def test_compute_evs_component_zero_reference():
    # Should return 0 when reference is 0 (avoid division by zero)
    score = compute_evs_component(current=50, reference=0)
    assert score == 0.0

def test_aggregate_evs_score():
    components = {
        'biodiversity': 70.0,
        'forest_cover': 60.0,
        'climate_stability': 80.0,
        'air_quality': 90.0,
    }
    weights = {
        'biodiversity': 0.15,
        'forest_cover': 0.10,
        'climate_stability': 0.12,
        'air_quality': 0.08,
    }
    overall = aggregate_evs_score(components, weights)
    # (70×0.15 + 60×0.10 + 80×0.12 + 90×0.08) / (0.15+0.10+0.12+0.08) = 33.3/0.45 = 74.0
    assert abs(overall - 74.0) < 0.001

def test_assign_confidence_grade_A():
    assert assign_confidence_grade(direct_indicators=9, total_indicators=10) == 'A'

def test_assign_confidence_grade_B():
    assert assign_confidence_grade(direct_indicators=6, total_indicators=10) == 'B'

def test_assign_confidence_grade_C():
    assert assign_confidence_grade(direct_indicators=4, total_indicators=10) == 'C'

def test_evs_weights_sum_to_one():
    total = sum(EVS_WEIGHTS.values())
    assert abs(total - 1.0) < 0.001
