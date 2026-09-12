import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.gap.inline,
  background: vars.surface.card,
  border: `1px solid ${vars.border.subtle}`,
  borderRadius: vars.radius.base,
  padding: '12px 12px 20px',
  color: 'inherit',
  transition: vars.motion.transitionUi,
  selectors: {
    '&:hover': {
      borderColor: vars.border.strong,
    },
  },
});

export const play = style({
  position: 'absolute',
  left: 12,
  bottom: 12,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  border: 'none',
  borderRadius: vars.radius.badge,
  background: `color-mix(in srgb, ${vars.text.onAccent} 72%, transparent)`,
  color: vars.text.strong,
  cursor: 'pointer',
  padding: 0,
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: `0 ${vars.space[1]}`,
});

export const title = style({
  margin: 0,
  fontSize: vars.size.body,
  fontWeight: vars.font.bold,
  lineHeight: vars.leading.tight,
  letterSpacing: vars.tracking.heading,
  color: vars.text.strong,
  wordBreak: 'keep-all',
  transition: vars.motion.transitionUi,
  selectors: {
    [`${root}:hover &`]: {
      color: vars.link.base,
    },
  },
});

export const note = style({
  fontSize: vars.size.caption,
  color: vars.text.muted,
});

export const iframe = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  border: 0,
});

export const trigger = style({
  display: 'contents',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: 0,
  color: 'inherit',
  font: 'inherit',
  textAlign: 'left',
});
