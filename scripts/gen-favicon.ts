/**
 * Build multi-size favicon.ico from public/brand PNGs into apps/web/app/
 * (App Router serves app/favicon.ico as /favicon.ico).
 *
 * Why png-to-ico: Next/YouTube/Google expect /favicon.ico; we already have
 * 16/32/48 PNGs and need a single multi-size ICO without hand-editing binaries.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pngToIco from 'png-to-ico';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const brandDir = path.join(root, 'apps/web/public/brand');
const outFile = path.join(root, 'apps/web/app/favicon.ico');

const sources = ['favicon-16x16.png', 'favicon-32x32.png', 'favicon-48x48.png'].map(
  (name) => path.join(brandDir, name),
);

for (const file of sources) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing favicon source: ${file}`);
  }
}

const buf = await pngToIco(sources);
fs.writeFileSync(outFile, buf);
console.log(`Wrote ${outFile} (${buf.length} bytes)`);
