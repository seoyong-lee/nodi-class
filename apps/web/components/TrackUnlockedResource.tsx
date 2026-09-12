'use client';

import { useEffect, useRef } from 'react';
import { track } from '../lib/analytics/track';

const pendingKey = (slug: string) => `unlock-pending:${slug}`;
const doneKey = (slug: string) => `unlocked:${slug}`;

/** Call before navigating to /unlock so the resource page can attribute unlock. */
export function markUnlockPending(slug: string): void {
  try {
    sessionStorage.setItem(pendingKey(slug), '1');
  } catch {
    /* ignore */
  }
}

/** After /unlock — fire once when this tab just completed the gate flow. */
export function TrackUnlockedResource({
  slug,
  unlocked,
}: {
  slug: string;
  unlocked: boolean;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (!unlocked || sent.current) return;
    try {
      if (sessionStorage.getItem(doneKey(slug))) return;
      if (!sessionStorage.getItem(pendingKey(slug))) return;
      sessionStorage.removeItem(pendingKey(slug));
      sessionStorage.setItem(doneKey(slug), '1');
    } catch {
      return;
    }
    sent.current = true;
    track({ name: 'Unlocked Resource', props: { resource_slug: slug } });
  }, [slug, unlocked]);

  return null;
}
