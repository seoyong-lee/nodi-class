import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars';

export const root = style({
  position: 'relative',
  aspectRatio: '16 / 9',
  width: '100%',
  overflow: 'hidden',
  borderRadius: `calc(${vars.radius.base} - 3px)`,
  background: vars.surface.raised,
  border: vars.border.hairline,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const image = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});

export const placeholder = style({
  fontSize: vars.size.label,
  letterSpacing: vars.tracking.label,
  color: vars.text.disabled,
});
