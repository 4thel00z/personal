import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';
import glob from 'fast-glob';
import GithubSlugger from 'github-slugger';
import { toString as mdastToString } from 'mdast-util-to-string';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import { createLoader } from 'simple-functional-loader';
import { filter } from 'unist-util-filter';
import { SKIP, visit } from 'unist-util-visit';

const filename = url.fileURLToPath(import.meta.url);
const processor = remark().use(remarkMdx).use(extractSections);

function isObjectExpression(node) {
  return (
    node.type === 'mdxTextExpression' &&
    node.data?.estree?.body?.[0]?.expression?.type === 'ObjectExpression'
  );
}

function excludeObjectExpressions(tree) {
  return filter(tree, (node) => !isObjectExpression(node));
}

function extractSections() {
  return (tree, { sections }) => {
    const slugger = new GithubSlugger();

    visit(tree, (node) => {
      if (node.type === 'heading' || node.type === 'paragraph') {
        const content = mdastToString(excludeObjectExpressions(node));

        if (node.type === 'heading' && node.depth <= 2) {
          const hash = node.depth === 1 ? null : slugger.slug(content);
          sections.push([content, hash, []]);
        } else if (content) {
          sections.at(-1)?.[2].push(content);
        }

        return SKIP;
      }
    });
  };
}

function extractMetaTitle(mdx) {
  // Best-effort extraction from: export const meta = { title: '...' }
  const match = mdx.match(/\\btitle\\s*:\\s*['"`]([^'"`]+)['"`]/);
  return match ? match[1] : null;
}

function buildBlogData(postsDir, cache) {
  const files = glob.sync('**/*.mdx', { cwd: postsDir });

  return files.map((file) => {
    const slug = file.replace(/\.mdx$/i, '');
    const pageUrl = `/blog/${slug}`;
    const mdx = fs.readFileSync(path.join(postsDir, file), 'utf8');

    let sections = [];
    if (cache.get(`blog:${file}`)?.[0] === mdx) {
      sections = cache.get(`blog:${file}`)[1];
    } else {
      const vfile = { value: mdx, sections };
      processor.runSync(processor.parse(vfile), vfile);
      cache.set(`blog:${file}`, [mdx, sections]);
    }

    const pageTitle = extractMetaTitle(mdx) ?? sections[0]?.[0] ?? slug;

    return {
      kind: 'blog',
      pageTitle,
      url: pageUrl,
      sections,
    };
  });
}

function isEnabled(value, defaultValue = true) {
  if (['true', '1', 'yes', 'y', 'on', 'enabled'].includes(value ?? '')) return true;
  if (['false', '0', 'no', 'n', 'off', 'disabled'].includes(value ?? '')) return false;
  return defaultValue;
}

function buildProjectsData(projectsDir, cache) {
  const files = glob.sync('**/*.mdx', { cwd: projectsDir });

  return files.map((file) => {
    const slug = file.replace(/\.mdx$/i, '');
    const pageUrl = `/projects/${slug}`;
    const mdx = fs.readFileSync(path.join(projectsDir, file), 'utf8');

    let sections = [];
    if (cache.get(`projects:${file}`)?.[0] === mdx) {
      sections = cache.get(`projects:${file}`)[1];
    } else {
      const vfile = { value: mdx, sections };
      processor.runSync(processor.parse(vfile), vfile);
      cache.set(`projects:${file}`, [mdx, sections]);
    }

    const pageTitle = extractMetaTitle(mdx) ?? sections[0]?.[0] ?? slug;

    return {
      kind: 'project',
      pageTitle,
      url: pageUrl,
      sections,
    };
  });
}

function buildChangelogData(entriesDir, cache) {
  const files = glob.sync('**/*.mdx', { cwd: entriesDir });

  return files.flatMap((file) => {
    const mdx = fs.readFileSync(path.join(entriesDir, file), 'utf8');

    const blocks = mdx
      .split(/\\n---\\n/g)
      .map((b) => b.trim())
      .filter(Boolean);

    return blocks.map((block, index) => {
      let sections = [];
      const cacheKey = `changelog:${file}:${index}`;

      if (cache.get(cacheKey)?.[0] === block) {
        sections = cache.get(cacheKey)[1];
      } else {
        const vfile = { value: block, sections };
        processor.runSync(processor.parse(vfile), vfile);
        cache.set(cacheKey, [block, sections]);
      }

      const title = sections[0]?.[0] ?? 'Changelog';
      const slugger = new GithubSlugger();
      const entryId = slugger.slug(title);

      return {
        kind: 'changelog',
        pageTitle: title,
        url: `/changelog#${entryId}`,
        sections,
      };
    });
  });
}

export default function SiteSearch(nextConfig = {}) {
  const cache = new Map();

  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      config.module.rules.push({
        test: filename,
        use: [
          createLoader(function () {
            const postsDir = path.resolve('./app/blog/posts');
            const entriesDir = path.resolve('./app/changelog/entries');
            const projectsDir = path.resolve('./app/projects/projects');
            this.addContextDependency(postsDir);
            this.addContextDependency(entriesDir);
            this.addContextDependency(projectsDir);

            const blog = buildBlogData(postsDir, cache);
            const changelog = buildChangelogData(entriesDir, cache);
            const includeProjects = isEnabled(
              process.env.NEXT_PUBLIC_FEATURE_SEARCH_PROJECTS,
              true,
            );
            const projects = includeProjects ? buildProjectsData(projectsDir, cache) : [];
            const data = [...blog, ...projects, ...changelog];

            return `
              import FlexSearch from 'flexsearch'

              let sectionIndex = new FlexSearch.Document({
                tokenize: 'full',
                document: {
                  id: 'url',
                  index: 'content',
                  store: ['title', 'pageTitle', 'kind', 'baseUrl'],
                },
                context: {
                  resolution: 9,
                  depth: 2,
                  bidirectional: true
                }
              })

              let data = ${JSON.stringify(data)}

              for (let { url, sections, kind, pageTitle } of data) {
                for (let [title, hash, content] of sections) {
                  let baseUrl = url
                  let finalUrl = url

                  if (kind === 'blog' || kind === 'project') {
                    baseUrl = url.replace(/\\.mdx(?=$|#)/, '')
                    finalUrl = baseUrl + (hash ? ('#' + hash) : '')
                  }

                  // For changelog we keep url as the entry anchor, but still index the section title/content.
                  sectionIndex.add({
                    url: finalUrl,
                    title,
                    content: [title, ...content].join('\\n'),
                    pageTitle,
                    kind,
                    baseUrl,
                  })
                }
              }

              export function search(query, options = {}) {
                let result = sectionIndex.search(query, {
                  ...options,
                  enrich: true,
                })
                if (result.length === 0) {
                  return []
                }
                return result[0].result.map((item) => ({
                  url: item.id,
                  title: item.doc.title,
                  pageTitle: item.doc.pageTitle,
                  kind: item.doc.kind,
                  baseUrl: item.doc.baseUrl,
                }))
              }
            `;
          }),
        ],
      });

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
}
