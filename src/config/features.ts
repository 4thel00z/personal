interface Features {
  blog: boolean;
  search: boolean;
  searchProjects: boolean;
  themeSwitcher: boolean;
  blogBreadcrumbs: boolean;
  blogReadingTime: boolean;
  blogReadingProgress: boolean;
  projectsMdx: boolean;
  landing: {
    hero: boolean;
    logoCloud: boolean;
    features: boolean;
    howItWorks: boolean;
    testimonials: boolean;
    pricing: boolean;
    faq: boolean;
    cta: boolean;
  };
}

const getFeatureFlag = (
  value: string | undefined = undefined,
  defaultValue: boolean = true,
): boolean => {
  if (['true', '1', 'yes', 'y', 'on', 'enabled'].includes(value ?? '')) return true;
  if (['false', '0', 'no', 'n', 'off', 'disabled'].includes(value ?? '')) return false;
  return defaultValue;
};

export const features: Features = {
  blog: getFeatureFlag(process.env.NEXT_PUBLIC_FEATURE_BLOG, true),
  search: getFeatureFlag(process.env.NEXT_PUBLIC_FEATURE_SEARCH, true),
  searchProjects: getFeatureFlag(process.env.NEXT_PUBLIC_FEATURE_SEARCH_PROJECTS, true),
  themeSwitcher: getFeatureFlag(process.env.NEXT_PUBLIC_FEATURE_THEME_SWITCHER, true),
  blogBreadcrumbs: getFeatureFlag(process.env.NEXT_PUBLIC_FEATURE_BLOG_BREADCRUMBS, true),
  blogReadingTime: getFeatureFlag(process.env.NEXT_PUBLIC_FEATURE_BLOG_READING_TIME, true),
  blogReadingProgress: getFeatureFlag(process.env.NEXT_PUBLIC_FEATURE_BLOG_READING_PROGRESS, true),
  projectsMdx: getFeatureFlag(process.env.NEXT_PUBLIC_FEATURE_PROJECTS_MDX, true),
  landing: {
    hero: getFeatureFlag(process.env.NEXT_PUBLIC_FEATURE_LANDING_HERO, false),
    logoCloud: getFeatureFlag(process.env.NEXT_PUBLIC_FEATURE_LANDING_LOGO_CLOUD, false),
    features: getFeatureFlag(process.env.NEXT_PUBLIC_FEATURE_LANDING_FEATURES, false),
    howItWorks: getFeatureFlag(process.env.NEXT_PUBLIC_FEATURE_LANDING_HOW_IT_WORKS, false),
    testimonials: getFeatureFlag(process.env.NEXT_PUBLIC_FEATURE_LANDING_TESTIMONIALS, false),
    pricing: getFeatureFlag(process.env.NEXT_PUBLIC_FEATURE_LANDING_PRICING, false),
    faq: getFeatureFlag(process.env.NEXT_PUBLIC_FEATURE_LANDING_FAQ, false),
    cta: getFeatureFlag(process.env.NEXT_PUBLIC_FEATURE_LANDING_CTA, false),
  },
} as const;
