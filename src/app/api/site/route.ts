import { NextResponse } from 'next/server';

import { getSite } from '@/lib/getSite';

/** Browser-facing SaaS brand/footer config. Token stays server-side. */
export async function GET() {
  const { site, source } = await getSite();
  return NextResponse.json(
    { site, source },
    { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' } },
  );
}
