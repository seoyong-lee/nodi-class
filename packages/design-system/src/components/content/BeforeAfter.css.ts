import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars';

export const root = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: vars.gap.blockTight,
  '@media': {
    '(max-width: 375px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const pane = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.gap.inline,
  minWidth: 0,
});

export const caption = style({
  fontSize: vars.size.label,
  letterSpacing: vars.tracking.label,
  textTransform: 'uppercase',
  color: vars.text.muted,
});

export const frame = style({
  background: vars.surface.card,
  border: vars.border.hairline,
  borderRadius: vars.radius.base,
  padding: vars.layout.cardPad,
  minHeight: 180,
  color: vars.text.body,
  fontSize: vars.size.bodySm,
  lineHeight: vars.leading.body,
});
