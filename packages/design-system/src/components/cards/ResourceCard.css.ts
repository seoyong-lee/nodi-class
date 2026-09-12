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
  transition: vars.motion.transitionUi,
  color: 'inherit',
  textDecoration: 'none',
  selectors: {
    '&:hover': {
      borderColor: vars.border.strong,
    },
  },
});

export const lockedThumb = style({
  opacity: 0.55,
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.gap.inline,
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
});

export const meta = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.gap.inlineTight,
  flexWrap: 'wrap',
});

export const locked = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: vars.size.caption,
  color: vars.text.muted,
});

export const open = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: vars.size.caption,
  fontWeight: vars.font.bold,
  color: vars.link.base,
});
