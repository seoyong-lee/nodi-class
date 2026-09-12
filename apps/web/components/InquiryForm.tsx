'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button, Input } from '@nodi/design-system';
import { postInquiry } from '../lib/api';
import { CONSENT_LABEL, FORM_ERROR_LABEL, INQUIRY_DONE_LABEL } from '../lib/copy';
import { getTurnstileToken } from '../lib/turnstile';

const honeypotClass =
  'absolute opacity-0 left-0 top-0 h-px w-px overflow-hidden pointer-events-none';

export function InquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [blocked, setBlocked] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const turnstileRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent || submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const container = turnstileRef.current;
      if (!container) {
        setError(FORM_ERROR_LABEL);
        return;
      }
      const turnstile = await getTurnstileToken(container);
      const result = await postInquiry({
        name,
        email,
        resultUrl,
        blocked,
        consent: true,
        website,
        turnstile,
      });
      if (!result.ok) {
        setError(FORM_ERROR_LABEL);
        return;
      }
      setSubmitted(true);
    } catch {
      setError(FORM_ERROR_LABEL);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <p className="m-0 max-w-[720px] text-strong break-keep">{INQUIRY_DONE_LABEL}</p>;
  }

  return (
    <form
      className="max-w-[720px] bg-raised border-hairline rounded p-10 max-[720px]:p-6 flex flex-col gap-6 break-keep relative"
      onSubmit={handleSubmit}
    >
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
      <div className="grid grid-cols-2 gap-6 max-[720px]:grid-cols-1">
        <Input
          label="이름"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="이메일"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Input
        label="현재 결과물 링크"
        name="resultUrl"
        type="url"
        required
        value={resultUrl}
        onChange={(e) => setResultUrl(e.target.value)}
      />
      <Input
        label="어떤 부분에서 어려움을 겪고 계신가요?"
        description="현재 문제 상황과 원하는 결과를 알려주세요."
        name="blocked"
        multiline
        rows={5}
        required
        value={blocked}
        onChange={(e) => setBlocked(e.target.value)}
      />
      <label className="flex items-center gap-[10px] text-label text-muted [color-scheme:dark] [&_input]:w-4 [&_input]:h-4 [&_input]:accent-accent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
        />
        {CONSENT_LABEL}
      </label>
      {error ? (
        <p className="m-0 text-label text-strong break-keep" role="alert">
          {error}
        </p>
      ) : null}
      <div className="self-start max-[720px]:self-stretch max-[720px]:[&_button]:w-full">
        <Button variant="primary" type="submit" disabled={submitting} loading={submitting}>
          프로젝트 검토 요청하기
        </Button>
      </div>
      <p className="m-0 text-label text-muted">계약과 세금계산서는 Cascades 명의로 진행합니다.</p>
    </form>
  );
}
