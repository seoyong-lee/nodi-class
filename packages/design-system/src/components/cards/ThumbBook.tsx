import Image from 'next/image';
import type { ReactNode } from 'react';

export type ThumbBookSize = {
  width: number;
  height: number;
};

export type ThumbBookProps = {
  src?: string;
  alt?: string;
  /** Intrinsic size of `src`. Given it, the cover is served through next/image. */
  size?: ThumbBookSize;
  children?: ReactNode;
};

/** Cards sit in a 3-up grid on desktop and full width below 720. */
const SIZES = '(max-width: 720px) 100vw, 420px';

/** Book cover — natural aspect ratio, no crop/scale stretch. */
export function ThumbBook({ src, alt = '', size, children }: ThumbBookProps) {
  return (
    <div className="relative w-full overflow-hidden bg-raised">
      {src && size ? (
        <Image
          className="block w-full h-auto"
          src={src}
          alt={alt}
          width={size.width}
          height={size.height}
          sizes={SIZES}
        />
      ) : src ? (
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
