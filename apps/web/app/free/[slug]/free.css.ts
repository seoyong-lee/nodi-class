import { style } from '@vanilla-extract/css';
import { vars } from '@nodi/design-system/styles/vars';

export const hero = style({
  display: 'grid',
  gridTemplateColumns: '1fr minmax(240px, 420px)',
  gap: vars.space[8],
  alignItems: 'start',
  wordBreak: 'keep-all',
  '@media': {
    '(max-width: 960px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const heroCopy = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
});

export const toc = style({
  listStyle: 'none',
  margin: `${vars.gap.blockTight} 0 0`,
  padding: 0,
  maxWidth: 720,
  borderTop: vars.border.hairline,
});

export const tocItem = style({
  display: 'flex',
  gap: vars.space[2],
  padding: '12px 0',
  borderBottom: vars.border.hairline,
});

export const tocNum = style({
  flex: 'none',
  width: 24,
  fontSize: vars.size.caption,
  color: vars.text.muted,
});

export const tocTitle = style({
  fontSize: vars.size.bodySm,
  color: vars.text.body,
});

export const part = style({
  maxWidth: 720,
  marginBottom: vars.space[5],
});

export const gate = style({
  maxWidth: 640,
  marginBottom: vars.space[5],
});

export const locked = style({
  marginTop: vars.space[3],
});

export const opened = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.gap.inlineTight,
  color: vars.text.strong,
  wordBreak: 'keep-all',
});

export const downloads = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.gap.inline,
  margin: `${vars.space[4]} 0 ${vars.space[5]}`,
});

export const others = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: vars.space[3],
  marginTop: vars.gap.blockTight,
  maxWidth: 720,
  '@media': {
    '(max-width: 720px)': {
      gridTemplateColumns: '1fr',
    },
  },
});
