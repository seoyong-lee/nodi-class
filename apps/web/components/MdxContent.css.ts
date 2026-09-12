import { style } from '@vanilla-extract/css';
import { vars } from '@nodi/design-system/styles/vars';

export const root = style({
  wordBreak: 'keep-all',
  color: vars.text.body,
  fontSize: vars.size.body,
  lineHeight: vars.leading.body,
});

export const h2 = style({
  margin: `${vars.space[5]} 0 ${vars.space[3]}`,
  fontSize: vars.size.h3,
  fontWeight: vars.font.bold,
  lineHeight: vars.leading.tight,
  letterSpacing: vars.tracking.heading,
  color: vars.text.strong,
});

export const h3 = style({
  margin: `${vars.space[3]} 0 ${vars.space[2]}`,
  fontSize: vars.size.body,
  fontWeight: vars.font.bold,
  color: vars.text.strong,
});

export const p = style({
  margin: `0 0 ${vars.space[2]}`,
  maxWidth: vars.layout.measure,
});

export const ul = style({
  margin: `0 0 ${vars.space[2]}`,
  paddingLeft: '1.25em',
  maxWidth: vars.layout.measure,
});

export const ol = style({
  margin: `0 0 ${vars.space[2]}`,
  paddingLeft: '1.25em',
  maxWidth: vars.layout.measure,
});

export const li = style({
  marginBottom: vars.gap.inlineTight,
});

export const strong = style({
  color: vars.text.strong,
  fontWeight: vars.font.bold,
});

export const inlineCode = style({
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  fontSize: '0.92em',
  background: vars.surface.raised,
  borderRadius: vars.radius.badge,
  padding: '0.1em 0.35em',
});
