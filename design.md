
# Design — Techne

A locked design system for this app. Every component redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the system needs to grow.

## Genre
modern-minimal

## Macrostructure family
- Marketing sections (Hero, Services, WhyTechne): Feature Stack — horizontal ruled sections, left-weight display headings
- Tool pages (Pricing): Workbench — config left, output right
- Detail/content pages (About, Contact, Blog, service pages): Long Document — clean ruled, editorial rhythm

## Theme
Custom — anchored on brand teal #63b4b5 (oklch 71% 0.07 199), deepened for contrast.

- `--color-paper`         oklch(98.5% 0.005 199)
- `--color-paper-2`       oklch(96%   0.010 199)
- `--color-paper-3`       oklch(93%   0.015 199)
- `--color-ink`           oklch(9%    0.020 200)
- `--color-ink-2`         oklch(38%   0.040 199)
- `--color-rule`          oklch(88%   0.015 199)
- `--color-accent`        oklch(55%   0.130 199)
- `--color-accent-hover`  oklch(48%   0.140 199)
- `--color-accent-ink`    oklch(98.5% 0.005 199)
- `--color-focus`         oklch(55%   0.170 220)

## Typography
- Display: IBM Plex Sans 600/700, style normal (never italic) — humanist grotesque, engineered for technical/infrastructure contexts
- Body: IBM Plex Sans 400/500 — one superfamily for cohesion and a more corporate, professional read than Space Grotesk
- Mono: IBM Plex Mono 400/500/600 — for port specs, latency values, pricing numbers, timestamps
- Display tracking: -0.02em; headings enable `ss02`/`cv05` stylistic sets
- Technical values (`.font-mono`) use tabular figures (`tnum`, slashed `zero`) so numeric columns align across the page
- No italic headers — ever
- Amended 2026-06-26: migrated Space Grotesk + Inter → IBM Plex Sans/Mono for a modern, professional infrastructure identity. The accent, layout, radius, and motion stance below are unchanged.

## Spacing
4-point named scale. See `tokens.css` for values. Use named tokens (`var(--space-md)`), never raw px.

## Motion
- Easings: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` — framer-motion `ease: [0.16, 1, 0.3, 1]`
- Reveal: `opacity: 0 → 1`, `y: 24 → 0`, duration 0.32s
- Max 2 animated elements per section — pick the heading and one supporting element
- Reduced-motion: collapses to opacity-only, ≤150ms (see index.css @layer base)
- No bounce, no overshoot, no spring on UI state changes

## Nav: N11 mega-menu
- Clean white header `bg-paper border-b border-rule`, no glass/blur
- IBM Plex Sans links, `text-ink-2 hover:text-ink`
- Dropdown: 2-col ruled grid, hairline shadow, 4px radius — NOT rounded-2xl shadow-2xl
- CTA: `btn-primary` (4px radius, no shadow-md)

## Footer: Ft5 Statement
- Dark background `bg-ink`
- Large company statement in display type
- Horizontal link row below
- CDN marquee strip above footer (inverted colors on dark)

## Microinteractions stance
- Silent success on form submit (no toast — show inline confirmation)
- Hover delay 800ms on tooltips, 0ms on focus tooltips
- Buttons: `transition-colors` only, no transform on hover
- Active: `active:scale-95` on CTAs only

## CTA voice
- Primary: `btn-primary` — filled accent, 4px radius, IBM Plex Sans semibold
- Secondary: `btn-secondary` — 1px accent border, transparent fill

## Anti-patterns BANNED on this project
- Blue `<span>` inside headings: **never**. Use weight/size/color contrast instead
- Rounded pill badges on every section eyebrow: **never** 
- `rounded-3xl` or `rounded-2xl` on cards: use `rounded-[4px]` (--radius-card)
- Centered headings on marketing sections: left-align all headings
- `shadow-xl shadow-brand-blue/5` hover effects: use `border-rule` transitions instead
- `uppercase tracking-widest text-brand-blue` small-cap section labels on every section
- Fade-in on every single element — pick 1-2 key moments per section

## What pages MUST share
- The accent colour and placement (≤5% per viewport)
- IBM Plex Sans for all headings
- IBM Plex Mono for all technical values (specs, numbers, latency, prices)
- The 4px border radius on all interactive elements
- CTA voice (btn-primary / btn-secondary)
- Horizontal rules (`border-rule`) as section dividers — not drop shadows

## What pages MAY differ on
- Section background alternation (paper / paper-2)
- Whether motion reveals are used (marketing: yes; detail pages: minimal)
- Number of stats visible in the hero strip

## Exports

### tokens.css
See `tokens.css` at project root — imported by `src/index.css`.

### Tailwind v4 @theme
```css
@theme {
  --color-paper:         oklch(98.5% 0.005 199);
  --color-paper-2:       oklch(96%   0.010 199);
  --color-paper-3:       oklch(93%   0.015 199);
  --color-ink:           oklch(9%    0.020 200);
  --color-ink-2:         oklch(38%   0.040 199);
  --color-rule:          oklch(88%   0.015 199);
  --color-accent:        oklch(55%   0.130 199);
  --color-accent-hover:  oklch(48%   0.140 199);
  --color-accent-ink:    oklch(98.5% 0.005 199);
  --color-focus:         oklch(55%   0.170 220);
  --font-display: "IBM Plex Sans", "Inter", system-ui, sans-serif;
  --font-body:    "IBM Plex Sans", "Inter", system-ui, sans-serif;
  --font-mono:    "IBM Plex Mono", "JetBrains Mono", monospace;
}
```
