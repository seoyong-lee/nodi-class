'use client';

import { useState } from 'react';
import { Thumb16x9 } from '@nodi/design-system';

type Props = {
  src?: string;
  alt?: string;
};

export function ResourceMdxImage({ src, alt = '' }: Props) {
  const [broken, setBroken] = useState(false);

  if (!src || broken) {
    return (
      <figure className="m-0">
        <Thumb16x9 />
        {alt ? <figcaption>{alt}</figcaption> : null}
      </figure>
    );
  }

  return (
    <figure className="m-0">
      <img src={src} alt={alt} onError={() => setBroken(true)} />
      {alt ? <figcaption>{alt}</figcaption> : null}
    </figure>
  );
}
