'use client';

import { Button, Icon } from '@nodi/design-system';
import { track } from '../lib/analytics/track';

export function TrackYouTubeButton({
  href,
  placement,
  size = 'md',
  label = '유튜브에서 보기',
  iconOnly = false,
}: {
  href: string;
  placement: 'nav' | 'hero' | 'resource_video';
  size?: 'md' | 'sm';
  label?: string;
  /** 36×36 icon button; label hidden, aria-label only. */
  iconOnly?: boolean;
}) {
  const onClick = () => {
    track({ name: 'Clicked YouTube Link', props: { placement } });
  };

  const external = placement === 'resource_video';

  if (iconOnly) {
    return (
      <a
        href={href}
        aria-label="유튜브 채널"
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        onClick={onClick}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-transparent text-strong no-underline transition-ui hover:border-line-strong active:bg-raised"
      >
        <Icon name="youtube" size={16} />
      </a>
    );
  }

  return (
    <Button
      variant="secondary"
      size={size}
      icon={placement === 'nav' ? 'arrow-up-right' : undefined}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
