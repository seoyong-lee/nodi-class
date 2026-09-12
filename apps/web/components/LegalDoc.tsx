import { MDXRemote } from 'next-mdx-remote/rsc';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import remarkGfm from 'remark-gfm';

type ChildrenProps = { children?: ReactNode };

const components = {
  h1: (props: ChildrenProps) => (
    <h1
      className="m-0 mb-3 text-h2 font-bold text-strong break-keep"
      {...props}
    />
  ),
  h2: (props: ChildrenProps) => (
    <h2
      className="m-0 mt-10 mb-3 text-h3 font-bold text-strong break-keep first:mt-0"
      {...props}
    />
  ),
  h3: (props: ChildrenProps) => (
    <h3
      className="m-0 mt-6 mb-2 text-body font-bold text-strong break-keep"
      {...props}
    />
  ),
  p: (props: ChildrenProps) => (
    <p
      className="m-0 mb-3 text-body text-body leading-[var(--leading-body)] break-keep first-of-type:text-body-sm first-of-type:text-muted"
      {...props}
    />
  ),
  ul: (props: ChildrenProps) => (
    <ul
      className="m-0 mb-3 flex list-disc flex-col gap-1 pl-[1.25em] text-body"
      {...props}
    />
  ),
  ol: (props: ChildrenProps) => (
    <ol
      className="m-0 mb-3 flex list-decimal flex-col gap-2 pl-[1.25em] text-body"
      {...props}
    />
  ),
  li: (props: ChildrenProps) => (
    <li className="m-0 break-keep [&_ul]:mt-2 [&_ul]:mb-0" {...props} />
  ),
  strong: (props: ChildrenProps) => (
    <strong className="font-bold text-strong" {...props} />
  ),
  em: (props: ChildrenProps) => <em className="italic" {...props} />,
  a: (props: ComponentPropsWithoutRef<'a'>) => (
    <a
      className="text-link underline-offset-2 hover:underline break-all"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-0 border-t border-line" />,
  code: (props: ChildrenProps) => (
    <code className="rounded-badge bg-raised px-[0.35em] py-[0.1em] font-mono text-[0.92em] text-strong">
      {props.children}
    </code>
  ),
  table: (props: ChildrenProps) => (
    <div className="my-4 w-full overflow-x-auto border border-line rounded">
      <table
        className="m-0 w-full min-w-[36rem] border-collapse text-left text-body-sm"
        {...props}
      />
    </div>
  ),
  thead: (props: ChildrenProps) => (
    <thead className="bg-raised text-strong" {...props} />
  ),
  tbody: (props: ChildrenProps) => <tbody {...props} />,
  tr: (props: ChildrenProps) => (
    <tr className="border-b border-line last:border-b-0" {...props} />
  ),
  th: (props: ChildrenProps) => (
    <th
      className="px-3 py-2.5 align-top font-bold text-strong whitespace-nowrap"
      {...props}
    />
  ),
  td: (props: ChildrenProps) => (
    <td className="px-3 py-2.5 align-top text-body break-keep" {...props} />
  ),
};

export function LegalDoc({ source }: { source: string }) {
  return (
    <article className="break-keep">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </article>
  );
}
