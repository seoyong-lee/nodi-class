'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export type BeforeAfterProps = {
  beforeCaption: string;
  afterCaption: string;
  before: ReactNode;
  after: ReactNode;
};

/**
 * Difference reveal: before dims out, after lights up (filter / border / opacity).
 * Hover (mouse): enter on, leave off. Touch: tap toggles.
 * Leaving the viewport always resets to off (no scroll-to-reveal).
 */
export function BeforeAfter({
  beforeCaption,
  afterCaption,
  before,
  after,
}: BeforeAfterProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) setOn(false);
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className="nodi-ba"
      data-on={on ? 'true' : 'false'}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onClick={() => {
        if (window.matchMedia('(hover: none)').matches) {
          setOn((v) => !v);
        }
      }}
    >
      <figure className="nodi-ba-pane nodi-ba-before">
        <figcaption className="nodi-ba-caption">{beforeCaption}</figcaption>
        <div className="nodi-ba-frame">{before}</div>
      </figure>
      <figure className="nodi-ba-pane nodi-ba-after">
        <figcaption className="nodi-ba-caption">{afterCaption}</figcaption>
        <div className="nodi-ba-frame">{after}</div>
      </figure>
    </div>
  );
}
