import type { ChangeEventHandler, InputHTMLAttributes } from 'react';
import { useId } from 'react';
import { cn } from '../../lib/cn';

export type InputProps = {
  label: string;
  description?: string;
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
  name: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  /** Extra classes on the control (e.g. amp-mask for Session Replay). */
  className?: string;
};

export function Input({
  label,
  description,
  type = 'text',
  name,
  placeholder,
  error,
  required,
  multiline = false,
  rows = 5,
  value,
  onChange,
  className,
}: InputProps) {
  const id = useId();
  const descriptionId = description ? `${id}-desc` : undefined;

  const fieldClass = cn(
    'w-full box-border px-4 py-[14px] bg-field text-strong rounded font-sans text-body-sm tracking-[var(--tracking-body)] outline-none transition-ui placeholder:text-disabled border focus:border-accent',
    multiline ? 'leading-[var(--leading-body)] resize-y py-[13px]' : 'leading-[1.4]',
    error ? 'border-line-strong' : 'border-line',
    className,
  );

  return (
    <div className="flex flex-col gap-inline-tight w-full min-w-0 box-border">
      <div className="flex flex-col gap-1">
        <label className="text-caption text-muted tracking-[var(--tracking-body)]" htmlFor={id}>
          {label}
        </label>
        {description ? (
          <span
            id={descriptionId}
            className="text-label leading-[1.6] text-[11px] break-keep text-[color-mix(in_srgb,var(--text-muted)_65%,var(--text-disabled))]"
          >
            {description}
          </span>
        ) : null}
      </div>
      {multiline ? (
        <textarea
          id={id}
          className={fieldClass}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          rows={rows}
          aria-describedby={descriptionId}
          aria-invalid={error ? true : undefined}
        />
      ) : (
        <input
          id={id}
          className={fieldClass}
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          aria-describedby={descriptionId}
          aria-invalid={error ? true : undefined}
        />
      )}
      {error ? <span className="text-label text-muted leading-[1.6]">{error}</span> : null}
    </div>
  );
}
