# Client Feedback Implementation Plan

> Date: 2026-07-02
> Source: Client feedback — (1) milk-shadow background concept, (2) "15+ Years Experience" motion + customizable images

---

## Current State (Codebase Analysis)

- **Tech stack:** Next.js 16.2.6 + Tailwind 4 + next-intl (English/Arabic RTL). No database or CMS — only a single contact API route (Resend email).
- **"15+ Years Experience" area** = the right side of `src/components/home/Hero.tsx` — a **static Unsplash image** (line 110-120) with two floating stat cards on top ("15+ Years Experience" and "5,000+ Workers Placed"). This is what the client means by "center images".
- The background currently has only a dot pattern + orange glow — no silhouette/illustration.
- Images are hardcoded — the client has no way to change them on their own.

---

## Phase 1 — Milk-shadow Background (Silhouette Illustration)

**What to do:**

1. **Create a silhouette SVG set** — based on recruitment categories: cleaning (mop/spray), driving (car/steering), nanny (mother-child), cooking, etc. Single-color soft shapes, tinted with the brand color.
2. **A reusable component named `SilhouetteBackdrop`** — places the SVGs at very low opacity (3–6%) in the section background, with a soft blur + gradient mask so they don't conflict with the content. Positions mirror in RTL (Arabic) mode.
3. **Where it goes:** Hero, ServicesSection, GuaranteeInfo — adds depth to the page while staying professional.

**Recommendation (client is open to a "cleaner approach"):** instead of a literal paper-style milk-shadow, use a **large duotone silhouette + a very subtle parallax drift on scroll**. It looks modern and gives more depth than a flat watermark. Will respect `prefers-reduced-motion`.

---

## Phase 2 — Hero Image Rotation ("15+ Years Experience" Motion)

**What to do:**

1. Replace the static image with a **`HeroImageRotator` component** — rotates 3–5 images with **crossfade + subtle Ken Burns zoom** (5-second interval).
2. The two floating stat cards **stay static** — only the background image rotates, so the main message isn't distracting.
3. Pause on hover, stop rotation when `prefers-reduced-motion` is set, first image loads with `priority` (won't hurt LCP), next image preloads.

---

## Phase 3 — Client-side Image Customization

**Problem:** The site has no backend/database, so a storage layer is needed to satisfy the "no development changes" requirement.

**Options:**

| Option | How it works | Cost/effort |
|---|---|---|
| **A. Admin page + Vercel Blob (recommended)** | Password-protected `/admin` page — client uploads/deletes/reorders images, hero fetches the list at runtime | Medium effort, nearly free, fully self-serve |
| B. Headless CMS (Sanity free tier) | Full CMS dashboard; campaign banner/text can also become editable later | More setup, but the most scalable |
| C. JSON file + redeploy | Cheap, but the client can't do it themselves — fails the requirement | Rejected |

**Recommendation: Option A** — the client only needs to add/remove/edit images; a full CMS is overkill.

**Task list:**

1. `/[locale]/admin/hero-images` page — simple password auth (env variable)
2. Upload/delete/reorder UI + API routes (images + a JSON manifest in Vercel Blob)
3. `HeroImageRotator` pulls images from that manifest; falls back to default images if the manifest is empty
4. Later, MotionBanner's campaign text can also become editable from the same admin (if the client wants)

---

## Bonus / Cleanup (Required Before Production)

- In `src/components/home/MotionBanner.tsx` (line 229-235), the **"Demo: Switch Banner Style" button is still live** (fixed bottom-left) — must be removed or converted to an admin toggle before going to production. Note: MotionBanner is not currently mounted on the homepage.
- Moving the Hero and Stats Unsplash placeholder images into Phase 3's customizable system would let everything be managed from one place.

---

## Order & Dependencies

1. **Phase 2 first** (hero rotator, with hardcoded images) — the motion effect can be shown to the client quickly
2. **Phase 1** (silhouette background) — independent, can be done in parallel
3. **Phase 3** (admin + storage) — after the rotator is built, connect it to the dynamic source

**Open question:** where will hosting be (Vercel?) — Option A's Blob storage depends on this. If not Vercel, the same thing can be done with Cloudinary (free tier).
