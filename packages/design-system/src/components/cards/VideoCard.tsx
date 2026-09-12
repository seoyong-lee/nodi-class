'use client';

import { useMemo, useState } from 'react';
import { Icon } from '../core/Icon';
import { Thumb16x9 } from './Thumb16x9';
import styles from './VideoCard.module.css';

export type VideoCardProps = {
  title: string;
  note: string;
  href: string;
  thumbnail?: string;
};

function youtubeEmbedUrl(href: string): string | null {
  try {
    const url = new URL(href);
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.replace(/^\//, '');
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
    }
    const id = url.searchParams.get('v');
    if (id) {
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    const parts = url.pathname.split('/');
    const embedIdx = parts.indexOf('embed');
    if (embedIdx >= 0 && parts[embedIdx + 1]) {
      return `https://www.youtube.com/embed/${parts[embedIdx + 1]}?autoplay=1`;
    }
  } catch {
    return null;
  }
  return null;
}

export function VideoCard({ title, note, href, thumbnail }: VideoCardProps) {
  const [playing, setPlaying] = useState(false);
  const embed = useMemo(() => youtubeEmbedUrl(href), [href]);

  return (
    <article className={styles.root}>
      {playing && embed ? (
        <Thumb16x9>
          <iframe
            className={styles.iframe}
            src={embed}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Thumb16x9>
      ) : (
        <button
          type="button"
          className={styles.trigger}
          onClick={() => {
            if (embed) {
              setPlaying(true);
            } else {
              window.open(href, '_blank', 'noopener,noreferrer');
            }
          }}
        >
          <Thumb16x9 src={thumbnail} alt="">
            <span className={styles.play} aria-hidden="true">
              <Icon name="play" size={14} />
            </span>
          </Thumb16x9>
        </button>
      )}
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {note ? <span className={styles.note}>{note}</span> : null}
      </div>
    </article>
  );
}
