
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
- Blog: a "Coming soon" band with two links, until there are articles
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
Each kind of content has its own face. A page uses at most three, and every face has one job.

| Role | Face | Used for |
| --- | --- | --- |
| Display | Archivo 500 to 800 | Headings, the wordmark, headline figures such as the hero facts and About stats |
| Body | IBM Plex Sans 400 to 600 | Paragraphs, menus, buttons, forms, table text |
| Data | IBM Plex Mono 400 to 600 | Short technical values: key-fact bands, port speeds, capacities, spec and table values that start with a number, step numbers, years, 3D diagram labels |

- Use `font-display`, `font-body` and `font-data`. `font-data` runs at 0.92em because Plex Mono is wide.
- The blog is a "Coming soon" page for now. When articles return, give them a reading serif in place of the data face, so article pages stay at three families.
- `isDataValue()` in `src/content/format.ts` picks table values for the data face: they start with a digit, are 28 characters or fewer, and contain no long word.
- Sentences and names never use the data face. Eyebrows, labels and dates stay in the body face.
- Use `.heading-1`, `.heading-2`, `.heading-3`, `.lede`, `.body-copy`, `.eyebrow`.
- Numbers use tabular figures. Headings are never italic and never use a colored span for emphasis.
- Archivo is not on the Hallmark allowlist and is not a banned default. It was chosen for its industrial grotesque voice, the same family mcbroad.com uses for headings.

## 3D model
`src/three/FabricStage.ts` draws one axonometric scale model of an interconnection hall, shown through `FabricView`.

- It is the only 3D object on the site. Selecting a service highlights the part of the hall that service uses, so the model explains the product line.
- On the desktop home page one shared model (`FabricJourney`) starts in the hero, travels down with the scroll, and lands in the services panel. Dropdowns then animate that same model. The stage is a native sticky element, so script never positions it during scrolling. It stays in the right column, and the facts live in the left column of the hero, so it never covers text or figures.
- Phones and tablets get a separate model in the hero and in the panel, because a pinned model would cover the text on a small screen.
- `focus` picks the highlighted service. `framing="focus"` moves the camera to it. `framing="full"` keeps the whole hall in frame, for page headers.
- Physical things are solid. Virtual services are translucent layers. Consulting is the whole hall drawn as a blueprint.
- No bloom, glow, particles or globes. Matte materials and soft shadows only.
- three.js loads on demand and pauses when off screen.
- Build sequence: on load the hall builds itself in about four seconds. The core cabinets go up first and the build spreads outward. Each shell rises, equipment slides in from bottom to top and its lights come on, then cable trays, fiber and the two virtual layers follow. Labels appear once it is built. It plays once per visit to a page.
- Reduced motion: the build plays in about two seconds with parts appearing in place and nothing moving. No sway, parallax, moving traffic or lifted layers. Scrolling and selecting are the visitor's own actions, so the trip and camera moves remain, with the swing cut to 30%.
- No WebGL: `FabricView` shows `src/assets/fabric-still.webp`.
- Regenerate the still images if the model changes.

## Motion
Motion explains order and arrival. It is not decoration.

- The 3D hall carries the main motion on the home page, see above.
- Home page: the hero text eases in as the hall builds. Each content block fades up once, 18px, when it first scrolls into view. Use `<Reveal>`, never hand-written variants.
- Sequences that mean something may stagger: finder rows, the four process steps with their connecting line, the reasons. One stagger per section, in steps of 0.06 to 0.18 seconds.
- Dropdowns open by height, and FAQ items open with `::details-content` where supported. The location pin pulses three times after it first appears, then rests.
- Not used: counting-up figures, parallax, looping or scroll-linked effects on content, bounce or overshoot.
- Reveals play once. Nothing is hidden by default for longer than its own fade.
- UI transitions change color only, at 160ms. Link arrows nudge 3px on hover.
- Reduced motion: `MotionConfig reducedMotion="user"` removes every lift and the line draw, leaving gentle fades. The pin pulse and the dropdown height tween are switched off.
- Never reveal the sticky 3D panel or its column, because the scroll journey measures their position.

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
