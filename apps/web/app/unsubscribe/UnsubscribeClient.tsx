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
    void postUnsubscribe(token).catch(() => {
      /* still show done — match API enumeration-safe posture */
    });
  }, [token]);

  return <p>{doneLabel}</p>;
}
