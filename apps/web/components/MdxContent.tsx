import { Callout, Prompt } from '@nodi/design-system';
import '@nodi/design-system/mdx.css';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { ReactNode } from 'react';
import remarkGfm from 'remark-gfm';
import { CopyCode } from './CopyCode';
import { ResourceMdxImage } from './ResourceMdxImage';

const components = {
  h2: (props: { children?: ReactNode; id?: string }) => (
    <h2
      className="mt-5 mb-3 scroll-mt-24 text-h3 font-bold text-strong"
      {...props}
    />
  ),
  ul: (props: { children?: ReactNode }) => (
    <ul className="list-disc" {...props} />
  ),
  ol: (props: { children?: ReactNode }) => (
    <ol className="list-decimal" {...props} />
  ),
  Callout,
  Prompt,
  img: ResourceMdxImage,
  pre: (props: { children?: ReactNode }) => <>{props.children}</>,
  code: (props: { children?: ReactNode; className?: string }) => {
    const isBlock =
      Boolean(props.className) || String(props.children).includes('\n');
    if (isBlock) {
      return <CopyCode>{props.children}</CopyCode>;
    }
    return <code>{props.children}</code>;
  },
  table: (props: { children?: ReactNode }) => (
    <div className="my-4 w-full overflow-x-auto">
      <table {...props} />
    </div>
  ),
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="nodi-mdx break-keep text-body leading-[var(--leading-body)]">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </div>
  );
}
