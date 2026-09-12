import { ResourceCard } from '@nodi/design-system';
import { resourceThumbnail } from '@nodi/shared';
import { listResources } from '../lib/resources';

function cardBadges(access: 'free' | 'paid' | undefined): string[] {
  if (access === 'paid') {
    return ['강의 교재'];
  }
  return ['무료 공개 중'];
}

export async function ResourceCardsGrid() {
  const resources = await listResources();

  return (
    <div className="grid grid-cols-3 gap-6 mt-block max-[960px]:grid-cols-2 max-[720px]:grid-cols-1 max-[720px]:mt-block-tight">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.frontmatter.slug}
          title={resource.frontmatter.title}
          slug={resource.frontmatter.slug}
          thumbnail={resource.frontmatter.cover ?? resourceThumbnail(resource.frontmatter.slug)}
          badges={cardBadges(resource.frontmatter.access)}
        />
      ))}
    </div>
  );
}
