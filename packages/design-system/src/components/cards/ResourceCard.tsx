import { Badge, type BadgeTone } from '../core/Badge';
import { ThumbBook } from './ThumbBook';

export type ResourceCardBadge = {
  label: string;
  tone?: BadgeTone;
};

export type ResourceCardProps = {
  title: string;
  slug: string;
  thumbnail?: string;
  /** Up to 2 badges, e.g. 클로드 + PPT */
  badges?: Array<string | ResourceCardBadge>;
};

function normalizeBadge(badge: string | ResourceCardBadge): ResourceCardBadge {
  return typeof badge === 'string' ? { label: badge } : badge;
}

export function ResourceCard({
  title,
  slug,
  thumbnail,
  badges = [],
}: ResourceCardProps) {
  const href = `/free/${slug}`;
  const shown = badges.map(normalizeBadge).slice(0, 2);

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
        {shown.length > 0 ? (
          <div className="flex items-center gap-inline-tight flex-wrap">
            {shown.map((badge) => (
              <Badge key={badge.label} tone={badge.tone}>
                {badge.label}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    </a>
  );
}
