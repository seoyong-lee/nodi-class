import type { Metadata } from 'next';
import { ResourceReadEntry } from '../../../../components/ResourceAccessEntry';
import { ResourceView } from '../../../../components/ResourceView';
import { hasValidAccessCookie } from '../../../../lib/access';
import { pageMetadata } from '../../../../lib/metadata';
import { getResource } from '../../../../lib/resources';

type Props = {
  params: Promise<{ slug: string }>;
};

/** Canonical stays on the prerendered locked view; this variant is per-reader. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getResource(slug);

  return pageMetadata({
    title: doc?.frontmatter.title ?? '자료를 찾을 수 없습니다',
    description: doc?.frontmatter.summary.replace(/\s+/g, ' ').trim() ?? '',
    path: `/free/${slug}`,
    noIndex: true,
  });
}

/**
 * Reads the access cookie, so it renders per request. Falls back to the locked
 * view when the cookie is missing or expired — never redirects, so a stale
 * client-side hint cannot bounce the reader between routes.
 */
export default async function FreeResourceReadPage({ params }: Props) {
  const { slug } = await params;
  const unlocked = await hasValidAccessCookie();

  return (
    <main>
      <ResourceReadEntry slug={slug} unlocked={unlocked} />
      <ResourceView slug={slug} unlocked={unlocked} />
    </main>
  );
}
