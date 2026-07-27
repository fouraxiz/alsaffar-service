import type { ErpLookupCountry } from './erpApi';
import type { Nationality } from '@/data/nationalities';

/**
 * Map Manpower lookup countries onto the home nationality-flag shape.
 * Uses backend iso2 + labels only — no static whitelist inventing.
 */
export function mapLookupCountriesToNationalities(list: ErpLookupCountry[]): Nationality[] {
  const seen = new Set<string>();
  const out: Nationality[] = [];

  for (const c of list ?? []) {
    let code = String(c.value || c.code || c.iso2 || '')
      .toLowerCase()
      .trim();
    if (code === 'bn') code = 'bd';
    if (!code || seen.has(code)) continue;
    seen.add(code);

    const nameEn = c.label_en || c.nationality_label || c.name || code.toUpperCase();
    const nameAr = c.label_ar || c.name_ar || nameEn;

    out.push({
      code,
      nameEn,
      nameAr,
      // Category/price are display helpers; backend country master has no category yet.
      category: 'skilled',
      priceRange: '',
    });
  }

  return out;
}
