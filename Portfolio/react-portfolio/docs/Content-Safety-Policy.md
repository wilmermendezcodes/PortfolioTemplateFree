# Content Safety Policy

This policy governs inputs and outputs for AI features. The goal is to reduce harm while preserving useful functionality.

## Disallowed Content (block or refuse)

- Child sexual content and sexual exploitation
- Explicit instructions facilitating self-harm or suicide
- Targeted harassment or threats of violence
- Illicit behavior facilitation (e.g., bypassing safety systems, creating malware)
- Personally identifiable information of others (doxxing) or sensitive financial data

## Sensitive Content (safe-complete or provide help resources)

- Self-harm: respond with empathy, encourage seeking help, provide hotline resources. Do not give instructions.
- Medical/legal/financial advice: provide general information with disclaimers; encourage professional consultation.

## Response Patterns

- Refusal: briefly explain why; offer safe alternative if possible.
- Grounded answers: cite sources or retrieved context; avoid speculation.
- Redaction: remove PII when echoing user content (e.g., in summaries).

## Implementation Notes

- Use lightweight keyword heuristics in `src/ai/safety.js` as a prefilter; optionally plug in a hosted moderation API.
- Enforce max input size and timeouts to prevent prompt injection via oversized content.
- Add tests for refusal cases and regression checks for allowed/safe-complete behavior.

