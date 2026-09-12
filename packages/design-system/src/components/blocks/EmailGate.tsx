'use client';

import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
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
  /** Checkbox label (required, default unchecked). */
  consent: string;
  /** Detail under the checkbox; may include a privacy link node. */
  consentDetail?: ReactNode;
  submittedLabel: string;
  submitted: boolean;
  onSubmit: (email: string, extra?: string) => void | Promise<void>;
  extraField?: EmailGateExtraField;
  /** Disables the submit button while a request is in flight. */
  submitting?: boolean;
  /** `stack` = full-width fields (home CTA card). Default keeps email+button row. */
  layout?: 'inline' | 'stack';
};

export function EmailGate({
  title,
  description,
  buttonLabel,
  consent,
  consentDetail,
  submittedLabel,
  submitted,
  onSubmit,
  extraField,
  submitting = false,
  layout = 'inline',
}: EmailGateProps) {
  const [email, setEmail] = useState('');
  const [extra, setExtra] = useState(extraField?.options[0]?.value ?? '');
  const [agreed, setAgreed] = useState(false);
  const selectId = useId();
  const consentId = useId();
  const stacked = layout === 'stack';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || !agreed) return;
    await onSubmit(email, extraField ? extra : undefined);
  }

  return (
    <section
      className={cn(
        'bg-raised border-hairline rounded flex flex-col gap-block-tight min-w-0 box-border overflow-hidden',
        stacked ? 'p-12 max-[768px]:p-6' : 'p-10 max-[720px]:p-6',
      )}
    >
      <div className="flex flex-col gap-inline">
        <h3 className="m-0 text-h3 font-bold text-strong break-keep">{title}</h3>
        {description ? (
          <p className="m-0 max-w-measure text-body-sm text-body break-keep">
            {description}
          </p>
        ) : null}
      </div>
      {submitted ? (
        <p className="m-0 text-body-sm text-accent">{submittedLabel}</p>
      ) : (
        <form
          className={
            stacked
              ? 'flex flex-col gap-6 min-w-0 w-full'
              : 'flex flex-wrap gap-inline items-end min-w-0 w-full'
          }
          onSubmit={handleSubmit}
        >
          <div
            className={
              stacked
                ? 'w-full min-w-0'
                : 'flex-[1_1_240px] min-w-0 w-full max-[480px]:flex-[1_1_100%]'
            }
          >
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
            <div
              className={
                stacked
                  ? 'flex flex-col gap-inline-tight w-full min-w-0'
                  : 'flex flex-col gap-inline-tight flex-[1_1_100%] min-w-0 max-[480px]:w-full'
              }
            >
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
          <div
            className={cn(
              'flex flex-col gap-2 break-keep',
              stacked ? 'w-full' : 'flex-[1_1_100%] w-full',
            )}
          >
            <label
              className="flex items-start gap-[10px] text-label text-muted leading-[1.7] [color-scheme:dark] [&_input]:mt-[2px] [&_input]:w-4 [&_input]:h-4 [&_input]:accent-accent [&_input]:shrink-0"
              htmlFor={consentId}
            >
              <input
                id={consentId}
                type="checkbox"
                name="consent"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
              />
              <span>{consent}</span>
            </label>
            {consentDetail ? (
              <p className="m-0 pl-[26px] text-label text-muted leading-[1.7]">
                {consentDetail}
              </p>
            ) : null}
          </div>
          <div
            className={
              stacked
                ? 'w-full [&_button]:w-full [&_button]:min-w-[12rem]'
                : 'flex-none max-[480px]:flex-[1_1_100%] max-[480px]:w-full max-[480px]:[&_button]:w-full max-[480px]:[&_a]:w-full'
            }
          >
            <Button
              variant="primary"
              type="submit"
              disabled={submitting}
              loading={submitting}
            >
              {buttonLabel}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
