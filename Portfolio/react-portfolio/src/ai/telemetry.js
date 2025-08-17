/*
  Minimal telemetry helper. Redacts PII by default and supports sampling.
  Frontend-safe: does not send network requests by itself.
*/

import { redactPII } from './safety';

function getEnvBoolean(name, fallback = false) {
  // CRA uses REACT_APP_*; fall back to window.__ENV
  const v = (typeof process !== 'undefined' && process.env && process.env[name])
    || (typeof window !== 'undefined' && window.__ENV && window.__ENV[name]);
  if (v == null) return fallback;
  return String(v).toLowerCase() === 'true' || String(v) === '1';
}

function getEnvNumber(name, fallback) {
  const v = (typeof process !== 'undefined' && process.env && process.env[name])
    || (typeof window !== 'undefined' && window.__ENV && window.__ENV[name]);
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function logAIEvent(event, options = {}) {
  const enabled = options.enabled ?? getEnvBoolean('REACT_APP_AI_TELEMETRY_ENABLED', false);
  if (!enabled) return;
  const sampling = options.sampling ?? getEnvNumber('REACT_APP_AI_TELEMETRY_SAMPLING', 0.05);
  if (Math.random() > sampling) return;

  const payload = { ...event };
  // Redact possibly sensitive fields
  ['input', 'prompt', 'output'].forEach((k) => {
    if (payload[k] && typeof payload[k] === 'string') {
      payload[k] = redactPII(payload[k]).redacted;
    }
  });

  // Default sink: console.debug (replace with your collection endpoint)
  // Never log secrets/keys here; ensure CI lints prevent that.
  try {
    // eslint-disable-next-line no-console
    console.debug('[AI-Telemetry]', payload);
  } catch (_) {}

  if (typeof options.onEvent === 'function') {
    try { options.onEvent(payload); } catch (_) {}
  }
}

