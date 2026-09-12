import { ResourceCard } from '@nodi/design-system';
import { hasValidAccessCookie } from '../lib/access';
import { listResources } from '../lib/resources';

export async function HomeResourceCards() {
  const [unlocked, resources] = await Promise.all([
    hasValidAccessCookie(),
    listResources(),
  ]);

  return (
    <div className="grid grid-cols-4 gap-6 mt-block max-[960px]:grid-cols-2 max-[720px]:grid-cols-1 max-[720px]:mt-block-tight">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.frontmatter.slug}
          title={resource.frontmatter.title}
          slug={resource.frontmatter.slug}
          locked={!unlocked}
        />
      ))}
    </div>
  );
}
