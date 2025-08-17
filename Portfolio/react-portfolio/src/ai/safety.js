/*
  Lightweight safety utilities: PII redaction, input limiting, and simple moderation.
  Pure JS, no deps. Import as needed; does nothing unless you call it.
*/

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const SSN_RE = /\b\d{3}-\d{2}-\d{4}\b/g; // US SSN pattern
const PHONE_RE = /(?:(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3}[\s.-]?\d{4})/g;
const CC_RE = /\b(?:\d[ -]*?){13,16}\b/g; // rough card number candidate

function luhnCheck(num) {
  const s = (num || '').replace(/[^\d]/g, '');
  let sum = 0; let alt = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let n = parseInt(s[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n; alt = !alt;
  }
  return s.length >= 13 && (sum % 10) === 0;
}

export function detectPII(text) {
  const findings = [];
  const pushMatches = (regex, type, validator) => {
    const re = new RegExp(regex.source, regex.flags.replace('g', '') + 'g');
    let m; while ((m = re.exec(text)) !== null) {
      const value = m[0];
      if (!validator || validator(value)) {
        findings.push({ type, value, start: m.index, end: m.index + value.length });
      }
      // prevent zero-length progress
      if (m.index === re.lastIndex) re.lastIndex++;
    }
  };
  pushMatches(EMAIL_RE, 'email');
  pushMatches(SSN_RE, 'ssn');
  pushMatches(PHONE_RE, 'phone');
  pushMatches(CC_RE, 'credit_card', luhnCheck);
  return findings;
}

export function redactPII(text, replacement = '[REDACTED]') {
  const entities = detectPII(text);
  if (entities.length === 0) return { redacted: text, entities };
  // Sort by start desc to avoid index shift
  const sorted = [...entities].sort((a, b) => b.start - a.start);
  let out = text;
  for (const e of sorted) {
    out = out.slice(0, e.start) + replacement + out.slice(e.end);
  }
  return { redacted: out, entities };
}

export function limitInput(text, maxChars = 6000) {
  const normalized = (text || '').trim().replace(/[\t\f\v]+/g, ' ').replace(/\s{2,}/g, ' ');
  if (normalized.length <= maxChars) return { text: normalized, truncated: false };
  return { text: normalized.slice(0, maxChars), truncated: true };
}

// Very light keyword-based prefilter. Not a classifier.
const CATEGORIES = {
  self_harm: [/\bkill myself\b/i, /\bsuicide\b/i],
  violence: [/\bkill (?:him|her|them)\b/i, /\bmake a bomb\b/i],
  hate: [/\b(?:racial slur|\bhate speech)\b/i],
  sexual_content_minor: [/\bminor\b.*\bsex\b/i],
  illicit: [/\bhack into\b/i, /\bbypass security\b/i],
};

export function moderateInput(text) {
  const matches = [];
  for (const [category, patterns] of Object.entries(CATEGORIES)) {
    for (const re of patterns) {
      if (re.test(text)) { matches.push(category); break; }
    }
  }
  const unique = [...new Set(matches)];
  return { blocked: unique.length > 0, categories: unique };
}

export function safeUserInput(input, options = {}) {
  const { maxChars = 6000, redact = true } = options;
  const { text, truncated } = limitInput(input, maxChars);
  const pii = redact ? redactPII(text) : { redacted: text, entities: [] };
  const moderation = moderateInput(pii.redacted);
  return {
    input: pii.redacted,
    truncated,
    pii_entities: pii.entities,
    moderation,
  };
}

// Helper to enforce refusal inline
export function shouldRefuse(moderation) {
  return Boolean(moderation && moderation.blocked);
}

