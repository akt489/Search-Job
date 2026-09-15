# Telegram Job Collector

A standalone JavaScript/Node.js Telegram User API collector for Search-Job. It connects through GramJS/MTProto using a legitimately authorized Telegram user account, reads configured channels, filters likely job messages, preserves the original Telegram text, and submits source-oriented payloads to the existing Job Ingestion API.

The collector never connects to PostgreSQL and never bypasses Telegram access controls.

## Architecture

```text
Telegram user account -> GramJS/MTProto -> Telegram Job Collector
  -> HTTPS bearer API key -> Search-Job Job Ingestion API -> Supabase PostgreSQL
```

## Setup

```powershell
Copy-Item .env.example .env
npm install
npm test
npm run lint
```

Fill `.env` with Telegram credentials from https://my.telegram.org, the Ingestion API URL, the matching API key, and one or more channels. Never commit `.env` or a Telegram session.

## Environment

- `TELEGRAM_API_ID`, `TELEGRAM_API_HASH`: Telegram application credentials.
- `TELEGRAM_SESSION`: persisted GramJS StringSession. Leave blank for the first interactive login. The first login writes the session to the ignored `TELEGRAM_SESSION_FILE`; copy that file's contents into Railway Variables.
- `TELEGRAM_SESSION_FILE`: local session file path, default `.telegram-session`. Never commit or log this file.
- `INGESTION_API_URL`: base URL of the Job Ingestion API.
- `IMPORT_API_KEY`: bearer key configured on the ingestion service.
- `CHANNELS`: comma-separated accessible public channels such as `@example_jobs,@other_jobs`.
- `PORT`: health server port; Railway supplies this in production.
- `HISTORY_LIMIT`, `BATCH_SIZE`, `REQUEST_TIMEOUT_MS`, `MAX_RETRIES`: collection controls.
- `JOB_KEYWORDS`: comma-separated first-pass filter signals.

## First authentication

```powershell
npm start
```

With an empty `TELEGRAM_SESSION`, answer the phone, login-code, and optional 2FA prompts. The generated StringSession is written to `.telegram-session`; copy its complete contents into the `TELEGRAM_SESSION` Railway Variable. Restarts with a configured session connect non-interactively.

## Historical collection

```powershell
npm run collect:history
```

The collector reads `HISTORY_LIMIT` messages per channel, filters candidates, maps raw messages to the ingestion contract, submits them one at a time, and logs per-channel summaries. The Ingestion API provides idempotency, so safe reprocessing after a restart returns duplicates instead of creating duplicate jobs.

## Real-time monitoring

```powershell
npm start
```

After authentication, the collector subscribes to new messages for every configured channel. A failing channel is logged independently; candidate messages from healthy channels continue to process.

## Ingestion contract

The collector sends:

```json
{
  "sourceType": "telegram",
  "sourceName": "@example_jobs",
  "sourceMessageId": "12345",
  "sourceUrl": "https://t.me/example_jobs/12345",
  "postedAt": "2026-09-15T10:30:00.000Z",
  "rawText": "Original Telegram message"
}
```

Authentication is `Authorization: Bearer <IMPORT_API_KEY>`. The collector does not send database fields or invent structured job data.

## Health

- `GET /health` returns collector health.
- `GET /ready` returns `200` after Telegram is connected and `503` otherwise.

## Railway

Create a separate Railway service rooted at `Telegram-job-collector`. Set the start command to `npm start`, expose the generated domain, set the healthcheck path to `/health`, and configure every variable from `.env.example` in Railway Variables. Do not set database variables: this service has no database connection.

## Security and limitations

The collector only reads channels accessible to the authenticated account. It does not enumerate private channels, bypass restrictions, or defeat Telegram rate limits. API keys, API hashes, phone numbers, login codes, 2FA passwords, and sessions are never logged. The deterministic filter is intentionally conservative and may submit questionable messages for later processing.
