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
  status?: 'published' | 'draft';
  updatedAt?: string;
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

type ApiResource = {
  slug: string;
  title: string;
  series: string;
  summary: string;
  youtube?: string;
  freeParts: number;
  publishedAt: string;
  body: string;
  downloads?: { label: string; key: string }[];
  status: 'published' | 'draft';
  updatedAt: string;
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

function apiBase(): string | undefined {
  const url = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  return url || undefined;
}

function fromApiResource(resource: ApiResource): ResourceDoc {
  return {
    frontmatter: {
      slug: resource.slug,
      title: resource.title,
      series: resource.series,
      summary: resource.summary,
      youtube: resource.youtube,
      freeParts: resource.freeParts,
      publishedAt: resource.publishedAt,
      downloads: resource.downloads,
      status: resource.status,
      updatedAt: resource.updatedAt,
    },
    parts: splitParts(resource.body),
    raw: resource.body,
  };
}

function readLocalFile(slug: string): string {
  const filePath = path.join(CONTENT_ROOT, slug, 'index.mdx');
  return fs.readFileSync(filePath, 'utf8');
}

function getLocalResource(slug: string): ResourceDoc {
  const rawFile = readLocalFile(slug);
  const { data, content } = matter(rawFile);
  const rawFm = data as Record<string, unknown>;
  const publishedRaw = rawFm.publishedAt;
  const publishedAt =
    publishedRaw instanceof Date
      ? publishedRaw.toISOString().slice(0, 10)
      : String(publishedRaw ?? '');
  return {
    frontmatter: {
      slug: String(rawFm.slug ?? slug),
      title: String(rawFm.title ?? ''),
      series: String(rawFm.series ?? ''),
      summary: String(rawFm.summary ?? ''),
      youtube: rawFm.youtube ? String(rawFm.youtube) : undefined,
      freeParts: Number(rawFm.freeParts ?? 1),
      publishedAt,
      downloads: rawFm.downloads as ResourceFrontmatter['downloads'],
      status: 'published',
    },
    parts: splitParts(content),
    raw: content,
  };
}

async function fetchJson<T>(pathSuffix: string): Promise<T | null> {
  const base = apiBase();
  if (!base) return null;
  try {
    const res = await fetch(`${base}${pathSuffix}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Prefer DynamoDB via API; fall back to content/resources MDX for local/dev. */
export async function getResource(slug: string): Promise<ResourceDoc | null> {
  const data = await fetchJson<{ ok: boolean; resource?: ApiResource }>(
    `/resources/${slug}`,
  );
  if (data?.ok && data.resource) {
    return fromApiResource(data.resource);
  }

  const localPath = path.join(CONTENT_ROOT, slug, 'index.mdx');
  if (fs.existsSync(localPath)) {
    return getLocalResource(slug);
  }
  return null;
}

export async function listResourceSlugs(): Promise<string[]> {
  const data = await fetchJson<{
    ok: boolean;
    resources?: { slug: string }[];
  }>('/resources');
  if (data?.ok && data.resources?.length) {
    return data.resources.map((r) => r.slug);
  }
  return RESOURCE_SLUGS.filter((slug) =>
    fs.existsSync(path.join(CONTENT_ROOT, slug, 'index.mdx')),
  );
}

export async function listResources(): Promise<ResourceDoc[]> {
  const data = await fetchJson<{
    ok: boolean;
    resources?: Omit<ApiResource, 'body'>[];
  }>('/resources');

  if (data?.ok && data.resources?.length) {
    // List endpoint omits body; enough for cards / “다른 자료”.
    return data.resources.map((meta) => ({
      frontmatter: {
        slug: meta.slug,
        title: meta.title,
        series: meta.series,
        summary: meta.summary,
        youtube: meta.youtube,
        freeParts: meta.freeParts,
        publishedAt: meta.publishedAt,
        downloads: meta.downloads,
        status: meta.status,
        updatedAt: meta.updatedAt,
      },
      parts: [],
      raw: '',
    }));
  }

  const slugs = await listResourceSlugs();
  return slugs.map((slug) => getLocalResource(slug));
}

export async function getOtherResources(
  currentSlug: string,
  limit = 2,
): Promise<ResourceDoc[]> {
  const all = await listResources();
  return all
    .filter((r) => r.frontmatter.slug !== currentSlug)
    .sort((a, b) =>
      b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt),
    )
    .slice(0, limit);
}
