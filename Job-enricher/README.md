# Search-Job Enricher

A background worker that enriches existing Search-Job rows through OpenRouter. It never creates or deletes jobs and never modifies `job_sources`.

## Architecture

The worker uses the existing canonical `jobs` and `job_sources` tables. It reads jobs and source text, claims only `pending` rows using PostgreSQL row locking, calls OpenRouter outside the transaction, validates the response with Zod, and performs a restricted update on the existing job row.

## Setup

```powershell
Copy-Item .env.example .env
npm install
npm run lint
npm test
npm run db:migrate
npm start
```

The runtime `DATABASE_URL` must use the dedicated `enricher_role` on Supabase. Do not use the ingestion API database credentials. `DIRECT_DATABASE_URL` is used only by the migration runner.

## Environment

- `DATABASE_URL`: enricher role runtime pooler URL, normally port `6543`.
- `DIRECT_DATABASE_URL`: enricher role migration URL, normally port `5432`.
- `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `OPENROUTER_BASE_URL`: AI configuration.
- `BATCH_SIZE`: default `5`.
- `POLL_INTERVAL_MS`: default `60000`.
- `STALE_TIMEOUT_MS`: default `600000`.
- `MAX_RETRIES`: default `3`.
- `HEARTBEAT_INTERVAL_MS`: default `300000`.

## States

```text
pending -> in_progress -> done
pending -> in_progress -> failed
pending -> in_progress -> not_a_job
```

Stale `in_progress` rows older than `STALE_TIMEOUT_MS` are reset to `pending`. Claiming uses `FOR UPDATE SKIP LOCKED`, so multiple replicas do not claim the same row.

## Manual Supabase role setup

Run this manually in Supabase SQL Editor after choosing a strong password. Do not run it from the application and do not commit the password:

```sql
CREATE ROLE enricher_role WITH LOGIN PASSWORD 'PASTE_STRONG_PASSWORD_HERE';
GRANT CONNECT ON DATABASE postgres TO enricher_role;
GRANT USAGE ON SCHEMA public TO enricher_role;
GRANT SELECT ON public.jobs, public.job_sources TO enricher_role;
GRANT UPDATE (title, company, location, category, type, salary, remote, description, requirements, deadline, application_url, experience_level, normalized_title, normalized_company, normalized_location, enrichment_status, enrichment_attempts, enrichment_error, enrichment_started_at, enriched_at, ai_model) ON public.jobs TO enricher_role;
```

If the role already exists, skip `CREATE ROLE` and use `ALTER ROLE enricher_role WITH PASSWORD '...'` only when rotation is needed. The role must not receive INSERT, DELETE, source-table UPDATE, or DDL privileges.

## Health

- `GET /health` confirms the process is alive.
- `GET /ready` checks database connectivity.

## Security

The AI API key, database URLs, and role password are never logged. The OpenRouter prompt includes only existing job fields and source text needed for enrichment. AI output is parsed defensively and rejected before PostgreSQL updates if it fails Zod validation.
