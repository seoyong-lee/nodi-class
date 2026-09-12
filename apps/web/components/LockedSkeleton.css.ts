import { style } from '@vanilla-extract/css';
import { vars } from '@nodi/design-system/styles/vars';

export const wrap = style({
  position: 'relative',
  maxWidth: 720,
});

export const blur = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[5],
  filter: 'blur(6px)',
  opacity: 0.45,
  pointerEvents: 'none',
  userSelect: 'none',
});

export const part = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
});

export const label = style({
  fontSize: vars.size.label,
  letterSpacing: vars.tracking.label,
  color: vars.text.muted,
  textTransform: 'uppercase',
});

export const lines = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

export const line = style({
  height: 12,
  borderRadius: vars.radius.badge,
  background: vars.surface.raised,
});

export const overlay = style({
  position: 'absolute',
  inset: 0,
  background: `color-mix(in srgb, ${vars.surface.page} 20%, transparent)`,
});
