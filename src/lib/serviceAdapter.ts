import type { ErpServiceCard } from './erpApi';
import { STATIC_SERVICES, type StaticService } from '@/data/services';
import { serverEnv } from './env';

/**
 * UI-ready service card. Titles/descriptions prefer ERP CMS text; presentation
 * (icon/image/gradient/WA) falls back to static defaults keyed by service_key.
 */
export type DisplayService = {
  serviceKey: string;
  homeKey: StaticService['homeKey'];
  pageKey: StaticService['pageKey'];
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  icon: string;
  image: string;
  pageImage: string;
  bg: string;
  gradient: string;
  waMsgEn: string;
  waMsgAr: string;
};

const FALLBACK_CYCLE = STATIC_SERVICES;

function defaultsFor(key: string, index: number): StaticService {
  const known = STATIC_SERVICES.find((s) => s.serviceKey === key);
  if (known) return known;
  // Custom CMS cards inherit presentation from a cycled static template.
  const template = FALLBACK_CYCLE[index % FALLBACK_CYCLE.length]!;
  return {
    ...template,
    serviceKey: key,
    homeKey: template.homeKey,
    pageKey: template.pageKey,
  };
}

/**
 * ERP may return a full URL, `/storage/...` path, or bare media basename.
 * Next/Image needs an absolute http(s) URL; otherwise use the static fallback.
 */
function resolveServiceImage(raw: string | null | undefined, fallback: string): string {
  const v = (raw ?? '').trim();
  if (!v) return fallback;
  if (/^https?:\/\//i.test(v)) return v;

  const base = serverEnv.erp.baseUrl.replace(/\/$/, '');
  if (!base) return fallback;

  if (v.startsWith('/')) return `${base}${v}`;
  if (v.includes('storage/media') || v.includes('packages/workdo')) {
    return `${base}/${v.replace(/^\/+/, '')}`;
  }
  // Media-library basename saved by the ERP panel.
  return `${base}/storage/media/${v.replace(/^\/+/, '')}`;
}

/**
 * Build presentation-ready cards from the ERP feed. Order follows the API
 * (sort_order). Also drop any inactive rows if the API includes `is_active`.
 */
export function mapApiServicesToDisplay(list: ErpServiceCard[]): DisplayService[] {
  return (list ?? [])
    .filter((card) => card.is_active !== false)
    .map((card, index) => {
      const base = defaultsFor(card.service_key, index);
      const titleEn = card.title?.en?.trim() || base.serviceKey;
      const titleAr = card.title?.ar?.trim() || titleEn;
      const descEn = card.description?.en?.trim() || '';
      const descAr = card.description?.ar?.trim() || descEn;
      const image = resolveServiceImage(card.image, base.image);

      return {
        serviceKey: card.service_key,
        homeKey: base.homeKey,
        pageKey: base.pageKey,
        title: { en: titleEn, ar: titleAr },
        description: { en: descEn, ar: descAr },
        icon: card.icon?.trim() || base.icon,
        image,
        pageImage: image || base.pageImage,
        bg: base.bg,
        gradient: base.gradient,
        waMsgEn: base.waMsgEn,
        waMsgAr: base.waMsgAr,
      };
    });
}

/** Pure static presentation list without relying on next-intl (API fallback). */
export function getStaticDisplayServices(): DisplayService[] {
  return STATIC_SERVICES.map((s) => ({
    serviceKey: s.serviceKey,
    homeKey: s.homeKey,
    pageKey: s.pageKey,
    title: { en: '', ar: '' },
    description: { en: '', ar: '' },
    icon: s.icon,
    image: s.image,
    pageImage: s.pageImage,
    bg: s.bg,
    gradient: s.gradient,
    waMsgEn: s.waMsgEn,
    waMsgAr: s.waMsgAr,
  }));
}
