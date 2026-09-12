import type { ReactNode } from 'react';

export type ThumbBookProps = {
  src?: string;
  alt?: string;
  children?: ReactNode;
};

/** Book cover thumb. Mild portrait so the mockup’s width (spine/shadow) still reads. */
export function ThumbBook({ src, alt = '', children }: ThumbBookProps) {
  return (
    <div className="relative aspect-[4/4] w-full overflow-hidden bg-raised">
      {src ? (
        <img
          className="absolute inset-0 h-full w-full scale-100 object-cover object-center"
          src={src}
          alt={alt}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-label tracking-label-en text-disabled">
          4:5
        </span>
      )}
      {children}
    </div>
  );
}
