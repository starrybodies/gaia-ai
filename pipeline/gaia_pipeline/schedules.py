from dagster import ScheduleDefinition, define_asset_job, AssetSelection

# Jobs grouping related assets
fires_job = define_asset_job(
    name="fires_ingestion_job",
    selection=AssetSelection.groups("fires"),
)

air_quality_job = define_asset_job(
    name="air_quality_job",
    selection=AssetSelection.groups("air_quality"),
)

deforestation_job = define_asset_job(
    name="deforestation_job",
    selection=AssetSelection.groups("deforestation"),
)

news_job = define_asset_job(
    name="news_ingestion_job",
    selection=AssetSelection.groups("news"),
)

evs_job = define_asset_job(
    name="evs_computation_job",
    selection=AssetSelection.groups("evs"),
)

# Schedules
fires_schedule = ScheduleDefinition(
    job=fires_job,
    cron_schedule="0 */3 * * *",  # Every 3 hours
    name="fires_every_3_hours",
)

air_quality_schedule = ScheduleDefinition(
    job=air_quality_job,
    cron_schedule="0 * * * *",  # Hourly
    name="air_quality_hourly",
)

deforestation_schedule = ScheduleDefinition(
    job=deforestation_job,
    cron_schedule="0 6 * * *",  # Daily at 06:00 UTC
    name="deforestation_daily",
)

news_schedule = ScheduleDefinition(
    job=news_job,
    cron_schedule="*/15 * * * *",  # Every 15 minutes
    name="news_every_15_min",
)

evs_schedule = ScheduleDefinition(
    job=evs_job,
    cron_schedule="0 2 * * 0",  # Weekly on Sunday at 02:00 UTC
    name="evs_weekly",
)
