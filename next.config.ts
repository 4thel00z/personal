import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import { recmaPlugins } from './mdx/recma';
import { rehypePlugins } from './mdx/rehype';
import { remarkPlugins } from './mdx/remark';
import SiteSearch from './mdx/siteSearch.mjs';

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins,
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
};

export default SiteSearch(withMDX(nextConfig));
