import type { Metadata } from 'next';
import { ResourceLockedEntry } from '../../../components/ResourceAccessEntry';
import { ResourceView } from '../../../components/ResourceView';
import { pageMetadata } from '../../../lib/metadata';
import { getResource, listResourceSlugs } from '../../../lib/resources';

/** Prerendered, but resource copy lives in DynamoDB — refresh without a deploy. */
export const revalidate = 300;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getResource(slug);

  if (!doc) {
    return pageMetadata({
      title: '자료를 찾을 수 없습니다',
      description: '요청한 전자책을 찾을 수 없습니다.',
      path: `/free/${slug}`,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.summary.replace(/\s+/g, ' ').trim(),
    path: `/free/${slug}`,
  });
}

export async function generateStaticParams() {
  const slugs = await listResourceSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Locked view only, so nothing here depends on the request and the page can be
 * prerendered and served from the CDN. The unlocked body lives at `./read`.
 */
export default async function FreeResourcePage({ params }: Props) {
  const { slug } = await params;

  return (
    <main>
      <ResourceLockedEntry slug={slug} />
      <ResourceView slug={slug} unlocked={false} />
    </main>
  );
}
