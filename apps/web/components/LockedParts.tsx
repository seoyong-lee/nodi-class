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
] as const;

export type LockedPart = {
  id: string;
  heading: string;
};

/** Locked teaser: one blurred section + fade, not the full remaining outline. */
export function LockedParts({ parts }: { parts: LockedPart[] }) {
  const preview = parts[0];
  if (!preview) return null;

  return (
    <div className="relative max-w-[720px] overflow-hidden max-h-[260px]">
      <div
        className="absolute inset-x-0 top-0 h-16 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, var(--surface-page), transparent)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, transparent, var(--surface-page))',
        }}
        aria-hidden="true"
      />
      <article className="flex flex-col gap-4" aria-hidden="true">
        <h2 className="m-0 flex items-center gap-inline-tight text-h3 font-bold text-strong break-keep">
          <span className="min-w-0">{preview.heading}</span>
          <span className="text-muted flex-none">
            <Icon name="lock" size={18} />
          </span>
        </h2>
        <div className="flex flex-col gap-inline blur-[6px] select-none pointer-events-none">
          {WIDTHS.map((width, line) => (
            <div
              key={line}
              className="h-[12px] rounded-badge bg-skeleton"
              style={{ width }}
            />
          ))}
        </div>
      </article>
    </div>
  );
}
