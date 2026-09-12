import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type Thumb16x9Props = {
  src?: string;
  alt?: string;
  children?: ReactNode;
  fit?: 'cover' | 'contain';
};

export function Thumb16x9({
  src,
  alt = '',
  children,
  fit = 'cover',
}: Thumb16x9Props) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[calc(var(--radius)-3px)] bg-raised border-hairline flex items-center justify-center">
      {src ? (
        <img
          className={cn(
            'w-full h-full block',
            fit === 'contain' ? 'object-contain' : 'object-cover',
          )}
          src={src}
          alt={alt}
        />
      ) : (
        <span className="text-label tracking-label-en text-disabled">16:9</span>
      )}
      {children}
    </div>
  );
}
