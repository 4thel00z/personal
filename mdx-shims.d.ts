declare module 'mdx-annotations' {
  export const mdxAnnotations: {
    remark: any;
    rehype: any;
    recma: any;
  };
}

declare module 'remark-rehype-wrap' {
  export const remarkRehypeWrap: any;
}

declare module '@/mdx/siteSearch.mjs' {
  export function search(
    query: string,
    options?: Record<string, unknown>,
  ): Array<{
    url: string;
    title: string;
    pageTitle?: string;
    kind?: 'blog';
    baseUrl?: string;
  }>;
}

declare module 'rehype-unwrap-images' {
  const plugin: any;
  export default plugin;
}
