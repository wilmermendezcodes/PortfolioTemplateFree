# Privacy and Data Handling

This doc describes how user data flows through AI features and how we protect it.

## Data Flow

- Inputs: user text, optional files. Sanitized and redacted before storage.
- Processing: may call a model provider; only necessary context and minimal metadata are sent.
- Outputs: stored with citations; no raw PII unless essential to the task.

## Retention

- Logs: disabled by default. When enabled, keep only sampled, redacted events for up to 30 days.
- Indexes: document any user-derived content stored in vector DBs; allow deletion on request.

## Controls

- PII redaction utilities in `src/ai/safety.js`
- Telemetry opt-in via `AI_TELEMETRY_ENABLED` and sampling via `AI_TELEMETRY_SAMPLING`
- Secrets via environment variables only; never hardcode API keys

## User Disclosure

- Clearly disclose AI assistance, limitations, and data usage in the UI where applicable.

