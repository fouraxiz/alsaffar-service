import { NextRequest, NextResponse } from 'next/server';

import { getWorkers } from '@/lib/getWorkers';
import type { WorkerQuery } from '@/lib/erpApi';

export const dynamic = 'force-dynamic';

/**
 * Browser-facing worker feed. The ERP bearer token stays server-side here;
 * the client only ever calls THIS route. Falls back to static data inside
 * getWorkers(), so it always returns a 200 with a usable list.
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const query: WorkerQuery = {
    category: sp.get('category') ?? undefined,
    nationality: sp.get('nationality') ?? undefined,
    gender: sp.get('gender') ?? undefined,
    experience: sp.get('experience') ?? undefined,
    language: sp.get('language') ?? undefined,
  };

  const { workers, source } = await getWorkers(query);
  return NextResponse.json(
    { workers, source },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } },
  );
}
