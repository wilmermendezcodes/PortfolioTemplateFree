/*
  Prompt helper to encourage grounded, safe outputs. Returns a structure
  you can adapt to your model client (system + user messages).
*/

export function buildGroundedPrompt({ question, contexts = [], k = 5, options = {} }) {
  const sys = [
    'You are a concise, truthful assistant.',
    'Use only the provided context. If insufficient, say you do not know.',
    'Cite sources like [doc_id] after each supported sentence.',
    'Do not output secrets, personal data, or unsafe instructions.',
  ];
  if (options.extraSystem) sys.push(String(options.extraSystem));

  const ctxLines = contexts.slice(0, k).map((c) => `- [${c.doc_id ?? 'doc'}] ${c.text ?? ''}`);
  const usr = [
    'Question:',
    String(question ?? ''),
    '',
    `Context (top-${Math.min(k, contexts.length)}):`,
    ...ctxLines,
    '',
    'Instructions:',
    '- Only use the context above. If insufficient, say so.',
    '- Cite sources like [doc_id] after each sentence.',
    '- If the question asks for unsafe content, refuse and suggest a safe alternative.',
  ].join('\n');

  return {
    system: sys.join(' '),
    user: usr,
  };
}

