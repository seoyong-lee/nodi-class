import fs from 'node:fs';
import path from 'node:path';
import { CONTACT_EMAIL, OPERATOR } from './business';

const LEGAL_ROOT = path.join(process.cwd(), '../../content/legal');

/** Fill placeholders with hardcoded operator info (no BIZ_* env). */
export function applyLegalPlaceholders(markdown: string): string {
  return markdown
    .replaceAll('[상호]', OPERATOR)
    .replaceAll('[대표자명]', OPERATOR)
    .replaceAll('contact@cascades.studio', CONTACT_EMAIL);
}

export function readLegalMarkdown(slug: 'privacy' | 'terms'): string {
  const filePath = path.join(LEGAL_ROOT, `${slug}.md`);
  const raw = fs.readFileSync(filePath, 'utf8');
  return applyLegalPlaceholders(raw);
}
