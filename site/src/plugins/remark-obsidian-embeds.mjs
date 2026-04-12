/**
 * Resolves Obsidian ![[file.png]] image embeds to /media/file.png.
 * These appear in the source as either:
 *   a) ![[file.png]] (uncommented) → rendered as an image
 *   b) <!-- ![[file.png]] --> (commented) → stays as raw HTML comment, ignored
 *
 * This plugin only needs to handle case (a) since HTML comments pass through
 * as raw HTML and are never rendered in the browser.
 */
import { visit } from 'unist-util-visit';

export default function remarkObsidianEmbeds() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      const re = /!\[\[([^\]]+)\]\]/g;
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
        const filename = match[1].trim();
        // Produce an image node pointing at /media/filename
        parts.push({
          type: 'image',
          url: `/media/${filename}`,
          alt: filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
          title: null,
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
