'use client';

import { useCallback, useRef, useState, type ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { COURSE_WAITLIST_SLUG } from '@nodi/shared/constants';
import { EmailGate, type EmailGateExtraField } from '@nodi/design-system';
import { postSubscribe } from '../lib/api';
import { identifySubscriber, track } from '../lib/analytics/track';
import {
  FORM_ERROR_LABEL,
  GATE_ACTIVE_RESUBSCRIBE_LABEL,
  GATE_MAIL_THROTTLED_LABEL,
  GATE_NOT_REGISTERED_LABEL,
  GATE_OPENING_LABEL,
  GATE_REGISTERING_LABEL,
  GATE_SUBMITTED_LABEL,
  GATE_VERIFYING_LABEL,
  SUBSCRIBE_CONSENT_LABEL,
} from '../lib/copy';
import { resourceReadPath } from '../lib/resourcePath';
import { getTurnstileToken, prewarmTurnstile } from '../lib/turnstile';
import { SubscribeConsentDetail } from './SubscribeConsentDetail';
import { markUnlockPending } from './TrackUnlockedResource';

type GatePlacement = 'home_top' | 'home_bottom' | 'resource' | 'course';
type GatePhase = 'idle' | 'verifying' | 'submitting' | 'opening';

type Props = {
  title: string;
  description?: string;
  buttonLabel: string;
  /** Resource slug or `course-waitlist`. */
  slug: string;
  placement: GatePlacement;
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

function subscribeSource(searchParams: URLSearchParams): string {
  const campaign = searchParams.get('utm_campaign')?.trim();
  if (campaign && /^[a-z0-9-]{1,64}$/.test(campaign)) return campaign;
  const src = searchParams.get('src')?.trim();
  if (src && /^[a-z0-9-]{1,64}$/.test(src)) return src;
  return 'direct';
}

function phaseLabel(phase: GatePhase, idle: string): string {
  if (phase === 'verifying') return GATE_VERIFYING_LABEL;
  if (phase === 'submitting') return GATE_REGISTERING_LABEL;
  if (phase === 'opening') return GATE_OPENING_LABEL;
  return idle;
}

async function applyUnlockCookie(unlockPath: string): Promise<void> {
  await fetch(unlockPath, {
    redirect: 'manual',
    credentials: 'same-origin',
  });
}

function waitForUnlockedContent(timeoutMs = 4000): Promise<HTMLElement | null> {
  const existing = document.getElementById('unlocked-content');
  if (existing) return Promise.resolve(existing);

  return new Promise((resolve) => {
    const started = Date.now();
    const observer = new MutationObserver(() => {
      const el = document.getElementById('unlocked-content');
      if (el) {
        observer.disconnect();
        resolve(el);
      } else if (Date.now() - started > timeoutMs) {
        observer.disconnect();
        resolve(null);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(() => {
      observer.disconnect();
      resolve(document.getElementById('unlocked-content'));
    }, timeoutMs);
  });
}

export function EmailGateForm({
  title,
  description,
  buttonLabel,
  slug,
  placement,
  extraField,
  layout,
  intent = 'subscribe',
  buttonVariant = 'primary',
  footer,
  notice,
  helper,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submittedLabel, setSubmittedLabel] = useState(GATE_SUBMITTED_LABEL);
  const [phase, setPhase] = useState<GatePhase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [website, setWebsite] = useState('');
  const turnstileRef = useRef<HTMLDivElement>(null);
  const prewarmed = useRef(false);
  const busy = phase !== 'idle';

  const handleEmailFocus = useCallback(() => {
    if (prewarmed.current) return;
    const container = turnstileRef.current;
    if (!container) return;
    prewarmed.current = true;
    prewarmTurnstile(container);
  }, []);

  async function handleSubmit(email: string, extra?: string) {
    setError(null);
    const normalizedEmail = email.trim().toLowerCase();
    const building =
      extraField && extra
        ? (extra as 'landing' | 'brand' | 'ppt' | 'app' | 'none')
        : undefined;
    const gateProps = (
      result: 'new' | 'existing' | 'error',
      duration_ms?: number,
    ) => ({
      email: normalizedEmail,
      placement,
      resource_slug: placement === 'resource' ? slug : undefined,
      building,
      result,
      ...(duration_ms !== undefined ? { duration_ms } : {}),
    });
    try {
      const container = turnstileRef.current;
      if (!container) {
        setError(FORM_ERROR_LABEL);
        track({
          name: 'Submitted Email Gate',
          props: gateProps('error'),
        });
        return;
      }
      setPhase('verifying');
      const turnstile = await getTurnstileToken(container);

      setPhase('submitting');
      const result = await postSubscribe({
        email: normalizedEmail,
        slug,
        source: subscribeSource(searchParams),
        building,
        consent: intent === 'subscribe' ? true : undefined,
        intent,
        website,
        turnstile,
      });

      if (!result.ok) {
        track({
          name: 'Submitted Email Gate',
          props: gateProps('error'),
        });
        if (result.error === 'not_registered') {
          setError(GATE_NOT_REGISTERED_LABEL);
        } else {
          setError(FORM_ERROR_LABEL);
        }
        return;
      }

      if (result.subscriberHash) {
        identifySubscriber(result.subscriberHash, {
          building,
          subscriber_status: result.state === 'active' ? 'active' : 'pending',
        });
      }

      if (result.resent === false) {
        setSubmittedLabel(GATE_MAIL_THROTTLED_LABEL);
      } else if (result.state === 'active' && intent === 'subscribe') {
        setSubmittedLabel(GATE_ACTIVE_RESUBSCRIBE_LABEL);
      } else {
        setSubmittedLabel(GATE_SUBMITTED_LABEL);
      }
      setSubmitted(true);

      const next = unlockNextPath(slug);
      const unlock = `/unlock?t=${encodeURIComponent(result.gateToken)}&next=${encodeURIComponent(next)}`;
      markUnlockPending(slug);

      setPhase('opening');
      const openStarted = performance.now();
      try {
        await applyUnlockCookie(unlock);
        if (placement === 'resource') {
          // The locked view is prerendered, so the unlocked body lives on ./read.
          router.replace(resourceReadPath(slug));
          const unlocked = await waitForUnlockedContent();
          unlocked?.scrollIntoView({ behavior: 'smooth' });
        } else {
          router.refresh();
        }
      } finally {
        track({
          name: 'Submitted Email Gate',
          props: gateProps(
            result.state === 'active' ? 'existing' : 'new',
            Math.round(performance.now() - openStarted),
          ),
        });
      }
    } catch {
      track({
        name: 'Submitted Email Gate',
        props: gateProps('error'),
      });
      setError(FORM_ERROR_LABEL);
    } finally {
      setPhase('idle');
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
        buttonLabel={phaseLabel(phase, buttonLabel)}
        buttonVariant={buttonVariant}
        consent={intent === 'subscribe' ? SUBSCRIBE_CONSENT_LABEL : undefined}
        consentDetail={intent === 'subscribe' ? <SubscribeConsentDetail /> : undefined}
        submittedLabel={submittedLabel}
        submitted={submitted}
        submitting={busy}
        onSubmit={handleSubmit}
        onEmailFocus={handleEmailFocus}
        extraField={intent === 'subscribe' ? extraField : undefined}
        layout={layout}
        requireConsent={intent === 'subscribe'}
        helper={helper}
      />
      {notice && !submitted ? notice : null}
      {footer && !submitted ? <div className="mt-6 flex flex-col gap-inline">{footer}</div> : null}
      {error && !submitted ? (
        <p className="mt-2 mb-0 text-label text-body break-keep" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
