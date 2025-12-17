import { toString as mdastToString } from 'mdast-util-to-string';
import { mdxAnnotations } from 'mdx-annotations';
import rehypeSlug from 'rehype-slug';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import { remarkRehypeWrap } from 'remark-rehype-wrap';

export const rehypePlugins = [
  mdxAnnotations.rehype,
  rehypeSlug,
  rehypeUnwrapImages,
  [
    remarkRehypeWrap,
    {
      node: { type: 'element', tagName: 'article' },
      start: 'element[tagName=hr]',
      transform: (article: any) => {
        article.children.splice(0, 1);

        const heading = article.children.find((node: any) => node.tagName === 'h2');
        article.properties = {
          ...heading?.properties,
          title: heading ? mdastToString(heading) : undefined,
        };

        if (heading) {
          heading.properties = {};
        }

        return article;
      },
    },
  ],
];
