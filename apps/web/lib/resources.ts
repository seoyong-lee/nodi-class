import fs from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import matter from 'gray-matter';
import { RESOURCE_SLUGS, type ResourceAccess } from '@nodi/shared';

const CONTENT_ROOT = path.join(process.cwd(), '../../content/resources');

export type ResourceFrontmatter = {
  slug: string;
  title: string;
  series: string;
  summary: string;
  included?: string[];
  youtube?: string;
  youtubeTitle?: string;
  cover?: string;
  access: ResourceAccess;
  courseTitle?: string;
  promptCount?: number;
  mailNote?: string;
  readingMinutes?: number;
  contents?: { count: number; label: string; note: string }[];
  fitFor?: string[];
  notFor?: string[];
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
  included?: string[];
  youtube?: string;
  freeParts: number;
  publishedAt: string;
  body: string;
  downloads?: { label: string; key: string }[];
  status: 'published' | 'draft';
  access?: ResourceAccess;
  courseTitle?: string;
  promptCount?: number;
  mailNote?: string;
  updatedAt: string;
};

function partIdFromHeading(heading: string, index: number): string {
  const partNum = /^Part\s+(\d+)\./i.exec(heading);
  if (partNum) return `part-${partNum[1]!.padStart(2, '0')}`;
  if (/^부록/.test(heading)) return 'part-appendix';
  return `part-${String(index).padStart(2, '0')}`;
}

/** Part boundaries only — not every `##` (prompt bodies may contain those). */
function isPartHeadingLine(line: string): {
  id?: string;
  heading: string;
} | null {
  const h2Jsx = /^<h2\s+id="([^"]+)">([^<]+)<\/h2>\s*$/.exec(line);
  if (h2Jsx) {
    return { id: h2Jsx[1]!.trim(), heading: h2Jsx[2]!.trim() };
  }
  const h2Md = /^##\s+(Part\s+\d+\..+|부록.+)$/i.exec(line);
  if (h2Md) {
    return { heading: h2Md[1]!.trim() };
  }
  return null;
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
    const matched = isPartHeadingLine(line);
    if (matched) {
      flush();
      current = {
        id: matched.id || partIdFromHeading(matched.heading, parts.length),
        heading: matched.heading,
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

function parseAccess(value: unknown): ResourceAccess {
  return value === 'free-until-course' ? 'free-until-course' : 'free';
}

function fromApiResource(resource: ApiResource): ResourceDoc {
  return {
    frontmatter: {
      slug: resource.slug,
      title: resource.title,
      series: resource.series,
      summary: resource.summary,
      included: resource.included,
      youtube: resource.youtube,
      freeParts: resource.freeParts,
      publishedAt: resource.publishedAt,
      downloads: resource.downloads,
      status: resource.status,
      access: parseAccess(resource.access),
      courseTitle: resource.courseTitle,
      promptCount: resource.promptCount,
      mailNote: resource.mailNote,
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

function parseStringList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => String(item));
}

function parseContents(
  value: unknown,
): ResourceFrontmatter['contents'] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      count: Number(row.count ?? 0),
      label: String(row.label ?? ''),
      note: String(row.note ?? ''),
    };
  });
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
      included: parseStringList(rawFm.included),
      youtube: rawFm.youtube ? String(rawFm.youtube) : undefined,
      youtubeTitle: rawFm.youtubeTitle
        ? String(rawFm.youtubeTitle)
        : undefined,
      cover: rawFm.cover ? String(rawFm.cover) : undefined,
      access: parseAccess(rawFm.access),
      courseTitle: rawFm.courseTitle ? String(rawFm.courseTitle) : undefined,
      promptCount:
        rawFm.promptCount != null ? Number(rawFm.promptCount) : undefined,
      mailNote: rawFm.mailNote ? String(rawFm.mailNote) : undefined,
      readingMinutes:
        rawFm.readingMinutes != null
          ? Number(rawFm.readingMinutes)
          : undefined,
      contents: parseContents(rawFm.contents),
      fitFor: parseStringList(rawFm.fitFor),
      notFor: parseStringList(rawFm.notFor),
      freeParts: Number(rawFm.freeParts ?? 1),
      publishedAt,
      downloads: rawFm.downloads as ResourceFrontmatter['downloads'],
      status: rawFm.status === 'draft' ? 'draft' : 'published',
    },
    parts: splitParts(content),
    raw: content,
  };
}

function isPublished(doc: ResourceDoc): boolean {
  return doc.frontmatter.status !== 'draft';
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

/**
 * Prefer DynamoDB via API; fall back to content/resources MDX for local/dev.
 * Memoized per request so the page and `generateMetadata` share one round-trip.
 */
export const getResource = cache(
  async (slug: string): Promise<ResourceDoc | null> => {
    const data = await fetchJson<{ ok: boolean; resource?: ApiResource }>(
      `/resources/${slug}`,
    );
    if (data?.ok && data.resource) {
      return fromApiResource(data.resource);
    }

    const localPath = path.join(CONTENT_ROOT, slug, 'index.mdx');
    if (fs.existsSync(localPath)) {
      const local = getLocalResource(slug);
      return isPublished(local) ? local : null;
    }
    return null;
  },
);

export async function listResourceSlugs(): Promise<string[]> {
  const data = await fetchJson<{
    ok: boolean;
    resources?: { slug: string }[];
  }>('/resources');
  if (data?.ok && data.resources?.length) {
    return data.resources.map((r) => r.slug);
  }
  return RESOURCE_SLUGS.filter((slug) => {
    const filePath = path.join(CONTENT_ROOT, slug, 'index.mdx');
    if (!fs.existsSync(filePath)) return false;
    return isPublished(getLocalResource(slug));
  });
}

export const listResources = cache(async (): Promise<ResourceDoc[]> => {
  const data = await fetchJson<{
    ok: boolean;
    resources?: Omit<ApiResource, 'body'>[];
  }>('/resources');

  if (data?.ok && data.resources?.length) {
    return data.resources
      .filter((meta) => meta.status !== 'draft')
      .map((meta) => ({
        frontmatter: {
          slug: meta.slug,
          title: meta.title,
          series: meta.series,
          summary: meta.summary,
          included: meta.included,
          youtube: meta.youtube,
          freeParts: meta.freeParts,
          publishedAt: meta.publishedAt,
          downloads: meta.downloads,
          status: meta.status,
          access: parseAccess(meta.access),
          courseTitle: meta.courseTitle,
          promptCount: meta.promptCount,
          mailNote: meta.mailNote,
          updatedAt: meta.updatedAt,
        },
        parts: [],
        raw: '',
      }));
  }

  const slugs = await listResourceSlugs();
  return slugs.map((slug) => getLocalResource(slug)).filter(isPublished);
});

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
