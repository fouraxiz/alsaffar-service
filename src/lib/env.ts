/**
 * Centralised, typed environment access.
 *
 * Best practice: read process.env in ONE place, never scatter it. Secrets
 * (ERP_API_*) are server-only — they have no NEXT_PUBLIC_ prefix so they are
 * stripped from the browser bundle. Importing `serverEnv` from a Client
 * Component would surface undefined values, which is the intended guard: all
 * ERP calls must go through server code (route handlers / server components).
 */

export const serverEnv = {
  erp: {
    baseUrl: (process.env.ERP_API_BASE_URL ?? '').replace(/\/$/, ''),
    token: process.env.ERP_API_TOKEN ?? '',
    /** Live backend on when flag is "1" AND a base URL is present. */
    enabled: process.env.ERP_API_ENABLED === '1' && !!process.env.ERP_API_BASE_URL,
    workersRevalidate: Number.parseInt(process.env.ERP_WORKERS_REVALIDATE ?? '60', 10),
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY ?? '',
    to: process.env.CONTACT_TO_EMAIL ?? 'support@alsaffar.pro',
    from: process.env.CONTACT_FROM_EMAIL ?? 'Alsaffar Website <onboarding@resend.dev>',
  },
} as const;

/** Public (browser-safe) values only. */
export const publicEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alsaffar-service.vercel.app',
} as const;
