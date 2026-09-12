import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@nodi/design-system/styles/vars';

export const form = style({
  maxWidth: 720,
  background: vars.surface.raised,
  border: vars.border.hairline,
  borderRadius: vars.radius.base,
  padding: vars.space[5],
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  wordBreak: 'keep-all',
});

export const row = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: vars.space[3],
  '@media': {
    '(max-width: 720px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const consent = style({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  fontSize: vars.size.label,
  color: vars.text.muted,
});

globalStyle(`${consent} input`, {
  width: 16,
  height: 16,
  accentColor: vars.accent.base,
});

export const submit = style({
  alignSelf: 'flex-start',
  '@media': {
    '(max-width: 720px)': {
      alignSelf: 'stretch',
    },
  },
});

globalStyle(`${submit} a, ${submit} button`, {
  '@media': {
    '(max-width: 720px)': {
      width: '100%',
    },
  },
});

export const note = style({
  margin: 0,
  fontSize: vars.size.label,
  color: vars.text.muted,
});

export const done = style({
  margin: 0,
  maxWidth: 720,
  color: vars.text.strong,
  wordBreak: 'keep-all',
});

export const error = style({
  margin: 0,
  fontSize: vars.size.label,
  color: vars.text.strong,
  wordBreak: 'keep-all',
});
