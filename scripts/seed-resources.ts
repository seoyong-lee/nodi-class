/**
 * Seed DynamoDB resources from content/resources/*/index.mdx via PUT /resources/:slug.
 *
 * Usage:
 *   API_URL=https://api.example.com ADMIN_API_KEY=… pnpm seed:resources
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { RESOURCE_SLUGS, ResourceUpsertInput } from '@nodi/shared';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentRoot = path.join(root, 'content/resources');

function requireEnv(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

async function main(): Promise<void> {
  const apiUrl = requireEnv('API_URL').replace(/\/$/, '');
  const adminKey = requireEnv('ADMIN_API_KEY');

  for (const slug of RESOURCE_SLUGS) {
    const filePath = path.join(contentRoot, slug, 'index.mdx');
    if (!fs.existsSync(filePath)) {
      console.warn(`skip ${slug}: no ${filePath}`);
      continue;
    }

    const rawFile = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(rawFile);
    const fm = data as Record<string, unknown>;
    const publishedRaw = fm.publishedAt;
    const publishedAt =
      publishedRaw instanceof Date
        ? publishedRaw.toISOString().slice(0, 10)
        : String(publishedRaw ?? '');

    const payload = ResourceUpsertInput.parse({
      slug: String(fm.slug ?? slug),
      title: String(fm.title ?? ''),
      series: String(fm.series ?? ''),
      summary: String(fm.summary ?? ''),
      youtube: fm.youtube ? String(fm.youtube) : undefined,
      freeParts: Number(fm.freeParts ?? 1),
      publishedAt,
      body: content.trim(),
      downloads: fm.downloads,
      status: 'published',
    });

    const res = await fetch(`${apiUrl}/resources/${payload.slug}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    if (!res.ok) {
      throw new Error(`PUT ${payload.slug} → ${res.status}: ${text}`);
    }
    console.log(`ok ${payload.slug}`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
