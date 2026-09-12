import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.gap.inlineTight,
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
});

export const label = style({
  fontSize: vars.size.caption,
  color: vars.text.muted,
  letterSpacing: vars.tracking.body,
});

export const field = style({
  width: '100%',
  boxSizing: 'border-box',
  padding: '14px 16px',
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
  resize: 'vertical',
  selectors: {
    '&:focus': {
      borderColor: vars.accent.base,
    },
  },
});

export const fieldError = style({
  borderColor: vars.border.strong,
});

export const error = style({
  fontSize: vars.size.label,
  color: vars.text.muted,
  lineHeight: 1.6,
});
