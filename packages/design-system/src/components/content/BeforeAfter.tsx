import type { ReactNode } from 'react';
import * as styles from './BeforeAfter.css';

export type BeforeAfterProps = {
  beforeCaption: string;
  afterCaption: string;
  before: ReactNode;
  after: ReactNode;
};

function Pane({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <div className={styles.pane}>
      <span className={styles.caption}>{caption}</span>
      <div className={styles.frame}>{children}</div>
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
    <div className={styles.root}>
      <Pane caption={beforeCaption}>{before}</Pane>
      <Pane caption={afterCaption}>{after}</Pane>
    </div>
  );
}
