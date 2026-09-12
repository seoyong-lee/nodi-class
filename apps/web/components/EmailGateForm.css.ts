import { style } from '@vanilla-extract/css';
import { vars } from '@nodi/design-system/styles/vars';

export const root = style({
  position: 'relative',
  minWidth: 0,
});

export const error = style({
  margin: `${vars.space[2]} 0 0`,
  fontSize: vars.size.label,
  color: vars.text.strong,
  wordBreak: 'keep-all',
});
