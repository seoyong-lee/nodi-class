import { style } from '@vanilla-extract/css';
import { vars } from '@nodi/design-system/styles/vars';

export const root = style({
  position: 'relative',
  margin: `${vars.space[3]} 0`,
});

export const button = style({
  position: 'absolute',
  top: vars.space[2],
  right: vars.space[2],
  zIndex: 1,
  appearance: 'none',
  border: vars.border.hairline,
  borderRadius: vars.radius.badge,
  background: vars.surface.card,
  color: vars.text.body,
  fontFamily: vars.font.sans,
  fontSize: vars.size.label,
  padding: '6px 10px',
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      color: vars.text.strong,
      borderColor: vars.border.strong,
    },
  },
});

export const pre = style({
  margin: 0,
  padding: vars.space[3],
  paddingTop: vars.space[5],
  overflowX: 'auto',
  background: vars.surface.raised,
  border: vars.border.hairline,
  borderRadius: vars.radius.base,
  color: vars.text.body,
  fontSize: vars.size.bodySm,
  lineHeight: vars.leading.body,
  wordBreak: 'keep-all',
  whiteSpace: 'pre-wrap',
});
