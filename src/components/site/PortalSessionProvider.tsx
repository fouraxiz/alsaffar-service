'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { PortalKind } from '@/lib/portalUrl';

const STORAGE_KEY = 'alsaffar_portal_session';

type PortalSession = {
  portal: PortalKind;
  at: number;
};

type PortalSessionContextValue = {
  portal: PortalKind | null;
  setPortal: (portal: PortalKind | null) => void;
  clear: () => void;
};

const PortalSessionContext = createContext<PortalSessionContextValue>({
  portal: null,
  setPortal: () => {},
  clear: () => {},
});

function readStored(): PortalKind | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PortalSession;
    if (parsed.portal !== 'customer' && parsed.portal !== 'vendor') return null;
    // Expire after 30 days (UI hint only — ERP session is the real gate).
    if (Date.now() - (parsed.at || 0) > 30 * 24 * 60 * 60 * 1000) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.portal;
  } catch {
    return null;
  }
}

function writeStored(portal: PortalKind | null) {
  if (typeof window === 'undefined') return;
  if (!portal) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  const payload: PortalSession = { portal, at: Date.now() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

/**
 * Tracks customer/vendor login state for marketing UI (Header).
 * ERP redirects back with ?portal_auth=customer|vendor after login.
 */
export function PortalSessionProvider({ children }: { children: ReactNode }) {
  const [portal, setPortalState] = useState<PortalKind | null>(null);

  const setPortal = useCallback((next: PortalKind | null) => {
    writeStored(next);
    setPortalState(next);
  }, []);

  const clear = useCallback(() => setPortal(null), [setPortal]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const auth = params.get('portal_auth');
    if (auth === 'customer' || auth === 'vendor') {
      writeStored(auth);
      setPortalState(auth);
      params.delete('portal_auth');
      const qs = params.toString();
      const next = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
      window.history.replaceState({}, '', next);
      return;
    }
    setPortalState(readStored());
  }, []);

  const value = useMemo(
    () => ({ portal, setPortal, clear }),
    [portal, setPortal, clear]
  );

  return (
    <PortalSessionContext.Provider value={value}>{children}</PortalSessionContext.Provider>
  );
}

export function usePortalSession(): PortalSessionContextValue {
  return useContext(PortalSessionContext);
}
