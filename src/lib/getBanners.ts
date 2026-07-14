// Server-only (route handlers / server components).
import { fetchBanners, erpEnabled, logErpFallback, type ErpBanner } from './erpApi';

/**
 * Live banners from ERP. Empty array when disabled, errored, or none are live —
 * the MotionBanner keeps its built-in visual marquee in that case.
 */
export async function getBanners(placement?: string): Promise<{ banners: ErpBanner[]; source: 'erp' | 'static' }> {
  if (!erpEnabled()) {
    return { banners: [], source: 'static' };
  }
  try {
    const res = await fetchBanners(placement);
    return { banners: res.data ?? [], source: 'erp' };
  } catch (err) {
    logErpFallback('getBanners', err);
    return { banners: [], source: 'static' };
  }
}
