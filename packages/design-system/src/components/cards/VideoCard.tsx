'use client';

import { useMemo, useState } from 'react';
import { Icon } from '../core/Icon';
import { Thumb16x9 } from './Thumb16x9';

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
    <article className="group flex flex-col gap-inline bg-card border border-line rounded px-3 pt-3 pb-5 text-inherit transition-ui hover:border-line-strong">
      {playing && embed ? (
        <Thumb16x9>
          <iframe
            className="absolute inset-0 w-full h-full border-0"
            src={embed}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Thumb16x9>
      ) : (
        <button
          type="button"
          className="contents cursor-pointer bg-transparent border-0 p-0 text-inherit font-inherit text-left"
          onClick={() => {
            if (embed) {
              setPlaying(true);
            } else {
              window.open(href, '_blank', 'noopener,noreferrer');
            }
          }}
        >
          <Thumb16x9 src={thumbnail} alt="">
            <span
              className="absolute left-3 bottom-3 inline-flex items-center justify-center w-8 h-8 border-0 rounded-badge bg-[color-mix(in_srgb,var(--text-on-accent)_72%,transparent)] text-strong cursor-pointer p-0"
              aria-hidden="true"
            >
              <Icon name="play" size={14} />
            </span>
          </Thumb16x9>
        </button>
      )}
      <div className="flex flex-col gap-[6px] px-1">
        <h3 className="m-0 text-body font-bold text-strong break-keep transition-ui group-hover:text-link">
          {title}
        </h3>
        {note ? <span className="text-caption text-muted">{note}</span> : null}
      </div>
    </article>
  );
}
