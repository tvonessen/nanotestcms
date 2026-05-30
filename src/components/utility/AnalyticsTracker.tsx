'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

type AnalyticsTrackerProps = {
  disabled?: boolean;
};

type AnalyticsCollectEvent = {
  pathname: string;
  viewportWidth?: number;
  referrer?: string;
  eventType: 'initial' | 'navigation';
};

const COLLECT_ENDPOINTS = ['/api/analytics/collect'];

function isPrivacySignalEnabled() {
  const browserNavigator = navigator as Navigator & { globalPrivacyControl?: boolean };
  return (
    browserNavigator.doNotTrack === '1' ||
    browserNavigator.doNotTrack === 'yes' ||
    browserNavigator.globalPrivacyControl === true
  );
}

function sendCollectEvent(event: AnalyticsCollectEvent): void {
  const payload = JSON.stringify(event);

  if (navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    for (const endpoint of COLLECT_ENDPOINTS) {
      if (navigator.sendBeacon(endpoint, blob)) {
        return;
      }
    }
  }

  const tryFetch = async () => {
    for (const endpoint of COLLECT_ENDPOINTS) {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        });
        return;
      } catch {
        // Try next endpoint
      }
    }
  };

  void tryFetch().catch(() =>
    fetch(COLLECT_ENDPOINTS[COLLECT_ENDPOINTS.length - 1], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => console.error('Analytics failed')),
  );
}

export function AnalyticsTracker({ disabled = false }: AnalyticsTrackerProps) {
  const pathname = usePathname();
  const hasSentInitialRef = useRef(false);
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (disabled || !pathname) return;
    if (isPrivacySignalEnabled()) return;

    if (lastPathRef.current === pathname) return;

    const eventType = hasSentInitialRef.current ? 'navigation' : 'initial';
    hasSentInitialRef.current = true;
    lastPathRef.current = pathname;

    sendCollectEvent({
      pathname,
      eventType,
      viewportWidth: window.innerWidth,
      referrer: document.referrer || undefined,
    });
  }, [disabled, pathname]);

  return null;
}
