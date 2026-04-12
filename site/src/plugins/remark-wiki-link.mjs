/**
 * Converts Obsidian wikilinks [[slug]] and [[slug|Title]] to HTML anchor tags.
 * Looks at the slug prefix to decide route: paper-* → /research/, project-* → /projects/
 */
import { visit } from 'unist-util-visit';

function slugToRoute(slug) {
  if (slug.startsWith('paper-')) return `/research/${slug}`;
  if (slug.startsWith('project-')) return `/projects/${slug}`;
  return `/${slug}`;
}

export default function remarkWikiLink() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      const re = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
      const value = node.value;
      if (!re.test(value)) return;

      re.lastIndex = 0;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = re.exec(value)) !== null) {
        if (match.index > lastIndex) {
          parts.push({ type: 'text', value: value.slice(lastIndex, match.index) });
        }
        const slug = match[1].trim();
        const label = match[2]?.trim() || slug;
        parts.push({
          type: 'link',
          url: slugToRoute(slug),
          children: [{ type: 'text', value: label }],
        });
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < value.length) {
        parts.push({ type: 'text', value: value.slice(lastIndex) });
      }

      if (parts.length > 0 && parent && index != null) {
        parent.children.splice(index, 1, ...parts);
      }
    });
  };
}
