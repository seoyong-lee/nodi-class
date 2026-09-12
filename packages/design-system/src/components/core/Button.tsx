import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { Icon } from './Icon';

export type ButtonProps = {
  variant: 'primary' | 'secondary';
  size?: 'md' | 'sm';
  icon?: string;
  href?: string;
  target?: string;
  rel?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  disabled?: boolean;
  loading?: boolean;
  title?: string;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
  onClick?:
    | ButtonHTMLAttributes<HTMLButtonElement>['onClick']
    | AnchorHTMLAttributes<HTMLAnchorElement>['onClick'];
  children?: ReactNode;
};

export function Button({
  variant,
  size = 'md',
  icon,
  href,
  target,
  rel,
  type = 'button',
  disabled = false,
  loading = false,
  title,
  'aria-label': ariaLabel,
  'aria-pressed': ariaPressed,
  onClick,
  children,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const className = cn(
    'inline-flex shrink-0 items-center justify-center gap-inline-tight box-border border rounded font-sans font-bold leading-[1.2] whitespace-nowrap no-underline cursor-pointer transition-ui',
    'disabled:cursor-not-allowed aria-disabled:cursor-not-allowed',
    size === 'md' ? 'px-[22px] py-[14px] text-body-sm' : 'px-4 py-[9px] text-caption',
    variant === 'primary'
      ? 'border-transparent bg-accent text-on-accent hover:enabled:bg-accent-hover hover:enabled:text-on-accent active:enabled:bg-accent-press active:enabled:text-on-accent disabled:bg-field disabled:text-disabled aria-disabled:bg-field aria-disabled:text-disabled'
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
      <a
        className={className}
        href={href}
        target={target}
        rel={rel}
        title={title}
        aria-label={ariaLabel}
        aria-pressed={ariaPressed}
        onClick={onClick as AnchorHTMLAttributes<HTMLAnchorElement>['onClick']}
      >
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
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      title={title}
      onClick={onClick as ButtonHTMLAttributes<HTMLButtonElement>['onClick']}
    >
      {content}
    </button>
  );
}
