'use client';

import { useEffect, useState } from 'react';
import {
  isLocalHostname,
  portalDefaults,
  resolvePortalUrl,
} from '@/lib/portalUrl';

/**
 * Portal base URL:
 * - localhost marketing site → local ERP
 * - live marketing site → /api/portal (ERP_API_BASE_URL), never localhost
 */
export function usePortalUrl(): string {
  const [portalUrl, setPortalUrl] = useState(() =>
    resolvePortalUrl(typeof window !== 'undefined' ? window.location.hostname : null)
  );

  useEffect(() => {
    const host = window.location.hostname;

    if (isLocalHostname(host)) {
      setPortalUrl(portalDefaults.local);
      return;
    }

    let active = true;
    fetch('/api/portal')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active) return;
        const url = typeof data?.portalUrl === 'string' ? data.portalUrl.replace(/\/$/, '') : '';
        if (url && !url.includes('localhost') && !url.includes('127.0.0.1')) {
          setPortalUrl(url);
        } else {
          setPortalUrl(resolvePortalUrl(host));
        }
      })
      .catch(() => {
        if (active) setPortalUrl(resolvePortalUrl(host));
      });

    return () => {
      active = false;
    };
  }, []);

  return portalUrl || portalDefaults.live;
}
