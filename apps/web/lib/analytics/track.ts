'use client';

import type { AnalyticsEvent } from '@nodi/shared';
import { Identify } from '@amplitude/unified';
import { amplitude } from './amplitude';

function hasApiKey(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY?.trim());
}

/** Typed track — no-op when key missing. SDK queues if init is still in flight. */
export function track(event: AnalyticsEvent): void {
  if (!hasApiKey()) return;
  if ('props' in event) {
    amplitude.track(event.name, event.props);
  } else {
    amplitude.track(event.name);
  }
}

/** Identify after subscribe — never pass email; hash only. */
export function identifySubscriber(
  hash: string,
  props: { building?: string; subscriber_status: 'pending' | 'active' },
): void {
  if (!hasApiKey() || !hash) return;
  amplitude.setUserId(hash);
  const identifyObj = new Identify();
  if (props.building) {
    identifyObj.set('building', props.building);
  }
  identifyObj.set('subscriber_status', props.subscriber_status);
  amplitude.identify(identifyObj);
}
