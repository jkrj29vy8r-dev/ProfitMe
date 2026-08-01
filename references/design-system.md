# ProfitMe Design System

The derived layer. Raw assets in the sibling folders are inspiration; **this file
is the contract.** Every UI component builds from these tokens.

> **Status: not yet derived.** No assets have been added and no app code exists.
> Every section below is a placeholder marked `TBD`. Values get filled in on the
> first real design pass, derived from `references/` — not guessed, and not
> inherited from a UI library's defaults.

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

## Materials & glass — TBD

Which surface classes are glass and which are solid, blur radius and background
tint per class, the border or inner-highlight treatment that makes the edge
read, and the solid fallback. Glass is for surfaces floating above content only.
Record the worst-case backdrop each glass surface must stay legible over —
contrast gets verified against that, not against a favorable screenshot.

## Motion — TBD

Duration scale (fast / base / slow) and what each is for. Easing curves by
purpose — entry, exit, hover, layout change. Stagger interval. All motion
interruptible, animating transform and opacity, and reduced under
`prefers-reduced-motion`.

## Component conventions — TBD

Shared rules every component honors: focus ring treatment, disabled treatment,
hit-target minimum, icon sizing and optical alignment, and the required states —
default, hover, focus, active, disabled, loading, empty, error, and the
"not enough data yet" case specific to analytics.

## Layout — TBD

Grid, container widths, breakpoints, and the narrow-screen story for dense
tables and charts.
