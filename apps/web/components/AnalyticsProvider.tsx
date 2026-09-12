'use client';

import { useEffect } from 'react';
import { initAmplitude } from '../lib/analytics/amplitude';

/** Mount once in root layout to initialize Amplitude. */
export function AnalyticsProvider() {
  useEffect(() => {
    initAmplitude();
  }, []);

  return null;
}
