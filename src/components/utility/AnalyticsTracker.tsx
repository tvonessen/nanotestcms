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

const COLLECT_ENDPOINT = '/api/tally';

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
    if (navigator.sendBeacon(COLLECT_ENDPOINT, blob)) {
      return;
    }
  }

  void fetch(COLLECT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  });
}

export function AnalyticsTracker({ disabled = false }: AnalyticsTrackerProps) {
  const pathname = usePathname();
  const hasSentInitialRef = useRef(false);
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (disabled || !pathname) return;
    if (isPrivacySignalEnabled()) return;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return;

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
