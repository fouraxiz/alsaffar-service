// Central SEO config. Override the domain by setting NEXT_PUBLIC_SITE_URL in
// the environment once the production domain is confirmed.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alsaffar.pro'
).replace(/\/$/, '');

export const LOCALES = ['en', 'ar'] as const;
export const DEFAULT_LOCALE = 'ar';

// All public routes (without locale prefix). '' is the home page.
export const ROUTES = ['', '/about', '/services', '/why-us', '/contact', '/request-cv'];

/**
 * Build canonical + hreflang alternates for a given page.
 * @param locale current locale
 * @param path route without locale prefix, e.g. '' or '/about'
 */
export function buildAlternates(locale: string, path = '') {
  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages: {
      en: `${SITE_URL}/en${path}`,
      ar: `${SITE_URL}/ar${path}`,
      'x-default': `${SITE_URL}/${DEFAULT_LOCALE}${path}`,
    },
  };
}

export const BRAND_KEYWORDS_EN = [
  'Alsaffar',
  'Alsaffar Services',
  'Alsaffar Office',
  'Alsaffar Recruitment Office',
  'Alsaffar Manpower',
  'Alsaffar Recruitment Manpower',
  'alsaffarservices',
  'recruitment',
  'manpower',
  'domestic worker',
  'Saudi Arabia',
  'Eastern Province',
];

export const BRAND_KEYWORDS_AR = [
  'الصفار',
  'الصفار للاستقدام',
  'مكتب الصفار',
  'مكتب الصفار للاستقدام',
  'الصفار للخدمات',
  'استقدام',
  'عمالة منزلية',
  'سائق',
  'المملكة العربية السعودية',
  'المنطقة الشرقية',
];
