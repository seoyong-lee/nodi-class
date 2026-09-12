'use client';

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { Button } from '../core/Button';

export type PromptProps = {
  id: string;
  index?: string;
  name: string;
  when?: string;
  kind?: 'quick';
  /** Prefer over children — JSX `{expr}` children are dropped by RSC MDX. */
  body?: string;
  children?: ReactNode;
  onCopy?: (promptId: string) => void;
};

function extractText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (typeof node === 'object' && 'props' in node) {
    const props = (node as { props?: { children?: ReactNode } }).props;
    return extractText(props?.children);
  }
  return '';
}

function childrenToText(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children) && children.every((c) => typeof c === 'string')) {
    return children.join('');
  }
  return extractText(children);
}

export function Prompt({
  id,
  index,
  name,
  when,
  kind,
  body,
  children,
  onCopy,
}: PromptProps) {
  const text = (body ?? childrenToText(children)).replace(/^\n+|\n+$/g, '');
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = preRef.current;
    if (!el || expanded) {
      setOverflows(false);
      return;
    }

    const check = () => {
      setOverflows(el.scrollHeight > el.clientHeight + 1);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, expanded]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text.trim());
      setCopied(true);
      onCopy?.(id);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  const label =
    kind === 'quick'
      ? `QUICK · ${name}`
      : index
        ? `PROMPT ${index} · ${name}`
        : `PROMPT · ${name}`;

  return (
    <div id={`prompt-${id}`} className="scroll-mt-24 flex flex-col gap-inline break-keep">
      <div className="flex justify-between items-center gap-inline">
        <span className="text-[12px] tracking-[0.08em] text-muted font-bold">
          {label}
        </span>
        <Button variant="secondary" size="sm" onClick={handleCopy}>
          {copied ? '복사됨' : '복사'}
        </Button>
      </div>
      {when ? (
        <p className="m-0 text-[15px] text-body">{when}</p>
      ) : null}
      <pre
        ref={preRef}
        className={cn(
          'm-0 p-4 bg-field font-sans text-[14px] leading-[1.6] text-body whitespace-pre-wrap overflow-y-auto rounded',
          expanded ? 'max-h-none' : 'max-h-[480px] max-[720px]:max-h-[360px]',
        )}
      >
        {text}
      </pre>
      {overflows || expanded ? (
        <button
          type="button"
          className="appearance-none border-0 bg-transparent p-0 self-start font-sans text-caption text-muted cursor-pointer hover:text-strong transition-ui"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? '접기' : '전체 펼치기'}
        </button>
      ) : null}
    </div>
  );
}
