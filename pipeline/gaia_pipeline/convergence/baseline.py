import math

class WelfordBaseline:
    """
    Numerically stable streaming mean/variance using Welford's online algorithm.
    Used for computing z-scores in convergence anomaly detection.
    Requires minimum 10 data points before computing z-scores.
    """

    MIN_COUNT = 10  # Minimum observations before z-scores are meaningful

    def __init__(self):
        self.count: int = 0
        self.mean: float = 0.0
        self._M2: float = 0.0  # Sum of squared deviations from mean

    def update(self, value: float) -> None:
        """Add a new observation to the running statistics."""
        self.count += 1
        delta = value - self.mean
        self.mean += delta / self.count
        delta2 = value - self.mean
        self._M2 += delta * delta2

    @property
    def variance(self) -> float:
        """Sample variance (Bessel's correction: divide by n-1)."""
        if self.count < 2:
            return 0.0
        return self._M2 / (self.count - 1)

    @property
    def std(self) -> float:
        """Sample standard deviation."""
        return math.sqrt(self.variance)

    def zscore(self, value: float) -> float:
        """
        Compute z-score for a value relative to the running baseline.
        Returns 0.0 if insufficient data or zero variance.
        """
        if self.count < self.MIN_COUNT or self.std < 1e-10:
            return 0.0
        return (value - self.mean) / self.std

    def to_dict(self) -> dict:
        """Serialize state for storage in Redis or database."""
        return {
            'count': self.count,
            'mean': self.mean,
            'M2': self._M2,
        }

    @classmethod
    def from_dict(cls, state: dict) -> 'WelfordBaseline':
        """Restore from serialized state."""
        wb = cls()
        wb.count = state['count']
        wb.mean = state['mean']
        wb._M2 = state['M2']
        return wb
