// Server-only by architecture: imported only from route handlers / server code.
// Secrets are read via serverEnv (no NEXT_PUBLIC_ prefix), so they never reach
// the browser bundle even if this module were imported client-side by mistake.
import { serverEnv } from './env';

/**
 * Server-only client for the Alsaffar ERP WebsiteApi (headless backend).
 *
 * All calls run on the server (route handlers / server components) so the
 * bearer token never reaches the browser. READ endpoints are token-gated;
 * WRITE (intake) endpoints are public but validated/rate-limited by the ERP.
 *
 * Every method is fail-soft: on any error it throws, and callers decide the
 * fallback (e.g. static data). Nothing here ever crashes a page render.
 */

const API_PREFIX = '/api/website/v1';
const DEFAULT_TIMEOUT_MS = 8000;

export type ErpNationality = { en: string | null; ar: string | null };
export type ErpCategory = { en: string | null; ar: string | null };
export type ErpLanguage = { name: string; proficiency: string | null };

export type ErpWorker = {
  worker_code: string;
  first_name: string | null;
  /** Sanitized human display name (EN) from ERP PublicWorkerResource. */
  name?: string | null;
  /** Sanitized human display name (AR). */
  name_ar?: string | null;
  photo_url: string | null;
  video_url: string | null;
  nationality: ErpNationality;
  category: ErpCategory;
  experience_years: number | null;
  skill_level: string | null;
  skills: string[];
  languages: ErpLanguage[];
  available: boolean;
  // Additive public fields (see backend PublicWorkerResource):
  gender?: 'male' | 'female' | null;
  age?: number | null;
  salary_expectation?: number | null;
  bio?: string | null;
  bio_ar?: string | null;
  job_type?: string | null;
};

export type ErpWorkerListResponse = {
  data: ErpWorker[];
  meta?: { total?: number; per_page?: number; current_page?: number };
};

export type ErpCountry = {
  slug: string;
  nationality: { en: string | null; ar: string | null };
  salary_ranges?: unknown[];
  pool_count?: number;
};

export type ErpCountryListResponse = { success?: boolean; data: ErpCountry[] };

export type ErpServiceCard = {
  service_key: string;
  title: { en: string | null; ar: string | null };
  description: { en: string | null; ar: string | null };
  icon: string | null;
  image: string | null;
  /** Present on some payloads; public list should already be active-only. */
  is_active?: boolean | null;
};

export type ErpServiceListResponse = { success?: boolean; data: ErpServiceCard[] };

export type ErpBanner = {
  title: { en: string | null; ar: string | null };
  image: string | null;
  link_url: string | null;
  placement: string | null;
};

export type ErpBannerListResponse = { success?: boolean; data: ErpBanner[] };

export type ErpPageContent = {
  slug: string;
  title: { en: string | null; ar: string | null };
  meta?: {
    title?: { en: string | null; ar: string | null };
    description?: { en: string | null; ar: string | null };
    og_image?: string | null;
  };
  status?: string;
  sections: Array<{
    section_key: string;
    sort_order: number;
    is_visible?: boolean;
    content: unknown;
  }>;
};

export type ErpSitemapResponse = {
  success?: boolean;
  data: {
    pages: Array<{ slug: string; lastmod: string | null }>;
    countries: Array<{ slug: string; lastmod: string | null }>;
    posts: Array<{ slug: string; lastmod: string | null }>;
    workers: Array<{ slug: string; lastmod: string | null }>;
  };
};

export type WorkerQuery = {
  category?: string;
  nationality?: string;
  gender?: string;
  experience?: string;
  language?: string;
  per_page?: number;
  page?: number;
};

function assertConfigured(): void {
  if (!serverEnv.erp.enabled) {
    throw new Error('ERP backend disabled (ERP_API_ENABLED!=1 or no base URL).');
  }
}

async function erpFetch<T>(
  path: string,
  opts: {
    method?: 'GET' | 'POST';
    query?: Record<string, string | number | undefined>;
    body?: unknown;
    formData?: FormData;
    auth?: boolean;
    revalidate?: number;
    timeoutMs?: number;
  } = {},
): Promise<T> {
  assertConfigured();

  const url = new URL(serverEnv.erp.baseUrl + API_PREFIX + path);
  for (const [k, v] of Object.entries(opts.query ?? {})) {
    if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
  }

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (opts.auth !== false && serverEnv.erp.token) {
    headers.Authorization = `Bearer ${serverEnv.erp.token}`;
  }
  // Never set Content-Type for FormData — fetch must add multipart boundary.
  if (opts.body !== undefined && !opts.formData) {
    headers['Content-Type'] = 'application/json';
  }

  const timeoutMs = opts.timeoutMs ?? (opts.formData ? 60000 : DEFAULT_TIMEOUT_MS);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const method = opts.method ?? 'GET';

  try {
    const revalidate = opts.revalidate ?? serverEnv.erp.workersRevalidate;
    const res = await fetch(url, {
      method,
      headers,
      body: opts.formData
        ? opts.formData
        : opts.body !== undefined
          ? JSON.stringify(opts.body)
          : undefined,
      signal: controller.signal,
      // POSTs never cached. revalidate:0 → always fresh (service activate/deactivate).
      ...(method === 'POST'
        ? { cache: 'no-store' as const }
        : revalidate === 0
          ? { cache: 'no-store' as const }
          : { next: { revalidate } }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`ERP ${method} ${path} -> ${res.status} ${text.slice(0, 200)}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    // AbortController timeout → clean message (raw AbortError triggers Next.dev overlay noise).
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(`ERP ${method} ${path} timed out after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/** READ: public worker listing (only Available + publicly-visible workers).
 * Always fresh so panel "make available" shows up immediately. */
export function fetchWorkers(query: WorkerQuery = {}): Promise<ErpWorkerListResponse> {
  return erpFetch<ErpWorkerListResponse>('/workers', {
    query: { ...query },
    revalidate: 0,
  });
}

/** READ: single worker by code. */
export function fetchWorker(code: string): Promise<{ data: ErpWorker }> {
  return erpFetch<{ data: ErpWorker }>(`/workers/${encodeURIComponent(code)}`);
}

/** READ: published nationality/country pages (labels, salary ranges, pool count). */
export function fetchCountries(): Promise<ErpCountryListResponse> {
  return erpFetch<ErpCountryListResponse>('/countries');
}

/** READ: active service cards (is_active=true only). Fresh on every request so
 * panel deactivate/activate is visible immediately (no sticky ISR snapshot). */
export function fetchServices(): Promise<ErpServiceListResponse> {
  return erpFetch<ErpServiceListResponse>('/services', { revalidate: 0 });
}

export type ErpSiteConfig = {
  name: { en: string | null; ar: string | null };
  tagline: { en: string | null; ar: string | null };
  logo_url: string | null;
  phone: string | null;
  phone_tel: string | null;
  whatsapp: string | null;
  whatsapp_url: string | null;
  email: string | null;
  address: { en: string | null; ar: string | null };
  hours: { en: string | null; ar: string | null };
  cr_number: string | null;
  license_number: string | null;
  musaned_id: string | null;
  map_embed_url: string | null;
  map_link_url: string | null;
};

/** READ: SaaS branding (logo, footer, contact). */
export function fetchSite(): Promise<{ success?: boolean; data: ErpSiteConfig }> {
  return erpFetch<{ success?: boolean; data: ErpSiteConfig }>('/site');
}

/** READ: live marketing banners (optional placement filter). */
export function fetchBanners(placement?: string): Promise<ErpBannerListResponse> {
  return erpFetch<ErpBannerListResponse>('/banners', {
    query: placement ? { placement } : undefined,
  });
}

/** READ: published page + visible sections. */
export function fetchPageContent(page: string): Promise<{ success?: boolean; data: ErpPageContent }> {
  return erpFetch<{ success?: boolean; data: ErpPageContent }>(`/content/${encodeURIComponent(page)}`);
}

/** READ: visible sections across published pages. */
export function fetchSections(page?: string): Promise<{ success?: boolean; data: unknown[] }> {
  return erpFetch<{ success?: boolean; data: unknown[] }>('/sections', {
    query: page ? { page } : undefined,
  });
}

/** READ: slugs + lastmod for sitemap build. */
export function fetchSitemap(): Promise<ErpSitemapResponse> {
  return erpFetch<ErpSitemapResponse>('/sitemap');
}

/** WRITE (public intake): contact / general lead. */
export function postLead(payload: Record<string, unknown>): Promise<unknown> {
  return erpFetch('/leads', { method: 'POST', body: payload, auth: false });
}

/** WRITE: a worker inquiry (interest in a specific CV). Accepts JSON or multipart FormData (docs). */
export function postWorkerInquiry(
  payload: Record<string, unknown> | FormData,
): Promise<unknown> {
  if (payload instanceof FormData) {
    return erpFetch('/worker-inquiries', {
      method: 'POST',
      formData: payload,
      auth: false,
      timeoutMs: 60000,
    });
  }
  return erpFetch('/worker-inquiries', { method: 'POST', body: payload, auth: false });
}

/** WRITE: callback request. */
export function postCallback(payload: Record<string, unknown>): Promise<unknown> {
  return erpFetch('/callback-requests', { method: 'POST', body: payload, auth: false });
}

/** WRITE: newsletter subscription. */
export function postNewsletter(payload: Record<string, unknown>): Promise<unknown> {
  return erpFetch('/newsletter', { method: 'POST', body: payload, auth: false });
}

export const erpEnabled = () => serverEnv.erp.enabled;

/** Soft log for expected ERP downtime — `console.warn` avoids Next.js red overlay in dev. */
export function logErpFallback(scope: string, err: unknown): void {
  const msg = err instanceof Error ? err.message : String(err);
  console.warn(`[${scope}] ERP unavailable, using static fallback: ${msg}`);
}
