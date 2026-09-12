import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.gap.inline,
  alignItems: 'flex-start',
  textAlign: 'left',
});

export const center = style({
  alignItems: 'center',
  textAlign: 'center',
});

export const label = style({
  fontSize: vars.size.label,
  color: vars.text.muted,
  lineHeight: 1.4,
  letterSpacing: 0,
  textTransform: 'none',
});

export const labelEn = style({
  letterSpacing: vars.tracking.label,
  textTransform: 'uppercase',
});

export const title = style({
  margin: 0,
  fontSize: vars.size.h2,
  fontWeight: vars.font.bold,
  lineHeight: vars.leading.heading,
  letterSpacing: vars.tracking.heading,
  color: vars.text.strong,
  wordBreak: 'keep-all',
});
