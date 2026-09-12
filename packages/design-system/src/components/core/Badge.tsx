import type { ReactNode } from 'react';
import * as styles from './Badge.css';

export type BadgeProps = {
  children?: ReactNode;
  tone?: 'default' | 'current';
};

export function Badge({ children, tone = 'default' }: BadgeProps) {
  const className = [styles.root, tone === 'current' ? styles.current : '']
    .filter(Boolean)
    .join(' ');

  return <span className={className}>{children}</span>;
}
