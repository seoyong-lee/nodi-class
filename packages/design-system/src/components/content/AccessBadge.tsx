import { Badge } from '../core/Badge';

export type AccessBadgeProps = {
  access: 'free' | 'free-until-course' | 'paid';
};

export function AccessBadge({ access }: AccessBadgeProps) {
  const label =
    access === 'free-until-course'
      ? '기간 한정 무료'
      : access === 'paid'
        ? '유료 전환됨 · 기존 등록자 무료'
        : '무료 자료';

  return <Badge tone="current">{label}</Badge>;
}
