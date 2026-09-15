import Image from 'next/image';
import { Thumb16x9 } from '@nodi/design-system';
import { imageSize } from '../lib/imageSize';
import { MdxImageFallback } from './MdxImageFallback';

type Props = {
  src?: string;
  alt?: string;
};

/** Body width is the 720px prose column, so 2x covers the widest realistic case. */
const SIZES = '(max-width: 760px) 100vw, 720px';

export function ResourceMdxImage({ src, alt = '' }: Props) {
  if (!src) {
    return (
      <figure className="m-0">
        <Thumb16x9 />
        {alt ? <figcaption>{alt}</figcaption> : null}
      </figure>
    );
  }

  const size = imageSize(src);
  if (!size) {
    return <MdxImageFallback src={src} alt={alt} />;
  }

  return (
    <figure className="m-0">
      <Image
        src={src}
        alt={alt}
        width={size.width}
        height={size.height}
        sizes={SIZES}
        className="w-full h-auto"
      />
      {alt ? <figcaption>{alt}</figcaption> : null}
    </figure>
  );
}
