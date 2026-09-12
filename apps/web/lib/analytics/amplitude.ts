'use client';

import * as amplitude from '@amplitude/unified';

let initialized = false;

function sessionReplaySampleRate(): number {
  const raw = process.env.NEXT_PUBLIC_AMPLITUDE_SR_SAMPLE_RATE?.trim();
  if (!raw) return 1;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0 || n > 1) return 1;
  return n;
}

/** Browser Amplitude init — once per page load. Missing key → warn + no-op. */
export function initAmplitude(): void {
  if (typeof window === 'undefined' || initialized) return;

  const key = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY?.trim();
  if (!key) {
    console.warn(
      '[amplitude] NEXT_PUBLIC_AMPLITUDE_API_KEY is missing; analytics disabled',
    );
    return;
  }

  initialized = true;
  void amplitude.initAll(key, {
    analytics: {
      autocapture: true,
    },
    sessionReplay: {
      sampleRate: sessionReplaySampleRate(),
      privacyConfig: {
        defaultMaskLevel: 'conservative',
        maskSelector: ['.amp-mask'],
      },
    },
  });
}

export { amplitude };
