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
