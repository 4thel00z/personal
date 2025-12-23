<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./public/logo-inverted.svg" />
    <img alt="personal-site" src="./public/logo.svg" height="72" />
  </picture>
</p>

<p align="center">
  <img alt="Demo" src="./.github/demo.gif" width="900" />
</p>

<h1 align="center">personal-site</h1>

<p align="center">
  A tokenized, themeable <strong>Next.js (App Router)</strong> landing page template built with <strong>Tailwind CSS v4</strong>.
  Includes an <strong>MDX blog</strong>, <strong>changelog</strong>, and <strong>command palette search</strong>.
</p>

<p align="center">
  <a href="#quickstart">Quickstart</a> ·
  <a href="#whats-included">What's included</a> ·
  <a href="#theming">Theming</a> ·
  <a href="#customize-content">Customize content</a>
</p>

## Quickstart

```bash
bun install
bun dev
```

Open `http://localhost:3000`.

## What's included

- **Theme tokens**: semantic Tailwind tokens powered by CSS variables (`bg-canvas`, `text-fg`, `border-border`, …).
- **Theme + mode controls**: theme picker + dark/light/system toggle (persisted in `localStorage`).
- **Blog**: MDX posts, tags, RSS, and full-text search + command palette.
- **Personal home**: intro, latest posts, and projects.

## Theming

The whole UI is driven by semantic tokens. Theme selection is controlled at the root `<html>` element:

- **`data-theme`**: `default` | `indigo` | (optional DaisyUI-style aliases)
- **`data-mode`**: `dark` | `light` | `system`

### Configure via env vars (no code changes)

Defaults come from:

- `NEXT_PUBLIC_THEME`
- `NEXT_PUBLIC_MODE`

Example:

```bash
NEXT_PUBLIC_THEME=indigo NEXT_PUBLIC_MODE=light bun dev
```

If you pick a theme/mode in the UI, the persisted selection wins on the next load.

### Add a new theme

1. Add a new `html[data-theme='…']` block in `app/globals.css`.
2. Assign semantic tokens:
   - `--color-canvas`, `--color-surface`, `--color-border`
   - `--color-fg`, `--color-muted`, `--color-subtle`
   - `--color-accent`, `--color-accentHover`
3. Keep components using semantic tokens only — everything updates automatically.

<details>
  <summary>Theme names (DaisyUI aliases)</summary>

- `light`, `dark`, `cupcake`, `bumblebee`, `emerald`, `corporate`, `synthwave`, `retro`, `cyberpunk`, `valentine`, `halloween`,
  `garden`, `forest`, `aqua`, `lofi`, `pastel`, `fantasy`, `wireframe`, `black`, `luxury`, `dracula`, `cmyk`, `autumn`, `business`,
  `acid`, `lemonade`, `night`, `coffee`, `winter`, `dim`, `nord`, `sunset`

</details>

## Feature Flags

You can enable or disable specific features using environment variables.

| Variable | Description | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_FEATURE_BLOG` | Enable blog routes and links | `true` |
| `NEXT_PUBLIC_FEATURE_SEARCH` | Enable command palette search | `true` |
| `NEXT_PUBLIC_FEATURE_THEME_SWITCHER` | Enable theme/mode controls | `true` |
| `NEXT_PUBLIC_FEATURE_LANDING_*` | Enable landing page sections (e.g. `NEXT_PUBLIC_FEATURE_LANDING_PRICING`) | `true` |

Supported landing sections: `HERO`, `LOGO_CLOUD`, `FEATURES`, `HOW_IT_WORKS`, `TESTIMONIALS`, `PRICING`, `FAQ`, `CTA`.

## Customize content

Edit `src/config/personal.ts` to update:

- Navigation
- Features
- Steps
- Testimonials
- Pricing tiers
- FAQs

## Notes

- Tailwind base palette comes from `tailwindcss/colors` (see `tailwind.config.ts`).
- Theme overrides use Tailwind v4 color variables (`--color-*`) so alpha utilities like `bg-surface/40` keep working.


