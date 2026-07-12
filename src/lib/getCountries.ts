// Server-only by architecture (imported only by the /api/countries route handler).
import { fetchCountries, erpEnabled } from './erpApi';
import { mapApiCountriesToNationalities } from './countryAdapter';
import { STATIC_NATIONALITIES, type Nationality } from '@/data/nationalities';

/**
 * Single source for the home nationality list. Tries the live ERP /countries
 * feed; on disabled/error/empty falls back to the bundled static list so the
 * section never hard-fails. Returns the list plus which source served it.
 */
export async function getCountries(): Promise<{ nationalities: Nationality[]; source: 'erp' | 'static' }> {
  if (!erpEnabled()) {
    return { nationalities: STATIC_NATIONALITIES, source: 'static' };
  }
  try {
    const res = await fetchCountries();
    const nationalities = mapApiCountriesToNationalities(res.data ?? []);
    // If the ERP is reachable but publishes nothing usable, keep the static list.
    if (nationalities.length === 0) return { nationalities: STATIC_NATIONALITIES, source: 'static' };
    return { nationalities, source: 'erp' };
  } catch (err) {
    console.error('[getCountries] ERP fetch failed, using static fallback:', err);
    return { nationalities: STATIC_NATIONALITIES, source: 'static' };
  }
}
