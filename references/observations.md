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

> **Provenance:** Verdikt is deployed at a Vercel preview URL and two files are
> named `dash-filled.png` / `dash-mobile.png`, i.e. exported design artifacts.
> This looks first-party. If it is, it is a consistency baseline rather than a
> reference, and its palette may be intentionally shared with ProfitMe rather than
> deliberately avoided. Unresolved — see the note in `dashboards/README.md`.

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
