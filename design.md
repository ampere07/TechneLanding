
# Design: Techne

A locked design system for this app. Every component redesign reads this file before
emitting code. Do not regenerate per page. Extend or amend this file when the system needs to grow.

Amended 2026-11-04: site-wide corporate redesign, referencing rise.ph, mcbroad.com and getafix.ph for
structure and information density. Replaces the earlier monospaced, ruled look.

## Position
A carrier-neutral network operator explaining what it sells, plainly, to network engineers and IT buyers.
Facts, tables and specifications carry the page. Decoration has to explain something or it goes.

## Genre
modern-minimal

## Page structure
- Home: hero with a facts panel in its left column, service explorer, service finder, virtual comparison, locations, logos, reasons, process, FAQ, closing band
- Service pages: `ServiceLayout` header with the 3D hall, facts band, body sections, related services, closing band
- Index and company pages: pale title band, then ruled content
- Request a quote: service options left, selection summary right. No prices are shown. The button opens the contact form pre-filled from the selection.

## Color
Anchored on the logo teal `#63b4b5` and logo grey, on deep navy. Tokens live in `tokens.css` and `src/index.css`.

| Token | Value | Use |
| --- | --- | --- |
| `paper` | `#ffffff` | Main surface |
| `paper-2` | `#f3f6f8` | Alternate bands, page title bands |
| `paper-3` | `#e6ecf0` | Hover on white buttons |
| `ink` / `navy` | `#0b2536` | Headings, navy bands, footer |
| `ink-2` | `#455a68` | Body text |
| `ink-3` | `#5f717d` | Small labels. Passes AA on `paper` and `paper-2` |
| `rule` / `rule-strong` | `#d8e0e6` / `#b4c1ca` | Dividers, control borders |
| `accent` | `#0e6b70` | Buttons, links, closing band |
| `accent-hover` | `#0a5559` | Hover |
| `teal-bright` | `#63b4b5` | Accents on navy only. Fails contrast on white |
| `focus` | `#1579a8` | Focus ring |

## Typography
- Libre Franklin 400, 500, 600, 700 for everything. One family, no monospace.
- Use `.heading-1`, `.heading-2`, `.heading-3`, `.lede`, `.body-copy`, `.eyebrow`.
- Numbers in facts and tables use tabular figures.
- Headings are never italic and never use a colored span for emphasis.

## 3D model
`src/three/FabricStage.ts` draws one axonometric scale model of an interconnection hall, shown through `FabricView`.

- It is the only 3D object on the site. Selecting a service highlights the part of the hall that service uses, so the model explains the product line.
- On the desktop home page one shared model (`FabricJourney`) starts in the hero, travels down with the scroll, and lands in the services panel. Dropdowns then animate that same model. The stage is a native sticky element, so script never positions it during scrolling. It stays in the right column, and the facts live in the left column of the hero, so it never covers text or figures.
- Phones and tablets get a separate model in the hero and in the panel, because a pinned model would cover the text on a small screen.
- `focus` picks the highlighted service. `framing="focus"` moves the camera to it. `framing="full"` keeps the whole hall in frame, for page headers.
- Physical things are solid. Virtual services are translucent layers. Consulting is the whole hall drawn as a blueprint.
- No bloom, glow, particles or globes. Matte materials and soft shadows only.
- three.js loads on demand and pauses when off screen.
- Reduced motion: no intro, sway, parallax, moving traffic or lifted layers. Scrolling and selecting are the visitor's own actions, so the trip and camera moves remain, with the swing cut to 30%.
- No WebGL: `FabricView` shows `src/assets/fabric-still.webp`.
- Regenerate the still images if the model changes.

## Motion
- No scroll reveals. Content is simply there.
- UI transitions change color only, at 160ms.
- The 3D model carries all the motion on the page.
- To preview the full motion on a PC, Windows "Show animations" must be on. When it is off, browsers report reduced motion.

## Components
- Nav: utility bar, sticky main bar, full-width mega menu grouped by service type
- Footer: navy, four columns
- Buttons: `btn-primary`, `btn-secondary` on light, `btn-on-navy`, `btn-outline-on-navy` on dark
- Tables: `.data-table`. Wide tables stack into labelled blocks on phones. Never hide a column behind sideways scrolling.
- Service data: `src/content/site.ts` is the single source for names, descriptions, facts and locations

## Copy
- Plain, specific sentences. Name the feature and who it is for.
- No em dashes. No "unmatched", "seamless", "future-proof", "world-class" or "next-gen".
- Never invent metrics, testimonials, client names or people. Use only figures the business has supplied.

## Banned on this project
- Monospaced uppercase labels and tick-mark eyebrows
- Decorative numbering such as 01, 02, 03. Numbers appear only for real sequences.
- Fake status widgets such as a pulsing "Live" dot
- Marquees and auto-rotating content
- Glowing stock-style imagery
- Gradient text, pill badges, `rounded-2xl` cards, drop-shadow hover effects

## Shape
4px cards, 3px buttons and inputs. Sections are separated by background bands and hairlines.
