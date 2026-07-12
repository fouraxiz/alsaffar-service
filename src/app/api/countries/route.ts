import { NextResponse } from 'next/server';

import { getCountries } from '@/lib/getCountries';

/**
 * Browser-facing nationality feed for the home section. The ERP bearer token
 * stays server-side here; the client only ever calls THIS route. Falls back to
 * static data inside getCountries(), so it always returns a 200 with a list.
 */
export async function GET() {
  const { nationalities, source } = await getCountries();
  return NextResponse.json(
    { nationalities, source },
    { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } },
  );
}
