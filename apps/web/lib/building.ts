import { BUILDING_OPTIONS } from '@nodi/shared';

export const BUILDING_EXTRA_FIELD = {
  name: 'building',
  label: '지금 만들고 있는 것',
  options: BUILDING_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
};
