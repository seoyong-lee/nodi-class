'use client';

import { useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { COURSE_WAITLIST_SLUG } from '@nodi/shared/constants';
import { EmailGate, type EmailGateExtraField } from '@nodi/design-system';
import { postSubscribe } from '../lib/api';
import {
  FORM_ERROR_LABEL,
  GATE_SUBMITTED_LABEL,
  SUBSCRIBE_CONSENT_LABEL,
} from '../lib/copy';
import { getTurnstileToken } from '../lib/turnstile';
import { SubscribeConsentDetail } from './SubscribeConsentDetail';

type Props = {
  title: string;
  description?: string;
  buttonLabel: string;
  /** Resource slug or `course-waitlist`. */
  slug: string;
  extraField?: EmailGateExtraField;
  layout?: 'inline' | 'stack';
};

const honeypotClass =
  'absolute opacity-0 left-0 top-0 h-px w-px overflow-hidden pointer-events-none';

function unlockNextPath(slug: string): string {
  if (slug === COURSE_WAITLIST_SLUG) return '/course';
  return `/free/${slug}`;
}

export function EmailGateForm({
  title,
  description,
  buttonLabel,
  slug,
  extraField,
  layout,
}: Props) {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
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

      const next = unlockNextPath(slug);
      const unlock = `/unlock?t=${encodeURIComponent(result.gateToken)}&next=${encodeURIComponent(next)}`;
      setSubmitted(true);
      window.location.assign(unlock);
    } catch {
      setError(FORM_ERROR_LABEL);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-w-0">
      <input
        className={honeypotClass}
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
        consent={SUBSCRIBE_CONSENT_LABEL}
        consentDetail={<SubscribeConsentDetail />}
        submittedLabel={GATE_SUBMITTED_LABEL}
        submitted={submitted}
        submitting={submitting}
        onSubmit={handleSubmit}
        extraField={extraField}
        layout={layout}
      />
      {error && !submitted ? (
        <p className="mt-2 mb-0 text-label text-body break-keep" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
