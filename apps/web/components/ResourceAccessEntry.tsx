'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ACCESS_HINT_COOKIE } from '@nodi/shared/constants';
import { track } from '../lib/analytics/track';
import { resourceReadPath } from '../lib/resourcePath';

const PROBE_KEY = 'access-probed';

function hasAccessHint(): boolean {
  return document.cookie.split('; ').some((entry) => entry === `${ACCESS_HINT_COOKIE}=1`);
}

function clearAccessHint(): void {
  document.cookie = `${ACCESS_HINT_COOKIE}=; path=/; max-age=0`;
}

function probedThisSession(): boolean {
  try {
    return sessionStorage.getItem(PROBE_KEY) === '1';
  } catch {
    return true;
  }
}

function markProbed(): void {
  try {
    sessionStorage.setItem(PROBE_KEY, '1');
  } catch {
    /* ignore */
  }
}

/** Asks the server whether the httpOnly access cookie is still valid. */
async function probeAccess(): Promise<boolean> {
  try {
    const res = await fetch('/access', { credentials: 'same-origin', cache: 'no-store' });
    if (!res.ok) return false;
    const data = (await res.json()) as { unlocked?: boolean };
    return data.unlocked === true;
  } catch {
    return false;
  }
}

function trackView(slug: string, unlocked: boolean): void {
  track({
    name: 'Viewed Resource Page',
    props: { resource_slug: slug, access_state: unlocked ? 'unlocked' : 'locked' },
  });
}

/**
 * Entry logic for the prerendered locked view. The access cookie is invisible
 * to a prerendered page, so readers who already unlocked are handed off to the
 * dynamic route, which then reports the page view.
 */
export function ResourceLockedEntry({ slug }: { slug: string }) {
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    if (hasAccessHint()) {
      router.replace(resourceReadPath(slug));
      return;
    }

    // No hint, but the access cookie may still be there — it predates the hint
    // or was set on another page. Ask once per session, then trust the answer.
    if (probedThisSession()) {
      trackView(slug, false);
      return;
    }

    void probeAccess().then((unlocked) => {
      markProbed();
      if (unlocked) {
        router.replace(resourceReadPath(slug));
        return;
      }
      trackView(slug, false);
    });
  }, [router, slug]);

  return null;
}

/**
 * Entry logic for the dynamic view. Drops a stale hint so an expired cookie
 * stops sending the reader here instead of the cached locked page.
 */
export function ResourceReadEntry({ slug, unlocked }: { slug: string; unlocked: boolean }) {
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    if (!unlocked) clearAccessHint();
    trackView(slug, unlocked);
  }, [slug, unlocked]);

  return null;
}
