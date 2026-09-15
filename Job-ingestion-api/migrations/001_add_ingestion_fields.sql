-- Extend the existing canonical jobs table. No second jobs table is created.
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS requirements JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS deadline TIMESTAMPTZ;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS application_url TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS experience_level VARCHAR(100);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS normalized_title TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS normalized_company TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS normalized_location TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_jobs_requirements ON jobs USING GIN (requirements);
CREATE INDEX IF NOT EXISTS idx_jobs_ingestion_candidates
  ON jobs (normalized_company, normalized_title, normalized_location, posted_at)
  WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS job_sources (
  id SERIAL PRIMARY KEY,
  job_id INT NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
  source_type VARCHAR(50) NOT NULL,
  source_name VARCHAR(255) NOT NULL,
  source_message_id VARCHAR(255) NOT NULL,
  source_url TEXT,
  raw_text TEXT NOT NULL,
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT job_sources_source_type_source_message_id_key UNIQUE (source_type, source_message_id)
);

CREATE INDEX IF NOT EXISTS idx_job_sources_job_id ON job_sources(job_id);
