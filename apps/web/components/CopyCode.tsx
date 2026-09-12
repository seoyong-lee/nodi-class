'use client';

import { useState, type ReactNode } from 'react';

export function CopyCode({ children }: { children: ReactNode }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text =
      typeof children === 'string'
        ? children
        : extractText(children);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="relative my-3">
      <button
        type="button"
        className="absolute top-2 right-2 z-[1] appearance-none border-hairline rounded-badge bg-card text-body font-sans text-label px-[10px] py-[6px] cursor-pointer hover:text-strong hover:border-hairline-strong"
        onClick={handleCopy}
      >
        {copied ? '복사됨' : '복사'}
      </button>
      <pre className="m-0 p-3 pt-5 overflow-x-auto bg-raised border-hairline rounded text-body text-body-sm break-keep whitespace-pre-wrap">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function extractText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (typeof node === 'object' && 'props' in node) {
    const props = node.props as { children?: ReactNode };
    return extractText(props.children);
  }
  return '';
}
