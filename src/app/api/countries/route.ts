import { NextResponse } from 'next/server';

import { getCountries } from '@/lib/getCountries';

/**
 * Browser-facing nationality feed for the home section.
 * Sourced from Manpower countries via ERP /lookups — never invents options.
 */
export async function GET() {
  const { nationalities, source } = await getCountries();
  return NextResponse.json(
    { nationalities, source },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } },
  );
}
