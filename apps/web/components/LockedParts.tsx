import { Icon } from '@nodi/design-system';

const WIDTHS = [
  '100%',
  '94%',
  '88%',
  '72%',
  '96%',
  '64%',
  '90%',
  '58%',
  '82%',
  '76%',
  '98%',
  '70%',
  '86%',
  '60%',
] as const;

export type LockedPart = {
  id: string;
  heading: string;
};

export function LockedParts({ parts }: { parts: LockedPart[] }) {
  return (
    <div className="relative max-w-[720px]">
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, var(--surface-page), transparent)',
        }}
        aria-hidden="true"
      />
      <div className="flex flex-col gap-block" aria-hidden="true">
        {parts.map((part, i) => {
          const lineCount = 6 + (i % 9);
          return (
            <article key={part.id} className="flex flex-col gap-4">
              <h2
                id={part.id}
                className="m-0 scroll-mt-24 flex items-center gap-inline-tight text-h3 font-bold text-strong break-keep"
              >
                <span className="min-w-0">{part.heading}</span>
                <span className="text-muted flex-none">
                  <Icon name="lock" size={18} />
                </span>
              </h2>
              <div className="flex flex-col gap-inline blur-[6px] select-none pointer-events-none">
                {Array.from({ length: lineCount }, (_, line) => (
                  <div
                    key={line}
                    className="h-[12px] rounded-badge bg-raised"
                    style={{ width: WIDTHS[line % WIDTHS.length] }}
                  />
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
