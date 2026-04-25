# Handoff: Portfolio V2 → V2+ Interactive Upgrade

## Overview

This is an **incremental upgrade** to the already-shipped V2 "Control Room" portfolio design. The visual system (dark dashboard, mono-forward type, sharp 0-radius panels, oklch palette) is unchanged. This handoff adds **six interactive features** layered onto that base:

1. **Command palette** (with light-mode support)
2. **Keyboard shortcuts** + discoverable HUD
3. **Scrubbable sparklines** with hover readouts
4. **Expandable research rows** (abstract + BibTeX)
5. **Live status strip** (uptime, scroll %, last-keystroke)
6. **Theme switcher** (dark / crt / light)

Out of scope: anything not in the list above. Do not touch the hero typography, stats ribbon, flagship schematic interactivity, or footer beyond what these features require.

---

## About the Design Files

The files in this bundle are **design references created in HTML/React-via-Babel-Standalone** — a working prototype of the intended look and behavior. They are **not production code**.

Recreate this in the target codebase's existing environment (Next.js / React on Vercel) using its established patterns. Lift values verbatim — tokens, timings, copy — but reorganize into the project's component structure.

## Fidelity

**High-fidelity.** All colors, type sizes, animation timings, keyboard mappings, and copy strings are final. Match the prototype.

---

## Shared Design Tokens (already in V2 — included for reference)

```ts
// Dark theme (default)
const dark = {
  bg:      'oklch(0.16 0.010 250)',
  panel:   'oklch(0.20 0.012 250)',
  panelHi: 'oklch(0.23 0.012 250)',  // hover state
  line:    'oklch(0.30 0.015 250)',
  text:    'oklch(0.92 0.008 250)',
  mute:    'oklch(0.58 0.015 250)',
  ok:      'oklch(0.78 0.15 150)',
  warn:    'oklch(0.78 0.16 65)',
  blue:    'oklch(0.75 0.13 230)',
};
```

The new **light theme** is specified in §6 below. Both themes share the same accent triplet (`ok`, `warn`, `blue`) — only the surface lightnesses invert.

Typography: **JetBrains Mono** (Google Fonts) for everything except the hero `h1` (system sans). Sharp 0-radius corners across the board. No shadows on panels.

---

## 1. Command Palette

A modal overlay invoked by keyboard or by clicking the `press / for cmd` button in the top nav.

### Trigger
- Keys: <kbd>/</kbd> or <kbd>:</kbd> from anywhere on the page (suppressed when focus is in an `INPUT` or `TEXTAREA`).
- Click: top-nav button on the right side.
- Close: <kbd>Esc</kbd>, click the backdrop, or run a command.

### Layout
- Full-page absolute overlay, `rgba(10,12,16,0.6)` + `backdrop-filter: blur(2px)`. (For light theme, use `rgba(255,255,255,0.5)` backdrop.)
- Centered horizontally, top offset **120px** from the page top — fixed top, not vertically centered. Width **560px**.
- Modal box: `panel` background, 1px `line` border, `0 16px 50px rgba(0,0,0,0.5)` shadow.

### Header
- `8px 12px 10px 14px` padding, 1px `line` bottom border. Flex row, gap 8px.
- `$` glyph in `warn` color, 12px mono.
- `<input autoFocus>`: transparent bg, no border, no outline, `text` color, 13px mono.
  - Placeholder: `type a command — e.g. 'go research', 'sensor lidar', 'help'`
- `<kbd>esc</kbd>` chip on the right: 1px `line` border, `mute` color, 10px, `2px 6px` padding.

### Result list
- Max-height 320px, vertical scroll.
- Each row: flex justify-between, `10px 14px` padding, 12px mono, top border `1px solid line` (skip on first row).
- Left: command key in `text` color. Right: description in `mute`.
- Hover: row background → `panelHi`, transition `background .12s`.
- Click row OR press <kbd>Enter</kbd> on the input → run top match, close, clear query.

### Empty state
- When no matches: 20px padding, 12px mono, `mute` text:
  `no matches. ? for help.` (the `?` in `warn` color)

### Filter logic
Case-insensitive substring match against either `cmd.k` (the command key) or `cmd.d` (the description). No fuzzy matching.

### Command registry

| key | description | action |
|---|---|---|
| `go research` | jump to research log | scroll to `#research` |
| `go flagship` | jump to flagship project | scroll to `#flagship` |
| `go top` | jump to top | scroll to `#top` |
| `open contact` | simulate ./contact --open | route to `/contact` |
| `cat resume` | open resume.pdf | open `/resume.pdf` in new tab |
| `sensor lidar` | inspect LIDAR_0 | set active sensor (existing flagship feature) |
| `sensor imu` | inspect IMU | set active sensor |
| `sensor cam` | inspect CAM | set active sensor |
| `theme dark` | default theme | set theme dark |
| `theme light` | bright/paper mode | set theme light |
| `theme crt` | phosphor / scanline mode | set theme crt |
| `help` | show keyboard shortcuts | open help HUD |
| `whoami` | about me | route to `/about` |

Add commands by extending the registry; the palette renders from the array.

### Scrolling helper
```js
function scrollToAnchor(sel) {
  const el = document.querySelector(sel);
  if (el) window.scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' });
}
```
(In the prototype the scroll container is the artboard root; in production it's `window`.)

---

## 2. Keyboard Shortcuts + Help HUD

Global `keydown` listener on `window`, mounted in a `useEffect` with cleanup. **Skip when** `e.target.tagName` is `INPUT` or `TEXTAREA`.

### Bindings

| key | action |
|---|---|
| <kbd>/</kbd> or <kbd>:</kbd> | open command palette |
| <kbd>?</kbd> | toggle help HUD |
| <kbd>Esc</kbd> | close any overlay (palette / help) |
| <kbd>g</kbd> then <kbd>r</kbd> | go to research |
| <kbd>g</kbd> then <kbd>f</kbd> | go to flagship |
| <kbd>g</kbd> then <kbd>t</kbd> | go to top |
| <kbd>1</kbd> / <kbd>2</kbd> / <kbd>3</kbd> | inspect LIDAR / IMU / CAM (existing flagship feature) |

### `g`-prefix implementation
On `g`, attach a one-shot `keydown` listener (`{ once: true }`) that handles the next key. Prevents the second key from firing other bindings.

```js
if (e.key === 'g') {
  const next = (e2) => {
    if (e2.key === 'r') scrollToAnchor('#research');
    else if (e2.key === 'f') scrollToAnchor('#flagship');
    else if (e2.key === 't') scrollToAnchor('#top');
    window.removeEventListener('keydown', next);
  };
  window.addEventListener('keydown', next, { once: true });
}
```

### Help HUD modal

Same overlay pattern as the palette. Centered (vertically + horizontally). Width 520px, `panel` bg, 1px `line` border, **24px** padding.

- Header: 11px mono, uppercase, letter-spacing 2px, `mute` color: `? keyboard shortcuts` (the `?` in `warn`). Margin-bottom 14px.
- Body: a `<table>` with two columns. Each row: `10px 0` padding, top border `1px solid line` (skip first).
  - Left cell (140px wide): each space-separated keypart wrapped in a `<kbd>` chip: `text` color, `bg` background, 1px `line` border, `2px 8px` padding, 4px right margin, 11px mono.
  - Right cell: description, `mute`, 12px.
- Footer: `$ esc to close`, 10px mono `mute`, margin-top 18px.

---

## 3. Scrubbable Sparklines

Replace the existing static `<Spark>` with an interactive version. Used in three telemetry panels: VELOCITY, YAW RATE, TRACKING ERR.

### Props
```ts
type SparkProps = {
  data: number[];                 // 80-point rolling series
  color: string;                  // stroke color (theme-token)
  h?: number;                     // default 36
  w?: number;                     // default 180
  fmt?: (v: number) => string;    // tooltip value formatter
};
```

Formatters used in the prototype:
- VELOCITY: `(v) => (v * 3).toFixed(2)` — maps 0–1 series to ~0–3 m/s
- YAW RATE: `(v) => ((v - 0.5) * 24).toFixed(1)` — centered yaw deg/s
- TRACKING ERR: `(v) => v.toFixed(3)`

### Render
- `<svg>` with `cursor: crosshair`. The polyline render is unchanged from V2.
- On `mousemove`: compute hovered index from cursor X relative to bounding rect, map to polyline coordinates.
- On `mouseleave`: clear hover state.

### Hover artifacts (rendered when `hover` is set)
1. Vertical guide line at `hover.x` from y=0 to y=h. Stroke: panel color, `stroke-opacity 0.5`, `stroke-dasharray "2 2"`.
2. Filled circle at `(hover.x, hover.y)`, radius **2.5**, fill = panel color.
3. Tooltip box: 48×14 px rect, fill `bg`, stroke `line`. Positioned at `(min(hover.x + 4, w - 50), 2)`. Inside: `<text>` at `(min(hover.x + 8, w - 46), 12)`, fill = panel color, **9px** mono, content = `fmt(hover.v)`.

### Index calculation
```js
const r = svgRef.current.getBoundingClientRect();
const x = e.clientX - r.left;
const i = clamp(Math.round((x / r.width) * (data.length - 1)), 0, data.length - 1);
```

The tooltip clamps so it never overflows the right edge of the SVG.

---

## 4. Expandable Research Rows

Replace the static research-log table rows with click-to-expand rows.

### Row state
Single state `expanded: string | null` holding the id of the open paper. Clicking the open row collapses it; clicking another row replaces.

### Row chrome (header strip)
- Grid columns change from V2's `90px 100px 60px 1fr 220px` to **`90px 100px 60px 1fr 220px 24px`** — a chevron column on the right.
- Row container: `cursor: pointer`. On hover, set `background: panelHi`, transition `background .12s`. On leave, restore transparent.
- Chevron: `›` glyph, `mute` color, text-align center.
  - When this row is `expanded`: `transform: rotate(90deg)`, transition `transform .15s`.

### Expanded body
Rendered immediately after the row when `expanded === paper.id`.
- Container: `padding: 16px 18px 22px`, `background: oklch(0.18 0.01 250)` (one step darker than `panel`), `border-top: 1px dashed line`.
- Layout: `grid-template-columns: 1.6fr 1fr`, `gap: 24px`.

**Left column:**
- Eyebrow: 10px mono, uppercase, letter-spacing 1.5, `mute`, content `Abstract — {venue} {year}`.
- Body: sans 13px, line-height 1.6, `text` color. The paper's abstract.
- Buttons row, `margin-top: 14px`, gap 8:
  - Primary (`open paper ↗`): `text` bg, `bg` text, no border, `6px 12px` padding, 10px mono, letter-spacing 1.5, uppercase. Routes to the paper URL.
  - Secondary (`copy bib`): transparent bg, `text` color, 1px `line` border. Copies the BibTeX to clipboard via `navigator.clipboard.writeText(paper.bibtex)`.

**Right column:**
- `<pre>` with the BibTeX. 12px padding, `bg` background, 1px `line` border, **10px** mono, line-height 1.55, `mute` color, `overflow: auto`.

### Data shape
```ts
type Paper = {
  id: string;       // 'PAP-006'
  tag: 'PREPRINT' | 'PUBLISHED';
  year: string;
  venue: string;    // 'ICIEA' | '—'
  title: string;
  keys: string[];
  color: string;    // warn for PREPRINT, ok for PUBLISHED
  abstract: string;
  bibtex: string;   // multiline
};
```

The four-paper seed dataset is in `v2-plus.jsx`. In production, source from CMS / MDX frontmatter.

---

## 5. Live Status Strip

Extend the V2 top bar with three new live readouts. Order from left:

1. `SQ / control` — unchanged.
2. `│` divider — unchanged.
3. `● ONLINE` — unchanged.
4. **`uptime HH:MM:SS`** — was a hardcoded string; now a real counter.
5. `│` divider.
6. **`scroll N%`** — current scroll progress, integer.
7. `│` divider.
8. **`last key X`** — label `last key` in `mute`, then a kbd chip showing the most recent keypress.

All separators and labels are 11px mono `mute`. The kbd chip:
- `text` color, `panelHi` background, 1px `line` border, `1px 6px` padding, 11px mono.
- Display the literal key character. For `' '` (space) display `␣`. For `Enter`, `Escape`, `?`, `:`, `/` keep verbatim.

### Hooks

**Uptime** — minted at component mount (or page load):
```js
const [uptime, setUptime] = useState(0);
useEffect(() => {
  const start = Date.now();
  const id = setInterval(() => setUptime(Math.floor((Date.now() - start) / 1000)), 1000);
  return () => clearInterval(id);
}, []);
const fmt = s =>
  `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor(s/60)%60).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
```

**Scroll %** — listen on the scroll container (window in production):
```js
useEffect(() => {
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    setScrollPct(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  return () => window.removeEventListener('scroll', onScroll);
}, []);
```

**Last key** — same global `keydown` listener used for shortcuts. Record only printable single-char keys plus `Enter`, `Escape`, `?`, `:`, `/`. Initial value `'—'`.

### Scroll-progress hairline
A 2px-tall sticky bar at the very top of the page (`position: sticky; top: 0; z-index: 10`). Inside, a div with `width: ${scrollPct*100}%`, height 100%, background `warn`, transition `width .12s linear`. Renders above the top-bar but below modals.

---

## 6. Theme Switcher

A `theme` state with three values: `'dark' | 'light' | 'crt'`. Default `'dark'`. Set via:
- Command palette (`theme dark`, `theme light`, `theme crt`).
- Optionally a small toggle in the top bar (not in the prototype — your call).

Persist to `localStorage('sq.theme')`. Read on mount.

### Theme tokens

```ts
const themes = {
  dark: {
    bg:      'oklch(0.16 0.010 250)',
    panel:   'oklch(0.20 0.012 250)',
    panelHi: 'oklch(0.23 0.012 250)',
    line:    'oklch(0.30 0.015 250)',
    text:    'oklch(0.92 0.008 250)',
    mute:    'oklch(0.58 0.015 250)',
    ok:      'oklch(0.78 0.15 150)',
    warn:    'oklch(0.78 0.16 65)',
    blue:    'oklch(0.75 0.13 230)',
    schematicBg: 'oklch(0.18 0.01 250)',
    expandedBg:  'oklch(0.18 0.01 250)',
    stripes: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 10px)',
    scanlines: 'none',
  },
  light: {
    bg:      'oklch(0.985 0.004 90)',     // warm paper
    panel:   'oklch(0.965 0.005 85)',
    panelHi: 'oklch(0.945 0.006 85)',
    line:    'oklch(0.85 0.010 80)',
    text:    'oklch(0.20 0.012 60)',
    mute:    'oklch(0.50 0.010 60)',
    ok:      'oklch(0.55 0.16 150)',      // darker for contrast on paper
    warn:    'oklch(0.58 0.18 50)',
    blue:    'oklch(0.50 0.15 230)',
    schematicBg: 'oklch(0.96 0.005 85)',
    expandedBg:  'oklch(0.97 0.005 85)',
    stripes: 'repeating-linear-gradient(135deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 10px)',
    scanlines: 'none',
  },
  crt: {
    // inherits from dark; only the page wrapper applies an overlay
    ...themes_dark_above,
    scanlines: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px)',
    filter: 'contrast(1.1) saturate(1.05)',
  },
};
```

### Applying a theme
- Best: write tokens to CSS variables on `:root` (or `body[data-theme]`) and switch via `data-theme` attribute. All component styles read `var(--bg)` etc.
- Acceptable for the prototype-style version: pass tokens via React Context.

### CRT overlay
A fixed full-viewport `<div>` at `z-index: 5` (below modals at 50, above content):
```jsx
{theme === 'crt' && (
  <div style={{
    position:'fixed', inset:0, pointerEvents:'none',
    background:'repeating-linear-gradient(to bottom, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px)',
    mixBlendMode:'overlay',
    zIndex: 5,
  }}/>
)}
```
Plus on the page wrapper itself: `filter: contrast(1.1) saturate(1.05)`.

### Light-theme adjustments

The hero typography, layout, and copy do **not** change. Only colors swap. Specific call-outs:
- `.cursor-blink` glyph stays `warn` — still readable on paper.
- The vehicle schematic SVG inherits via theme tokens; the `stripes-dark` background becomes the `stripes` (light) variant.
- The top scroll-progress hairline stays `warn` in both themes.
- The `kbd` chips in the status strip flip — `text` on `panelHi` reads correctly in both themes because both lightness pairs are inverted symmetrically.
- Backdrops behind modals: dark uses `rgba(10,12,16,0.6)`; light uses `rgba(255,255,255,0.5)`.

### Light-theme verification checklist
- [ ] All `mono` text passes WCAG AA against `bg` and `panel`.
- [ ] `ok` and `warn` accents are darkened to remain readable on paper (see token table).
- [ ] Sparkline tooltip box still reads (it uses `bg` fill + `line` stroke; that works in both).
- [ ] BibTeX `<pre>` background is `bg`, which is a soft paper tone — verify the contrast against `mute` text.

---

## State Management Summary

All new state is local to the page-level component. None of these need to escape to a global store:

```ts
const [theme, setTheme]         = useState(() => localStorage.getItem('sq.theme') || 'dark');
const [paletteOpen, setPaletteOpen] = useState(false);
const [paletteQ, setPaletteQ]   = useState('');
const [helpOpen, setHelpOpen]   = useState(false);
const [expanded, setExpanded]   = useState<string | null>(null);
const [uptime, setUptime]       = useState(0);
const [scrollPct, setScrollPct] = useState(0);
const [lastKey, setLastKey]     = useState('—');
```

`useEffect` sync `theme → localStorage` on every change.

---

## Reduced motion

Respect `prefers-reduced-motion: reduce`:
- Sparklines: keep the polyline but stop the rolling animation; freeze the series at one snapshot.
- Cursor blink: disable.
- Chevron rotation: still fine — it's a 150ms transform.
- Scroll-progress hairline: keep but remove the 120ms transition (snap instant).
- CRT scanlines: leave on; they're static.

---

## Files in this bundle

- `index.html` — standalone preview of V2+ Interactive (open in a browser).
- `v2-plus.jsx` — the React component with all six features. Canonical reference.
- `README.md` — this file.

The pre-upgrade V2 lives separately in your existing codebase / earlier handoff.

---

## Implementation order (suggested)

1. **Theme tokens** — refactor V2 to read colors from CSS vars / context. Verify dark mode is unchanged.
2. **Live status strip** — uptime + scroll + last-key. Quick win; tests the keyboard plumbing.
3. **Keyboard shortcuts + help HUD** — sets up the global `keydown` infrastructure.
4. **Command palette** — reuses the keyboard layer and the modal pattern from the help HUD.
5. **Scrubbable sparklines** — drop-in replacement for the existing component.
6. **Expandable research rows** — tweak the existing grid columns + render the body.
7. **Light theme** — last so you can sanity-check every component as you go.

---

## Notes for the implementer

- **Do not change the hero, stats ribbon, or footer chrome** beyond what these features require.
- **Keep all copy strings verbatim** — `./contact --open`, `// research_log [N]`, `$ esc to close`, etc.
- **The `g`-prefix shortcut must be one-shot.** Don't leave the listener attached or every subsequent `r/f/t` will fire.
- **Throttle the scroll listener** if the page is long; otherwise the status strip updates 60+ times/sec for free. `passive: true` is sufficient on most modern browsers.
- **Don't add fuzzy-matching to the palette.** Plain `includes` matches the muscle-memory of a CLI better and the command set is small.
- **CRT mode is a gimmick** — don't promote it as default and don't spend extra time perfecting it. It's a punchline, not a feature.
