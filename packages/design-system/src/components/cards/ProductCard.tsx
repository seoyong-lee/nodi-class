import { Button } from '../core/Button';
import * as styles from './ProductCard.css';

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
    <article className={styles.root}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.summary}>{summary}</p>
      </div>
      <dl className={styles.rows}>
        {rows.map((row) => (
          <div key={row.label} className={styles.row}>
            <dt className={styles.dt}>{row.label}</dt>
            <dd className={styles.dd}>{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className={styles.cta}>
        <Button variant={ctaVariant} href={ctaHref}>
          {ctaLabel}
        </Button>
      </div>
    </article>
  );
}
