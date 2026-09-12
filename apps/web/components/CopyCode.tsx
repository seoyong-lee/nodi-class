'use client';

import { useState, type ReactNode } from 'react';
import styles from './CopyCode.module.css';

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
    <div className={styles.root}>
      <button type="button" className={styles.button} onClick={handleCopy}>
        {copied ? '복사됨' : '복사'}
      </button>
      <pre className={styles.pre}>
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
