# Adding Media to the Site

All media lives in `public/media/`. The site renders gracefully without any files there —
cards show a placeholder icon, and Media sections are empty until you add files.

## Steps to add an image or video

1. **Drop the file** into `public/media/`:
   ```
   site/public/media/your-image.png
   ```

2. **Uncomment** the embed in the relevant markdown file:
   ```md
   <!-- Before (not shown on site): -->
   <!-- ![[your-image.png]] -->

   <!-- After (shows on site): -->
   ![[your-image.png]]
   ```

3. **Optionally set a card cover** by adding `cover:` to the frontmatter.
   The value is just the filename (no path):
   ```yaml
   ---
   title: "Your Paper Title"
   cover: your-image.png
   ---
   ```
   This makes the card on the list page show your image instead of the placeholder icon.

## Supported file types

- Images: `.png`, `.jpg`, `.webp`, `.gif`, `.svg`
- Video: drop a `.mp4` into `public/media/` and add a plain HTML `<video>` tag in your markdown

## Partner logos

The logos in the root (`logo-habib-university.png`, etc.) are already copied if you reference them.
To use them: copy them to `public/media/` and uncomment the logo lines in the collaborators section.

## Rebuilding after adding media

```bash
cd site
npm run dev    # hot-reload for local preview
npm run build  # production build for Vercel
```
