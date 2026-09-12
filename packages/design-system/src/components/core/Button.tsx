import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Icon } from './Icon';

export type ButtonProps = {
  variant: 'primary' | 'secondary';
  size?: 'md' | 'sm';
  icon?: string;
  href?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  disabled?: boolean;
  loading?: boolean;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
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
  onClick,
  children,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const className = cn(
    'inline-flex items-center justify-center gap-inline-tight box-border border rounded font-sans font-bold leading-[1.2] no-underline cursor-pointer transition-ui',
    'disabled:cursor-not-allowed aria-disabled:cursor-not-allowed',
    size === 'md' ? 'px-[22px] py-[14px] text-body-sm' : 'px-4 py-[9px] text-caption',
    variant === 'primary'
      ? 'border-transparent bg-accent text-on-accent hover:enabled:bg-accent-hover hover:enabled:text-strong active:enabled:bg-accent-press active:enabled:text-strong disabled:bg-field disabled:text-disabled aria-disabled:bg-field aria-disabled:text-disabled'
      : 'border-line bg-transparent text-strong hover:enabled:border-line-strong active:enabled:bg-raised disabled:bg-transparent disabled:text-disabled disabled:border-line aria-disabled:bg-transparent aria-disabled:text-disabled aria-disabled:border-line',
    loading && 'opacity-[0.72] pointer-events-none',
  );

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
      onClick={onClick}
    >
      {content}
    </button>
  );
}
