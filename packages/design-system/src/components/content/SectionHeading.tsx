import { cn } from '../../lib/cn';

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

  return (
    <header
      className={cn(
        'flex flex-col gap-inline items-start text-left',
        align === 'center' && 'items-center text-center',
      )}
    >
      <span
        className={cn(
          'text-label text-muted leading-[1.4] tracking-normal normal-case',
          !isKoreanLabel && 'tracking-label-en',
        )}
      >
        {index} / {label}
      </span>
      <h2 className="m-0 text-h2 font-bold text-strong break-keep">{title}</h2>
    </header>
  );
}
