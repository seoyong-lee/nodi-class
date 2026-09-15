'use client';

import { useState } from 'react';
import { Thumb16x9 } from '@nodi/design-system';

/**
 * Used when the intrinsic size is unknown, so `next/image` cannot reserve
 * space. Serves the file as-is and swaps in a placeholder if it fails to load.
 */
export function MdxImageFallback({ src, alt = '' }: { src: string; alt?: string }) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <figure className="m-0">
        <Thumb16x9 />
        {alt ? <figcaption>{alt}</figcaption> : null}
      </figure>
    );
  }

  return (
    <figure className="m-0">
      <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setBroken(true)} />
      {alt ? <figcaption>{alt}</figcaption> : null}
    </figure>
  );
}
