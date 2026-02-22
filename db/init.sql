CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;
CREATE EXTENSION IF NOT EXISTS vector;

-- Environmental events (fires, deforestation alerts, storms)
CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL,
    time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'EMERGENCY')),
    location GEOMETRY(Point, 4326) NOT NULL,
    h3_resolution5 VARCHAR(20),
    affected_area GEOMETRY(Polygon, 4326),
    properties JSONB DEFAULT '{}',
    source VARCHAR(100) NOT NULL,
    confidence FLOAT CHECK (confidence BETWEEN 0 AND 1),
    PRIMARY KEY (id, time)
);
SELECT create_hypertable('events', 'time', if_not_exists => TRUE);
CREATE INDEX IF NOT EXISTS events_location_idx ON events USING GIST (location);
CREATE INDEX IF NOT EXISTS events_type_time_idx ON events (event_type, time DESC);

-- Sensor readings (air quality, SST, water levels)
CREATE TABLE IF NOT EXISTS sensor_readings (
    time TIMESTAMPTZ NOT NULL,
    sensor_id INTEGER NOT NULL,
    metric VARCHAR(50) NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    unit VARCHAR(20),
    quality_flag SMALLINT DEFAULT 0,
    location GEOMETRY(Point, 4326),
    h3_resolution5 VARCHAR(20)
);
SELECT create_hypertable('sensor_readings', 'time', if_not_exists => TRUE);
ALTER TABLE sensor_readings SET (
  timescaledb.compress,
  timescaledb.compress_orderby = 'time DESC',
  timescaledb.compress_segmentby = 'sensor_id'
);
SELECT add_compression_policy('sensor_readings', INTERVAL '7 days', if_not_exists => TRUE);

-- EVS (Ecosystem Vitality Score) per ecoregion
CREATE TABLE IF NOT EXISTS evs_scores (
    time TIMESTAMPTZ NOT NULL,
    ecoregion_id VARCHAR(10) NOT NULL,
    overall_score FLOAT CHECK (overall_score BETWEEN 0 AND 100),
    components JSONB NOT NULL DEFAULT '{}',
    confidence_grade CHAR(1) CHECK (confidence_grade IN ('A', 'B', 'C')),
    missing_indicators SMALLINT DEFAULT 0,
    PRIMARY KEY (ecoregion_id, time)
);
SELECT create_hypertable('evs_scores', 'time', if_not_exists => TRUE);

-- Convergence alerts (multi-signal compound events)
CREATE TABLE IF NOT EXISTS convergence_alerts (
    id BIGSERIAL,
    time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    severity VARCHAR(20) CHECK (severity IN ('WATCH', 'WARNING', 'CRITICAL', 'EMERGENCY')),
    ci_score FLOAT NOT NULL,
    threat_profile VARCHAR(50),
    h3_cells TEXT[] NOT NULL,
    affected_area GEOMETRY(Polygon, 4326),
    signal_types TEXT[] NOT NULL,
    signal_z_scores JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'false_positive')),
    resolution_time TIMESTAMPTZ,
    PRIMARY KEY (id, time)
);
SELECT create_hypertable('convergence_alerts', 'time', if_not_exists => TRUE);
CREATE INDEX IF NOT EXISTS convergence_severity_idx ON convergence_alerts (severity, time DESC);
CREATE INDEX IF NOT EXISTS convergence_area_idx ON convergence_alerts USING GIST (affected_area);

-- AI document embeddings (for RAG briefings)
CREATE TABLE IF NOT EXISTS document_embeddings (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    source VARCHAR(255) NOT NULL,
    source_tier SMALLINT CHECK (source_tier BETWEEN 1 AND 3),
    event_types TEXT[],
    location GEOMETRY(Point, 4326),
    embedding VECTOR(1536),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);
CREATE INDEX IF NOT EXISTS doc_location_idx ON document_embeddings USING GIST (location);
CREATE INDEX IF NOT EXISTS doc_source_tier_idx ON document_embeddings (source_tier, created_at DESC);
CREATE INDEX IF NOT EXISTS doc_embedding_idx ON document_embeddings
  USING hnsw (embedding vector_cosine_ops);

-- Retention policies
SELECT add_retention_policy('sensor_readings', INTERVAL '2 years', if_not_exists => TRUE);
SELECT add_retention_policy('events', INTERVAL '5 years', if_not_exists => TRUE);
ALTER TABLE events SET (
  timescaledb.compress,
  timescaledb.compress_orderby = 'time DESC',
  timescaledb.compress_segmentby = 'event_type'
);
SELECT add_compression_policy('events', INTERVAL '30 days', if_not_exists => TRUE);
