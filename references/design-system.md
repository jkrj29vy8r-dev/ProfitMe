# ProfitMe Design System

The derived layer. Raw assets in the sibling folders are inspiration; **this file
is the contract.** Every UI component builds from these tokens.

> **Status: v1 complete (2026-08-01).** Every token below is derived — from
> measured evidence where the references support it, from explicit domain
> reasoning where they don't. See [`observations.md`](observations.md) for the
> evidence trail. This is a system to build components from, not a mockup; it
> gets revised as real components expose gaps, per the maintenance rules below.

## How this file is maintained

- A component needs a value that is not here → derive it from the references,
  add it here as a named token, *then* write the component. Never a local
  one-off.
- A design pass learns something new → fold it back into this file in the same
  session, so the next component starts from it.
- A token changes → it changes here first, and existing components are updated
  to match. Two competing values for the same idea is a bug.
- Every token needs a **name and a job**, not just a value. "What is this for"
  is what keeps a system coherent as it grows.

---

## Brand direction

Apple, Porsche, Stripe, Linear and Tesla are the craft bar, not the palette.
Copying any of their actual color, type or layout decisions would fail the
originality rules in `CLAUDE.md` before the first component ships — "looks like
Stripe but recolored" is explicitly the failure mode this system exists to avoid.

The one hard constraint the references themselves impose: **the accent cannot be
blue.** Tesla, Mercedes, Spline and our own Verdikt dashboard all independently
land on a blue CTA against a neutral ground — see `observations.md`, first and
second passes. That makes blue-on-neutral the most common choice in the entire
library, not a distinctive one. Using it would be the opposite of standing apart
from Apple/Linear/Stripe/Tesla — it would visually merge ProfitMe with all of
them at once.

**ProfitMe's accent is a muted copper.** Reasoning:

- It sits in Porsche/Apple's *material* register — warm metal, not a UI-library
  primary — which is the premium association being reached for, without lifting
  either brand's literal palette.
- It is unclaimed by every source in `references/`. Nothing here needs to be
  un-derived.
- It fits the domain without the on-the-nose move of making green the brand
  color. Green and red are reserved for profit/loss semantics — a brand accent
  can never share a hue with a semantic one, or "is this the brand or is this bad
  news" becomes a real question a user asks.

Copper appears only on interactive chrome — primary buttons, links, focus rings,
selection, brand marks. It never appears in a status pill. That separation by
*context*, not just hue, is what keeps it from colliding with the caution color
below, which sits nearby on the wheel because caution conventionally has to.

---

## Color — derived (2026-08-01)

Values given as HSL for legibility of the ramp logic; ship as whatever token
format the codebase uses.

### Accent — Copper

| Token         | Value                  | For                                    |
| ------------- | ----------------------- | --------------------------------------- |
| `copper-200`  | `hsl(28, 55%, 88%)`     | Subtle tints, selected-row backgrounds  |
| `copper-400`  | `hsl(28, 60%, 68%)`     | Hover state of the base tone            |
| `copper-500`  | `hsl(28, 58%, 45%)`     | **Base brand tone** — primary buttons, links, active nav |
| `copper-600`  | `hsl(28, 62%, 36%)`     | Pressed/active state, on-light text use |
| `copper-700`  | `hsl(28, 60%, 26%)`     | On-copper text where contrast demands it |

Muted and darker than a marketing gold — this is metal-under-gallery-light, not
a coin icon. If it looks like a crypto-app accent, it's oversaturated; pull
saturation down before pulling lightness down.

**`glow-accent`** (added 2026-08-02) — `hsl(28, 58%, 45%, 0.55)` dark /
`hsl(28, 62%, 36%, 0.4)` light. A static glow value, for the one or two focal
points per screen that earn a glow (the hero scene's single light source, the
product-reveal chart's line and leading dot) — never applied to anything that
animates the filter itself, only to elements whose ancestor is transformed
(see Motion, 3D scenes addendum). Copper, per the decision above, where the
pattern itself shows as blue in Verdikt.

### Semantic — profit, loss, caution

Never used for brand/interactive chrome. Never appear without a text label, icon,
or sign — see Component conventions.

| Token           | Value                | For                          |
| --------------- | --------------------- | ----------------------------- |
| `positive-500`  | `hsl(152, 55%, 38%)`  | Gains, cleared status, upward trend |
| `positive-200`  | `hsl(152, 45%, 90%)`  | Positive-tinted backgrounds (light mode) |
| `negative-500`  | `hsl(358, 68%, 52%)`  | Losses, flagged status, downward trend |
| `negative-200`  | `hsl(358, 60%, 92%)`  | Negative-tinted backgrounds (light mode) |
| `caution-500`   | `hsl(42, 75%, 50%)`   | Needs-review, pending, in-between states |
| `caution-200`   | `hsl(42, 70%, 90%)`   | Caution-tinted backgrounds (light mode) |

`caution-500` sits only 14° from `copper-500` on the wheel — deliberately, since
caution conventionally has to live in amber territory. They stay legible as
different things because they never appear in the same role: copper is chrome,
caution is always inside a labelled status pill (`hsl(42,...)` + the word
"Review", never the color alone).

### Neutrals — warm-tinted, both modes

Cool grays (the common blue-black of dark-mode UI) fight a warm copper accent.
Both ramps carry a slight warm undertone instead, at low enough saturation that
they still read as neutral.

**Dark mode** (primary mode — the product a finance professional has open all
day defaults dark, per Verdikt and Rimac):

| Token          | Value                | For                                |
| -------------- | ---------------------- | ------------------------------------ |
| `ink-950`      | `hsl(30, 8%, 6%)`      | Page background                     |
| `ink-900`      | `hsl(30, 7%, 10%)`     | Module card surface                 |
| `ink-800`      | `hsl(30, 6%, 15%)`     | Raised surface (popover, dropdown)  |
| `ink-700`      | `hsl(30, 5%, 22%)`     | Border, hairline dividers            |
| `ink-400`      | `hsl(30, 4%, 52%)`     | Secondary text, muted labels        |
| `ink-100`      | `hsl(30, 15%, 94%)`    | Primary text on dark                |

**Light mode:**

| Token           | Value                 | For                                |
| --------------- | ----------------------- | ------------------------------------ |
| `paper-50`      | `hsl(32, 30%, 98%)`     | Page background                     |
| `paper-0`       | `hsl(0, 0%, 100%)`      | Module card surface                 |
| `paper-100`     | `hsl(30, 20%, 95%)`     | Recessed surface (inputs, wells)    |
| `paper-300`     | `hsl(30, 15%, 88%)`     | Border, hairline dividers            |
| `paper-600`     | `hsl(30, 8%, 45%)`      | Secondary text, muted labels        |
| `paper-950`     | `hsl(30, 15%, 12%)`     | Primary text on light               |

### Domain constraint (unchanged, now enforced by the tokens above)

Positive/negative is never color alone. Every semantic use pairs the hue with a
sign (+/−), an icon, or a text label — enforced concretely by the pill-badge
pattern in Data display, below. Contrast is WCAG AA minimum, checked against the
actual surface token it sits on, not assumed from the palette in isolation.

## Typography — derived (2026-08-01)

**Typeface direction, not a specific file:** a grotesk in the humanist-geometric
family — moderate x-height, true italics, a large enough weight range to carry
both display and dense UI text on its own. One typeface, not a display/body
pairing — Apple and Tesla both run the entire experience on one face and let
scale and weight do the work; that restraint transfers better to a daily-use tool
than Mercedes' serif/sans pairing, which reads as editorial rather than
functional. The specific family is an implementation choice (licensed or
variable), not fixed here.

### Scale

Few steps, large jumps between them — the restraint observed on every
reference in the library, none of which run more than four or five sizes on a
page. Tracking tightens as size increases; opens up for small uppercase labels,
matching the eyebrow pattern confirmed on both Rimac and the Verdikt dashboard.

| Token         | Size / Line height | Tracking | Weight     | For                          |
| ------------- | ------------------- | -------- | ---------- | ----------------------------- |
| `text-hero`   | `clamp(42px, 6.4vw, 96px)` / 0.94 | −3.5% | 600 | Landing hero headline only — the one place type is allowed to dominate the viewport. Ceiling set by the constraint that eyebrow through sub-CTA note must fit one viewport at 900px height; larger values pushed the CTAs below the fold. |
| `text-display`| 56px / 60px         | −2%      | 600        | Hero numbers, in-product display figures |
| `text-h1`     | 40px / 46px         | −1.5%    | 600        | Page titles                   |
| `text-h2`     | 28px / 34px         | −1%      | 600        | Section headings              |
| `text-h3`     | 20px / 28px         | −0.5%    | 600        | Card/module titles            |
| `text-body-lg`| 17px / 26px         | 0        | 400 / 500  | Lead paragraphs               |
| `text-body`   | 15px / 22px         | 0        | 400        | Default UI text                |
| `text-label`  | 13px / 16px         | +6%      | 500        | Uppercase eyebrows, e.g. "PORTFOLIO HEALTH" |
| `text-caption`| 12px / 16px         | +2%      | 500        | Timestamps, helper text        |

### Numeric data — non-negotiable

Every number that can be compared to another number renders in **tabular
figures**, no exceptions: dashboard metrics, table cells, deltas, currency. A
column of misaligned digits is the fastest way to look like an unfinished
product. Financial deltas render at `text-body`/`text-h3` weight 600 regardless
of surrounding text weight — the number is always the loudest thing in its row.

## Spacing — derived (2026-08-01)

4px base unit. Component-internal gaps use the small end of the scale; section
rhythm uses the large end — "generous and rhythmic" from the quality bar means
committing to the large steps on purpose, not stopping at `lg` everywhere.

| Token       | Value | For                                          |
| ----------- | ----- | --------------------------------------------- |
| `space-xs`  | 4px   | Icon-to-label gap, tightest internal padding  |
| `space-sm`  | 8px   | Internal padding, chip/badge padding          |
| `space-md`  | 12px  | Default control padding                       |
| `space-lg`  | 16px  | Card internal padding, form field gaps        |
| `space-xl`  | 24px  | Gap between related cards                     |
| `space-2xl` | 32px  | Gap between unrelated modules                 |
| `space-3xl` | 48px  | Sub-section rhythm                            |
| `space-4xl` | 64px  | Section rhythm on dense pages (dashboard)     |
| `space-5xl` | 96px  | Section rhythm on marketing/landing surfaces  |
| `space-6xl` | 128px | Hero-level breathing room                      |

## Radius, borders & elevation — derived (2026-08-01)

### Radius

Convergent evidence across nearly every source in the library: buttons, CTAs and
status badges are consistently pill-shaped (Tesla, Audi, Verdikt, the logistics
dashboard concept), while cards and inputs use a small-to-medium radius, never a
pill. Two radius families, used consistently by role — mixing them within one
role is a tell of an unfinished system.

| Token          | Value  | For                                  |
| -------------- | ------ | -------------------------------------- |
| `radius-sm`    | 6px    | Inputs, small controls, chips          |
| `radius-md`    | 10px   | Cards, panels, dropdowns               |
| `radius-lg`    | 16px   | Modals, large surfaces                 |
| `radius-pill`  | 9999px | Buttons, CTAs, status badges           |

### Borders

`ink-700` / `paper-300` (1px) for standard dividers. Glass surfaces use a lighter
variant per the Materials & glass section — a pure white-at-low-opacity inner
highlight rather than the standard border color, since it needs to read against
arbitrary backdrops, not just the page surface.

### Elevation — the strategy differs by mode, deliberately

Two different techniques, each backed by its own evidence source, not one ramp
forced onto both themes:

**Dark mode:** border + a one-step lift in surface value (`ink-900` →
`ink-800`), no shadow. Confirmed on both Spline's dropdown panels and the
Verdikt dashboard's module cards — shadows barely register on near-black and
read as murky rather than elevated.

**Light mode:** soft, diffuse shadow — confirmed on the logistics dashboard
concept, the library's only light-mode dense reference. Large blur, low
opacity, and warm-tinted rather than pure black, so it agrees with the warm
neutral ramp instead of looking like a generic Material Design drop shadow.

| Token          | Mode  | Value                                              |
| -------------- | ----- | ----------------------------------------------------|
| `elevation-1`  | Dark  | `border: 1px solid ink-700` + surface `ink-900`     |
| `elevation-2`  | Dark  | `border: 1px solid ink-700` + surface `ink-800`     |
| `elevation-1`  | Light | `0 1px 2px hsl(30 15% 20% / 0.06)`                  |
| `elevation-2`  | Light | `0 8px 24px hsl(30 15% 20% / 0.10)`                 |

## Materials & glass — derived (2026-08-01)

Blur and tint values, completing the recipe defined earlier this session from
`audi/`.

| Token             | Mode  | Blur  | Fill                          | Edge                                |
| ----------------- | ----- | ----- | ------------------------------ | -------------------------------------|
| `glass-nav`       | Dark  | 20px  | `ink-900` @ 72% opacity        | `white` @ 8% opacity, 1px inner      |
| `glass-nav`       | Light | 20px  | `paper-50` @ 75% opacity       | `black` @ 6% opacity, 1px inner      |
| `glass-overlay`   | Dark  | 16px  | `ink-800` @ 78% opacity        | `white` @ 8% opacity, 1px inner      |
| `glass-overlay`   | Light | 16px  | `paper-0` @ 80% opacity        | `black` @ 6% opacity, 1px inner      |

Overlay carries slightly less blur than nav so a command palette or popover
feels a fraction lighter/closer than the persistent nav bar behind it — a subtle
depth cue, not just two identical recipes reused. Both still follow every rule
in the recipe above: worst-case backdrop verification is mandatory before either
token ships on a real surface.

## Motion — derived (2026-08-01)

Measured from 60fps captures of apple.com and rimac-automobili.com, which
converge on the same reveal pattern independently. Evidence in
[`observations.md`](observations.md).

### Duration

| Token             | Value | For                                                    |
| ----------------- | ----- | ------------------------------------------------------ |
| `motion-instant`  | 100ms | State flips that must feel like nothing — checkbox, tab |
| `motion-fast`     | 180ms | Hover, focus, small property changes                    |
| `motion-base`     | 260ms | The default: panels, popovers, disclosure               |
| `motion-slow`     | 420ms | Full-surface transitions, route changes                 |
| `motion-stagger`  | 40ms  | Interval between adjacent items in a cascade            |

A staggered group of ~8 items therefore resolves in roughly 500ms end to end,
matching both references.

### Easing

| Token            | Curve                              | For                          |
| ---------------- | ---------------------------------- | ---------------------------- |
| `ease-entry`     | `cubic-bezier(0.16, 1, 0.3, 1)`    | Things arriving — decelerate |
| `ease-exit`      | `cubic-bezier(0.4, 0, 1, 1)`       | Things leaving — accelerate  |
| `ease-standard`  | `cubic-bezier(0.4, 0, 0.2, 1)`     | Property changes in place    |

Entry and exit are deliberately different curves. Nothing uses a symmetric
ease-in-out, and nothing springs or bounces.

### Principles — these carry more weight than the numbers

1. **Reveal with opacity, not translation.** Neither reference slides, springs,
   scales or bounces its menu items — they materialize in place. The slide-in
   with a spring is the generic move and is banned by default. Transform is for
   elements that genuinely move through space, not for making a list appear.
2. **Cascade top to bottom** at `motion-stagger`. Never reveal a group at once.
3. **Overlap transitions.** The outgoing element fades out *while* the incoming
   one fades in. Sequential out-then-in reads slow and cheap.
4. **Morph, don't swap,** on paired icons — hamburger↔close, play↔pause,
   chevron rotation.
5. **Interruptible always.** Reversing mid-animation continues from the current
   value and never snaps.
6. **A hold is a decision.** If a surface must sit empty while data loads, that
   empty state is designed — never an accidental blank.
7. Under `prefers-reduced-motion`, stagger goes to 0 and durations collapse to
   `motion-instant`; the state change still reads, it just stops moving.
8. **Data animates to its value on mount.** Bars grow from zero, area charts draw,
   gauges sweep, lists populate in cascade. A dashboard assembles rather than
   switching on. Confirmed against a mid-load capture in `dashboards/`. This is
   principle 2 applied to data instead of menu items — the cascade generalizes.
   It runs once on mount, never on every re-render, and never on a value update
   (a changing number tweens, it does not re-grow from zero).

### 3D scenes (WebGL) — derived 2026-08-01

First real 3D work in the product: a Three.js hero scene. Vanilla Three.js, not
React Three Fiber — this codebase has no React, and R3F is a reconciler for
React, not an independent capability; bootstrapping React + ReactDOM + the R3F
runtime to mount one scene would cost roughly 3x the dependency Three.js alone
already costs, for nothing Three.js couldn't already do directly. If the product
becomes a React app, this scene graph ports to R3F components near 1:1.

- **Position in screen-fraction space, not raw world coordinates.** A fixed
  world-space X lands at a different screen position depending on how far the
  object sits from the camera — perspective shrinks apparent lateral offset
  with distance. Define objects as `(xFrac, yFrac, z)`, `-1..1` across the
  visible frustum *at that object's depth*, and convert through the camera's
  actual FOV/aspect at render time. Recompute on resize; aspect changes what a
  given fraction maps to. This is the 2D hero's "keep it in the margins, out of
  the text column" CSS-percentage discipline, ported to 3D — skipping it is
  exactly how objects end up drifting across headline text.
- **Canvas-texture over 3D text geometry.** A "screen" inside the scene (coin
  face, invoice, KPI card) is a 2D canvas drawn once and mapped as a texture,
  not extruded glyph geometry. No font loading, no per-glyph triangle cost, and
  it reuses the same visual vocabulary already established in CSS-authored
  components — just lit and rotating in real 3D now.
- **The render loop must fully stop, not throttle, when unseen.** Gate on
  IntersectionObserver *and* on the element's own computed opacity/fade — an
  observer alone typically only fires "not intersecting" once the element is
  almost entirely scrolled past, well after a scroll-tied fade has already
  reached zero. That gap is measured cost: a WebGL frame keeps rendering,
  invisibly, overlapping whatever reveal-heavy content sits just below it.
  Also stop on `document.hidden` (tab backgrounded) — an idle canvas still
  costs a scheduled frame if the loop keeps calling itself.
  - No shadow maps, no post-processing, no env-map PBR.
  - Merge repeating geometry (e.g. chart bars) into one `BufferGeometry` — one
    draw call instead of N.
  - One draw call for any particle field regardless of count (`THREE.Points`).
  - Disable antialiasing and cap pixel ratio below what a display supports.
    MSAA is near-free on real GPU hardware but not on integrated/software
    rendering, and retina sharpness is not what makes ambient decoration read
    as premium — holding frame rate is.
  - **Runs on phones too, in a compact mode** (below 700px) — reversed
    2026-08-02, per explicit direction: the scene should not read as a
    desktop-only feature. `compact` mode changes exactly two things: (1)
    pixel ratio caps at 1 instead of 1.5 and the particle field drops from
    100 to 45 points — pure GPU/battery cost reduction, phone hardware and
    battery budget are both tighter than a laptop; (2) every floater moves
    to the four corners of the viewport (|yFrac| >= ~0.74, pushed further
    from center than the desktop's |xFrac| >= 0.5) and shrinks slightly,
    because a phone hero is a single tall stacked column that fills most of
    the viewport in both dimensions — the desktop margin rule doesn't leave
    enough clearance on a narrow screen, and corners are what actually stays
    free regardless of how much text the column holds. Verified with
    device-emulated captures at two real viewport sizes (390×844 and a
    320×568 short/narrow case) confirming no overlap with the fixed nav or
    the hero copy in either theme.
  - Detect WebGL availability and fall back to the plain CSS surface
    underneath rather than erroring — a decorative layer must never be able to
    break the page it decorates.
- **Theme reactivity without rebuilding the scene.** Watch `data-theme` via
  `MutationObserver` and refresh only the colors already read from CSS custom
  properties on the existing materials/uniforms. Geometry, positions and the
  running clock stay untouched — cheaper and avoids a visible pop on toggle.
- **Honest performance reporting.** Compositor-only CSS/transform work costs
  roughly the same regardless of GPU, so it can be measured here and trusted.
  WebGL cannot: this environment has no real GPU, so any frame-rate number
  measured here reflects software rasterization, not user hardware, and is
  pessimistic by construction. Design conservatively for that reason — don't
  report a software-rendered number as if it were the real-hardware one.

### Addendum — derived 2026-08-02, from `references/animations/` (6 clips)

A batch of new motion references (four site builds, filed at reduced
evidentiary weight — see that folder's README) surfaced one reveal variant
worth adding to the principles above, and closed three items that had been
open since the first hero-scene pass.

- **Echo-resolve, a variant of "reveal with opacity, not translation."**
  Two of the six clips (a tattoo-studio hero, a crypto-fund portfolio list)
  resolve kinetic type from a brief duplicated/ghost line rather than a plain
  rise. Layered onto the existing blur+yPercent word reveal as an additive
  afterimage — never a replacement for it, and never used on scrubbed
  surfaces, only the same one-shot `[data-split]` moment. The ghost is
  copper-tinted, appears at ~40% opacity for ~0.4s starting slightly after
  the word begins rising, and dissolves before the word finishes settling.
  Absolutely positioned over the live word so it carries no layout weight.
- **The hero scene's one light source was still functionally absent.**
  Flagged in the first pass (two beam planes at 12–16% opacity) and left
  unfixed. Replaced with the existing background shader's own glow term,
  strengthened rather than supplemented with new geometry — cheaper (no new
  draw calls) and closer to the single-dominant-glow pattern this batch
  reconfirms (a title-reveal glow in two of the four sites shown).
- **Contact shadows and a directional shading wash, also still open.**
  Every floater now carries a camera-facing sprite shadow (Spline's own
  technique, cited in the first pass and never implemented), and the two
  canvas-textured surfaces that had no light-catch cue (invoices, KPI cards)
  now carry the same upper-left highlight wash the coin faces already had.
- **Floater count: resolved to fewer, not more.** Nine floating objects was
  already denser than anything in the reference library; this batch's two
  single-focal-subject compositions (product hero, portrait hero) reinforce
  the original recommendation rather than the alternative. Trimmed to six —
  two coins, one invoice, one KPI card, the bar chart, the line chart —
  keeping one from each side of the centred headline column.

Explicitly not adopted from this batch: the lime, glitch-red and purple
accents shown (each is one more data point against a hue this system already
ruled out or never considered), numbered section indices (chapters already
use words, deliberately), and a literal preloader sequence (a blocking load
moment is the wrong trade for a tool opened daily, however good it looks in a
9-second clip).

## Component conventions — derived (2026-08-01)

- **Focus ring.** 2px `copper-500`, 2px offset from the element edge. Never
  suppressed, never replaced by a background-color change alone — keyboard
  navigation must be visually unambiguous on every surface, glass included.
- **Disabled.** Opacity reduced to 40%, pointer events off. Never communicated by
  color shift alone, since that fails the same test as profit/loss color-only
  encoding — pair with `cursor: not-allowed` and, where the disabled reason
  matters, a tooltip.
- **Hit target minimum.** 44×44px for every interactive element regardless of
  visual size — a pill badge or icon button can render smaller than that and
  still needs the full target.
- **Icon sizing.** 16 / 20 / 24px tied to `text-caption` / `text-body` /
  `text-h3` respectively. Icons are optically centered against adjacent text —
  vertically centered by eye, not by bounding-box math, since most icon glyphs
  sit slightly off-center within their box.
- **Required states, every interactive or data component:** default, hover,
  focus, active, disabled, loading, empty, error, and — specific to an
  analytics product and the state most often skipped — **not enough data yet**.
  That last one always follows the sample-data pattern in Data display below,
  never a blank panel.
- **Status is never color alone**, anywhere in the product: sign, icon, or text
  label accompanies every semantic color use. This is the single rule most
  worth enforcing in review, since it is the easiest one to quietly drop under
  deadline pressure.

## Data display — partially derived (2026-08-01)

Structural patterns from the `dashboards/` reference. Values still TBD; the
structure is decided.

- **Module cards.** Each analytical unit is a card on the page background,
  separated by a subtle border plus a slight surface lift rather than a heavy
  shadow. Depth on dark comes from border and surface value, not from shadow
  spread.
- **Eyebrow + title.** A small uppercase letterspaced category label sits above a
  plain-language title. The eyebrow classifies so the title can stay human. Adopt
  this — it lets a dense page stay scannable without shouting headings.
- **Status trio.** One semantic set (positive / caution / negative) applied
  consistently across dots, numerals, distribution bars and timelines. **Never
  hue alone:** every status carries a shape, icon or label as well. Two values
  that differ only in color are a defect, and profit/loss is exactly where this
  bites. The pattern to follow is a **pill badge carrying a text label** —
  "Cleared", "Review", "Flagged" — which reads without color at all.
- **Selection by inversion.** A selected card inverts to a solid accent fill while
  its siblings stay on the base surface. Decisive at density, and far more legible
  than a border change.
- **Icon chips are a small-count device.** A tinted circular icon per KPI tile
  reads as a legend at four tiles and as noise at twelve. If a KPI row can grow,
  do not hue-code its tiles.
- **Numbers.** Tabular figures everywhere. The metric is the largest thing in its
  card; its unit and qualifier sit smaller and quieter beside it.
- **Sample-data state.** The "not enough data yet" case is a labelled preview with
  representative data and a clear call to make it real — never a blank panel.
  This is the state analytics products most often skip and the one ProfitMe
  should get visibly right.
- **Reflow, don't hide.** Narrow layouts stack modules to one column and drop KPI
  rows to a 2×2 grid. Nothing is dropped on small screens; the composition
  reflows.

## Layout — derived (2026-08-01)

| Token           | Value   | For                                    |
| --------------- | ------- | ----------------------------------------- |
| `breakpoint-sm` | 640px   | Mobile → tablet                           |
| `breakpoint-md` | 1024px  | Tablet → desktop                          |
| `breakpoint-lg` | 1440px  | Desktop → wide desktop                    |
| `container-app` | 1280px  | Max width for dashboard content            |
| `container-narrow` | 720px | Max width for reading-width content (docs, settings forms) |

12-column grid at `md` and above, 4-column below `sm`. Gutter follows the
spacing scale (`space-xl` at desktop, `space-lg` at mobile) rather than a fixed
pixel value independent of it.

**Narrow-screen dashboard story:** reflow, don't hide — already specified in
Data display. Module grids collapse to a single column; multi-column KPI rows
drop to 2×2 before 1×N, since a single vertical stack of eight tiles forces too
much scrolling before any number is visible. Tables gain horizontal scroll
within their own card rather than shrinking text below `text-caption`.
