import type { ChangeEventHandler, InputHTMLAttributes } from 'react';
import { useId } from 'react';
import styles from './Input.module.css';

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
  const fieldClass = [styles.field, error ? styles.fieldError : ''].filter(Boolean).join(' ');

  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={id}>
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
      {error ? <span className={styles.error}>{error}</span> : null}
    </div>
  );
}
