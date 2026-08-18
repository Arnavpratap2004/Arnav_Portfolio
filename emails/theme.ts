/**
 * Shared tokens for the transactional emails.
 *
 * Deliberately conservative: a light body with a dark branded header renders
 * consistently in Gmail, Outlook (Word engine), and Apple Mail, whereas a
 * fully dark template gets its backgrounds stripped or inverted by several of
 * them. The accents below are lifted from the site's contact section so the
 * mail still reads as part of the portfolio.
 */

export const color = {
  ink: '#0A0F1A',
  inkSoft: '#161D2B',

  pageBg: '#F1F4F7',
  card: '#FFFFFF',
  well: '#F7F9FB',
  border: '#E3E9F0',
  borderStrong: '#D3DBE5',

  text: '#0F1720',
  textMuted: '#66788C',
  textFaint: '#93A3B4',
  onDark: '#FFFFFF',
  onDarkMuted: '#8C9BAE',

  cyan: '#1F8FB5',
  cyanSoft: '#48B8D8',
  green: '#12A87C',
  link: '#1F6FEB',
} as const;

export const font =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export const fontMono =
  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";

export const SITE = 'https://arnavpratap.tech';
export const GITHUB = 'https://github.com/Arnavpratap2004';
export const LINKEDIN = 'https://www.linkedin.com/in/arnavpratap2004/';

/** Label above a value, e.g. "SUBJECT". */
export const eyebrow = {
  margin: '0 0 4px',
  fontSize: '11px',
  lineHeight: '16px',
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase' as const,
  color: color.textFaint,
};

export const body = {
  backgroundColor: color.pageBg,
  fontFamily: font,
  margin: 0,
  padding: '0 0 32px',
  // Keep clients that auto-invert (Outlook mobile, some Gmail dark themes)
  // from repainting the light card into an unreadable mid-grey.
  colorScheme: 'light only',
  supportedColorSchemes: 'light only',
};

// `width:100%` + `max-width` rather than a fixed 600px: a fixed width makes the
// body grow to fit, so `max-width:100%` then resolves against 600px and the card
// overflows horizontally on phones instead of shrinking.
export const container = {
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
  padding: 0,
};

export const card = {
  backgroundColor: color.card,
  border: `1px solid ${color.border}`,
  borderRadius: '14px',
  overflow: 'hidden',
};

export const paragraph = {
  margin: '0 0 14px',
  fontSize: '15px',
  lineHeight: '24px',
  color: color.text,
};

/** Initials for the avatar chip — "Ada Lovelace" -> "AL". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** First name for greetings, falling back to the whole string. */
export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name.trim();
}
