import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/business';
import { listResourceSlugs } from '../lib/resources';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const resourceSlugs = await listResourceSlugs();
  const pages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/free`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/course`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/service`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  return pages.concat(
    resourceSlugs.map((slug) => ({
      url: `${SITE_URL}/free/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  );
}
