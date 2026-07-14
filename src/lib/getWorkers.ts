// Server-only by architecture (imported only by the /api/workers route handler).
import { fetchWorkers, erpEnabled, logErpFallback, type WorkerQuery } from './erpApi';
import { mapApiWorkers } from './workerAdapter';
import { mockWorkers, type WorkerCV } from '@/data/cvData';

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
    const res = await fetchWorkers({ per_page: 200, ...query });
    const workers = mapApiWorkers(res.data ?? []);
    // If the ERP is reachable but empty, still prefer showing something.
    if (workers.length === 0) return { workers: mockWorkers, source: 'static' };
    return { workers, source: 'erp' };
  } catch (err) {
    logErpFallback('getWorkers', err);
    return { workers: mockWorkers, source: 'static' };
  }
}
