'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  DEFAULT_LIVE_PORTAL,
  isLocalHostname,
  portalDefaults,
} from '@/lib/portalUrl';

const PortalUrlContext = createContext<string>(DEFAULT_LIVE_PORTAL);

/**
 * Server passes the correct ERP base (local vs live). Client only switches to
 * local when the marketing site itself is opened on localhost.
 */
export function PortalUrlProvider({
  children,
  initialPortalUrl,
}: {
  children: ReactNode;
  initialPortalUrl: string;
}) {
  const [portalUrl, setPortalUrl] = useState(initialPortalUrl);

  useEffect(() => {
    const host = window.location.hostname;
    if (isLocalHostname(host)) {
      setPortalUrl(portalDefaults.local);
      return;
    }
    const next =
      !initialPortalUrl ||
      initialPortalUrl.includes('localhost') ||
      initialPortalUrl.includes('127.0.0.1')
        ? DEFAULT_LIVE_PORTAL
        : initialPortalUrl;
    setPortalUrl(next);
  }, [initialPortalUrl]);

  const value = useMemo(() => portalUrl || DEFAULT_LIVE_PORTAL, [portalUrl]);
  return <PortalUrlContext.Provider value={value}>{children}</PortalUrlContext.Provider>;
}

export function usePortalUrl(): string {
  return useContext(PortalUrlContext) || DEFAULT_LIVE_PORTAL;
}
