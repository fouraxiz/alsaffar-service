// Server-only — imported by /api/lookups route handler.
import { fetchLookups, erpEnabled, logErpFallback, type ErpLookups } from './erpApi';

const EMPTY: ErpLookups = {
  categories: [],
  countries: [],
  languages: [],
  genders: [],
  skill_levels: [],
  experience_ranges: [],
  service_types: [],
};

/**
 * CV filter masters from the ERP. Never invents options — if the backend is
 * off/empty the panel simply shows nothing for that group.
 */
export async function getLookups(): Promise<{ lookups: ErpLookups; source: 'erp' | 'empty' }> {
  if (!erpEnabled()) {
    return { lookups: EMPTY, source: 'empty' };
  }
  try {
    const res = await fetchLookups();
    const data = res.data;
    if (!data || typeof data !== 'object') {
      return { lookups: EMPTY, source: 'empty' };
    }
    return {
      lookups: {
        categories: Array.isArray(data.categories) ? data.categories : [],
        countries: Array.isArray(data.countries) ? data.countries : [],
        languages: Array.isArray(data.languages) ? data.languages : [],
        genders: Array.isArray(data.genders) ? data.genders : [],
        skill_levels: Array.isArray(data.skill_levels) ? data.skill_levels : [],
        experience_ranges: Array.isArray(data.experience_ranges) ? data.experience_ranges : [],
        service_types: Array.isArray(data.service_types) ? data.service_types : [],
      },
      source: 'erp',
    };
  } catch (err) {
    logErpFallback('getLookups', err);
    return { lookups: EMPTY, source: 'empty' };
  }
}
