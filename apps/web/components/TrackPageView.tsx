'use client';

import { useEffect, useRef } from 'react';
import type { AnalyticsEvent } from '@nodi/shared';
import { track } from '../lib/analytics/track';

/** Fire a page-view event once on mount (StrictMode-safe). */
export function TrackPageView({ event }: { event: AnalyticsEvent }) {
  const sent = useRef(false);
  const eventRef = useRef(event);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    track(eventRef.current);
  }, []);

  return null;
}
