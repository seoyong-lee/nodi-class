'use client';

import { useEffect } from 'react';
import { postUnsubscribe } from '../../lib/api';

type Props = {
  token?: string;
  doneLabel: string;
};

export function UnsubscribeClient({ token, doneLabel }: Props) {
  useEffect(() => {
    if (!token) return;
    void (async () => {
      try {
        await postUnsubscribe(token);
      } catch {
        /* still show done — match API enumeration-safe posture */
      }
      try {
        await fetch('/unsubscribe/clear', { method: 'POST' });
      } catch {
        /* cookie clear best-effort */
      }
    })();
  }, [token]);

  return <p>{doneLabel}</p>;
}
