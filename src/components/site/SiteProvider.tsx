'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { STATIC_SITE, type SiteConfig } from '@/data/site';

const SiteContext = createContext<SiteConfig>(STATIC_SITE);

export function SiteProvider({
  children,
  initialSite,
}: {
  children: ReactNode;
  initialSite?: SiteConfig;
}) {
  const [site, setSite] = useState<SiteConfig>(initialSite ?? STATIC_SITE);

  useEffect(() => {
    let active = true;
    fetch('/api/site')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data?.site) setSite(data.site as SiteConfig);
      })
      .catch(() => {
        /* keep SSR / static */
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => site, [site]);
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteConfig {
  return useContext(SiteContext);
}
