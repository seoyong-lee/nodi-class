'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button, Input } from '@nodi/design-system';
import { postInquiry } from '../lib/api';
import { CONSENT_LABEL, FORM_ERROR_LABEL, INQUIRY_DONE_LABEL } from '../lib/copy';
import { getTurnstileToken } from '../lib/turnstile';
import * as hp from './honeypot.css';
import * as styles from './InquiryForm.css';

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
    return <p className={styles.done}>{INQUIRY_DONE_LABEL}</p>;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
      <div className={styles.row}>
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
        label="어디에서 막혔나요?"
        name="blocked"
        multiline
        required
        value={blocked}
        onChange={(e) => setBlocked(e.target.value)}
      />
      <label className={styles.consent}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
        />
        {CONSENT_LABEL}
      </label>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      <div className={styles.submit}>
        <Button variant="primary" type="submit" disabled={submitting} loading={submitting}>
          프로젝트 검토 요청하기
        </Button>
      </div>
      <p className={styles.note}>
        계약과 세금계산서는 Cascades 명의로 진행합니다.
      </p>
    </form>
  );
}
