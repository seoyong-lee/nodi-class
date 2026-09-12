import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars';

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.gap.inlineTight,
  border: '1px solid transparent',
  borderRadius: vars.radius.base,
  fontFamily: vars.font.sans,
  fontWeight: vars.font.bold,
  lineHeight: 1.2,
  letterSpacing: vars.tracking.body,
  textDecoration: 'none',
  cursor: 'pointer',
  transition: vars.motion.transitionUi,
  boxSizing: 'border-box',
  selectors: {
    '&:disabled, &[aria-disabled="true"]': {
      cursor: 'not-allowed',
    },
  },
});

export const md = style({
  padding: '14px 22px',
  fontSize: vars.size.bodySm,
});

export const sm = style({
  padding: '9px 16px',
  fontSize: vars.size.caption,
});

export const disabled = style({
  cursor: 'not-allowed',
});

export const primary = style({
  background: vars.accent.base,
  color: vars.text.onAccent,
  selectors: {
    '&:hover:not(:disabled):not([aria-disabled="true"])': {
      background: vars.accent.hover,
      color: vars.text.strong,
    },
    '&:active:not(:disabled):not([aria-disabled="true"])': {
      background: vars.accent.press,
      color: vars.text.strong,
    },
    [`&${disabled}, &:disabled, &[aria-disabled='true']`]: {
      background: vars.surface.field,
      color: vars.text.disabled,
    },
  },
});

export const secondary = style({
  background: 'transparent',
  color: vars.text.strong,
  borderColor: vars.border.subtle,
  selectors: {
    '&:hover:not(:disabled):not([aria-disabled="true"])': {
      borderColor: vars.border.strong,
    },
    '&:active:not(:disabled):not([aria-disabled="true"])': {
      background: vars.surface.raised,
    },
    [`&${disabled}, &:disabled, &[aria-disabled='true']`]: {
      background: 'transparent',
      color: vars.text.disabled,
      borderColor: vars.border.subtle,
    },
  },
});

export const loading = style({
  opacity: 0.72,
  pointerEvents: 'none',
});
