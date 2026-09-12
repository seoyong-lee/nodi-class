import { products, toProductCardRows } from '@nodi/shared';
import type { ProductCardRow } from '@nodi/design-system';

function asThree(
  rows: ReturnType<typeof toProductCardRows>,
): [ProductCardRow, ProductCardRow, ProductCardRow] {
  if (rows.length !== 3) {
    throw new Error('ProductCard requires exactly 3 rows');
  }
  return rows as [ProductCardRow, ProductCardRow, ProductCardRow];
}

export function productCardProps(
  key: keyof typeof products,
): {
  label: string;
  title: string;
  summary: string;
  rows: [ProductCardRow, ProductCardRow, ProductCardRow];
  ctaLabel: string;
  ctaHref: string;
  ctaVariant: 'primary' | 'secondary';
} {
  const p = products[key];
  return {
    label: p.label,
    title: p.title,
    summary: p.summary,
    rows: asThree(toProductCardRows(p.rows)),
    ctaLabel: p.cta.label,
    ctaHref: p.cta.href,
    ctaVariant: p.cta.variant,
  };
}
