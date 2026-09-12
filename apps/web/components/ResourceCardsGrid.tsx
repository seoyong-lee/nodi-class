import { ResourceCard } from '@nodi/design-system';
import { resourceBadge, resourceThumbnail } from '@nodi/shared';
import { hasValidAccessCookie } from '../lib/access';
import { listResources } from '../lib/resources';

export async function ResourceCardsGrid() {
  const [unlocked, resources] = await Promise.all([
    hasValidAccessCookie(),
    listResources(),
  ]);

  return (
    <div className="grid grid-cols-3 gap-6 mt-block max-[960px]:grid-cols-2 max-[720px]:grid-cols-1 max-[720px]:mt-block-tight">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.frontmatter.slug}
          title={resource.frontmatter.title}
          slug={resource.frontmatter.slug}
          locked={!unlocked}
          badge={resourceBadge(resource.frontmatter.slug)}
          thumbnail={resourceThumbnail(resource.frontmatter.slug)}
        />
      ))}
    </div>
  );
}
