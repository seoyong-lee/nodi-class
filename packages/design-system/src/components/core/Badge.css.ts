import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars';

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 9px',
  border: `1px solid ${vars.border.subtle}`,
  borderRadius: vars.radius.badge,
  fontSize: vars.size.label,
  lineHeight: 1.4,
  letterSpacing: vars.tracking.body,
  whiteSpace: 'nowrap',
  background: vars.surface.raised,
  color: vars.text.muted,
});

export const current = style({
  background: vars.accent.quiet,
  color: vars.accent.base,
  borderColor: 'transparent',
});
