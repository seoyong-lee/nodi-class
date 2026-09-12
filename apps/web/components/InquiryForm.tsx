'use client';

import { useState, type FormEvent } from 'react';
import { Button, Input } from '@nodi/design-system';
import { CONSENT_LABEL } from '../lib/copy';
import styles from './InquiryForm.module.css';

export function InquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [blocked, setBlocked] = useState('');
  const [consent, setConsent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className={styles.done}>
        검토 요청을 받았습니다. 2영업일 내 회신드립니다.
      </p>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
      <div className={styles.submit}>
        <Button variant="primary" type="submit">
          프로젝트 검토 요청하기
        </Button>
      </div>
      <p className={styles.note}>
        계약과 세금계산서는 Cascades 명의로 진행합니다.
      </p>
    </form>
  );
}
