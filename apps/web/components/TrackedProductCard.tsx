'use client';

import { ProductCard, type ProductCardProps } from '@nodi/design-system';
import { track } from '../lib/analytics/track';

type Placement = 'home_card' | 'course_card';

type Props = ProductCardProps & {
  analytics?:
    | { kind: 'vod'; placement: Placement }
    | { kind: 'inquiry'; placement: Placement };
};

export function TrackedProductCard({ analytics, onCtaClick, ...rest }: Props) {
  return (
    <ProductCard
      {...rest}
      onCtaClick={() => {
        if (analytics?.kind === 'vod') {
          track({
            name: 'Clicked VOD Waitlist CTA',
            props: { placement: analytics.placement },
          });
        } else if (analytics?.kind === 'inquiry') {
          track({
            name: 'Clicked Inquiry CTA',
            props: { placement: analytics.placement },
          });
        }
        onCtaClick?.();
      }}
    />
  );
}
