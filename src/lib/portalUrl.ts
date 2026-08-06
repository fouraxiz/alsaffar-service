/**
 * Portal (ERP) base URL for Sign In / Sign Up links.
 *
 * - Marketing site on localhost → local ERP
 * - Marketing site on live domain → live ERP (never localhost)
 *
 * Live source of truth (preferred):
 *   ERP_API_BASE_URL (server) → exposed via /api/portal
 *
 * Optional public overrides:
 *   NEXT_PUBLIC_PORTAL_URL_LOCAL
 *   NEXT_PUBLIC_PORTAL_URL_LIVE / NEXT_PUBLIC_PORTAL_URL
 */

export const DEFAULT_LIVE_PORTAL = 'https://alsaffar.4axizerp.com';
export const DEFAULT_LOCAL_PORTAL = 'http://localhost/alsaffar-backend';

export function isLocalHostname(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname.endsWith('.local')
  );
}

export function isLocalUrl(url: string): boolean {
  try {
    return isLocalHostname(new URL(url).hostname);
  } catch {
    return false;
  }
}

/** Strip trailing slash; empty → fallback. */
export function cleanBase(value: string | undefined | null, fallback: string): string {
  const raw = (value ?? '').trim();
  if (!raw || raw === '/') return fallback;
  return raw.replace(/\/$/, '');
}

/**
 * Origin-only ERP base (drops /api/... path if someone pasted a full API URL).
 */
export function toPortalOrigin(url: string, fallback: string = DEFAULT_LIVE_PORTAL): string {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}`.replace(/\/$/, '');
  } catch {
    return cleanBase(url, fallback);
  }
}

const LOCAL_PORTAL = cleanBase(
  process.env.NEXT_PUBLIC_PORTAL_URL_LOCAL,
  DEFAULT_LOCAL_PORTAL
);

/** Live portal — never allow a localhost value (common Vercel misconfig). */
function resolveLivePortalFromEnv(): string {
  const candidate = cleanBase(
    process.env.NEXT_PUBLIC_PORTAL_URL_LIVE || process.env.NEXT_PUBLIC_PORTAL_URL,
    DEFAULT_LIVE_PORTAL
  );
  if (isLocalUrl(candidate)) {
    return DEFAULT_LIVE_PORTAL;
  }
  return toPortalOrigin(candidate, DEFAULT_LIVE_PORTAL);
}

const LIVE_PORTAL = resolveLivePortalFromEnv();

/** Resolve portal URL from the marketing site hostname (client-safe). */
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

/**
 * Server-only: prefer ERP_API_BASE_URL (already set correctly on Vercel for the API).
 */
export function resolvePortalUrlFromServer(erpBaseUrl?: string | null): string {
  const fromErp = (erpBaseUrl ?? '').trim();
  if (fromErp && !isLocalUrl(fromErp)) {
    return toPortalOrigin(fromErp, LIVE_PORTAL);
  }
  return LIVE_PORTAL;
}

export const portalDefaults = {
  local: LOCAL_PORTAL,
  live: LIVE_PORTAL,
} as const;

export type PortalKind = 'customer' | 'vendor';

/** Absolute ERP auth URLs (path-based). */
export function portalAuthUrl(
  baseUrl: string,
  action: 'login' | 'register',
  portal: PortalKind
): string {
  const base = cleanBase(baseUrl, LIVE_PORTAL);
  return `${base}/${action}/${portal}`;
}
