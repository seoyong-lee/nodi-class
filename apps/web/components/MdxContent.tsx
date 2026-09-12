import { MDXRemote } from 'next-mdx-remote/rsc';
import type { ReactNode } from 'react';
import { CopyCode } from './CopyCode';

const components = {
  h2: (props: { children?: ReactNode; id?: string }) => (
    <h2 className="mt-5 mb-3 text-h3 font-bold text-strong" {...props} />
  ),
  h3: (props: { children?: ReactNode }) => (
    <h3 className="mt-3 mb-2 text-body font-bold text-strong" {...props} />
  ),
  p: (props: { children?: ReactNode }) => (
    <p className="m-0 mb-2 max-w-measure" {...props} />
  ),
  ul: (props: { children?: ReactNode }) => (
    <ul className="m-0 mb-2 pl-[1.25em] max-w-measure" {...props} />
  ),
  ol: (props: { children?: ReactNode }) => (
    <ol className="m-0 mb-2 pl-[1.25em] max-w-measure" {...props} />
  ),
  li: (props: { children?: ReactNode }) => (
    <li className="mb-inline-tight" {...props} />
  ),
  strong: (props: { children?: ReactNode }) => (
    <strong className="text-strong font-bold" {...props} />
  ),
  pre: (props: { children?: ReactNode }) => <>{props.children}</>,
  code: (props: { children?: ReactNode; className?: string }) => {
    const isBlock = Boolean(props.className) || String(props.children).includes('\n');
    if (isBlock) {
      return <CopyCode>{props.children}</CopyCode>;
    }
    return (
      <code className="font-mono text-[0.92em] bg-raised rounded-badge px-[0.35em] py-[0.1em]">
        {props.children}
      </code>
    );
  },
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="break-keep text-body text-body leading-[var(--leading-body)]">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
