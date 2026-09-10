// Server-only (route handlers / server components).
import { fetchPageContent, erpEnabled, logErpFallback } from './erpApi';

export type HeroContent = {
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
};

/**
 * Fetch home hero section content for the active locale from ERP.
 * Falls back to null if disabled, erroring, or unconfigured,
 * so the Hero component can use localized static strings.
 */
export async function getHomeHeroContent(locale: string = 'en'): Promise<{
  hero: HeroContent | null;
  source: 'erp' | 'static';
}> {
  if (!erpEnabled()) {
    return { hero: null, source: 'static' };
  }

  try {
    const res = await fetchPageContent('home');
    const page = res?.data;
    if (!page || !Array.isArray(page.sections)) {
      return { hero: null, source: 'static' };
    }

    const heroSection = page.sections.find(
      (s) => s.section_key === 'hero' && s.is_visible !== false,
    );

    if (!heroSection || !heroSection.content || typeof heroSection.content !== 'object') {
      return { hero: null, source: 'static' };
    }

    const rawContent = heroSection.content as Record<string, any>;
    const langContent =
      (rawContent[locale] && typeof rawContent[locale] === 'object' ? rawContent[locale] : null) ||
      (rawContent['en'] && typeof rawContent['en'] === 'object' ? rawContent['en'] : null) ||
      rawContent;

    const heading = typeof langContent.heading === 'string' ? langContent.heading.trim() : '';
    const subheading = typeof langContent.subheading === 'string' ? langContent.subheading.trim() : '';
    const body = typeof langContent.body === 'string' ? langContent.body.trim() : '';

    // Ignore placeholder page titles like 'Home' or 'الرئيسية' when no body/subheading exists
    const isPlaceholderHeading =
      heading.toLowerCase() === 'home' || heading === 'الرئيسية';

    if ((!heading || isPlaceholderHeading) && !subheading && !body) {
      return { hero: null, source: 'static' };
    }

    return {
      hero: {
        title: heading && !isPlaceholderHeading ? heading : undefined,
        titleHighlight: subheading || undefined,
        subtitle: body || undefined,
      },
      source: 'erp',
    };
  } catch (err) {
    logErpFallback('getHomeHeroContent', err);
    return { hero: null, source: 'static' };
  }
}
