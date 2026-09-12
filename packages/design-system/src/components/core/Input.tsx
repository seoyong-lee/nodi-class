import type { ChangeEventHandler, InputHTMLAttributes } from 'react';
import { useId } from 'react';
import { cn } from '../../lib/cn';

export type InputProps = {
  label: string;
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
  name: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

export function Input({
  label,
  type = 'text',
  name,
  placeholder,
  error,
  required,
  multiline = false,
  rows = 5,
  value,
  onChange,
}: InputProps) {
  const id = useId();

  const fieldClass = cn(
    'w-full box-border px-4 py-[14px] bg-field text-strong rounded font-sans text-body-sm tracking-[var(--tracking-body)] outline-none transition-ui [color-scheme:dark] placeholder:text-disabled border focus:border-accent',
    multiline
      ? 'leading-[var(--leading-body)] resize-y py-[13px]'
      : 'leading-[1.4]',
    error ? 'border-line-strong' : 'border-line',
  );

  return (
    <div className="flex flex-col gap-inline-tight w-full min-w-0 box-border">
      <label
        className="text-caption text-muted tracking-[var(--tracking-body)]"
        htmlFor={id}
      >
        {label}
      </label>
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
          aria-invalid={error ? true : undefined}
        />
      )}
      {error ? (
        <span className="text-label text-muted leading-[1.6]">{error}</span>
      ) : null}
    </div>
  );
}
