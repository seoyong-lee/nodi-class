import type { ReactNode } from 'react';

export type ThumbBookProps = {
  src?: string;
  alt?: string;
  children?: ReactNode;
};

/** Book cover — natural aspect ratio, no crop/scale stretch. */
export function ThumbBook({ src, alt = '', children }: ThumbBookProps) {
  return (
    <div className="relative w-full overflow-hidden bg-raised">
      {src ? (
        <img
          className="block w-full h-auto"
          src={src}
          alt={alt}
          decoding="async"
          loading="lazy"
        />
      ) : (
        <span className="flex items-center justify-center aspect-[4/5] text-label tracking-label-en text-disabled">
          cover
        </span>
      )}
      {children}
    </div>
  );
}
