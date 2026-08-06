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

const LOCAL_PORTAL = (
  process.env.NEXT_PUBLIC_PORTAL_URL_LOCAL ?? 'http://localhost/alsaffar-backend'
).replace(/\/$/, '');

const LIVE_PORTAL = (
  process.env.NEXT_PUBLIC_PORTAL_URL_LIVE ??
  process.env.NEXT_PUBLIC_PORTAL_URL ??
  'https://alsaffar.4axizerp.com'
).replace(/\/$/, '');

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

  // SSR without host: production → live, otherwise local.
  if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
    return LIVE_PORTAL;
  }

  return LOCAL_PORTAL;
}

export const portalDefaults = {
  local: LOCAL_PORTAL,
  live: LIVE_PORTAL,
} as const;
