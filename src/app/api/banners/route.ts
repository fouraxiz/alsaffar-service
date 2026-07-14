import { NextRequest, NextResponse } from 'next/server';

import { getBanners } from '@/lib/getBanners';

/** Browser-facing live banners from ERP WebsiteApi. */
export async function GET(request: NextRequest) {
  const placement = request.nextUrl.searchParams.get('placement') ?? undefined;
  const { banners, source } = await getBanners(placement || undefined);
  return NextResponse.json(
    { banners, source },
    { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' } },
  );
}
