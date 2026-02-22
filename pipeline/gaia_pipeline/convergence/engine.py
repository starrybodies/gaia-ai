"""
H3-based convergence detection engine.
Monitors environmental signals across H3 resolution 5 hexagonal cells (~252 km² each).
Fires compound threat alerts when multiple signals exceed z-score thresholds.
"""

from dataclasses import dataclass, field

SIGNAL_WEIGHTS = {
    'fire': 0.30,
    'deforestation': 0.25,
    'biodiversity': 0.15,
    'air-quality': 0.10,
    'water-stress': 0.08,
    'ocean-sst': 0.05,
    'land-use': 0.04,
    'carbon': 0.02,
    'soil': 0.005,
    'fishing': 0.005,
}

# Named threat profiles: (required_signals_subset, multiplier, label)
THREAT_PROFILES = [
    ({'fire', 'deforestation', 'biodiversity'}, 3.5, 'Ecosystem Collapse'),
    ({'deforestation', 'land-use', 'water-stress'}, 3.0, 'Extractive Degradation'),
    ({'fire', 'air-quality'}, 2.5, 'Climate-Fire Emergency'),
    ({'fire', 'deforestation', 'biodiversity', 'air-quality'}, 4.0, 'Full Ecosystem Collapse'),
    ({'ocean-sst', 'fishing'}, 2.5, 'Marine Ecosystem Stress'),
]

def compute_convergence_index(
    signal_zscores: dict,
    weights: dict,
    apply_threat_profiles: bool = True,
) -> float:
    """
    CI = Σ(w_s × z_s) × diversity_bonus × threat_profile_multiplier
    diversity_bonus = 1.0 + 0.2 × (n_signals - 1)
    """
    if not signal_zscores:
        return 0.0

    n_signals = len(signal_zscores)
    diversity_bonus = 1.0 + 0.2 * (n_signals - 1)

    weighted_sum = sum(
        weights.get(signal, 0.01) * z
        for signal, z in signal_zscores.items()
        if z > 0
    )

    ci = weighted_sum * diversity_bonus

    if apply_threat_profiles:
        active_signals = set(signal_zscores.keys())
        best_multiplier = 1.0
        best_profile = None
        for required_signals, multiplier, label in THREAT_PROFILES:
            if required_signals.issubset(active_signals) and multiplier > best_multiplier:
                best_multiplier = multiplier
                best_profile = label
        ci *= best_multiplier

    return ci

def classify_severity(
    n_signal_types: int,
    ci: float,
    persistence_days: int,
    contiguous_cells: int = 1,
) -> str:
    """
    EMERGENCY: CI >= 15.0 across > 10 contiguous cells
    CRITICAL:  3+ types with CI >= 10.0
    WARNING:   3+ types OR CI >= 5.0 persisting > 14 days
    WATCH:     2+ signal types
    """
    if ci >= 15.0 and contiguous_cells > 10:
        return 'EMERGENCY'
    if n_signal_types >= 3 and ci >= 10.0:
        return 'CRITICAL'
    if (n_signal_types >= 3 and ci >= 5.0 and persistence_days > 14) or ci >= 10.0:
        return 'WARNING'
    if n_signal_types >= 2:
        return 'WATCH'
    return 'NONE'

@dataclass
class ConvergenceEngine:
    """Maintains per-cell signal state and computes convergence alerts."""

    cell_signals: dict = field(default_factory=dict)

    def update_signal(self, h3_cell: str, signal_type: str, z_score: float) -> None:
        if h3_cell not in self.cell_signals:
            self.cell_signals[h3_cell] = {}
        self.cell_signals[h3_cell][signal_type] = z_score

    def get_active_alerts(self, min_severity: str = 'WATCH') -> list:
        severity_rank = {'WATCH': 0, 'WARNING': 1, 'CRITICAL': 2, 'EMERGENCY': 3, 'NONE': -1}
        alerts = []

        for cell_id, signals in self.cell_signals.items():
            anomalous = {s: z for s, z in signals.items() if z >= 1.5}
            if len(anomalous) < 2:
                continue

            ci = compute_convergence_index(anomalous, SIGNAL_WEIGHTS)
            severity = classify_severity(len(anomalous), ci, persistence_days=1)

            if severity == 'NONE':
                continue
            if severity_rank.get(severity, -1) >= severity_rank.get(min_severity, 0):
                alerts.append({
                    'h3_cell': cell_id,
                    'severity': severity,
                    'ci_score': ci,
                    'signal_types': list(anomalous.keys()),
                    'signal_z_scores': anomalous,
                })

        return sorted(alerts, key=lambda a: a['ci_score'], reverse=True)
