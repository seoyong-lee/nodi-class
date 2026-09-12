import * as styles from './SectionHeading.css';

const HANGUL = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/;

export type SectionHeadingProps = {
  index: '01' | string;
  label: string;
  title: string;
  align?: 'left' | 'center';
};

export function SectionHeading({
  index,
  label,
  title,
  align = 'left',
}: SectionHeadingProps) {
  const isKoreanLabel = HANGUL.test(label);
  const rootClass = [styles.root, align === 'center' ? styles.center : '']
    .filter(Boolean)
    .join(' ');
  const labelClass = [styles.label, isKoreanLabel ? '' : styles.labelEn]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={rootClass}>
      <span className={labelClass}>
        {index} / {label}
      </span>
      <h2 className={styles.title}>{title}</h2>
    </header>
  );
}
