import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { RESOURCE_SLUGS } from '@nodi/shared';

const CONTENT_ROOT = path.join(process.cwd(), '../../content/resources');

export type ResourceFrontmatter = {
  slug: string;
  title: string;
  series: string;
  summary: string;
  youtube?: string;
  freeParts: number;
  publishedAt: string;
  downloads?: { label: string; key: string }[];
};

export type ResourcePart = {
  id: string;
  heading: string;
  body: string;
};

export type ResourceDoc = {
  frontmatter: ResourceFrontmatter;
  parts: ResourcePart[];
  raw: string;
};

function slugifyHeading(heading: string): string {
  return heading
    .replace(/^Part\s+\d+\.\s*/i, '')
    .trim()
    .toLowerCase()
    .replace(/[^\w\uac00-\ud7a3]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function splitParts(markdown: string): ResourcePart[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const parts: ResourcePart[] = [];
  let current: ResourcePart | null = null;
  const bodyLines: string[] = [];

  function flush() {
    if (!current) return;
    parts.push({ ...current, body: bodyLines.join('\n').trim() });
    bodyLines.length = 0;
  }

  for (const line of lines) {
    const match = /^##\s+(.+)$/.exec(line);
    if (match) {
      flush();
      const heading = match[1]!.trim();
      current = {
        id: slugifyHeading(heading) || `part-${parts.length}`,
        heading,
        body: '',
      };
      continue;
    }
    if (current) {
      bodyLines.push(line);
    }
  }
  flush();
  return parts;
}

function readResourceFile(slug: string): string {
  const filePath = path.join(CONTENT_ROOT, slug, 'index.mdx');
  return fs.readFileSync(filePath, 'utf8');
}

export function getResource(slug: string): ResourceDoc {
  const rawFile = readResourceFile(slug);
  const { data, content } = matter(rawFile);
  const rawFm = data as Record<string, unknown>;
  const publishedRaw = rawFm.publishedAt;
  const publishedAt =
    publishedRaw instanceof Date
      ? publishedRaw.toISOString().slice(0, 10)
      : String(publishedRaw ?? '');
  const parts = splitParts(content);
  return {
    frontmatter: {
      slug: String(rawFm.slug ?? ''),
      title: String(rawFm.title ?? ''),
      series: String(rawFm.series ?? ''),
      summary: String(rawFm.summary ?? ''),
      youtube: rawFm.youtube ? String(rawFm.youtube) : undefined,
      freeParts: Number(rawFm.freeParts ?? 1),
      publishedAt,
      downloads: rawFm.downloads as ResourceFrontmatter['downloads'],
    },
    parts,
    raw: content,
  };
}

export function listResourceSlugs(): string[] {
  return RESOURCE_SLUGS.filter((slug) =>
    fs.existsSync(path.join(CONTENT_ROOT, slug, 'index.mdx')),
  );
}

/** §4 slug order (home ResourceCards). */
export function listResources(): ResourceDoc[] {
  return listResourceSlugs().map((slug) => getResource(slug));
}

/** Current slug excluded, newest first. */
export function getOtherResources(currentSlug: string, limit = 2): ResourceDoc[] {
  return listResources()
    .filter((r) => r.frontmatter.slug !== currentSlug)
    .sort((a, b) =>
      b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt),
    )
    .slice(0, limit);
}
