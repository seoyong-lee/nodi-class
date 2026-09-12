import { ThumbBook } from './ThumbBook';

export type ResourceCardProps = {
  title: string;
  slug: string;
  thumbnail?: string;
};

export function ResourceCard({ title, slug, thumbnail }: ResourceCardProps) {
  const href = `/free/${slug}`;

  return (
    <a
      className="flex flex-col gap-inline bg-card border border-line rounded overflow-hidden pb-5 transition-ui text-inherit no-underline hover:border-line-strong hover:bg-raised"
      href={href}
    >
      <ThumbBook src={thumbnail} alt="" />
      <div className="flex flex-col gap-inline px-4">
        <h3 className="m-0 text-body font-bold leading-[var(--leading-tight)] tracking-[var(--tracking-heading)] text-strong break-keep">
          {title}
        </h3>
      </div>
    </a>
  );
}
