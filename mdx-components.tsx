import type { MDXComponents } from 'mdx/types';

import * as mdxComponents from '@/src/components/mdx';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...mdxComponents,
  };
}
