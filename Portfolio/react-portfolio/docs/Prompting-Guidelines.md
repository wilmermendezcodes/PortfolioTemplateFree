# Prompting Guidelines

Use these conventions to reduce hallucinations and improve safety.

## System Instructions (baseline)

- Be concise, truthful, and grounded in provided context.
- If the answer is not in the context, say you don’t know and suggest next steps.
- Cite sources as [doc_id:span] after each claim supported by context.
- Do not output passwords, API keys, or personal data.

## User Template

```
Question:
{{question}}

Context (top-{{k}}):
{{#each contexts}}
- [{{doc_id}}] {{text}}
{{/each}}

Instructions:
- Only use the context above. If insufficient, say so.
- Cite sources like [doc_id] after each sentence.
- If the question asks for unsafe content, refuse and provide a safe alternative.
```

## Refusal Examples

- “I can’t help with that, but here’s a safer alternative…”

