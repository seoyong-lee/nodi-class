'use client';

import { Button } from '@nodi/design-system';
import { track } from '../lib/analytics/track';

export function TrackYouTubeButton({
  href,
  placement,
  size = 'md',
  label = '유튜브에서 보기',
}: {
  href: string;
  placement: 'nav' | 'hero' | 'resource_video';
  size?: 'md' | 'sm';
  label?: string;
}) {
  return (
    <Button
      variant="secondary"
      size={size}
      icon={placement === 'nav' ? 'arrow-up-right' : undefined}
      href={href}
      target={placement === 'resource_video' ? '_blank' : undefined}
      rel={placement === 'resource_video' ? 'noopener noreferrer' : undefined}
      onClick={() => {
        track({ name: 'Clicked YouTube Link', props: { placement } });
      }}
    >
      {label}
    </Button>
  );
}
