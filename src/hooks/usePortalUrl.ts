'use client';

import { useEffect, useState } from 'react';
import { portalDefaults, resolvePortalUrl } from '@/lib/portalUrl';

/**
 * Portal base URL that follows where the marketing site is opened:
 * localhost → local ERP, live domain → live ERP.
 */
export function usePortalUrl(): string {
  const [portalUrl, setPortalUrl] = useState(() =>
    // SSR-safe initial: production build defaults to live so live HTML is correct.
    resolvePortalUrl(typeof window !== 'undefined' ? window.location.hostname : null)
  );

  useEffect(() => {
    setPortalUrl(resolvePortalUrl(window.location.hostname));
  }, []);

  return portalUrl || portalDefaults.live;
}
