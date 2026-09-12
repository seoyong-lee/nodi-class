/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    '../../packages/design-system/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        page: 'var(--surface-page)',
        card: 'var(--surface-card)',
        raised: 'var(--surface-raised)',
        field: 'var(--surface-field)',
        strong: 'var(--text-strong)',
        body: 'var(--text-body)',
        muted: 'var(--text-muted)',
        disabled: 'var(--text-disabled)',
        'on-accent': 'var(--text-on-accent)',
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          press: 'var(--accent-press)',
          quiet: 'var(--accent-quiet)',
        },
        link: {
          DEFAULT: 'var(--link)',
          hover: 'var(--link-hover)',
        },
        line: {
          DEFAULT: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
        },
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        hero: 'var(--font-hero)',
      },
      fontSize: {
        hero: ['var(--size-hero)', { lineHeight: 'var(--leading-hero)', letterSpacing: 'var(--tracking-hero)' }],
        'hero-m': ['var(--size-hero-mobile)', { lineHeight: 'var(--leading-hero-mobile)', letterSpacing: 'var(--tracking-hero)' }],
        h2: ['var(--size-h2)', { lineHeight: 'var(--leading-heading)', letterSpacing: 'var(--tracking-heading)' }],
        h3: ['var(--size-h3)', { lineHeight: 'var(--leading-tight)', letterSpacing: 'var(--tracking-heading)' }],
        body: ['var(--size-body)', { lineHeight: 'var(--leading-body)', letterSpacing: 'var(--tracking-body)' }],
        'body-sm': ['var(--size-body-sm)', { lineHeight: 'var(--leading-body)', letterSpacing: 'var(--tracking-body)' }],
        caption: ['var(--size-caption)', { lineHeight: '1.6', letterSpacing: 'var(--tracking-body)' }],
        label: ['var(--size-label)', { lineHeight: '1.4', letterSpacing: 'var(--tracking-body)' }],
      },
      fontWeight: {
        regular: 'var(--weight-regular)',
        bold: 'var(--weight-bold)',
      },
      spacing: {
        // Keep default Tailwind numeric scale (1=4px…). Remapping broke
        // p-3/w-8 etc. Use semantic tokens for brand gaps.
        section: 'var(--gap-section)',
        block: 'var(--gap-block)',
        'block-tight': 'var(--gap-block-tight)',
        inline: 'var(--gap-inline)',
        'inline-tight': 'var(--gap-inline-tight)',
        gutter: 'var(--page-gutter)',
        'card-pad': 'var(--card-pad)',
      },
      maxWidth: {
        page: 'var(--page-max)',
        measure: 'var(--measure)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        badge: 'var(--radius-badge)',
      },
      transitionTimingFunction: {
        ui: 'var(--ease)',
      },
      transitionDuration: {
        ui: 'var(--dur)',
      },
    },
  },
  corePlugins: {
    // Brand forbids elevation shadows.
    boxShadow: false,
  },
  plugins: [],
};
