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
    auth?: boolean;
    revalidate?: number;
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
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: opts.method ?? 'GET',
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      signal: controller.signal,
      // ISR for GETs; POSTs are never cached.
      next: opts.method === 'POST' ? undefined : { revalidate: opts.revalidate ?? serverEnv.erp.workersRevalidate },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`ERP ${opts.method ?? 'GET'} ${path} -> ${res.status} ${text.slice(0, 200)}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

/** READ: public worker listing (only Available + publicly-visible workers). */
export function fetchWorkers(query: WorkerQuery = {}): Promise<ErpWorkerListResponse> {
  return erpFetch<ErpWorkerListResponse>('/workers', { query: { ...query } });
}

/** READ: single worker by code. */
export function fetchWorker(code: string): Promise<{ data: ErpWorker }> {
  return erpFetch<{ data: ErpWorker }>(`/workers/${encodeURIComponent(code)}`);
}

/** READ: published nationality/country pages (labels, salary ranges, pool count). */
export function fetchCountries(): Promise<ErpCountryListResponse> {
  return erpFetch<ErpCountryListResponse>('/countries');
}

/** WRITE (public intake): contact / general lead. */
export function postLead(payload: Record<string, unknown>): Promise<unknown> {
  return erpFetch('/leads', { method: 'POST', body: payload, auth: false });
}

/** WRITE: a worker inquiry (interest in a specific CV). */
export function postWorkerInquiry(payload: Record<string, unknown>): Promise<unknown> {
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
