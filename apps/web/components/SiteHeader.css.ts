import { style } from '@vanilla-extract/css';
import { vars } from '@nodi/design-system/styles/vars';

export const root = style({
  position: 'sticky',
  top: 0,
  zIndex: 20,
  background: `color-mix(in srgb, ${vars.surface.page} 92%, transparent)`,
  borderBottom: vars.border.hairline,
});

export const inner = style({
  maxWidth: vars.layout.pageMax,
  margin: '0 auto',
  padding: `0 ${vars.layout.pageGutter}`,
  minHeight: 64,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space[3],
  '@media': {
    '(max-width: 720px)': {
      minHeight: 56,
      flexWrap: 'wrap',
      paddingTop: vars.space[2],
      paddingBottom: vars.space[2],
    },
  },
});

export const wordmark = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: 6,
  textDecoration: 'none',
  wordBreak: 'keep-all',
  whiteSpace: 'nowrap',
  selectors: {
    '&:hover': {
      color: 'inherit',
    },
  },
});

export const wordmarkStrong = style({
  fontSize: 19,
  fontWeight: vars.font.bold,
  letterSpacing: '-0.03em',
  color: vars.text.strong,
});

export const wordmarkSoft = style({
  fontSize: 19,
  fontWeight: vars.font.regular,
  letterSpacing: '-0.03em',
  color: vars.text.body,
});

export const nav = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[3],
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  '@media': {
    '(max-width: 720px)': {
      width: '100%',
      gap: 20,
      justifyContent: 'flex-start',
    },
  },
});

export const link = style({
  fontSize: vars.size.bodySm,
  textDecoration: 'none',
  wordBreak: 'keep-all',
  color: vars.text.body,
  selectors: {
    '&:hover': {
      color: vars.text.strong,
    },
  },
});

export const linkCurrent = style({
  fontSize: vars.size.bodySm,
  textDecoration: 'none',
  wordBreak: 'keep-all',
  color: vars.accent.base,
  selectors: {
    '&:hover': {
      color: vars.accent.hover,
    },
  },
});
