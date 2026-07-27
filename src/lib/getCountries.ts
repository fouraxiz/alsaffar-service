// Server-only by architecture (imported only by the /api/countries route handler).
import { fetchLookups, erpEnabled, logErpFallback } from './erpApi';
import { mapLookupCountriesToNationalities } from './countryAdapter';
import type { Nationality } from '@/data/nationalities';

/**
 * Home nationality list from Manpower countries (via WebsiteApi /lookups).
 * Does not invent a static list — empty when ERP is off or returns nothing.
 */
export async function getCountries(): Promise<{ nationalities: Nationality[]; source: 'erp' | 'empty' }> {
  if (!erpEnabled()) {
    return { nationalities: [], source: 'empty' };
  }
  try {
    const res = await fetchLookups();
    const nationalities = mapLookupCountriesToNationalities(res.data?.countries ?? []);
    return {
      nationalities,
      source: nationalities.length ? 'erp' : 'empty',
    };
  } catch (err) {
    logErpFallback('getCountries', err);
    return { nationalities: [], source: 'empty' };
  }
}
