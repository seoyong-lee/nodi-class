import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars';

export const root = style({
  borderTop: vars.border.hairline,
  padding: `${vars.space[6]} 0 ${vars.space[8]}`,
});

export const inner = style({
  maxWidth: vars.layout.pageMax,
  margin: '0 auto',
  padding: `0 ${vars.layout.pageGutter}`,
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.gap.block,
  justifyContent: 'space-between',
});

export const businessBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.gap.inline,
  minWidth: 0,
});

export const operator = style({
  fontSize: vars.size.bodySm,
  fontWeight: vars.font.bold,
  color: vars.text.strong,
  letterSpacing: vars.tracking.heading,
});

export const businessList = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const businessItem = style({
  fontSize: vars.size.label,
  lineHeight: 1.8,
  color: vars.text.muted,
});

export const aside = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.gap.blockTight,
  alignItems: 'flex-start',
});

export const links = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  gap: vars.gap.blockTight,
  flexWrap: 'wrap',
});

export const link = style({
  fontSize: vars.size.caption,
  color: vars.text.body,
});

export const social = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  gap: vars.gap.inline,
  flexWrap: 'wrap',
});

export const socialLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: vars.size.caption,
  color: vars.text.body,
});

export const copy = style({
  fontSize: vars.size.label,
  color: vars.text.disabled,
});
