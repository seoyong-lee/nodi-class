import { Badge } from '../core/Badge';
import { Icon } from '../core/Icon';
import { Thumb16x9 } from './Thumb16x9';

export type ResourceCardProps = {
  title: string;
  slug: string;
  locked: boolean;
  thumbnail?: string;
  openLabel?: string;
  fromVideo?: boolean;
};

export function ResourceCard({
  title,
  slug,
  locked,
  thumbnail,
  openLabel = '받기',
  fromVideo = true,
}: ResourceCardProps) {
  const href = `/free/${slug}`;

  return (
    <a
      className="flex flex-col gap-inline bg-card border border-line rounded px-3 pt-3 pb-5 transition-ui text-inherit no-underline hover:border-line-strong hover:bg-raised"
      href={href}
    >
      <div className={locked ? 'opacity-[0.55]' : undefined}>
        <Thumb16x9 src={thumbnail} alt="" />
      </div>
      <div className="flex flex-col gap-inline px-1">
        <h3 className="m-0 text-body font-bold text-strong break-keep">{title}</h3>
        <div className="flex items-center gap-inline-tight flex-wrap">
          {fromVideo ? <Badge>영상에서 소개</Badge> : null}
          {locked ? (
            <span className="inline-flex items-center gap-[6px] text-caption text-muted">
              <Icon name="lock" size={14} />
            </span>
          ) : (
            <span className="inline-flex items-center gap-[6px] text-caption font-bold text-link">
              {openLabel}
              <Icon name="arrow-right" size={14} />
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
