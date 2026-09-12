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
  value,
  onChange,
}: InputProps) {
  const id = useId();
  const fieldClass = cn(
    'w-full box-border px-4 py-[14px] bg-field text-strong border border-line rounded font-sans text-body-sm leading-[1.4] outline-none transition-ui resize-y focus:border-accent',
    error && 'border-line-strong',
  );

  return (
    <div className="flex flex-col gap-inline-tight w-full min-w-0 box-border">
      <label className="text-caption text-muted" htmlFor={id}>
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
          rows={4}
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
      {error ? <span className="text-label text-muted leading-[1.6]">{error}</span> : null}
    </div>
  );
}
