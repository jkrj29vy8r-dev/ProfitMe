# ProfitMe Design System

The derived layer. Raw assets in the sibling folders are inspiration; **this file
is the contract.** Every UI component builds from these tokens.

> **Status: v1 complete (2026-08-01).** Every token below is derived — from
> measured evidence where the references support it, from explicit domain
> reasoning where they don't. See [`observations.md`](observations.md) for the
> evidence trail. This is a system to build components from, not a mockup; it
> gets revised as real components expose gaps, per the maintenance rules above.

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
| `text-display`| 56px / 60px         | −2%      | 600        | Hero numbers, landing headline |
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

## Color — TBD

Neutral ramp, surface levels, border colors, one accent and what it is reserved
for, and semantic colors.

**Domain constraint:** ProfitMe reports profit and loss. Positive/negative must
never be encoded in color alone — pair with sign, icon, or label. Contrast is
WCAG AA minimum, verified against real surfaces rather than assumed.

## Typography — TBD

Typeface, type scale and its steps, weights in use, tracking per size, line
heights, measure limits. Prefer few steps used consistently over many used
loosely. Tabular figures for all numeric/financial data.

## Spacing — TBD

Base unit and scale. Component-internal padding, gaps between related elements,
section rhythm. Every gap in the product resolves to a step on this scale.

## Radius, borders & elevation — TBD

Radius scale and which size belongs to which surface class. Border weight and
color. Shadow ramp tied to elevation level. Consistency here does more for
"premium" than any single flourish.

## Materials & glass — partially derived (2026-08-01)

Which surface classes are glass, and the blur/tint values per class, remain TBD.
The **recipe** is decided, derived from `audi/` — the one production reference
where translucent controls sit on photography and stay legible across a bright
sky and a near-black car body in the same scroll.

1. **Restraint over drama.** Enough backdrop shows through to read as material;
   not enough to let the backdrop's contrast swing through it. If the content
   behind is clearly identifiable through the surface, there is too much
   transparency.
2. **Always a visible edge.** A border or inner highlight, so the control's
   boundary never depends on the backdrop. This is what actually makes glass read
   as an object rather than a smudge.
3. **Flat label value.** Text on glass stays one fixed color and never picks up
   tint from behind it.
4. **Hierarchy by fill weight, not hue.** Primary and secondary differ in
   opacity/fill, so the pair behaves identically on any backdrop.
5. **Worst-case verification is mandatory.** Every glass surface records the
   lightest and darkest backdrop it must survive, and contrast is checked against
   both — never against a favorable screenshot.
6. Floating surfaces only — nav, overlays, command palette, sticky headers. Never
   on a large surface that animates or scroll-links. Solid fallback always
   available.

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
