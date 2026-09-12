import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';
import styles from './Button.module.css';

export type ButtonProps = {
  variant: 'primary' | 'secondary';
  size?: 'md' | 'sm';
  icon?: string;
  href?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  disabled?: boolean;
  loading?: boolean;
  children?: ReactNode;
};

export function Button({
  variant,
  size = 'md',
  icon,
  href,
  type = 'button',
  disabled = false,
  loading = false,
  children,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const className = [
    styles.root,
    styles[size],
    styles[variant],
    isDisabled ? styles.disabled : '',
    loading ? styles.loading : '',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {children}
      {icon ? <Icon name={icon} size={size === 'sm' ? 14 : 16} /> : null}
    </>
  );

  if (href && !isDisabled) {
    return (
      <a className={className} href={href}>
        {content}
      </a>
    );
  }

  return (
    <button
      className={className}
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
    >
      {content}
    </button>
  );
}
