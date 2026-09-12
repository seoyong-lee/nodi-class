/**
 * Token aliases — values stay in packages/design-system/src/tokens/*.css.
 * Styles reference these so components never hardcode hex/rgb/shadow.
 */
export const vars = {
  surface: {
    page: 'var(--surface-page)',
    card: 'var(--surface-card)',
    raised: 'var(--surface-raised)',
    field: 'var(--surface-field)',
  },
  border: {
    subtle: 'var(--border-subtle)',
    strong: 'var(--border-strong)',
    hairline: 'var(--border-hairline)',
    hairlineStrong: 'var(--border-hairline-strong)',
  },
  text: {
    strong: 'var(--text-strong)',
    body: 'var(--text-body)',
    muted: 'var(--text-muted)',
    disabled: 'var(--text-disabled)',
    onAccent: 'var(--text-on-accent)',
  },
  accent: {
    base: 'var(--accent)',
    hover: 'var(--accent-hover)',
    press: 'var(--accent-press)',
    quiet: 'var(--accent-quiet)',
  },
  link: {
    base: 'var(--link)',
    hover: 'var(--link-hover)',
  },
  focus: 'var(--focus-ring)',
  font: {
    sans: 'var(--font-sans)',
    regular: 'var(--weight-regular)',
    bold: 'var(--weight-bold)',
  },
  size: {
    hero: 'var(--size-hero)',
    heroMobile: 'var(--size-hero-mobile)',
    h2: 'var(--size-h2)',
    h3: 'var(--size-h3)',
    body: 'var(--size-body)',
    bodySm: 'var(--size-body-sm)',
    caption: 'var(--size-caption)',
    label: 'var(--size-label)',
  },
  leading: {
    hero: 'var(--leading-hero)',
    heading: 'var(--leading-heading)',
    body: 'var(--leading-body)',
    tight: 'var(--leading-tight)',
  },
  tracking: {
    hero: 'var(--tracking-hero)',
    heading: 'var(--tracking-heading)',
    body: 'var(--tracking-body)',
    label: 'var(--tracking-label)',
  },
  space: {
    1: 'var(--space-1)',
    2: 'var(--space-2)',
    3: 'var(--space-3)',
    4: 'var(--space-4)',
    5: 'var(--space-5)',
    6: 'var(--space-6)',
    8: 'var(--space-8)',
    10: 'var(--space-10)',
    15: 'var(--space-15)',
  },
  gap: {
    section: 'var(--gap-section)',
    block: 'var(--gap-block)',
    blockTight: 'var(--gap-block-tight)',
    inline: 'var(--gap-inline)',
    inlineTight: 'var(--gap-inline-tight)',
  },
  layout: {
    pageMax: 'var(--page-max)',
    pageGutter: 'var(--page-gutter)',
    cardPad: 'var(--card-pad)',
    measure: 'var(--measure)',
  },
  radius: {
    base: 'var(--radius)',
    badge: 'var(--radius-badge)',
  },
  motion: {
    transitionUi: 'var(--transition-ui)',
    dur: 'var(--dur)',
    ease: 'var(--ease)',
  },
} as const;
