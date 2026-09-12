import { Badge } from '../core/Badge';

export type AccessBadgeProps = {
  access: 'free' | 'paid';
};

export function AccessBadge({ access }: AccessBadgeProps) {
  return (
    <Badge tone="current">
      {access === 'free' ? '무료 자료' : '유료 전환됨 · 기존 등록자 무료'}
    </Badge>
  );
}
