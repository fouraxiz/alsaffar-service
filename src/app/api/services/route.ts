import { NextResponse } from 'next/server';

import { getServices } from '@/lib/getServices';

export const dynamic = 'force-dynamic';

/**
 * Browser-facing service cards. Bearer token stays server-side.
 * When source=erp, an empty/partial list mirrors the panel (inactive cards omitted).
 */
export async function GET() {
  const { services, source } = await getServices();
  return NextResponse.json(
    { services, source },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  );
}
