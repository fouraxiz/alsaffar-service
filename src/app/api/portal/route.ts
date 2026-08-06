import { NextResponse } from 'next/server';

import { serverEnv } from '@/lib/env';
import {
  portalDefaults,
  resolvePortalUrlFromServer,
} from '@/lib/portalUrl';

/**
 * Browser-safe portal base URLs.
 * Live uses ERP_API_BASE_URL (same host as the website API) so Sign In/Up
 * never accidentally point at localhost after a Vercel misconfig.
 */
export async function GET() {
  const live = resolvePortalUrlFromServer(serverEnv.erp.baseUrl);

  return NextResponse.json(
    {
      portalUrl: live,
      localPortalUrl: portalDefaults.local,
      livePortalUrl: live,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    }
  );
}
