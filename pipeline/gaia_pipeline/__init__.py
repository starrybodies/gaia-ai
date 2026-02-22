from dagster import Definitions, load_assets_from_modules
from . import assets
from .resources import db_resource, redis_resource
from .schedules import (
    fires_schedule, air_quality_schedule,
    deforestation_schedule, news_schedule, evs_schedule,
    fires_job, air_quality_job, deforestation_job, news_job, evs_job,
)

all_assets = load_assets_from_modules([assets])

defs = Definitions(
    assets=all_assets,
    resources={
        "db": db_resource,
        "redis": redis_resource,
    },
    jobs=[fires_job, air_quality_job, deforestation_job, news_job, evs_job],
    schedules=[
        fires_schedule,
        air_quality_schedule,
        deforestation_schedule,
        news_schedule,
        evs_schedule,
    ],
)
