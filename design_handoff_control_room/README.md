# Handoff: Portfolio Site — "Control Room" Direction

## Overview

This is a redesign of Muhammad Suleiman Qureshi's personal portfolio site (currently live at `suleimanqureshi.vercel.app`). The redesign reframes the site as an **instrumentation dashboard / ground-station UI** — visually referencing the autonomous robotics work the portfolio describes. Dark theme, mono-forward typography, live-feeling telemetry, schematic-style diagrams.

The target route is the **homepage** (`/`). Subpages (`/research`, `/projects`, `/about`, `/contact`) should inherit the same visual system but are out of scope for this handoff.

---

## About the Design Files

The files in this bundle are **design references created in HTML/React-in-the-browser via Babel Standalone** — a prototype of the intended look, layout, and micro-interactions. They are **not production code**.

Your task is to **recreate this design in the target codebase's existing environment**, using its established patterns and libraries. The existing site appears to be a Next.js / React app deployed on Vercel — implement in that stack, not by dropping the HTML in as-is.

- Do not ship `index.html` + Babel Standalone to production.
- Do reuse the visual values (colors, typography, spacing, component structure, SVG schematic) verbatim.
- Component decomposition in the prototype (`Panel`, `Spark`) is a suggestion — reorganize to fit Next.js conventions (colocated `components/`, server vs. client boundary, etc.).

## Fidelity

**High-fidelity.** Colors, typography, spacing, component structure, and animation timing are all final. Recreate pixel-perfectly, then adapt responsive breakpoints (see §Responsive below — the prototype is desktop-only at 1280px).

---

## Design Tokens

Use these exact values. All colors are in `oklch()` — map to your token system / Tailwind config as needed.

### Colors

| Token        | Value                        | Usage |
|--------------|------------------------------|-------|
| `bg`         | `oklch(0.16 0.010 250)`      | Page background |
| `panel`      | `oklch(0.20 0.012 250)`      | Card / panel background |
| `line`       | `oklch(0.30 0.015 250)`      | Borders, dividers |
| `text`       | `oklch(0.92 0.008 250)`      | Primary text |
| `mute`       | `oklch(0.58 0.015 250)`      | Secondary text, labels |
| `ok`         | `oklch(0.78 0.15 150)`       | Status: online / healthy (green) |
| `warn`       | `oklch(0.78 0.16 65)`        | Accent: highlight, warnings (amber) |
| `blue`       | `oklch(0.75 0.13 230)`       | Secondary accent (IMU, links) |

All accents share roughly equal lightness (~0.78) and chroma (~0.15) — only the hue varies. Preserve this when extending.

### Typography

- **Sans**: system stack — `-apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", Helvetica, Arial, sans-serif`. Used for the hero name only.
- **Mono**: **JetBrains Mono** (weights 400, 500, 600) — everything else: nav, labels, body copy, telemetry numerals, status strings. This is central to the aesthetic.

Load JetBrains Mono via Google Fonts or self-host. Do **not** substitute a different mono.

### Type scale (desktop, 1280px frame)

| Use | Size | Weight | Other |
|---|---|---|---|
| Hero name `h1` | 84px | 700 | line-height 1.0, letter-spacing -2.5px |
| Stats numerals | 36px | 500 | mono |
| Telemetry numerals | 32px | 400 | mono |
| Section heading `h2` | 13px | 400 | mono, uppercase, letter-spacing 2px |
| Nav items | 11px | 400 | mono, uppercase, letter-spacing 1.2px |
| Labels (panel titles) | 10px | 400 | mono, uppercase, letter-spacing 1.5px |
| Body / description | 13px | 400 | mono, line-height 1.6 |
| Table row | 12px | 400 | mono |

### Spacing

- Outer page padding: **28px** horizontal (generous but not loose).
- Section vertical rhythm: **32–36px** between major sections.
- Grid gap: **10px** for dashboard panel cluster, **14px** for inline metadata rows, **20px** for hero two-column split.

### Borders & radii

- Panel/card border: **1px solid `line`**.
- **Zero border-radius.** Everything is sharp-cornered — this is load-bearing for the instrumentation feel. Do not add rounding.

### Shadows

None. The depth comes from 1px borders on subtly lighter panels.

---

## Page Structure

The homepage is a single scroll, 1280px wide, broken into 6 stacked sections:

1. **Top bar** — status chrome
2. **Hero** — operator profile (left) + live telemetry cluster (right)
3. **Stats ribbon** — 4-column metrics
4. **Research log** — table of papers
5. **Flagship project** — vehicle schematic + stack diagram
6. **Footer** — minimal signoff

---

### 1. Top bar

Full-width strip, `14px 28px` padding, bottom border `1px solid line`. Flex justify-between. All text 11px mono.

**Left cluster** (gap 16px):
- `SQ / control` — "SQ" in `text`, "control" in `mute`, weight 600 on SQ.
- Vertical `│` divider in `mute`.
- `● ONLINE` — dot and text in `ok` color.
- `uptime 04:21:08` — in `mute`. (Hardcoded string in the prototype — in prod, this should either be a real uptime counter from `Date.now() - buildTime` OR a static "Available" indicator. Don't fake it with a random value.)

**Right cluster** — nav (gap 24px, uppercase, letter-spacing 1.2px):
- `Overview` (active: `text` color, 1px bottom border in `text`, 2px padding-bottom)
- `Research`, `Projects`, `About`, `Contact` (all in `mute`)

### 2. Hero

Padding `32px 28px`. Two-column grid `1.4fr 1fr`, gap 20px.

**Left column:**
- Breadcrumb line (mono 11px `mute`, uppercase, letter-spacing 1.5px, margin-bottom 14px):
  `# OPERATOR_PROFILE :: role=R&D_LEAD :: domain=ROBOTICS_AUTOMATION`
- `h1` — sans, 84px, weight 700, line-height 1.0, letter-spacing -2.5px:
  `Muhammad Suleiman\nQureshi.` — the final period is in `warn` color.
- Description block (mono 13px, line-height 1.6, color `mute`, max-width 640px, margin-top 22px). Three lines, each prefixed with `>` in `text` color:
  - `> building autonomous systems end-to-end · PCB → sys-ID → MPC → real-time CV.`
  - `> currently leading R&D at HU-Takhleeq — Habib University's industry-academia hub.` (HU-Takhleeq in `blue`)
  - `> i like systems with tangible impact` + blinking cursor `▌` in `warn`
- Buttons (gap 8px, margin-top 28px):
  - Primary: `background: text`, `color: bg`, padding `10px 16px`, mono 11px uppercase letter-spacing 1.5px. Label: `./contact --open`
  - Secondary: transparent bg, `text` color, 1px `line` border. Label: `cat resume.pdf`

**Right column — Telemetry cluster:**
2×2 grid, gap 10px. Each cell is a `Panel` component:

**Panel component spec:**
- 1px `line` border, `panel` background.
- Header: `8px 12px` padding, bottom border `1px solid line`, flex justify-between. Title (mono 10px uppercase letter-spacing 1.5px `mute`) on left, optional tag (mono 10px `mute`) on right.
- Body: 14px padding.

Four telemetry panels:
| Title | Tag | Big number | Sparkline color |
|---|---|---|---|
| VELOCITY | m/s | `vals.v.toFixed(2)` in `text` | `ok` |
| YAW RATE | deg/s | `vals.yaw.toFixed(1)` in `text` | `blue` |
| TRACKING ERR | m | `vals.err.toFixed(3)` in `warn` | `warn` |
| SYSTEM | all | 4-line status list (see below) | — |

SYSTEM panel body (mono 11px line-height 1.9 `mute`):
```
● mppi_node     OK     (● in ok)
● ekf_localizer OK     (● in ok)
● can_bridge    OK     (● in ok)
● lidar_0       OK*    (● in warn)
```

**Sparkline** component:
- SVG, default w=180 h=36.
- 80-point rolling window of values in [0, 1].
- `<polyline>` with `stroke-width="1.25"`, `fill="none"`, color per panel.
- Points mapped: x = `(i / 79) * w`, y = `h - ((v - min) / (max - min)) * h`.

### 3. Stats ribbon

Margin `0 28px`. 1px `line` border wrapping a 4-col grid. Each cell: padding 18px, left border `1px solid line` except the first.

| Label (10px mono mute, letter-spacing 1.5) | Value (36px mono text, margin-top 6px, weight 500) | Caption (10px mono mute, margin-top 4px) |
|---|---|---|
| PAPERS | 06 | / peer-reviewed + preprint |
| PROJECTS | 09 | / deployed or live |
| CGPA | 3.88 | / 4.00 |
| DEAN'S LIST | ×4 | / consecutive |

### 4. Research log

Padding `36px 28px 0`.

Header row (flex justify-between, baseline align, margin-bottom 14px):
- Left `h2` (mono 13px uppercase letter-spacing 2px `text`): `// research_log [6]` — `//` and `[6]` in `mute`.
- Right (mono 11px `mute`): `sort: --date.desc`

Table (1px `line` border, `panel` bg). Each row:
- Grid `90px 100px 60px 1fr 220px`, gap 14px, align-items center, padding `14px 18px`, top border from row 2 onward, mono 12px.
- Columns: `id` (mute) · `● TAG` (colored per status — warn for PREPRINT, ok for PUBLISHED) · `year` (mute) · `title` (text) · `keys` (mute, right-aligned, hashtagged)

Rows (data):
1. PAP-006 · ● PREPRINT (warn) · 2026 · Hierarchical PID-MPPI Control for an Autonomous Electric Tow Truck · #robotics #MPPI #PID
2. PAP-005 · ● PUBLISHED (ok) · 2026 · Deployment-Oriented Memory-Based Visual Inspection of Injection-Molded Parts · #CV #anomaly #mfg
3. PAP-004 · ● PUBLISHED · 2025 · Sys-ID Methods for Retrofitted Electric Drivetrains · #sys-id #controls
4. PAP-003 · ● PUBLISHED · 2025 · Real-Time Perception Pipeline for Industrial AGVs · #CV #AGV

### 5. Flagship — EV-TOW-01

Padding `36px 28px 0`.

Header row: `// flagship :: ev-tow-01` (ev-tow-01 in `warn`) · right: `● deployed` in `ok`.

Grid `1.3fr 1fr`, gap 10px.

**Left — VEHICLE · EV-TOW-01 panel** (tag: "retrofit"):
- Body holds a 260px-tall schematic, `stripes-dark` background, 1px dashed `line` border.
- Inline SVG (`viewBox 0 0 600 260`): top-down vehicle schematic.
  - Outer chassis rectangle (180,80 → 240×100, `mute` stroke).
  - Cab rectangle (210,55 → 180×25).
  - Four wheel circles at corners of chassis (r=12, `text` stroke).
  - LIDAR: filled circle `warn` at (300,67) r=8, dashed leader line up to label `LIDAR_0` at (305, 20) in `warn`.
  - IMU: filled square `blue` at (290,120) 20×20, dashed leader right to label `IMU` at (372,133) in `blue`.
  - CAM: filled rect `ok` at (410,117) 14×26, dashed leader right to label `CAM` at (482,133) in `ok`.
  - Caption top-left: `fig. 01 — sensor layout (top)` mono 10px `mute`.
  - Caption bottom-left: `scale 1:24` mono 10px `mute`.

**Right column** — two stacked panels, gap 10px:

**CONTROL STACK panel:**
Monospace tree (11px, line-height 1.9, `text`, with `│`/`├──` chars in `mute`):
```
│ OUTER  MPPI (N=1024, H=30)
├──     COST   tracking + obstacle + smoothness
│
│ INNER  PID (v, δ)
├──     RATE   100 Hz
│
│ PLANT  system-ID'd 2DOF bicycle
```

**IMPACT panel:**
Sans 13px, line-height 1.5, `text`:
> Deployed and operational. Full-stack: custom PCB, sys-ID, hierarchical control, and a real-time perception pipeline. First autonomous retrofit to run on this class of vehicle in PK industry.

### 6. Footer

Padding `36px 28px 28px`, margin-top 32px, 1px `line` top border. Flex justify-between.
- Left: `SQ@ 2026 · karachi, pk` (mono 11px `mute`)
- Right: `$ uptime & thanks — shell closed` (mono 11px `mute`)

---

## Interactions & Behavior

### Live telemetry (hero right column)

Drives the four telemetry panels. In the prototype this updates every 80 ms via `setInterval`; in production use `requestAnimationFrame` throttled to ~10–15 Hz, or mount it behind `useEffect` with cleanup. State:

```js
// tick counter increments by 0.08 each interval
v   = 1.8 + sin(t * 0.8) * 0.4 + jitter(±0.025)   // velocity m/s
yaw = sin(t * 0.5) * 12                            // yaw rate deg/s
err = 0.04 + jitter(±0.01)                         // tracking error m
```

Sparkline series: separate `useState` array of 80 values, rolled every 120 ms:
```js
next = 0.5 + sin(Date.now() / 400) * 0.25 + jitter(±0.1)
```

This is **decorative motion**, not real data. It should feel alive without lying — consider a subtle hover tooltip that says "simulated telemetry" if you want to be explicit. Pause the animation when the page is not visible (`document.hidden` / `visibilitychange`) to save battery.

### Cursor blink

CSS keyframe `blink` — 1s step, toggles opacity 1→0 at 50%. Applied via `::after { content: '▌' }` pseudo.

### Pulse (not currently used in V2 but defined in CSS)

2-state opacity pulse at 1.6s ease-in-out. Available for future "live" indicators.

### Hover states

The prototype does not define hover states explicitly. Recommended:
- Nav items: on hover, color `mute → text`, preserve underline only on active.
- Buttons: primary — background `text → oklch(0.98 0.008 250)`; secondary — border `line → text`.
- Research log rows: on hover, row background `panel → oklch(0.22 0.012 250)`, cursor pointer, link to `/research/[slug]`.
- Paper tag pills / `.mono` hashtag clusters: no hover, static.

### Navigation

- Top-bar nav → routes: `/`, `/research`, `/projects`, `/about`, `/contact`.
- Hero primary button (`./contact --open`) → `/contact`.
- Hero secondary button (`cat resume.pdf`) → opens `/Suleiman_Resume_April_2026.pdf` in new tab.
- Research log rows → `/research/[slug]` (slugs from existing site).
- Flagship section title / vehicle panel → `/projects/project-autonomous-ev-tow-truck`.

### Reduced motion

Respect `prefers-reduced-motion: reduce` — disable the sparkline animation, freeze telemetry values to reasonable middles, stop the cursor blink.

---

## Responsive

The prototype is desktop-only at 1280px. You own the responsive adaptation. Suggested breakpoints:

- **≥1120px (desktop):** prototype layout as-is.
- **720–1119px (tablet):** collapse hero to single column (text over telemetry). Telemetry grid stays 2×2. Stats ribbon stays 4 cols. Flagship becomes single column.
- **<720px (mobile):** everything single column. Stats become 2×2. Research log rows restack vertically (id+tag on row 1, title on row 2, keys on row 3). Reduce hero h1 to ~48px. Horizontal padding drops to 16px.

Preserve all colors, the mono-forward type system, and the 0-radius sharp corners across all breakpoints.

---

## State Management

Minimal. All state is local to the home component:
- `vals` — telemetry numerals `{ v, yaw, err, t }`.
- `series` — 80-point sparkline array.

No data fetching on this page. Research papers + project blurbs are currently hardcoded — if the existing site has an MDX/CMS source, plug into it via Next.js `getStaticProps` or Server Components.

---

## Assets

- **Fonts:** JetBrains Mono (Google Fonts) — required. Sans is system stack, no webfont.
- **Images:** none. The "vehicle schematic" is inline SVG — copy verbatim from the prototype.
- **Icons:** none. All indicators are Unicode bullets (`●`), box-drawing chars (`│├──`), and arrows (`→`).
- **Photo of you / robot:** not used in V2. If you want to add one later, the natural slot is replacing the vehicle schematic with a photograph — keep the same 1px dashed border + `fig. 01` caption treatment so it still reads as "plate."

---

## Files in this bundle

- `index.html` — standalone preview of just V2 (open in a browser to see the design).
- `v2-controlroom.jsx` — the React component. This is the canonical reference; port this to the target codebase.
- `README.md` — this file.

The full 4-variant canvas lives in `Site Revamp.html` in the parent project, if the other directions ever come back into scope.

---

## Notes for the implementer

- **Do not add rounded corners.** The sharp 0-radius is deliberate and load-bearing.
- **Do not replace JetBrains Mono** with a different monospace font. The whole system hangs off its metrics.
- **Do not add gradients, glows, or neon.** The dashboard aesthetic is restrained — dark grey on dark grey with single-hue accents. This is not a "cyberpunk" treatment.
- **Keep telemetry subtle.** If it becomes distracting, it's failed. No more than 15 Hz update rate. No hard pulses.
- **Copy every mono string verbatim** — the `./contact --open`, `cat resume.pdf`, `// research_log [6]`, etc. are the voice of the design. Don't "professionalize" them.
- If the existing site has an analytics layer or OG metadata, preserve it. The redesign is visual; content routes and metadata should match the current live site.
