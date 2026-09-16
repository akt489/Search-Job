ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS enrichment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS enrichment_attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS enrichment_error TEXT,
  ADD COLUMN IF NOT EXISTS enrichment_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS enriched_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS ai_model VARCHAR(255),
  ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
  ADD COLUMN IF NOT EXISTS description_en TEXT;

ALTER TABLE public.jobs
  DROP CONSTRAINT IF EXISTS jobs_enrichment_status_check;

ALTER TABLE public.jobs
  ADD CONSTRAINT jobs_enrichment_status_check
  CHECK (enrichment_status IN ('pending', 'in_progress', 'done', 'failed', 'not_a_job'));

CREATE INDEX IF NOT EXISTS idx_jobs_enrichment_pending
  ON public.jobs (id)
  WHERE enrichment_status = 'pending';

CREATE INDEX IF NOT EXISTS idx_jobs_enrichment_stale
  ON public.jobs (enrichment_started_at)
  WHERE enrichment_status = 'in_progress';
