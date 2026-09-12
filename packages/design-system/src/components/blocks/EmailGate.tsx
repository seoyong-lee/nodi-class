'use client';

import { useId, useState, type FormEvent } from 'react';
import { Button } from '../core/Button';
import { Input } from '../core/Input';

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
    <section className="bg-raised border-hairline rounded p-5 flex flex-col gap-block-tight min-w-0 box-border overflow-hidden">
      <div className="flex flex-col gap-inline">
        <h3 className="m-0 text-h3 font-bold text-strong break-keep">{title}</h3>
        {description ? (
          <p className="m-0 max-w-measure text-body-sm text-body break-keep">{description}</p>
        ) : null}
      </div>
      {submitted ? (
        <p className="m-0 text-body-sm text-accent">{submittedLabel}</p>
      ) : (
        <form
          className="flex flex-wrap gap-inline items-end min-w-0 w-full"
          onSubmit={handleSubmit}
        >
          <div className="flex-[1_1_240px] min-w-0 w-full max-[480px]:flex-[1_1_100%]">
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
            <div className="flex flex-col gap-inline-tight flex-[1_1_100%] min-w-0 max-[480px]:w-full">
              <label className="text-caption text-muted" htmlFor={selectId}>
                {extraField.label}
              </label>
              <select
                id={selectId}
                className="w-full box-border py-[14px] pl-4 pr-10 bg-field text-strong border border-line rounded font-sans text-body-sm leading-[1.4] outline-none transition-ui focus:border-accent"
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
          <div className="flex-none max-[480px]:flex-[1_1_100%] max-[480px]:w-full max-[480px]:[&_button]:w-full max-[480px]:[&_a]:w-full">
            <Button variant="primary" type="submit" disabled={submitting} loading={submitting}>
              {buttonLabel}
            </Button>
          </div>
        </form>
      )}
      <p className="m-0 text-label leading-[1.7] text-muted max-w-measure break-keep">{consent}</p>
    </section>
  );
}
