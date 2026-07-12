import type { ErpCountry } from './erpApi';
import { STATIC_NATIONALITIES, SLUG_TO_ISO, type Nationality } from '@/data/nationalities';

/**
 * Map the ERP /countries feed onto the site's Nationality shape. The ERP owns
 * which nationalities are published and their labels; `category` and
 * `priceRange` are not in the country payload yet, so they come from the static
 * base (matched by ISO code). Unknown slugs are skipped (no flag/category for
 * them). Display order follows the canonical STATIC_NATIONALITIES order.
 */
export function mapApiCountriesToNationalities(list: ErpCountry[]): Nationality[] {
  const apiByCode = new Map<string, ErpCountry>();
  for (const c of list ?? []) {
    const code = SLUG_TO_ISO[c.slug];
    if (code) apiByCode.set(code, c);
  }

  return STATIC_NATIONALITIES.filter((n) => apiByCode.has(n.code)).map((n) => {
    const c = apiByCode.get(n.code)!;
    return {
      ...n,
      nameEn: c.nationality?.en || n.nameEn,
      nameAr: c.nationality?.ar || n.nameAr,
    };
  });
}
