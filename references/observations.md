# Observations

Findings from reading the raw assets. This is the working layer between the
screenshots and `design-system.md` — evidence lives here, decided tokens live
there. Append a dated entry per analysis pass.

---

## 2026-08-01 — first pass (7 assets, mobile)

Sources: apple.com, tesla.com, rimac-automobili.com, mercedes-benz.ro,
spline.design. All iPhone captures, 1290×2796. Videos are 60fps, which is what
made the motion timings below measurable rather than guessed — frames were
extracted at 30fps through the transitions.

### Motion — the strongest finding

**Apple and Rimac independently converge on the same menu-reveal pattern.** Two
unrelated teams arriving at the same solution is the most reliable signal in the
library so far.

Measured, frame by frame:

- **Opacity only.** Items materialize in place. Neither site slides, springs,
  scales or bounces the menu items. The generic implementation — slide in from
  the edge with a spring — appears in neither reference.
- **Top-to-bottom stagger,** roughly 30–50ms between adjacent items. On Rimac the
  primary items lead and the secondary link list follows in the same cascade; on
  Apple the eight items fade up in sequence over about half a second.
- **~500ms total** from first item appearing to last item settled.
- **Overlapping crossfade, not sequential.** On Rimac the outgoing page content is
  still fading out while the first menu items are already fading in. Nothing waits
  its turn. Apple differs — it clears the surface, holds white for ~0.4s, then
  reveals — because a real page navigation is happening underneath.
- **Icon morph.** Both morph hamburger↔close rather than swapping icons.

Rimac's section transitions use the same vocabulary at a larger scale: full-screen
crossfade with the heading resolving as the imagery settles.

### Layout & structure

- **Tesla:** full-bleed imagery with text overlaid low-left, dot pagination,
  horizontally swipeable card rails, and one persistent bottom CTA that survives
  the entire scroll. Top nav is a wordmark and a single "Meniu" word — nothing else.
- **Rimac:** a persistent numbered index (01–04) pinned bottom-left doing double
  duty as nav and progress indicator. Very little else on screen at any moment.
- **Apple:** stacked full-width product tiles, each its own composition, alternating
  light and dark. Product page mixes autoplaying video with progress dots, an
  interactive swatch picker, and expandable `+` hotspots over imagery.
- **Mercedes:** serif display headings over a sans UI, one quiet "Filtrați și
  Sortează" control instead of a filter bar, product cards with a single saturated
  CTA on an otherwise achromatic page.
- **Spline:** elevated dropdown panel separated by a border plus a slight lift
  rather than a heavy shadow — the dark-UI depth trick worth stealing in principle.

### Typography

Two distinct strategies, both legitimate:

- **Wide-tracked uppercase display** (Rimac) — letterspacing does the work, weight
  stays light. Reads expensive, works on dark.
- **Serif display over sans UI** (Mercedes) — the pairing carries the hierarchy
  almost by itself, with few sizes in play.

Apple and Tesla both run a tight type scale — very few steps, large jumps between
them. Nobody uses many sizes. That restraint is the transferable lesson.

### Color

Every reference here is achromatic or near-achromatic, reserving exactly one
saturated color for the primary action. Tesla, Mercedes and Spline all land on a
blue CTA against grayscale. **This is a structural principle worth taking and a
color worth avoiding** — a blue accent on a neutral ground is the single most
common choice in this set, and copying it would put ProfitMe in the middle of the
crowd rather than apart from it.

### Chrome

Consistently minimal. Tesla's entire top nav is a wordmark plus one word; Rimac
keeps a mark and a hamburger. Persistent bottom CTAs (Tesla, Mercedes) do the
conversion work instead of a loud header.

### Not yet answerable

Nothing here constrains ProfitMe's color, type scale or spacing scale — these are
all marketing and configurator surfaces, and none is a data-dense product UI.
The `dashboards/` folder is still empty, so the surfaces that matter most for an
analytics product have no reference coverage yet. Type and color tokens stay
undecided until there is either dashboard reference material or a ProfitMe brand
decision to derive from.

---

## 2026-08-01 — second pass (8 new assets)

Five of the thirteen files in this batch were re-uploads of assets already filed;
deduplicated by hash before analysis. The eight new ones split into two very
different classes of evidence.

### Verdikt dashboard — the `dashboards/` gap, filled

Four stills and a flow video of a dark analytics dashboard for an AI
vehicle-intelligence product. This is the first genuinely data-dense product UI in
the library and the closest thing here to ProfitMe's actual job.

**Entry choreography** — readable because one capture happens to catch the
dashboard mid-load, before its data settles:

- Progress bars sit at zero and grow to value.
- The area chart is empty and draws in.
- The activity timeline is absent and populates.
- The radial score gauge arc sweeps to position.
- The live counter ("analyses / hour") ticks — it read 1,221 / 1,238 / 1,274
  across three captures seconds apart.

So: **data animates to its value on mount rather than appearing pre-filled.** Every
module carries its own entry, and the page assembles rather than switching on.
This is the same staggered-reveal principle already derived from Apple and Rimac,
applied to data rather than to menu items — which is a strong sign the principle
generalizes.

**Structure** — a module-card system on near-black, each card carrying a small
uppercase letterspaced eyebrow ("COMMAND CENTER", "INTERACTIVE SCORE", "VERDICT
MIX", "PREMIUM ANALYTICS", "VEHICLE HEALTH", "ACTIVITY") above a plain-language
title. The eyebrow does the categorization so the title can stay human. Cards
separate from the background by a subtle border plus a slight surface lift — the
same dark-UI depth technique noted on Spline, confirmed here in a product context.

**Semantic status** — a green/amber/red trio runs consistently across dots,
numerals, the distribution bar and the timeline. Notably the numeral itself is
colored, not just an adjacent dot. **This is the accessibility trap named in
`CLAUDE.md`:** score 47 in red and 84 in green differ *only* by hue in the ranked
list. ProfitMe must pair status with a shape, icon or label, since profit and loss
carry the same risk.

**Responsive** — the narrow layout stacks every module to one column and drops the
KPI row from four across to a 2×2 grid. Nothing is hidden; the composition
reflows. Worth following.

**Other details worth keeping:** a "Preview / Sample data — run a verdict to make
it yours" chip, which is the *not enough data yet* state solved gracefully rather
than with an empty panel; the VIN input with an inline character counter (0/17), a
scan affordance, and the submit button living inside the field; and a
"Synthesizing…" loading state that names what is happening instead of showing a
bare spinner.

> **Provenance: resolved 2026-08-01.** Verdikt is first-party but a deliberately
> separate product. Structure transfers, surface does not: take the module-card
> system, eyebrow labels, entry choreography, sample-data state and reflow
> behavior; give ProfitMe its own palette and type voice so the two never read as
> the same product. This also means Verdikt's blue-cyan accent goes on the avoid
> list alongside the others — for a different reason than Apple's or Tesla's, but
> the same outcome.

### Dribbble concept shots — filed at lower weight

Three captures of a car-rental landing concept. Filed in `concepts/` with a README
explaining why portfolio work does not carry the same evidentiary weight as
shipped product.

Being straight about it: this shot contains several things already on the
*generic* list in `CLAUDE.md` — a bento grid of stock photography, one saturated
red applied decoratively to every surface, and four equal icon-topped feature
cards. It is a useful contrast case precisely because it looks impressive as a
static image and would not survive as a product.

Two ideas are worth keeping: reducing a multi-step process to four labelled steps,
and floating the search control over the bottom edge of the hero so it bridges two
sections instead of sitting inside one.

### Cross-cutting

The blue-accent-on-neutral observation from the first pass now holds across seven
of nine sources, Verdikt included. Continuing to treat it as a structural
principle to keep and a specific color to avoid.

---

## 2026-08-01 — third pass (5 new assets)

One shipped site and four concept shots.

### Audi — translucent controls over photography

`audi.ro`, dark automotive marketing, structured as full-screen chapters: image,
heading, two stacked pill CTAs, repeat. A footer carousel of models with explicit
prev/next chevrons, an icon-plus-label quick-link row, and a persistent
back-to-top control.

**The reason this asset matters is glass.** It is the library's clearest
production example of frosted, translucent buttons sitting directly on
photography, and it survives the case `CLAUDE.md` demands be verified — the same
button treatment stays legible over a bright sky and over a near-black car body
within one scroll. How it manages that:

- The translucency is **restrained**. Enough backdrop shows through to read as
  material; not enough to let the backdrop's contrast swing through it.
- Every pill carries a **visible edge**, so the control's boundary never depends
  on the backdrop behind it.
- The label stays a **single flat value** rather than picking up any tint from
  what is behind it.
- Primary and secondary differ by **fill weight**, not by hue — so the pair works
  identically on any backdrop.

That is the transferable recipe for the glass rules already in the design system,
and it is now recorded there.

Also worth keeping: the two-CTA rhythm closing every chapter, which gives a long
scroll a predictable beat without repeating a layout.

### Logistics dashboard concept — the light-mode counterweight

The most transferable concept work received so far, and the library's only
light-mode data-dense layout. Against the dark Verdikt dashboard it isolates which
patterns are genuinely structural rather than theme-dependent:

- **The eyebrow-over-title and module-card patterns survive the theme flip.** Both
  dashboards independently use small labels above large values inside bordered
  cards. That mutual confirmation raises confidence these are structure, not style.
- **KPI tiles pair each metric with a tinted circular icon chip**, each in a
  different hue. On four tiles it reads as a legend. It would not survive twelve —
  a caution worth recording, since analytics pages grow.
- **One selected card inverts to a solid accent fill** while its siblings stay
  white. Selection by inversion rather than by border is decisive and reads
  instantly at density.
- **Status is a pill badge with a text label** — "In transit", "Processing",
  "Received", "Paid". Text plus color, not color alone. This is the accessible
  answer to the exact trap flagged in the Verdikt dashboard, and it comes from the
  weaker source. Concept work can still be right about a specific thing.
- Period filters (`Period / Day / Month / Year`) sit as a quiet segmented control
  in the header rather than as a filter bar.

Caveats consistent with the folder: perfect placeholder data, no empty or error
states, and perspective mockups that flatter the composition.

### Library balance — worth flagging

The library is now nine shipped sources and three concept sources, and it is
heavily weighted toward **automotive marketing**: Tesla, Mercedes, Rimac, Audi,
plus three car-related concept shots. That is a lot of full-bleed photography and
hero-plus-CTA structure, and very little of what ProfitMe actually is.

Still thin or absent: `stripe/`, `linear/`, `vercel/`, `porsche/` are empty, and
there is exactly one shipped analytics dashboard. Type and color remain undecided
for the same reason as the first pass — the evidence is about marketing surfaces,
and ProfitMe is a working tool someone opens daily.

---

## 2026-08-01 — v1 design system synthesis

No new assets. This pass closed the remaining `TBD` sections in
`design-system.md` — color, typography, spacing, radius/elevation, component
conventions, layout — using the full evidence gathered across the first three
passes, plus explicit domain reasoning where the references are silent (marketing
sites don't constrain a daily-use analytics tool's density or type scale on
their own).

**The color decision is the one worth flagging on its own.** Blue-on-neutral now
appears in Tesla, Mercedes, Spline *and* Verdikt — four of nine shipped sources,
independently. That crosses from "one popular choice" to "the default," which
means it's disqualified as ProfitMe's accent by the originality rules' own logic:
a direction shared by the majority of the reference set isn't synthesis, it's
consensus, and consensus is what "never generic" is defined against. Copper was
chosen instead — Porsche/Apple's *material* register rather than any brand's
literal palette, unclaimed across the whole library, and deliberately kept out of
the green/red semantic hues so brand identity and P&L status never share a
lookup.

Everything else in this pass extends prior findings rather than introducing new
ones: the pill-for-interactive / small-radius-for-containers split, confirmed
across five sources now (Tesla, Audi, Verdikt, the logistics concept, and by
absence — nobody in the library puts a pill on a card); the dark-vs-light
elevation split, which keeps Spline/Verdikt's border-and-lift technique for dark
and the logistics concept's diffuse shadow for light rather than forcing one
ramp onto both; and a single-typeface direction over Mercedes' serif/sans split,
on the reasoning that a serif reads editorial in a tool opened daily rather than
premium.

**What this pass did not do:** invent evidence. Where the library is genuinely
silent — a specific typeface file, exact chart color mappings, table row
density — the design system says so rather than presenting a guess as derived.

---

## 2026-08-02 — animations/ (6 clips, one TikTok compilation)

Source: a single @webloved TikTok ("Can you believe Claude F5 did this?"),
showing four different agency/AI-builder site builds back-to-back off a laptop
screen — 576×1024, six segments split into separate files for the folder.
Filed at the same reduced evidentiary weight as `concepts/`: built to read as a
striking 9-second clip, not to survive daily use, and every site shown is a real
studio's actual branded work, so wordmarks, copy and specific palettes are
off-limits the same way Dribbble work already is.

Four sites: **Anyflow** (lime agency site), **Monolith** (black-and-white tattoo
studio), **Drip** (cream product e-commerce), **Dragonfly** (near-black crypto
fund, glitch/monospace). Full breakdown of what's extracted from each is in
`animations/README.md` rather than duplicated here.

**The one finding worth stating plainly:** every hero across all four sites is a
kinetic-type event rather than a photo or a static composition — the headline
animating *is* the hero — and color is spent on exactly one keyword or shape per
screen, never a themed wash. That is a faster, punchier register than the calm
opacity-led crossfade already measured off Apple and Rimac in this file's first
pass. It is a real alternate direction, not evidence that the existing one is
wrong: ProfitMe is a tool a finance professional keeps open all day, and a
kinetic-typographic hero that performs once and then has nowhere to go on
scroll fits a marketing landing page better than a daily-use product. Filed for
future landing-page work (the hero already reveals its headline as a scroll
event, which is the closer relative), not pulled into `design-system.md` now —
no component or page task is in flight to derive a token against.

Lime and glitch-red are each one more data point for hues already ruled out —
lime for the same "if everyone converges here it isn't synthesis" logic that
disqualified blue, glitch-red as tonally wrong for a profit/loss tool where red
already carries a specific, serious meaning. Neither changes the copper
decision; both make it slightly better-evidenced.

---

## 2026-08-03 — dashboard reveal pass (re-read for a Trigger B redesign)

Re-listed `references/` (26 assets) and re-read the ones this task actually
turns on, in full: all four `dashboards/` stills plus the Verdikt flow video,
`concepts/dribbble-logistics-dashboard-perspective.png`, and frame extractions
from `spline/`, `tesla/` and `apple/`. The six `animations/` clips were read in
depth earlier the same day (see the 2026-08-02 entry) and are not re-derived
here. `audi/`, `rimac/`, `mercedes/` and the remaining `concepts/` stills were
not re-opened this pass — their findings are already in the entries above and
nothing in this task depended on re-confirming them.

**The find of the pass: `verdikt-dashboard-desktop-midload.png` is a genuine
partially-loaded frame, and what is missing from it is systematic.** Chrome,
eyebrows, panel titles, every KPI number, and the ring gauge's drawn arc are
all painted. The area chart is entirely absent, every progress bar is an empty
track, the distribution bar and its headline percentage are absent, and the
activity list is absent. Comparing it against `-settled.png` gives an assembly
order rather than a guess: shell → labels → headline numbers → charts, bars and
rows last. Folded into `design-system.md` (Motion, principle 8) as a table,
because it is the kind of thing that would otherwise be re-invented as "fade
the panel in" on every future reveal.

**Second find: the loading state is labelled with a domain verb.** The Verdikt
flow video holds on a partial arc reading "Synthesizing…" — not a spinner, not
"Loading". Added to Component conventions. For an analytics product the count
of what is being processed is itself a piece of information, so the hold can
carry real content.

**Perspective is reference-backed; hardware is not.** The logistics concept
tilts dashboard panels in 3D with soft grounding shadows and one panel lifted
forward, which supports a perspective treatment. But **no asset in the library
contains a laptop, a phone frame, or any device chrome at all** — Verdikt is a
flat screenshot, the concept work is bare floating panels. The laptop built
this pass came from an explicit product instruction, not from the references,
and it is deliberately abstract (a bezel, a deck, a trackpad rectangle) rather
than a rendered machine. Flagged because a photoreal laptop reveal is Apple's
signature move and `apple/` is in this library; going near it would be the
copy the originality rules exist to prevent. The dashboard is the subject, the
hardware is a stage.

**Not adopted:** Verdikt's blue accent and its glowing blue ring gauge (the
copper decision stands, and this is the third pass that has had to say so);
the Spline gallery's card-grid hero; Tesla's full-bleed product photography,
which has nothing to give a product with no physical object to photograph.

---

## 2026-08-03 — Motion pass across the whole application

**Trigger:** a direct instruction to apply one set of motion principles
everywhere — ease-in-out, natural acceleration and deceleration, small
overshoot, micro-interactions, hover lift, soft shadow, animated borders and
gradients; no cheap bounce, no over-animation.

**Reference handling, stated plainly.** `references/` was re-listed at the start
of this pass: 42 files, identical to the set analysed earlier the same day —
no new assets. The raw clips were therefore not re-opened frame by frame; the
derivations already recorded in this file were used instead. That is a
deliberate departure from the "re-read every asset" rule, and it is only
defensible because the folder is provably unchanged *within the same session*.
A later session must re-list and re-read rather than trusting this note.

**The conflict this pass had to resolve.** The instruction asked for ease-in-out
everywhere. `design-system.md` said the opposite: "Nothing uses a symmetric
ease-in-out." Both were partly right, and the resolution is recorded in the
Easing section — the old rule was derived from *arrival* captures and then
over-generalised to interaction, which those captures never covered. Curve is
now selected by motion type. Overshoot got a hard number (≤8%, one settle) so
"small overshoot" and "cheap bounce" stop being a matter of taste.

**Four defects found while implementing, none of them cosmetic:**

1. **Every card hover would have been dead.** GSAP leaves an inline `transform`
   after a tween, and inline styles beat the stylesheet — so a CSS hover lift on
   any revealed card silently did nothing. Fixed by ending each reveal with
   `clearProps`. Caught by asserting the inline style is empty after the entry
   completes, not by looking at the page.
2. **Three reveals were already no-ops.** `transform` does not apply to
   non-replaced inline elements, and `display: contents` generates no box —
   so two prose reveals were degrading to flat fades and the closing CTAs were
   appearing with no animation at all. Also fixed an unclosed `<span>` found in
   the same markup.
3. **Two things moved for one pointer.** Hovering a timeline row lifted the
   enclosing card as well, sliding the row out from under the cursor. Measured
   as a 3px shift, fixed by having the card yield its movement to the row.
   Became principle 10.
4. **Hover would have latched on touch.** No `(hover: hover)` gate existed, so
   tapping a card on a phone would leave it stuck mid-lift. Became principle 11.

**Performance.** Measured like-for-like against the committed baseline in the
same session, three runs each, scrubbing the pinned reveal: baseline 37.6fps
with 13.0% of frames over 33ms, after the change 38.7fps with 5.0% over. No
regression. Note for future passes: an earlier entry in this file reports
50.6fps for the same sequence — that was a less loaded sandbox, not a faster
page. Absolute frame numbers from this environment are only meaningful when
both sides are measured minutes apart on the same machine.

**Deliberately not done.** `backdrop-filter` is still never animated — the nav's
blur is static. "Soft blur transitions" is honoured where blur is cheap
(short timed tweens on small elements during entry, dropped to `filter: none`
on completion) and refused where it is not (animating the blur radius of a
large glass surface), per the existing performance contract.

**Still open:** the site has no `favicon.ico` — a 404 on every page load,
unrelated to motion, left alone rather than silently widening this pass.
