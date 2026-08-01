# ProfitMe Landing — Design Specification (from `/references`) & Gap Analysis

Produced 2026-08-01 by a full recursive re-read of every file currently in
`/references` (20 assets: 13 stills, 7 videos, across apple/ tesla/ rimac/
mercedes/ spline/ audi/ dashboards/ concepts/), followed by a fresh capture of
the current build for comparison. No code was changed to produce this document.

## Methodological caveat — read this before the rest

**Every asset in `/references` is a mobile capture, 1290×2796 (iPhone).** The
current landing page is a desktop-primary build (1440px). Layout and spacing
numbers do not transfer 1:1 across that gap — a "95% pixel match" claim would
be meaningless without a viewport to match it at. What *does* transfer, and is
what this document extracts, is **ratios and principles**: how much empty
space per unit of content, how many light sources, how many focal objects per
screen, how contrast is distributed. Where a reference genuinely constrains a
desktop decision, it's stated. Where it doesn't, that's stated too, rather than
invented.

**Second caveat, load-bearing for the rebuild:** several folders are real
companies' live marketing sites (Apple, Tesla, Rimac, Audi, Mercedes) and one
is another designer's Dribbble portfolio (`concepts/`). This spec extracts
*principles* — lighting logic, composition ratios, material technique — never
specific brand elements (a color that reads as *their* identity, a layout
that's recognizably *their* page). Where closing a gap would mean adopting a
specific brand's signature element rather than a general technique, it's
flagged **[BRAND-SPECIFIC — confirm before doing]** below, per the standing
originality rules in `CLAUDE.md`. Everything else is safe to execute against
without asking again.

---

## PART 1 — Design specification, derived fresh

### 1. Layout

- **One focal subject per screen**, not a grid of competing elements. Rimac and
  Audi each give an entire viewport to one headline + one image. Spline's hero
  is one 3D object + one line of copy. Verdikt's dashboard is the outlier —
  intentionally dense — but even there, one module (the fleet-verdict gauge)
  is visually dominant and everything else is secondary.
- **Chrome recedes.** Tesla and Rimac's entire top nav is a wordmark and (at
  most) a hamburger. No reference runs a heavy nav bar competing with hero
  content.
- Verdikt/logistics-concept dashboards use a **module-card grid**, uniform
  gutter, no card larger than it needs to be for its one number or chart.

### 2. Spacing

- Marketing pages (Rimac, Audi, Tesla): **negative space dominates** — a
  screen is "one headline + generous air," not "headline plus filler." The
  ratio of empty-to-content is high, deliberately.
- Dashboard surfaces (Verdikt, logistics concept): **tight, efficient,
  consistent gutters** between KPI tiles — small-scale rhythm, not generous
  air, because density is the job there.
- Current build already tracks this reasonably well on both counts — this is
  **not a significant gap.**

### 3. Typography

- Every reference runs **very few sizes per screen** (confirmed already in
  `design-system.md`). Verdikt's dashboard numerals are the sharpest data
  point: the metric is the loudest thing in its card by a wide margin — bigger
  and bolder relative to its label than the current build's KPI tiles.
- No reference in this set uses more than one typeface family per surface
  except Mercedes (serif headline / sans UI) — already noted and deliberately
  not adopted, since a serif reads editorial rather than functional for a
  daily-use tool (see `design-system.md`, Typography).

### 4. Color

- Already exhaustively derived. Restating the one fact that matters for this
  gap analysis: **Verdikt's dashboard glow, ring gauge, and accent are blue.**
  Matching it at "95%" literally would mean reintroducing blue — which
  directly reverses the brand decision already made and documented (blue is
  the consensus across 4 of 9 shipped sources, which is why copper was chosen
  instead). **[BRAND-SPECIFIC TENSION — see decision point below.]**

### 5. Lighting — the category this task most under-served last round

- **Audi**: one soft, bright key light (the sky) behind/above the product,
  car reads as a controlled silhouette against it. Single source, high
  contrast, nothing competing.
- **Rimac**: near-black scenes, one soft directional light catching a single
  white architectural surface. Huge dynamic range — true blacks next to a
  clearly lit highlight, nothing washed to grey.
- **Spline**: 3D primitives lit by one elevated key light + ambient fill,
  producing a visible specular highlight and a **contact shadow** grounding
  each shape to an implied surface.
- **Verdikt**: a soft **warm radial glow** sits behind the hero headline at
  the top of an otherwise near-black page — this is the single most
  "premium-lighting" moment in the entire reference set, and it's a glow, not
  a beam.
- **Apple**: deliberately flat, no glow, no drama — restraint as the choice.

**Synthesis:** every reference that reads as premium uses exactly **one**
dominant light source per screen — never several competing highlights, never
scattered decoration. Two important, specific findings:

- **No reference anywhere in this set contains a literal "god ray" / light-shaft
  effect.** The closest things are Verdikt's soft radial glow and Audi's bright
  backlight. If "restore volumetric light beams" is read as literal Tyndall
  shafts, that's not actually a documented pattern here — it's closer to the
  general "cinematic 3D scene" register than to anything in `/references`. The
  reference-backed correction is a **single strong soft glow**, not multiple
  visible beam planes.
- The current build's two beam planes render at 12–16% opacity — nearly
  invisible in the capture (see `current-hero-dark.png`). Whatever the target
  effect, the present execution reads as absent, which is a legitimate,
  reference-backed gap regardless of how "beams" get resolved.

### 6. 3D composition

- **Spline** is the only true-3D reference in the set: few objects (1–2 per
  view), each with a visible material response and a **grounding contact
  shadow** — nothing floats with no anchor.
- **Rydex / logistics concepts**: fake-3D via CSS/render perspective tilt on
  otherwise flat UI panels, each with a soft shadow beneath establishing it
  sits above the page, not glued to it.
- **No reference shows a dense field of many small simultaneous 3D objects.**
  The closest thing, Spline, is sparse by comparison.

**This is the most important finding for the rebuild decision.** The
reference set's actual 3D-composition principle is **fewer objects, larger,
better lit, each grounded with a shadow** — not "more floating trinkets." The
current build (9 small floating objects, none grounded, flat unshaded
textures on everything except the coins) is already *more* maximalist in
object count than anything in `/references`, while under-executing on the
lighting/shadow craft that makes Spline's sparser scene read as premium.
Simply adding *more* objects would move further from the reference set, not
closer to it. **This needs your call before I touch the scene — see decision
point below.**

### 7. Motion

Already measured and derived in `design-system.md` from Apple + Rimac (opacity
lead, top-to-bottom stagger, overlap crossfade, icon morph). The current
build's GSAP text/card reveals already implement this closely — **not a
significant gap.**

### 8. Scroll behavior

No reference asset is a long scroll capture with camera-depth motion — they're
short clips (menu opens, product-page taps) or static stills. **The "scroll
like Apple Vision Pro" direction from earlier in this project has no
supporting evidence in `/references`** — it's a separate, valid design
direction, but it isn't something this folder can source-of-truth. Flagging
this rather than quietly inventing a reference for it.

### 9. Premium feeling (qualitative synthesis)

Restraint; one hero moment per screen; one light source; grounded objects;
huge dynamic range between shadow and highlight; a glow reserved for exactly
one focal point, never scattered.

### 10. Animations

Covered under Motion (§7) — no separate findings beyond what's already
derived.

---

## PART 2 — Gap analysis: current build vs. this spec

Grounded in fresh captures: `current-hero-dark.png`, `current-hero-light.png`,
`current-pinned.png`, `current-full-dark.png` (all in the session scratchpad).

| # | Gap | Reference evidence | Severity | Safe to close directly? |
|---|-----|---------------------|----------|---------------------------|
| 1 | No contact/grounding shadow under any floating 3D object — they read as flat cutouts in a void | Spline (contact shadow under every shape), logistics concepts (shadow under every tilted panel) | High | **Yes** — lighting/material technique, not brand-specific |
| 2 | Ambient light is two beam planes at 12–16% opacity — functionally invisible | Verdikt's radial glow is the closest analog and is clearly visible, not subtle to the point of absence | High | **Yes** — replace faint beams with one strong soft glow |
| 3 | Non-coin objects (invoices, KPI cards, charts) use flat unlit canvas textures — no shading gradient for the key light to catch | Spline's objects show visible specular falloff | Medium | **Yes** |
| 4 | Pinned dashboard mock is flat — solid panel, 1px border, no glow, no gradient chart fill | Verdikt's real dashboard has a glowing gauge ring, gradient area-fill under the trend line, glow-adjacent status dots | Medium | **Yes, using copper — not blue** |
| 5 | Narrow dynamic range — hero sits in one dark-brown tonal band | Rimac's true-black-next-to-lit-highlight contrast | Medium | **Yes** |
| 6 | 9 simultaneous floating objects, none grounded | No reference shows this density; Spline shows 1–2 grounded objects | High | **Needs your decision — see below** |
| 7 | Dashboard-blue glow/ring/accent | Verdikt uses blue for all of this | — | **[BRAND-SPECIFIC]** — do it in copper, not blue, per existing brand decision |
| 8 | KPI numerals not as dominant/bold relative to card as Verdikt's | Verdikt dashboard stills | Low | **Yes** |
| 9 | Camera is pointer-reactive only, not scroll-linked, inside the hero | No reference evidence either way — this is a Vision-Pro-style addition, not a reference-backed gap | — | Optional, your call, not a "match the reference" item |

**Not a gap** (confirming rather than flagging): dark-mode card style
(border + surface lift, no shadow) already matches Spline/Verdikt's own
technique — this was correctly derived already and shouldn't be "fixed"
toward drop shadows.

---

## Decision points before any rebuild starts

1. **Object count in the hero scene: fewer-and-grounded, or more-as-requested?**
   The reference-backed correction is fewer, larger, better-lit, grounded
   objects. Your instruction asked to restore more objects. These pull in
   different directions — tell me which one to build.
2. **Dashboard/gauge glow color: copper (on-brand) or blue (literal Verdikt
   match)?** Recommend copper; confirm if you want literal.
3. Everything else in the table (contact shadows, a real glow, material
   shading, dynamic range, numeral scale) I can execute directly — no further
   confirmation needed on those.

Holding here per your instruction not to code yet. Tell me how you want (1)
and (2) resolved and I'll start the rebuild against this spec.
