import { Button } from '../core/Button';

export type ProductCardRow = {
  label: string;
  value: string;
};

export type ProductCardProps = {
  label: string;
  title: string;
  summary: string;
  rows: [ProductCardRow, ProductCardRow, ProductCardRow];
  ctaLabel: string;
  ctaHref?: string;
  ctaVariant?: 'primary' | 'secondary';
};

export function ProductCard({
  label,
  title,
  summary,
  rows,
  ctaLabel,
  ctaHref,
  ctaVariant = 'secondary',
}: ProductCardProps) {
  return (
    <article className="flex flex-col gap-block-tight bg-card border-hairline rounded p-card-pad h-full">
      <div className="flex flex-col gap-inline-tight">
        <span className="text-label tracking-label-en text-muted">{label}</span>
        <h3 className="m-0 text-h3 font-bold text-strong break-keep">{title}</h3>
        <p className="m-0 text-body-sm text-body break-keep">{summary}</p>
      </div>
      <dl className="m-0 flex flex-col flex-[1_1_auto] border-t border-line">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[84px_1fr] gap-inline py-3 border-b border-line"
          >
            <dt className="text-caption text-muted">{row.label}</dt>
            <dd className="m-0 text-caption leading-[1.6] text-strong break-keep">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="w-full [&>*]:w-full">
        <Button variant={ctaVariant} href={ctaHref}>
          {ctaLabel}
        </Button>
      </div>
    </article>
  );
}
