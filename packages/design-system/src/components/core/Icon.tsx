import type { LucideIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import styles from './Icon.module.css';

export type IconProps = {
  name: string;
  size?: number;
};

function toPascalCase(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

export function Icon({ name, size = 16 }: IconProps) {
  const iconName = toPascalCase(name);
  const LucideGlyph = (LucideIcons as unknown as Record<string, LucideIcon>)[iconName];

  if (!LucideGlyph) {
    return null;
  }

  return (
    <span className={styles.root} aria-hidden="true" style={{ width: size, height: size }}>
      <LucideGlyph size={size} color="currentColor" strokeWidth={2} />
    </span>
  );
}
