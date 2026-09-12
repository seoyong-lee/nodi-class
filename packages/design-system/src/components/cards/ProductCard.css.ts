import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.gap.blockTight,
  background: vars.surface.card,
  border: vars.border.hairline,
  borderRadius: vars.radius.base,
  padding: vars.layout.cardPad,
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.gap.inlineTight,
});

export const label = style({
  fontSize: vars.size.label,
  letterSpacing: vars.tracking.label,
  textTransform: 'uppercase',
  color: vars.text.muted,
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

export const summary = style({
  margin: 0,
  fontSize: vars.size.bodySm,
  lineHeight: vars.leading.body,
  color: vars.text.body,
  wordBreak: 'keep-all',
});

export const rows = style({
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  borderTop: vars.border.hairline,
});

export const row = style({
  display: 'grid',
  gridTemplateColumns: '84px 1fr',
  gap: vars.gap.inline,
  padding: '12px 0',
  borderBottom: vars.border.hairline,
});

export const dt = style({
  fontSize: vars.size.caption,
  color: vars.text.muted,
});

export const dd = style({
  margin: 0,
  fontSize: vars.size.caption,
  lineHeight: 1.6,
  color: vars.text.strong,
  wordBreak: 'keep-all',
});

export const cta = style({
  width: '100%',
});

globalStyle(`${cta} > *`, {
  width: '100%',
});
