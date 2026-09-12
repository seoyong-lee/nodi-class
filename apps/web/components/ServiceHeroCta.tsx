'use client';

import { Button } from '@nodi/design-system';
import { track } from '../lib/analytics/track';

/** Service page hero CTA → inquiry form. */
export function ServiceHeroCta() {
  return (
    <Button
      variant="primary"
      href="#inquiry"
      onClick={() => {
        track({
          name: 'Clicked Inquiry CTA',
          props: { placement: 'service_hero' },
        });
      }}
    >
      프로젝트 검토 요청하기
    </Button>
  );
}
