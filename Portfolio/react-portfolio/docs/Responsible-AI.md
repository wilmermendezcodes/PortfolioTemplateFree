# Responsible AI Guidelines

These guidelines define how this project approaches safety, privacy, fairness, and transparency for any AI features (now or future). They are designed to be practical and easy to adopt in pull requests.

## Principles

- Safety-by-default: refuse dangerous requests, avoid harmful content, and prefer not answering over unsafe answering.
- Privacy-first: never log raw user inputs with PII; redact at source, minimize data retention, and document any data sharing.
- Transparency: disclose model usage, limitations, and data handling; provide a visible feedback channel for issues.
- Accountability: human-in-the-loop for sensitive actions; clear escalation and rollback paths.
- Robustness: evaluate regularly (bias, hallucination, regressions) and gate launches behind metrics.

## Required Controls (MVP)

- Input safety: sanitize, enforce length limits, and lightweight moderation before model calls.
- Output safety: instruct grounded, cite sources, block disallowed content, and add refusal patterns.
- PII handling: detect and redact PII pre-logging and in prompts unless essential; never store secrets in prompts.
- Telemetry: opt-in logging controlled by `AI_TELEMETRY_ENABLED`, sampled, with automatic PII redaction.
- Documentation: maintain a model card, data sources, and evaluation results (see RAG-Performance.md).

## Developer Checklist (PRs touching AI)

- Safety
  - [ ] Added/updated safety checks (input moderation, max length, PII redaction)
  - [ ] Prompt includes grounding + citation instructions; refusal is tested
- Privacy
  - [ ] No raw PII in logs; added redaction in telemetry callsites
  - [ ] Data retention explained in docs; secrets in env vars only
- Evaluation
  - [ ] Added/updated tests or eval script; tracked EM/F1 + faithfulness
  - [ ] No drop in safety metrics; performance trade-offs documented
- Transparency
  - [ ] Updated Model Card with changes, limitations, and risks
  - [ ] Added/updated user-facing disclosure if UX changes

## Incident Response

- Triage: reproduce, capture minimal context (redacted), severity rating
- Mitigation: hotfix guardrail/prompt, temporary disable, or roll back
- Postmortem: document root cause, add missing tests/metrics, update guidelines

---

See also: docs/Model-Card-Template.md, docs/Content-Safety-Policy.md, docs/Privacy-and-Data-Handling.md

