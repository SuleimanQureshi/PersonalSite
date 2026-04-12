/**
 * Removes list items that are placeholder links.
 * Matches: - [ ] Some text — [Label](url)  where href is literal "url" or "XXXX"
 * Also strips shield.io status badge images (rendered from markdown as <img>).
 */
import { visit, SKIP } from 'unist-util-visit';

function isPlaceholderUrl(url) {
  if (!url) return false;
  return url === 'url' || /XXXX/.test(url) || url === '#';
}

function isBadgeImage(node) {
  // img with src from shields.io
  return (
    node.type === 'image' &&
    typeof node.url === 'string' &&
    node.url.includes('shields.io')
  );
}

export default function remarkFilterLinks() {
  return (tree) => {
    // Remove placeholder list items
    visit(tree, 'listItem', (node, index, parent) => {
      let hasPlaceholder = false;
      visit(node, 'link', (linkNode) => {
        if (isPlaceholderUrl(linkNode.url)) {
          hasPlaceholder = true;
        }
      });
      if (hasPlaceholder && parent && index != null) {
        parent.children.splice(index, 1);
        return [SKIP, index];
      }
    });

    // Remove shields.io badge images
    visit(tree, 'paragraph', (node, index, parent) => {
      const onlyBadges = node.children.every(
        (c) => isBadgeImage(c) || (c.type === 'text' && c.value.trim() === '')
      );
      if (onlyBadges && parent && index != null) {
        parent.children.splice(index, 1);
        return [SKIP, index];
      }
    });
  };
}
