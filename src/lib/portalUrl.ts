/**
 * Portal (ERP) base URL for Sign In / Sign Up links.
 *
 * - Marketing site on localhost → local ERP
 * - Marketing site on live domain → live ERP
 *
 * Optional env overrides:
 * - NEXT_PUBLIC_PORTAL_URL_LOCAL (default: http://localhost/alsaffar-backend)
 * - NEXT_PUBLIC_PORTAL_URL_LIVE or NEXT_PUBLIC_PORTAL_URL (default: https://alsaffar.4axizerp.com)
 */

function cleanBase(value: string | undefined, fallback: string): string {
  const raw = (value ?? '').trim();
  if (!raw || raw === '/') return fallback;
  return raw.replace(/\/$/, '');
}

const LOCAL_PORTAL = cleanBase(
  process.env.NEXT_PUBLIC_PORTAL_URL_LOCAL,
  'http://localhost/alsaffar-backend'
);

const LIVE_PORTAL = cleanBase(
  process.env.NEXT_PUBLIC_PORTAL_URL_LIVE || process.env.NEXT_PUBLIC_PORTAL_URL,
  'https://alsaffar.4axizerp.com'
);

function isLocalHostname(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname.endsWith('.local')
  );
}

/** Resolve portal URL from the marketing site hostname. */
export function resolvePortalUrl(hostname?: string | null): string {
  if (hostname && isLocalHostname(hostname)) {
    return LOCAL_PORTAL;
  }

  if (hostname) {
    return LIVE_PORTAL;
  }

  if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
    return LIVE_PORTAL;
  }

  return LOCAL_PORTAL;
}

export const portalDefaults = {
  local: LOCAL_PORTAL,
  live: LIVE_PORTAL,
} as const;

export type PortalKind = 'customer' | 'vendor';

/** Absolute ERP auth URLs (path-based — query strings are not required). */
export function portalAuthUrl(
  baseUrl: string,
  action: 'login' | 'register',
  portal: PortalKind
): string {
  const base = cleanBase(baseUrl, LIVE_PORTAL);
  return `${base}/${action}/${portal}`;
}
