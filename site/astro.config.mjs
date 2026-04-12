import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import remarkWikiLink from './src/plugins/remark-wiki-link.mjs';
import remarkFilterLinks from './src/plugins/remark-filter-links.mjs';
import remarkObsidianEmbeds from './src/plugins/remark-obsidian-embeds.mjs';

export default defineConfig({
  site: 'https://msuleimanqureshi.com',
  output: 'static',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkFilterLinks, remarkWikiLink, remarkObsidianEmbeds],
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
