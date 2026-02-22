from gaia_pipeline.convergence.engine import (
    ConvergenceEngine,
    compute_convergence_index,
    classify_severity,
    THREAT_PROFILES,
    SIGNAL_WEIGHTS,
)

def test_convergence_index_two_signals():
    signals = {'fire': 2.5, 'deforestation': 3.0}
    ci = compute_convergence_index(signals, SIGNAL_WEIGHTS)
    assert ci > 0
    assert isinstance(ci, float)

def test_diversity_bonus_increases_ci():
    signals_one = {'fire': 3.0}
    signals_three = {'fire': 3.0, 'deforestation': 3.0, 'air-quality': 3.0}
    ci_one = compute_convergence_index(signals_one, SIGNAL_WEIGHTS)
    ci_three = compute_convergence_index(signals_three, SIGNAL_WEIGHTS)
    assert ci_three > ci_one * 1.3

def test_ecosystem_collapse_profile():
    # Fire + Deforestation + Biodiversity decline → 3.5× multiplier
    signals = {'fire': 4.0, 'deforestation': 3.5, 'biodiversity': 2.8}
    ci = compute_convergence_index(signals, SIGNAL_WEIGHTS, apply_threat_profiles=True)
    assert ci >= 3.5

def test_classify_severity_watch():
    assert classify_severity(n_signal_types=2, ci=3.0, persistence_days=1) == 'WATCH'

def test_classify_severity_warning():
    assert classify_severity(n_signal_types=3, ci=5.5, persistence_days=15) == 'WARNING'

def test_classify_severity_critical():
    assert classify_severity(n_signal_types=3, ci=11.0, persistence_days=5) == 'CRITICAL'

def test_classify_severity_emergency():
    assert classify_severity(n_signal_types=4, ci=16.0, persistence_days=10, contiguous_cells=11) == 'EMERGENCY'

def test_convergence_engine_get_active_alerts():
    engine = ConvergenceEngine()
    engine.update_signal('851fb467fffffff', 'fire', 4.0)
    engine.update_signal('851fb467fffffff', 'deforestation', 3.5)
    engine.update_signal('851fb467fffffff', 'biodiversity', 2.8)
    alerts = engine.get_active_alerts(min_severity='WATCH')
    assert len(alerts) == 1
    assert alerts[0]['h3_cell'] == '851fb467fffffff'
    assert alerts[0]['ci_score'] > 0
