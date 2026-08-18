// Server-only by architecture (imported only by the /api/workers route handler).
import { fetchWorkers, erpEnabled, logErpFallback, type WorkerQuery, type ErpWorker } from './erpApi';
import { mapApiWorkers } from './workerAdapter';
import { mockWorkers, type WorkerCV } from '@/data/cvData';

/** WebsiteApi caps `per_page` at 50. Walk pages so Browse CVs sees the full public pool. */
const ERP_PAGE_SIZE = 50;
const ERP_MAX_PAGES = 20;

/**
 * Single source for worker CVs. Tries the live ERP; on disabled/error falls
 * back to the bundled static dataset so the site never hard-fails.
 * Returns the list plus which source served it (useful for a subtle UI hint).
 */
export async function getWorkers(
  query: WorkerQuery = {},
): Promise<{ workers: WorkerCV[]; source: 'erp' | 'static' }> {
  if (!erpEnabled()) {
    return { workers: mockWorkers, source: 'static' };
  }
  try {
    const { page: _ignoredPage, per_page: _ignoredPerPage, ...filters } = query;
    const collected: ErpWorker[] = [];
    let page = 1;
    let lastPage = 1;

    do {
      const res = await fetchWorkers({
        ...filters,
        per_page: ERP_PAGE_SIZE,
        page,
      });
      collected.push(...(res.data ?? []));
      lastPage = Math.max(1, res.meta?.last_page ?? 1);
      page += 1;
    } while (page <= lastPage && page <= ERP_MAX_PAGES);

    const workers = mapApiWorkers(collected);
    // If the ERP is reachable but empty, still prefer showing something.
    if (workers.length === 0) return { workers: mockWorkers, source: 'static' };
    return { workers, source: 'erp' };
  } catch (err) {
    logErpFallback('getWorkers', err);
    return { workers: mockWorkers, source: 'static' };
  }
}
