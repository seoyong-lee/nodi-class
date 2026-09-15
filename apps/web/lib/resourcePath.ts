/** Statically rendered locked view — what crawlers and first-time visitors get. */
export function resourcePath(slug: string): string {
  return `/free/${slug}`;
}

/** Dynamic view that reads the access cookie and may render the full body. */
export function resourceReadPath(slug: string): string {
  return `/free/${slug}/read`;
}
