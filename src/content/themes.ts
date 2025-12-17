export const customThemes = ['default', 'indigo'] as const;

export const daisyUiThemes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
  'dim',
  'nord',
  'sunset',
] as const;

export const themes = [...customThemes, ...daisyUiThemes] as const;
export type ThemeName = (typeof themes)[number];

export const modes = ['system', 'dark', 'light'] as const;
export type ThemeMode = (typeof modes)[number];
