# Backend Integration Plan — Alsaffar Website ⇄ ERP (headless)

> Goal: make this Next.js site consume the Alsaffar ERP (`d:/XAMPP82/htdocs/alsaffar`, package `WebsiteApi`)
> as its live data + lead backend, WITHOUT breaking the current standalone site.
> Author: integration pass, 2026-07-11.

## 0. Current state (verified)

| Area | Now | Target |
|---|---|---|
| Worker/CV data | static `src/data/cvData.ts` (81 mock records) | fetched from ERP `GET /api/website/v1/workers`, **static as fallback** |
| Contact form | `POST /api/contact` → Resend email only | Resend **+** ERP `POST /api/website/v1/leads` (lands in CRM) |
| Worker inquiry / callback / newsletter | none / local only | ERP intake endpoints (CRM + SLA timer) |
| Env / API base URL | **none** | `.env.local` + `.env.example` with API base + token |
| Backend connection code | 100% built (endpoints, token gate, CORS, admin token issue/rotate) | reuse as-is |

Decision (safe defaults, revertible): **worker data = backend-first with static fallback**; **contact = Resend + CRM (dual, non-destructive)**.

## 1. Data-shape mapping (the one real gap)

ERP `PublicWorkerResource` (privacy whitelist) returns:
`worker_code, first_name, photo_url, video_url, nationality{en,ar}, category{en,ar}, experience_years, skill_level, skills[], languages[{name,proficiency}], available`

Site `WorkerCV` type additionally uses for filters/detail: `gender, age, salaryExpectation, jobType, visaType, serviceType, bio/bioAr, name (full)`.

**Gap resolution (two-sided):**
- **Backend (small, one-time):** extend `PublicWorkerResource` to also expose the fields the client ALREADY publishes publicly today: `gender`, `age` (derived from dob, not dob itself), `salary_expectation`, `bio/bio_ar`, `job_type` alias of category. These are non-sensitive (already on the live site). Passport/phone/dob/religion/vendor/finance stay hidden.
- **Frontend:** an adapter `mapApiWorkerToCV()` converts the API shape → `WorkerCV`, filling any still-missing optional field with sensible defaults so the existing components need **no rewrite**.

## 2. Frontend work (this repo)

- **F1. Env scaffolding** — `.env.example` + `.env.local`:
  - `NEXT_PUBLIC_SITE_URL`, `ERP_API_BASE_URL` (server-only, e.g. `http://localhost/alsaffar/public` in dev / `https://<vps>` in prod), `ERP_API_TOKEN` (server-only, from ERP admin), `ERP_API_ENABLED` ("1" to use backend, "0" to force static), plus existing Resend vars.
- **F2. API client lib** — `src/lib/erpApi.ts`: server-side `fetch` wrapper (adds `Authorization: Bearer <token>` for READ, base URL, timeout, ISR `revalidate`), typed responses, throws→caller falls back.
- **F3. Worker adapter** — `src/lib/workerAdapter.ts`: `mapApiWorkerToCV(apiWorker): WorkerCV`.
- **F4. Worker data source** — `src/lib/getWorkers.ts`: `getWorkers()` server function → tries ERP `/workers` (adapted); on error/`ERP_API_ENABLED=0` returns static `mockWorkers`. Wire `CVBrowser` (currently imports `mockWorkers` directly) to receive workers as a prop from a server component, OR keep client component + a route handler `src/app/api/workers/route.ts` that proxies ERP (keeps token server-side). **Chosen: route handler proxy** (least churn to the client component; token never reaches browser).
- **F5. Contact → CRM** — `src/app/api/contact/route.ts`: after Resend send, also `POST` to ERP `/leads` (source="website-contact"), guarded + non-fatal (Resend success is still success if CRM is down).
- **F6. Worker inquiry / callback / newsletter** — where the site has these actions (request-cv "No match" form, callback button, footer newsletter), POST to the matching ERP intake endpoints via server route handlers. If a form is currently local-only, wire it; if absent, skip (note it).
- **F7. Media** — API returns short-lived signed `photo_url`/`video_url` from the ERP host; ensure `next.config.ts images.remotePatterns` allows the ERP host, or proxy via the route handler.

## 3. Backend work (ERP repo — minimal, non-breaking)

- **B1. Expand `PublicWorkerResource`** (add gender, age-from-dob, salary_expectation, bio/bio_ar, job_type) — additive only, still a strict whitelist.
- **B2. Admin config at deploy:** issue an API token (WebsiteApi → Settings → API token → Issue), add the Vercel origin(s) + localhost to `cors_allowed_origins`. (Runtime config, not code — documented in §5.)

## 4. Fallback / resilience

- `ERP_API_ENABLED=0` or any fetch error → static `mockWorkers` (site never hard-fails).
- Contact: Resend is the source of truth for the reply; CRM POST is best-effort.
- ISR: worker list cached ~60s (`revalidate: 60`) so the site is fast and the ERP isn't hammered.

## 5. Deployment / env values (human, at go-live)

| Where | Key | Dev | Prod |
|---|---|---|---|
| Next.js (Vercel env) | `ERP_API_BASE_URL` | `http://localhost/alsaffar/public` | `https://<erp-vps-domain>` |
| Next.js | `ERP_API_TOKEN` | dev token from admin | prod token from admin (server-only, not `NEXT_PUBLIC`) |
| Next.js | `ERP_API_ENABLED` | `1` | `1` |
| ERP admin | API token | Issue in WebsiteApi Settings | Issue |
| ERP admin | `cors_allowed_origins` | `http://localhost:3000` | `https://alsaffar-service.vercel.app` (+ custom domain) |
| ERP host | — | XAMPP | VPS + HTTPS + queue worker + `schedule:run` cron |

## 6. Step order (this pass)

1. F1 env scaffolding (+ document values) — **start here**
2. F2 erpApi client + F3 adapter + F4 route-handler proxy `/api/workers` + wire CVBrowser
3. B1 expand PublicWorkerResource (ERP repo)
4. F5 contact → CRM dual-send
5. F6 inquiry/callback/newsletter wiring (where present)
6. F7 image remote host allow
7. Local end-to-end test (XAMPP backend running, token+CORS set for localhost:3000)
8. `.env.example` + this plan handed off for prod values

## 6b. DONE in this pass (2026-07-11) + bugs found

**Frontend (this repo) — wired & type-clean (no tsc errors in any new file):**
- `.env.example` + `.env.local` (server-only `ERP_API_*`, never `NEXT_PUBLIC_`).
- `src/lib/env.ts` (typed central env), `src/lib/erpApi.ts` (server fetch client, Bearer token, ISR, timeout, fail-soft),
  `src/lib/workerAdapter.ts` (ERP → WorkerCV), `src/lib/getWorkers.ts` (backend-first + static fallback).
- `src/app/api/workers/route.ts` (route-handler proxy — token stays server-side; browser only calls `/api/workers`).
- `CVBrowser.tsx` now hydrates from `/api/workers` (instant static render → live ERP), filters over state.
- `contact/route.ts` → Resend **+** best-effort CRM `/leads` mirror (non-fatal).
- `next.config.ts` remotePatterns += ERP host (signed photo/video URLs).

**Backend (ERP repo) — additive, non-breaking:**
- `PublicWorkerResource` += gender, age (from dob), salary_expectation, bio, bio_ar, job_type (verified: age=30, job_type=Housemaid render from real data).
- New Manpower migration: nullable `salary_expectation` / `bio` / `bio_ar` on manpower_workers (+ model fillable).

**3 real bugs found by testing over actual HTTP (curl + token) — all fixed:**
1. `Integrations::manpowerActive()` / `leadAvailable()` evaluated `Module_is_active()` with no company id → under
   token-auth (no `Auth::user()`) they returned **false**, so the public worker API always returned `[]` and every
   lead was silently skipped. Fixed to accept + pass the token's `website_company_id` (5 call sites).
2. `leads.email` is NOT NULL, but website contact/callback leads are phone-only → insert failed. Fixed with
   `email ?: ''` coalesce in LeadBridgeService.
3. Stale opcached config pointed Apache at DB `ngof` → `php artisan config:clear` fixed it (env, not code).

**Proven over real HTTP:** `GET /api/website/v1/workers` (token) returns the public worker with the new fields +
Arabic; `POST /api/website/v1/leads` lands a phone-only lead in the CRM (leads count increments).

## 6c. F6 DONE — every backend-capturable form now flows to the CRM
- **Contact form** → CRM lead (source `website-contact`) ✓
- **NoMatchForm** ("specific worker request" in Browse-CVs) → new `src/app/api/inquiry/route.ts` → CRM lead
  (source `website-no-match`, description + applied filters as notes). Verified over real HTTP: lead lands. ✓
- **Everything else is intentionally NOT a backend form**: "request this CV", callback, and service CTAs are
  WhatsApp (`wa.me/966920021201`) / phone (`tel:`) / maps deep-links — left as-is (that IS the desired UX).
- **No newsletter form exists** on the site (the "newsletter" grep hit was `subscribeToReducedMotion`).

Nothing else on the site is wireable. All my new/edited files are TypeScript-clean (the sole `tsc` error is the
pre-existing uninstalled `resend` dependency — it is in package.json, just not `npm install`-ed in this checkout).

## 6d. Truly remaining (environment / human — not code)
- `npm install` in this repo (node_modules is incomplete — resend/react-qr-code/react-to-print/
  react-phone-number-input are declared in package.json but not installed), then `npm run build`.
- Set prod env values + flip `ERP_API_ENABLED=1`: real ERP HTTPS URL, issued token, Vercel env; add the Vercel
  origin to `cors_allowed_origins` in the ERP admin. (Dev is proven working against XAMPP.)
- Optional later: localize Arabic worker name/skills (ERP exposes one label set; adapter reuses it for AR).

## 7. Out of scope (human/ops)

Real VPS domain + HTTPS, issuing the prod token, Vercel env values, DNS, and the ERP admin managing website CONTENT (pages/services/country pages) — those are runtime/admin tasks once wired.
