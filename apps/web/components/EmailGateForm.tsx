'use client';

import { useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { EmailGate, type EmailGateExtraField } from '@nodi/design-system';
import { postSubscribe } from '../lib/api';
import {
  CONSENT_LABEL,
  FORM_ERROR_LABEL,
  GATE_ACTIVE_LABEL,
  GATE_SUBMITTED_LABEL,
} from '../lib/copy';
import { getTurnstileToken } from '../lib/turnstile';
import hp from './honeypot.module.css';
import styles from './EmailGateForm.module.css';

type Props = {
  title: string;
  description?: string;
  buttonLabel: string;
  /** Resource slug or `course-waitlist`. */
  slug: string;
  extraField?: EmailGateExtraField;
};

type GateOutcome = 'pending' | 'active';

export function EmailGateForm({
  title,
  description,
  buttonLabel,
  slug,
  extraField,
}: Props) {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [outcome, setOutcome] = useState<GateOutcome>('pending');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [website, setWebsite] = useState('');
  const turnstileRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(email: string, extra?: string) {
    setError(null);
    setSubmitting(true);
    try {
      const container = turnstileRef.current;
      if (!container) {
        setError(FORM_ERROR_LABEL);
        return;
      }
      const turnstile = await getTurnstileToken(container);

      const building =
        extraField && extra
          ? (extra as 'landing' | 'brand' | 'ppt' | 'app' | 'none')
          : undefined;

      const sourceRaw = searchParams.get('src')?.trim();
      const source =
        sourceRaw && /^[a-z0-9-]{0,64}$/.test(sourceRaw)
          ? sourceRaw
          : undefined;

      const result = await postSubscribe({
        email,
        slug,
        source,
        building,
        consent: true,
        website,
        turnstile,
      });

      if (!result.ok) {
        setError(FORM_ERROR_LABEL);
        return;
      }

      setOutcome(result.state);
      setSubmitted(true);
    } catch {
      setError(FORM_ERROR_LABEL);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.root}>
      <input
        className={hp.honeypot}
        type="text"
        name="website"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      <div ref={turnstileRef} />
      <EmailGate
        title={title}
        description={description}
        buttonLabel={buttonLabel}
        consent={CONSENT_LABEL}
        submittedLabel={
          outcome === 'active' ? GATE_ACTIVE_LABEL : GATE_SUBMITTED_LABEL
        }
        submitted={submitted}
        submitting={submitting}
        onSubmit={handleSubmit}
        extraField={extraField}
      />
      {error && !submitted ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
