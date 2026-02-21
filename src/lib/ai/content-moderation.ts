/**
 * Content safety pipeline for AI-generated and user-submitted text.
 * Mandatory before saving any AI-generated pitch content.
 */

// ─── PII Scrubbing ─────────────────────────────────────

const PII_PATTERNS: { pattern: RegExp; replacement: string }[] = [
  // Email addresses
  { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: '[email removed]' },
  // UK phone numbers (landline and mobile)
  { pattern: /(?:\+44|0)\s*\d[\d\s]{8,12}/g, replacement: '[phone removed]' },
  // UK postcodes
  { pattern: /[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}/gi, replacement: '[postcode removed]' },
  // Full street addresses (number + street name pattern)
  { pattern: /\d{1,5}\s+[A-Z][a-zA-Z]+\s+(?:Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Drive|Dr|Close|Cl|Way|Crescent|Cres|Court|Ct|Place|Pl|Terrace|Ter|Gardens|Gdns)\b/gi, replacement: '[address removed]' },
  // National Insurance numbers
  { pattern: /[A-CEGHJ-PR-TW-Z]{2}\s*\d{2}\s*\d{2}\s*\d{2}\s*[A-D]/gi, replacement: '[NI number removed]' },
];

/**
 * Remove PII from text: emails, UK phone numbers, postcodes, addresses, NI numbers.
 */
export function scrubPII(text: string): string {
  let result = text;
  for (const { pattern, replacement } of PII_PATTERNS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

// ─── Content Safety ─────────────────────────────────────

const BLOCKED_WORDS = [
  // Violence / harm
  'kill', 'murder', 'weapon', 'bomb', 'explode', 'attack', 'stab', 'shoot',
  // Drugs / substances
  'cocaine', 'heroin', 'meth', 'marijuana', 'cannabis', 'weed', 'drug deal',
  // Adult content
  'pornography', 'porn', 'xxx', 'nude', 'naked', 'onlyfans',
  // Discrimination
  'racist', 'sexist', 'homophobic',
  // Scam / fraud
  'pyramid scheme', 'get rich quick', 'money laundering',
  // Gambling
  'gambling', 'casino', 'betting shop',
];

/**
 * Check if content is safe for the platform.
 * Returns { safe: true } or { safe: false, reason: string }.
 */
export function isContentSafe(text: string): { safe: boolean; reason?: string } {
  const lower = text.toLowerCase();

  for (const word of BLOCKED_WORDS) {
    if (lower.includes(word)) {
      return {
        safe: false,
        reason: `Content contains inappropriate language. Please revise and try again.`,
      };
    }
  }

  return { safe: true };
}

/**
 * Full content safety pipeline: scrub PII then check safety.
 * Returns cleaned text and safety result.
 */
export function processContent(text: string): {
  cleaned: string;
  safe: boolean;
  reason?: string;
} {
  const cleaned = scrubPII(text);
  const safety = isContentSafe(cleaned);
  return { cleaned, ...safety };
}
