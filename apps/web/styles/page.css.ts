import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@nodi/design-system/styles/vars';

export const shell = style({
  minHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
});

export const main = style({
  flex: '1 1 auto',
});

export const section = style({
  maxWidth: vars.layout.pageMax,
  margin: '0 auto',
  padding: `${vars.gap.section} ${vars.layout.pageGutter} 0`,
  wordBreak: 'keep-all',
});

export const sectionLast = style([
  section,
  {
    paddingBottom: vars.gap.section,
  },
]);

export const heroCenter = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space[3],
  textAlign: 'center',
});

export const heroLeft = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  maxWidth: '40em',
});

export const eyebrow = style({
  fontSize: vars.size.label,
  color: vars.text.muted,
});

export const heroTitle = style({
  margin: 0,
  fontFamily: vars.font.sans,
  fontSize: vars.size.hero,
  fontWeight: vars.font.bold,
  lineHeight: vars.leading.hero,
  letterSpacing: vars.tracking.hero,
  color: vars.text.strong,
  '@media': {
    '(max-width: 720px)': {
      fontSize: vars.size.heroMobile,
    },
  },
});

export const lead = style({
  margin: 0,
  maxWidth: vars.layout.measure,
  color: vars.text.body,
});

export const ctaRow = style({
  display: 'flex',
  gap: vars.gap.inline,
  justifyContent: 'center',
  marginTop: vars.gap.inlineTight,
  flexWrap: 'wrap',
  '@media': {
    '(max-width: 720px)': {
      flexDirection: 'column',
      width: '100%',
    },
  },
});

globalStyle(`${ctaRow} a, ${ctaRow} button`, {
  '@media': {
    '(max-width: 720px)': {
      width: '100%',
    },
  },
});

export const ctaRowLeft = style([
  ctaRow,
  {
    justifyContent: 'flex-start',
  },
]);

export const grid4 = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: vars.space[3],
  marginTop: vars.gap.block,
  '@media': {
    '(max-width: 960px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '(max-width: 720px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const grid3 = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: vars.space[3],
  marginTop: vars.gap.block,
  '@media': {
    '(max-width: 960px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const grid2 = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: vars.space[3],
  marginTop: vars.gap.block,
  maxWidth: 720,
  '@media': {
    '(max-width: 720px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const gateBlock = style({
  marginTop: vars.gap.block,
  maxWidth: 640,
});

export const gateCenter = style([
  gateBlock,
  {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
]);

export const sectionSpacer = style({
  height: vars.gap.blockTight,
});

export const sectionNote = style({
  margin: `${vars.space[3]} 0 0`,
  maxWidth: vars.layout.measure,
  fontSize: vars.size.bodySm,
  color: vars.text.muted,
});

export const operator = style({
  display: 'flex',
  gap: vars.space[5],
  alignItems: 'flex-start',
  marginTop: vars.gap.blockTight,
  '@media': {
    '(max-width: 960px)': {
      flexDirection: 'column',
    },
  },
});

export const profileFrame = style({
  flex: 'none',
  width: 280,
  aspectRatio: '1 / 1',
  borderRadius: vars.radius.base,
  overflow: 'hidden',
  background: vars.surface.raised,
  border: vars.border.hairline,
  position: 'relative',
  // Clip the next/image fill layer to the rounded frame.
  isolation: 'isolate',
  '@media': {
    '(max-width: 960px)': {
      width: 'min(280px, 100%)',
    },
  },
});

export const profileImage = style({
  objectFit: 'cover',
  objectPosition: 'center',
  borderRadius: vars.radius.base,
});

export const operatorCopy = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  paddingTop: vars.gap.inlineTight,
});

export const operatorList = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

export const operatorLead = style({
  fontSize: vars.size.h3,
  fontWeight: vars.font.bold,
  lineHeight: vars.leading.tight,
  letterSpacing: vars.tracking.heading,
  color: vars.text.strong,
});

export const operatorItem = style({
  fontSize: vars.size.body,
  color: vars.text.body,
});

export const operatorMeta = style({
  fontSize: vars.size.label,
  color: vars.text.muted,
});

export const finalCta = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.gap.block,
});

export const finalTitle = style({
  margin: 0,
  fontSize: vars.size.h2,
  fontWeight: vars.font.bold,
  lineHeight: vars.leading.heading,
  letterSpacing: vars.tracking.heading,
  color: vars.text.strong,
  textAlign: 'center',
});

export const baImage = style({
  width: '100%',
  height: 'auto',
  display: 'block',
  borderRadius: vars.radius.base,
});

export const sectionLabel = style({
  fontSize: vars.size.label,
  letterSpacing: vars.tracking.label,
  color: vars.text.muted,
});

export const cardGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: vars.space[3],
  marginTop: vars.gap.blockTight,
  '@media': {
    '(max-width: 960px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '(max-width: 720px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  background: vars.surface.card,
  border: vars.border.hairline,
  borderRadius: vars.radius.base,
  padding: vars.layout.cardPad,
});

export const cardTitle = style({
  margin: 0,
  fontSize: vars.size.h3,
  fontWeight: vars.font.bold,
  lineHeight: vars.leading.tight,
  letterSpacing: vars.tracking.heading,
  color: vars.text.strong,
});

export const cardBody = style({
  margin: 0,
  fontSize: vars.size.bodySm,
  color: vars.text.body,
});

export const listPlain = style({
  listStyle: 'none',
  margin: `${vars.gap.blockTight} 0 0`,
  padding: 0,
  maxWidth: 720,
  borderTop: vars.border.hairline,
});

export const listPlainItem = style({
  padding: `${vars.space[2]} 0`,
  borderBottom: vars.border.hairline,
  color: vars.text.strong,
});

export const priceLine = style({
  margin: `${vars.gap.blockTight} 0 0`,
  maxWidth: vars.layout.measure,
  fontSize: vars.size.h3,
  lineHeight: vars.leading.tight,
  letterSpacing: vars.tracking.heading,
  color: vars.text.strong,
});

export const checkList = style({
  listStyle: 'none',
  margin: `${vars.gap.blockTight} 0 0`,
  padding: 0,
  maxWidth: 720,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
});

export const checkItem = style({
  display: 'flex',
  gap: 12,
  alignItems: 'flex-start',
  color: vars.text.strong,
});

export const checkIcon = style({
  flex: 'none',
  display: 'inline-flex',
  paddingTop: 5,
  color: vars.text.muted,
});

export const mutedList = style({
  listStyle: 'none',
  margin: `${vars.gap.blockTight} 0 0`,
  padding: 0,
  maxWidth: 720,
  borderTop: vars.border.hairline,
});

export const mutedItem = style({
  padding: `${vars.space[2]} 0`,
  borderBottom: vars.border.hairline,
  color: vars.text.muted,
});

export const steps = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space[2],
  marginTop: vars.gap.blockTight,
  flexWrap: 'wrap',
  '@media': {
    '(max-width: 720px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
});

export const step = style({
  flex: '1 1 0',
  minWidth: 140,
  background: vars.surface.card,
  border: vars.border.hairline,
  borderRadius: vars.radius.base,
  padding: vars.layout.cardPad,
  minHeight: 96,
  display: 'flex',
  alignItems: 'center',
  fontSize: vars.size.h3,
  fontWeight: vars.font.bold,
  lineHeight: vars.leading.tight,
  letterSpacing: vars.tracking.heading,
  color: vars.text.strong,
});

export const stepArrow = style({
  flex: 'none',
  color: vars.text.muted,
  '@media': {
    '(max-width: 720px)': {
      transform: 'rotate(90deg)',
      alignSelf: 'center',
    },
  },
});

export const legalTitle = style({
  margin: `0 0 ${vars.space[3]}`,
  fontSize: vars.size.h2,
  fontWeight: vars.font.bold,
  color: vars.text.strong,
  letterSpacing: vars.tracking.heading,
  lineHeight: vars.leading.heading,
});

export const legalBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[3],
  maxWidth: vars.layout.measure,
});

globalStyle(`${legalBody} h2`, {
  margin: 0,
  fontSize: vars.size.h3,
  color: vars.text.strong,
});

globalStyle(`${legalBody} p, ${legalBody} li`, {
  margin: 0,
  color: vars.text.body,
});

globalStyle(`${legalBody} ul`, {
  margin: 0,
  paddingLeft: '1.25em',
});

export const notFound = style({
  padding: `${vars.gap.section} ${vars.layout.pageGutter}`,
  color: vars.text.body,
});
