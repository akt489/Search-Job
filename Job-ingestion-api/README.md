# Search-Job Job Ingestion API

A production-oriented internal ingestion service for external job collectors. It accepts source-oriented postings, deterministically normalizes them, preserves raw source data, and writes to the existing Search-Job PostgreSQL `jobs` table. It does not build a Telegram collector and it does not expose job CRUD endpoints.

## Architecture

Collectors call this service over HTTPS with a bearer API key and request ID. The service validates and normalizes each item, applies API-key rate limiting, performs conservative duplicate candidate detection, and creates the canonical job and `job_sources` record in one PostgreSQL transaction.

The existing Search-Job backend remains responsible for browsing, saving, applying, and user-facing job operations.

## Existing database integration

The existing backend uses native `pg` and a runtime-created `jobs` table. This service uses the same `pg` library and `DATABASE_URL`. The migration extends that table with ingestion metadata and creates `job_sources`; it never creates a second jobs table.

## Setup

```powershell
Copy-Item .env.example .env
npm install
npm run db:migrate
npm test
npm run dev
```

Run the migration against a development database first. It is version-controlled and uses `IF NOT EXISTS` for additive changes. The migration adds `requirements` as JSONB with a GIN index, `deadline`, `application_url`, `experience_level`, normalized matching fields, `deleted_at`, and the `job_sources` table.

## Environment variables

- `DATABASE_URL`: PostgreSQL connection string shared with Search-Job.
- `IMPORT_API_KEY`: secret bearer key for collectors.
- `PORT`: service port, default `4010`.
- `CLIENT_ORIGIN`: optional allowed CORS origin.
- `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`: configurable API-key rate limit.
- `MAX_BATCH_SIZE`: maximum bulk items, default `100`.
- `MAX_BODY_SIZE`: JSON body limit, default `1mb`.
- `DUPLICATE_WINDOW_DAYS`: candidate matching window, default `7`.

All timestamps are stored as PostgreSQL `TIMESTAMPTZ` values in UTC.

## API

Health does not require authentication:

```http
GET /health
```

```json
{"status":"ok"}
```

Import one source-oriented job:

```bash
curl -X POST http://localhost:4010/api/jobs/import \
  -H "Authorization: Bearer $IMPORT_API_KEY" \
  -H "X-Request-ID: telegram-12345" \
  -H "Content-Type: application/json" \
  -d '{"sourceType":"telegram","sourceName":"@ethiopian_jobs","sourceMessageId":"12345","sourceUrl":"https://t.me/ethiopian_jobs/12345","postedAt":"2026-09-15T10:30:00Z","rawText":"Junior Backend Developer at Acme\nLocation: Addis\n- Node.js"}'
```

Created response:

```json
{"status":"created","jobId":981,"requestId":"telegram-12345"}
```

Replaying the same source returns the existing job ID:

```json
{"status":"duplicate","jobId":981,"requestId":"telegram-12345"}
```

Bulk import supports partial success and defaults to 100 items:

```bash
curl -X POST http://localhost:4010/api/jobs/import/bulk \
  -H "Authorization: Bearer $IMPORT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"sourceType":"telegram","sourceName":"@jobs","sourceMessageId":"1","rawText":"Backend Developer at Acme"},{"sourceType":"telegram","sourceName":"@jobs","sourceMessageId":"2","rawText":"Designer at Acme"}]}'
```

Each item has its own transaction. Invalid items return `status: "invalid"`; database failures return `status: "error"`; one item never rolls back another.

## Idempotency and duplicate candidates

The database constraint `UNIQUE(source_type, source_message_id)` is the final idempotency guarantee, including concurrent retries. Same-source retries return the original `jobId`.

Cross-channel matching is intentionally conservative. It searches active jobs within `DUPLICATE_WINDOW_DAYS` using normalized company, title, and location. A candidate is only reported when it is unambiguous; the service never automatically merges or suppresses uncertain jobs. Future semantic matching can be added behind the duplicate detection service.

## Security and observability

Import routes require `Authorization: Bearer <IMPORT_API_KEY>`. API-key rate limiting is applied after authentication. Request IDs are accepted from `X-Request-ID`, generated when absent, returned in the response, and included in Pino JSON logs. Secrets and raw source text are never logged.

## Testing and deployment

```powershell
npm test
npm run lint
npm run build # not applicable; this is a Node service
```

Deploy only after applying the migration to a development database and verifying existing Search-Job routes against the extended canonical table. Run the service with `npm start` behind HTTPS at the collector boundary.
