import { NextResponse } from 'next/server';

import { getLookups } from '@/lib/getLookups';

export const dynamic = 'force-dynamic';

/**
 * Browser-facing filter masters (nationality, job type, gender, service type).
 * Token stays server-side; never invents static options.
 */
export async function GET() {
  const { lookups, source } = await getLookups();
  return NextResponse.json(
    { ...lookups, source },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } },
  );
}
