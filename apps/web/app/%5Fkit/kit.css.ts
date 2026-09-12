import { style } from '@vanilla-extract/css';
import { vars } from '@nodi/design-system/styles/vars';

export const page = style({
  maxWidth: vars.layout.pageMax,
  margin: '0 auto',
  padding: `${vars.space[5]} ${vars.layout.pageGutter} ${vars.space[10]}`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.gap.section,
});

export const heading = style({
  margin: 0,
  fontSize: vars.size.h2,
  fontWeight: vars.font.bold,
  color: vars.text.strong,
  letterSpacing: vars.tracking.heading,
});

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.gap.blockTight,
});

export const sectionTitle = style({
  margin: 0,
  fontSize: vars.size.h3,
  fontWeight: vars.font.bold,
  color: vars.text.strong,
});

export const row = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.gap.inline,
  alignItems: 'center',
});

export const stack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.gap.blockTight,
  maxWidth: 480,
});

export const grid3 = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: vars.gap.blockTight,
  '@media': {
    '(max-width: 800px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const grid2 = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: vars.gap.blockTight,
  '@media': {
    '(max-width: 800px)': {
      gridTemplateColumns: '1fr',
    },
  },
});
