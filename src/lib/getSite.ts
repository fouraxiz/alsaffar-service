// Server-only.
import { fetchSite, erpEnabled, logErpFallback } from './erpApi';
import { mergeSiteConfig, STATIC_SITE, type SiteConfig } from '@/data/site';

export async function getSite(): Promise<{ site: SiteConfig; source: 'erp' | 'static' }> {
  if (!erpEnabled()) {
    return { site: STATIC_SITE, source: 'static' };
  }
  try {
    const res = await fetchSite();
    return { site: mergeSiteConfig(res.data), source: 'erp' };
  } catch (err) {
    logErpFallback('getSite', err);
    return { site: STATIC_SITE, source: 'static' };
  }
}
