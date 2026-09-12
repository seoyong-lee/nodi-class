import type { ReactNode } from 'react';

export type BeforeAfterProps = {
  beforeCaption: string;
  afterCaption: string;
  before: ReactNode;
  after: ReactNode;
};

function Pane({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <div className="flex h-full min-w-0 flex-col gap-inline">
      <span className="text-label tracking-label-en text-muted">{caption}</span>
      <div className="flex h-full min-h-[180px] flex-col rounded border-hairline bg-card p-card-pad text-body text-body-sm">
        <div className="relative aspect-video w-full overflow-hidden rounded [&_img]:absolute [&_img]:inset-0 [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:object-top">
          {children}
        </div>
      </div>
    </div>
  );
}

export function BeforeAfter({ beforeCaption, afterCaption, before, after }: BeforeAfterProps) {
  return (
    <div className="grid grid-cols-2 items-stretch gap-block-tight max-[720px]:grid-cols-1">
      <Pane caption={beforeCaption}>{before}</Pane>
      <Pane caption={afterCaption}>{after}</Pane>
    </div>
  );
}
