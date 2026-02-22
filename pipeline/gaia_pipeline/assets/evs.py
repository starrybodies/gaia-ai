"""
Ecosystem Vitality Score (EVS) computation.
10 indicators, 0-100 scale, proximity-to-target normalization.
"""

import os
import json
from datetime import datetime, timezone
from dagster import asset, get_dagster_logger
from gaia_pipeline.resources import DatabaseResource

EVS_WEIGHTS = {
    'biodiversity': 0.15,
    'structural_integrity': 0.12,
    'npp_anomaly': 0.10,
    'forest_cover': 0.10,
    'water_quality': 0.10,
    'climate_stability': 0.12,
    'soil_health': 0.08,
    'air_quality': 0.08,
    'species_trend': 0.10,
    'protected_areas': 0.05,
}

def compute_evs_component(current: float, reference: float) -> float:
    """Proximity-to-target normalization: Score = 100 × (current / reference)."""
    if reference <= 0:
        return 0.0
    return max(0.0, min(100.0, 100.0 * current / reference))

def aggregate_evs_score(
    components: dict,
    weights: dict,
) -> float:
    """Weighted average of component scores."""
    total_weight = sum(weights.get(k, 0.0) for k in components)
    if total_weight == 0:
        return 0.0
    weighted_sum = sum(components[k] * weights.get(k, 0.0) for k in components)
    return weighted_sum / total_weight

def assign_confidence_grade(direct_indicators: int, total_indicators: int = 10) -> str:
    """
    A: >80% direct data, B: 50-80% direct data, C: <50%
    """
    if total_indicators == 0:
        return 'C'
    proportion = direct_indicators / total_indicators
    if proportion > 0.80:
        return 'A'
    elif proportion >= 0.50:
        return 'B'
    return 'C'

@asset(
    description="Compute Ecosystem Vitality Scores using available sensor and event data",
    group_name="evs",
)
def evs_computation_asset(context, db: DatabaseResource) -> dict:
    """
    Simplified EVS using available air quality sensor data as one component.
    In production: integrate with GFW, GBIF, MODIS, and other sources.
    """
    logger = get_dagster_logger()

    conn = None
    computed = 0
    try:
        conn = db.get_connection()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    h3_resolution5 as h3_cell,
                    AVG(value) as avg_pm25
                FROM sensor_readings
                WHERE metric = 'pm25'
                  AND time > NOW() - INTERVAL '7 days'
                  AND h3_resolution5 IS NOT NULL
                GROUP BY h3_resolution5
                HAVING COUNT(*) >= 5
                LIMIT 100
            """)

            rows = cur.fetchall()

        with conn.cursor() as cur:
            for h3_cell, avg_pm25 in rows:
                # PM2.5: reference = 5 µg/m³ (WHO guideline)
                # Score = 100 × (5 / avg_pm25), clamped [0, 100]
                air_quality_score = compute_evs_component(
                    current=max(0.0, 5.0 - (avg_pm25 - 5.0)),
                    reference=5.0,
                )

                components = {'air_quality': air_quality_score}
                weights_subset = {'air_quality': EVS_WEIGHTS['air_quality']}
                overall = aggregate_evs_score(components, weights_subset)
                confidence = assign_confidence_grade(direct_indicators=1, total_indicators=10)

                cur.execute("""
                    INSERT INTO evs_scores (time, ecoregion_id, overall_score, components, confidence_grade, missing_indicators)
                    VALUES (%s, %s, %s, %s::jsonb, %s, %s)
                    ON CONFLICT (ecoregion_id, time) DO UPDATE
                    SET overall_score = EXCLUDED.overall_score,
                        components = EXCLUDED.components,
                        confidence_grade = EXCLUDED.confidence_grade
                """, (
                    datetime.now(timezone.utc),
                    h3_cell,
                    overall,
                    json.dumps(components),
                    confidence,
                    9,  # 9 of 10 indicators missing in simplified version
                ))
                computed += cur.rowcount

        conn.commit()
    except Exception:
        if conn is not None:
            conn.rollback()
        raise
    finally:
        if conn is not None:
            conn.close()

    logger.info(f"Computed EVS for {computed} cells")
    return {"computed": computed}
