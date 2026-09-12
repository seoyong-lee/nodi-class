'use client';

import { useRef, useState, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { COURSE_WAITLIST_SLUG } from '@nodi/shared/constants';
import { EmailGate, type EmailGateExtraField } from '@nodi/design-system';
import { postSubscribe } from '../lib/api';
import {
  FORM_ERROR_LABEL,
  GATE_ACTIVE_RESUBSCRIBE_LABEL,
  GATE_NOT_REGISTERED_LABEL,
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
  /** Paid textbook reopen — no consent, existing subscribers only. */
  intent?: 'subscribe' | 'reopen';
  buttonVariant?: 'primary' | 'secondary';
  /** Extra actions below form (e.g. course CTA). */
  footer?: ReactNode;
  notice?: ReactNode;
  /** Small line under the submit button. */
  helper?: string;
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
  intent = 'subscribe',
  buttonVariant = 'primary',
  footer,
  notice,
  helper,
}: Props) {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submittedLabel, setSubmittedLabel] = useState(GATE_SUBMITTED_LABEL);
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
        consent: intent === 'subscribe' ? true : undefined,
        intent,
        website,
        turnstile,
      });

      if (!result.ok) {
        if (result.error === 'not_registered') {
          setError(GATE_NOT_REGISTERED_LABEL);
        } else {
          setError(FORM_ERROR_LABEL);
        }
        return;
      }

      if (result.state === 'active' && intent === 'subscribe') {
        setSubmittedLabel(GATE_ACTIVE_RESUBSCRIBE_LABEL);
      } else {
        setSubmittedLabel(GATE_SUBMITTED_LABEL);
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
        buttonVariant={buttonVariant}
        consent={intent === 'subscribe' ? SUBSCRIBE_CONSENT_LABEL : undefined}
        consentDetail={
          intent === 'subscribe' ? <SubscribeConsentDetail /> : undefined
        }
        submittedLabel={submittedLabel}
        submitted={submitted}
        submitting={submitting}
        onSubmit={handleSubmit}
        extraField={intent === 'subscribe' ? extraField : undefined}
        layout={layout}
        requireConsent={intent === 'subscribe'}
        helper={helper}
      />
      {notice && !submitted ? notice : null}
      {footer && !submitted ? (
        <div className="mt-6 flex flex-col gap-inline">{footer}</div>
      ) : null}
      {error && !submitted ? (
        <p className="mt-2 mb-0 text-label text-body break-keep" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
