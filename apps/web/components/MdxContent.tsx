import { MDXRemote } from 'next-mdx-remote/rsc';
import type { ReactNode } from 'react';
import { CopyCode } from './CopyCode';
import styles from './MdxContent.module.css';

const components = {
  h2: (props: { children?: ReactNode; id?: string }) => (
    <h2 className={styles.h2} {...props} />
  ),
  h3: (props: { children?: ReactNode }) => (
    <h3 className={styles.h3} {...props} />
  ),
  p: (props: { children?: ReactNode }) => (
    <p className={styles.p} {...props} />
  ),
  ul: (props: { children?: ReactNode }) => (
    <ul className={styles.ul} {...props} />
  ),
  ol: (props: { children?: ReactNode }) => (
    <ol className={styles.ol} {...props} />
  ),
  li: (props: { children?: ReactNode }) => (
    <li className={styles.li} {...props} />
  ),
  strong: (props: { children?: ReactNode }) => (
    <strong className={styles.strong} {...props} />
  ),
  pre: (props: { children?: ReactNode }) => <>{props.children}</>,
  code: (props: { children?: ReactNode; className?: string }) => {
    const isBlock = Boolean(props.className) || String(props.children).includes('\n');
    if (isBlock) {
      return <CopyCode>{props.children}</CopyCode>;
    }
    return <code className={styles.inlineCode}>{props.children}</code>;
  },
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className={styles.root}>
      <MDXRemote source={source} components={components} />
    </div>
  );
}
