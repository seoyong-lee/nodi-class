import type { ReactNode } from 'react';

export type Thumb16x9Props = {
  src?: string;
  alt?: string;
  children?: ReactNode;
};

export function Thumb16x9({ src, alt = '', children }: Thumb16x9Props) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[calc(var(--radius)-3px)] bg-raised border-hairline flex items-center justify-center">
      {src ? (
        <img className="w-full h-full object-cover block" src={src} alt={alt} />
      ) : (
        <span className="text-label tracking-label-en text-disabled">16:9</span>
      )}
      {children}
    </div>
  );
}
