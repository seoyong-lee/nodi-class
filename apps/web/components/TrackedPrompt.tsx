'use client';

import { Prompt, type PromptProps } from '@nodi/design-system';
import { track } from '../lib/analytics/track';

export function TrackedPrompt({
  resourceSlug,
  ...props
}: PromptProps & { resourceSlug: string }) {
  return (
    <Prompt
      {...props}
      onCopy={(promptId) => {
        track({
          name: 'Copied Prompt',
          props: { resource_slug: resourceSlug, prompt_id: promptId },
        });
      }}
    />
  );
}
