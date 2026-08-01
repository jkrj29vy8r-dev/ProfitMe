# ProfitMe

## Design Workflow

`references/` is the single source of truth for the design system. Nothing in
this product gets styled from taste, memory, or a component library's defaults.

It holds two layers, and the distinction matters:

- **Raw assets** — the screenshots, GIFs and video in the subfolders. Inspiration
  only, never copied.
- **[`references/design-system.md`](references/design-system.md)** — the derived,
  decided tokens for ProfitMe: color, type, space, radius, shadow, motion. This
  is the canonical layer. It is *answerable to* the raw assets and *binding on*
  the code.

Components conform to the derived layer. That indirection is the whole point —
re-deriving tokens from raw video on every component is how a design system
drifts apart one component at a time.

### Trigger

Two entry points, with different weights.

**A — Creating any new UI component.** Before writing it:

1. Read `references/design-system.md`. Build from those tokens. If it covers
   everything the component needs, that is sufficient — do not re-read the full
   asset library for a button variant.
2. Check the raw assets when the component needs something the derived layer
   does not yet answer — a new interaction, a pattern with no precedent in the
   codebase, anything where "what should this feel like" is genuinely open.
3. If the component needs a value the system lacks, **do not invent a local
   one.** Derive it from the references, add it to `design-system.md` as a real
   token, then use it. Ad-hoc values in component files are the failure mode
   this workflow exists to prevent.

**B — Designing, redesigning or improving a page, screen or flow.** Read *every*
asset in `references/` first — not a sample, not the folder that seems most
relevant, not the README summaries alone. Every image, GIF and video, using the
Read tool on each file. New assets appear continuously, so the folder must be
re-listed and re-read each time rather than recalled from a previous session.
Then state briefly what was extracted before building, and fold anything newly
learned back into `design-system.md`.

If `references/` is empty or thin, say so and proceed on craft fundamentals —
do not stall waiting for assets.

### Consistency

A new component that is individually beautiful but inconsistent with the rest of
the product is a defect. Before shipping one, check it against existing
components for the same spacing scale, the same radius and border treatment, the
same motion timing, the same focus-ring treatment, the same empty and loading
behavior. Where an existing component conflicts with `design-system.md`, say so
rather than quietly matching the outlier.

### What to extract

Analyze along these dimensions. Record the *principle*, never the artifact.

- **Design language** — surface treatment, elevation, borders, radii, density,
  the ratio of chrome to content.
- **Animation & motion** — easing curves, durations, stagger, what triggers
  motion, which properties animate, choreography between elements.
- **Spacing** — the underlying scale, rhythm between sections, how negative space
  is used to establish hierarchy, optical vs. mathematical alignment.
- **Typography** — the type scale and how few steps it uses, weight contrast,
  tracking, line height, measure, how hierarchy survives at small sizes.
- **Color** — palette structure, neutral ramp, what color is reserved for, how
  contrast is achieved, semantic color for positive/negative values.
- **Motion principles** — the rules behind the motion: does it clarify state
  change, preserve spatial continuity, direct attention, or is it decoration.
- **UX patterns** — navigation model, progressive disclosure, empty/loading/error
  states, form and input behavior, feedback and confirmation, keyboard support.

### Originality rules — non-negotiable

The references exist to raise the ceiling, not to supply the answer.

1. **Never copy.** No layout, component, color value, gradient, easing curve,
   illustration or copy line reproduced from a reference. If the output could be
   recognized as "the Stripe pricing page but recolored," it is wrong and gets
   rebuilt.
2. **Never use another company's brand assets** — logos, wordmarks, proprietary
   typefaces, product photography, brand colors.
3. **Synthesize across references.** Draw from several, never one. A direction
   traceable to a single reference is a copy with extra steps.
4. **Derive, don't sample.** Build ProfitMe's own type scale, spacing scale,
   palette and motion tokens. They may be *informed* by what the references
   prove works; they may not be lifted from it.
5. **Fit the domain.** ProfitMe is a profit-analytics product. A pattern that
   serves a car configurator may be wrong here. Every borrowed principle must
   earn its place against this product's actual job.

### Quality bar

World-class premium SaaS. Concretely, that means:

- A real design system — tokens for color, type, space, radius, shadow and
  motion — not one-off values scattered across components.
- Every state designed: default, hover, focus, active, disabled, loading, empty,
  error, and the "not enough data yet" case that analytics products always miss.
- Motion that is fast, purposeful, interruptible, and honors
  `prefers-reduced-motion`.
- Accessible by construction: WCAG AA contrast minimum, visible focus rings,
  keyboard-navigable, semantic HTML, meaningful labels. Never encode meaning in
  color alone — profit and loss need more than green and red.
- Responsive by design rather than by breakpoint patching. Dense tables and
  charts must have a considered narrow-screen story.
- Performance is part of the design: animate transform and opacity, avoid layout
  thrash, no jank on scroll-linked motion.

### Output

When presenting a design, lead with the reasoning: what the references
established, what direction was chosen for ProfitMe, and why. Then the work.
Flag any spot where a reference tempted a direction that was deliberately
rejected as too derivative.
