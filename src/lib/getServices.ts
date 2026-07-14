// Server-only (route handlers / server components).
import { fetchServices, erpEnabled, logErpFallback } from './erpApi';
import { mapApiServicesToDisplay, getStaticDisplayServices, type DisplayService } from './serviceAdapter';

/**
 * Active service cards for the home grid + /services page.
 *
 * - ERP enabled + success → API list (active cards only; empty = all inactive in panel).
 * - ERP enabled + error → empty list (do NOT fall back to full static catalog —
 *   that would bring inactive cards like maid-services back onto the site).
 * - ERP disabled → static seeded catalog.
 */
export async function getServices(): Promise<{ services: DisplayService[]; source: 'erp' | 'static' }> {
  if (!erpEnabled()) {
    return { services: getStaticDisplayServices(), source: 'static' };
  }
  try {
    const res = await fetchServices();
    const services = mapApiServicesToDisplay(res.data ?? []);
    return { services, source: 'erp' };
  } catch (err) {
    logErpFallback('getServices', err);
    return { services: [], source: 'erp' };
  }
}
