import { style } from '@vanilla-extract/css';

export const honeypot = style({
  position: 'absolute',
  opacity: 0,
  left: 0,
  top: 0,
  height: 1,
  width: 1,
  overflow: 'hidden',
  pointerEvents: 'none',
});
