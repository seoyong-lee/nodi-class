import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars';

export const root = style({
  background: vars.surface.raised,
  border: vars.border.hairline,
  borderRadius: vars.radius.base,
  padding: vars.space[5],
  display: 'flex',
  flexDirection: 'column',
  gap: vars.gap.blockTight,
  minWidth: 0,
  boxSizing: 'border-box',
  overflow: 'hidden',
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.gap.inline,
});

export const title = style({
  margin: 0,
  fontSize: vars.size.h3,
  fontWeight: vars.font.bold,
  lineHeight: vars.leading.tight,
  letterSpacing: vars.tracking.heading,
  color: vars.text.strong,
  wordBreak: 'keep-all',
});

export const description = style({
  margin: 0,
  maxWidth: vars.layout.measure,
  fontSize: vars.size.bodySm,
  lineHeight: vars.leading.body,
  color: vars.text.body,
  wordBreak: 'keep-all',
});

export const submitted = style({
  margin: 0,
  fontSize: vars.size.bodySm,
  color: vars.accent.base,
});

export const form = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.gap.inline,
  alignItems: 'flex-end',
  minWidth: 0,
  width: '100%',
});

export const fieldGrow = style({
  flex: '1 1 240px',
  minWidth: 0,
  width: '100%',
  '@media': {
    '(max-width: 480px)': {
      flex: '1 1 100%',
      width: '100%',
    },
  },
});

export const extra = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.gap.inlineTight,
  flex: '1 1 100%',
  minWidth: 0,
  '@media': {
    '(max-width: 480px)': {
      flex: '1 1 100%',
      width: '100%',
    },
  },
});

export const extraLabel = style({
  fontSize: vars.size.caption,
  color: vars.text.muted,
  letterSpacing: vars.tracking.body,
});

export const select = style({
  width: '100%',
  boxSizing: 'border-box',
  // Extra right padding so the native chevron is not flush with the edge.
  padding: '14px 40px 14px 16px',
  background: vars.surface.field,
  color: vars.text.strong,
  border: `1px solid ${vars.border.subtle}`,
  borderRadius: vars.radius.base,
  fontFamily: vars.font.sans,
  fontSize: vars.size.bodySm,
  lineHeight: 1.4,
  letterSpacing: vars.tracking.body,
  outline: 'none',
  transition: vars.motion.transitionUi,
  selectors: {
    '&:focus': {
      borderColor: vars.accent.base,
    },
  },
});

export const submit = style({
  flex: '0 0 auto',
  '@media': {
    '(max-width: 480px)': {
      flex: '1 1 100%',
      width: '100%',
    },
  },
});

globalStyle(`${submit} button, ${submit} a`, {
  '@media': {
    '(max-width: 480px)': {
      width: '100%',
    },
  },
});

export const consent = style({
  margin: 0,
  fontSize: vars.size.label,
  lineHeight: 1.7,
  color: vars.text.muted,
  maxWidth: vars.layout.measure,
  wordBreak: 'keep-all',
});
