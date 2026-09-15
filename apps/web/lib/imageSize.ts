import fs from 'node:fs';
import path from 'node:path';

export type ImageSize = { width: number; height: number };

const cache = new Map<string, ImageSize | null>();

function publicPath(src: string): string {
  return path.join(process.cwd(), 'public', src.replace(/^\//, ''));
}

/** PNG: IHDR is the first chunk, so width/height sit at a fixed offset. */
function readPngSize(buf: Buffer): ImageSize | null {
  if (buf.length < 24) return null;
  if (buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

/** JPEG: walk the marker segments until a start-of-frame carries the size. */
function readJpegSize(buf: Buffer): ImageSize | null {
  if (buf.length < 4 || buf.readUInt16BE(0) !== 0xffd8) return null;
  let offset = 2;
  while (offset + 9 < buf.length) {
    if (buf[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buf[offset + 1]!;
    const isStartOfFrame =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isStartOfFrame) {
      return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
    }
    offset += 2 + buf.readUInt16BE(offset + 2);
  }
  return null;
}

/**
 * Intrinsic size of an image under `public/`, or null when it is missing or
 * an unsupported format. `next/image` needs this to reserve layout space.
 */
export function imageSize(src: string): ImageSize | null {
  if (!src.startsWith('/') || src.startsWith('//')) return null;

  const cached = cache.get(src);
  if (cached !== undefined) return cached;

  let size: ImageSize | null = null;
  try {
    const fd = fs.openSync(publicPath(src), 'r');
    try {
      const buf = Buffer.alloc(65536);
      const read = fs.readSync(fd, buf, 0, buf.length, 0);
      const head = buf.subarray(0, read);
      size = readPngSize(head) ?? readJpegSize(head);
    } finally {
      fs.closeSync(fd);
    }
  } catch {
    size = null;
  }

  cache.set(src, size);
  return size;
}
