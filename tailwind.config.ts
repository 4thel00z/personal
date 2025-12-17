import colors from 'tailwindcss/colors';

export default {
  content: ['./app/**/*.{ts,tsx,mdx}', './src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        /*
          Semantic tokens (dynamic)
          These map to CSS variables set in `app/globals.css` via html[data-theme][data-mode].
          The Tailwind colors package provides safe fallbacks.
        */
        canvas: `var(--color-canvas, ${colors.zinc[950]})`,
        surface: `var(--color-surface, ${colors.zinc[900]})`,
        border: `var(--color-border, ${colors.zinc[800]})`,
        fg: `var(--color-fg, ${colors.zinc[50]})`,
        muted: `var(--color-muted, ${colors.zinc[400]})`,
        subtle: `var(--color-subtle, ${colors.zinc[600]})`,
        accent: `var(--color-accent, ${colors.teal[400]})`,
        accentHover: `var(--color-accentHover, ${colors.teal[300]})`,
      },
    },
  },
  plugins: [],
};
