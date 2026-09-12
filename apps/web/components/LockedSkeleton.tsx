const WIDTHS = ['100%', '94%', '88%', '72%', '96%', '64%', '90%', '58%'] as const;

export function LockedSkeleton({ partLabels }: { partLabels: string[] }) {
  return (
    <div className="relative max-w-[720px]">
      <div
        className="flex flex-col gap-5 blur-[6px] opacity-[0.45] pointer-events-none select-none"
        aria-hidden="true"
      >
        {partLabels.map((label, partIndex) => (
          <div key={`${label}-${partIndex}`} className="flex flex-col gap-2">
            <span className="text-label tracking-label-en text-muted">{label}</span>
            <div className="flex flex-col gap-inline">
              {WIDTHS.slice(0, 4 + (partIndex % 3)).map((width, i) => (
                <div
                  key={i}
                  className="h-3 rounded-badge bg-raised"
                  style={{ width }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--surface-page)_20%,transparent)]" />
    </div>
  );
}
