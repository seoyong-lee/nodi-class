import type { ReactNode } from 'react';

export type BeforeAfterProps = {
  beforeCaption: string;
  afterCaption: string;
  before: ReactNode;
  after: ReactNode;
};

function Pane({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-inline min-w-0">
      <span className="text-label tracking-label-en text-muted">{caption}</span>
      <div className="bg-card border-hairline rounded p-card-pad min-h-[180px] text-body text-body-sm">
        {children}
      </div>
    </div>
  );
}

export function BeforeAfter({
  beforeCaption,
  afterCaption,
  before,
  after,
}: BeforeAfterProps) {
  return (
    <div className="grid grid-cols-2 gap-block-tight max-[375px]:grid-cols-1">
      <Pane caption={beforeCaption}>{before}</Pane>
      <Pane caption={afterCaption}>{after}</Pane>
    </div>
  );
}
