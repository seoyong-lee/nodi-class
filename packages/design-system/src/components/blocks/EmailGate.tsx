'use client';

import { useId, useState, type FormEvent } from 'react';
import { Button } from '../core/Button';
import { Input } from '../core/Input';
import styles from './EmailGate.module.css';

export type EmailGateExtraField = {
  name: string;
  label: string;
  options: { value: string; label: string }[];
};

export type EmailGateProps = {
  title: string;
  description?: string;
  buttonLabel: string;
  consent: string;
  submittedLabel: string;
  submitted: boolean;
  onSubmit: (email: string, extra?: string) => void | Promise<void>;
  extraField?: EmailGateExtraField;
  /** Disables the submit button while a request is in flight. */
  submitting?: boolean;
};

export function EmailGate({
  title,
  description,
  buttonLabel,
  consent,
  submittedLabel,
  submitted,
  onSubmit,
  extraField,
  submitting = false,
}: EmailGateProps) {
  const [email, setEmail] = useState('');
  const [extra, setExtra] = useState(extraField?.options[0]?.value ?? '');
  const selectId = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    await onSubmit(email, extraField ? extra : undefined);
  }

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      {submitted ? (
        <p className={styles.submitted}>{submittedLabel}</p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGrow}>
            <Input
              label="이메일"
              type="email"
              name="email"
              placeholder="이메일 주소"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {extraField ? (
            <div className={styles.extra}>
              <label className={styles.extraLabel} htmlFor={selectId}>
                {extraField.label}
              </label>
              <select
                id={selectId}
                className={styles.select}
                name={extraField.name}
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
              >
                {extraField.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <div className={styles.submit}>
            <Button variant="primary" type="submit" disabled={submitting} loading={submitting}>
              {buttonLabel}
            </Button>
          </div>
        </form>
      )}
      <p className={styles.consent}>{consent}</p>
    </section>
  );
}
