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

**Never ship generic SaaS UI.** Every page must stand next to Apple, Linear,
Stripe and Porsche without embarrassment.

That means their *level* — the quality, the motion, the attention to detail —
not their appearance. This does not soften the originality rules above; it is
the standard those rules are held to. Matching their craft while looking like
none of them is the entire job.

#### What "generic" means concretely

These are the defaults that produce forgettable SaaS. Each is a defect:

- Untouched component-library styling shipped as-is (default shadcn/MUI/Bootstrap
  look), or a stock template layout.
- The default purple-blue gradient hero. Rounded-corner card grid with three
  equal feature boxes. Centered hero, subhead, two buttons, logo strip.
- Type that is all one weight at three sizes, with default line heights and no
  tracking decisions.
- Spacing chosen ad hoc — everything at 16px because it was the first value that
  looked fine.
- Motion added at the end as decoration: fade-in-on-scroll applied uniformly to
  every section.
- Generic stock iconography and undifferentiated empty states ("No data").

#### The non-negotiables

**Motion.** Smooth, fast, purposeful. Transform and opacity only. Interruptible —
reversing mid-animation must never snap. Choreographed, not uniform: related
elements stagger, entering and exiting use different curves, and every animation
justifies its existence by clarifying a state change or preserving spatial
continuity. Honors `prefers-reduced-motion`. 60fps is the floor, including on
scroll-linked motion.

**Spacing.** Premium means generous and *rhythmic*, not merely large. Space
derives from one scale; sections breathe; density is a deliberate choice per
surface. Optical alignment beats mathematical alignment when they disagree.

**Typography.** The highest-leverage surface in the product. Deliberate scale,
real weight contrast, tracking tightened as size increases, line height tuned per
role, measure capped for readability. Tabular figures everywhere numbers are
compared.

**Glass — subtle, and disciplined.** `backdrop-filter` is expensive and easy to
overdo. Rules: use it for surfaces that float above content (nav, overlays,
command palette, sticky headers), not for everything; keep blur restrained;
always pair with a border or subtle inner highlight so the edge reads; and
**verify text contrast over the worst-case backdrop**, not the demo screenshot.
Never blur a large surface that animates or scroll-links. Provide a solid
fallback where support or performance requires it. If glass isn't earning its
cost on a given surface, don't use it there.

**Performance is design.** Animate transform and opacity, avoid layout thrash,
respect the compositor, keep blurred layers few, watch bundle and font loading.
A beautiful page that stutters has failed the bar — smoothness *is* the premium
feel, and dropping frames reads as cheap no matter how good the static
composition is.

**Craft baseline.** A real token system, not one-off values. Every state
designed: default, hover, focus, active, disabled, loading, empty, error, and
the "not enough data yet" case analytics products always miss. Accessible by
construction — WCAG AA minimum, visible focus rings, keyboard-navigable,
semantic HTML; never encode meaning in color alone, since profit and loss need
more than green and red. Responsive by design, with a considered narrow-screen
story for dense tables and charts.

### Output

When presenting a design, lead with the reasoning: what the references
established, what direction was chosen for ProfitMe, and why. Then the work.
Flag any spot where a reference tempted a direction that was deliberately
rejected as too derivative.

Before presenting, run the work against the *generic* list above. If any item
matches, it gets fixed first — not shipped with a note acknowledging it.
