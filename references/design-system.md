# ProfitMe Design System

The derived layer. Raw assets in the sibling folders are inspiration; **this file
is the contract.** Every UI component builds from these tokens.

> **Status: partially derived.** Motion is derived from measured evidence — see
> [`observations.md`](observations.md), 2026-08-01. Everything else is still
> `TBD`: the current references are marketing and configurator surfaces, not
> data-dense product UI, so they do not yet constrain ProfitMe's color, type or
> spacing. Those get filled in from dashboard references or a brand decision,
> not guessed and not inherited from a UI library's defaults.

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

## Component conventions — TBD

Shared rules every component honors: focus ring treatment, disabled treatment,
hit-target minimum, icon sizing and optical alignment, and the required states —
default, hover, focus, active, disabled, loading, empty, error, and the
"not enough data yet" case specific to analytics.

## Layout — TBD

Grid, container widths, breakpoints, and the narrow-screen story for dense
tables and charts.
