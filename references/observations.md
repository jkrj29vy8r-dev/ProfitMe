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
