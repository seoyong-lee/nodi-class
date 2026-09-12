import { Badge } from '../core/Badge';
import { Icon } from '../core/Icon';
import { Thumb16x9 } from './Thumb16x9';
import * as styles from './ResourceCard.css';

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
    <a className={styles.root} href={href}>
      <div className={locked ? styles.lockedThumb : undefined}>
        <Thumb16x9 src={thumbnail} alt="" />
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.meta}>
          {fromVideo ? <Badge>영상에서 소개</Badge> : null}
          {locked ? (
            <span className={styles.locked}>
              <Icon name="lock" size={14} />
            </span>
          ) : (
            <span className={styles.open}>
              {openLabel}
              <Icon name="arrow-right" size={14} />
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
