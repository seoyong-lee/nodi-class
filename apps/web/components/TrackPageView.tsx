'use client';

import { useEffect, useRef } from 'react';
import type { AnalyticsEvent } from '@nodi/shared';
import { track } from '../lib/analytics/track';

/** Fire a page-view event once on mount (StrictMode-safe). */
export function TrackPageView({ event }: { event: AnalyticsEvent }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    track(event);
    // Event identity is fixed per mount site; deps would re-fire on object identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-once
  }, []);

  return null;
}
