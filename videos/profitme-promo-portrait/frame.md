---
version: alpha
name: Blue Professional — Frame (video / frame layer)
description: >
  Video-first companion to Blue Professional's design.md. The unit is the frame (1920×1080). Atoms
  are identical and sacred — the warm cream canvas, a single muted copper (#955823) as the only
  accent, the three-step gray text ladder, Inter (display/numerals/chrome) + Inter (body),
  soft copper-tinted cards (4% fill / 20% border / 10–14px radius) with NO shadows, pill chrome, and
  the copper progress bar. Composition + frame scale rewritten. Motion out of scope.
unit: the frame — 1920×1080 primary; 9:16 and 1:1 documented
principle: atoms are sacred · composition is free · numbers come from the script

colors:
  # Straight from references/design-system.md. Two corrections to the automatic
  # remix: it painted text-muted with ProfitMe's profit green (#2C9664) — the one
  # hue the system reserves for semantics and forbids as chrome — and it left the
  # preset's stock green/red for positive/negative. Body copy is a warm neutral;
  # the semantic pair is ProfitMe's own.
  bg: "#FBFAF8"           # paper-50 — warm page ground, never pure white
  primary: "#955823"      # copper-600 — the on-light text/chrome tone
  text: "#231F1A"         # paper-950
  text-muted: "#7C736A"   # paper-600 — secondary copy, warm neutral
  text-light: "#9C948B"
  accent-light: "rgba(149, 88, 35, 0.08)"
  accent-medium: "rgba(149, 88, 35, 0.15)"
  border: "rgba(149, 88, 35, 0.2)"
  card-bg: "rgba(149, 88, 35, 0.04)"
  positive: "#2C9664"     # positive-500 — never without a sign, icon or label
  negative: "#D83137"     # negative-500 — same rule

radii:
  pill: "100px"
  card-lg: "14px"
  card-md: "12px"
  card-sm: "10px"
  bar: "6px"
  circle: "50%"

typography:
  # One face in every role — ProfitMe runs the whole product on a single grotesk
  # and lets scale and weight do the work (design-system.md, Typography).
  # The capture reported the face as the stack's last fallback only because the
  # headless browser had no Inter installed — a capture artifact, not a brand
  # decision. Weights and tracking below are the design system's own.
  # — reading ramp —
  body:    { fontFamily: "Inter", cqw: 0.85, weight: 400, lineHeight: 1.55, color: "text-muted" }
  h4-eyebrow:{ fontFamily: "Inter", cqw: 0.8, weight: 500, tracking: "0.06em", upper: true, color: "primary" }
  tag:     { fontFamily: "Inter", px: 12, weight: 500, tracking: "0.02em", color: "primary" }
  counter: { fontFamily: "Inter", px: 13, weight: 500, tracking: "0.02em", color: "text-muted" }
  # — display / numerical ramp — tracking tightens as size grows; every figure tabular —
  h3:      { fontFamily: "Inter", cqw: 1.25, weight: 600, lineHeight: 1.3, tracking: "-0.005em", color: "text" }
  stat-num:{ fontFamily: "Inter", cqw: 1.9, weight: 600, lineHeight: 1.0, tracking: "-0.02em", color: "primary", fontVariantNumeric: "tabular-nums" }
  blockquote:{ fontFamily: "Inter", cqw: 2.4, weight: 600, lineHeight: 1.3, tracking: "-0.015em", color: "text" }
  h2:      { fontFamily: "Inter", cqw: 2.6, weight: 600, lineHeight: 1.1, tracking: "-0.01em", color: "text" }
  metric-value:{ fontFamily: "Inter", cqw: 3.0, weight: 600, lineHeight: 1.0, tracking: "-0.02em", color: "primary", fontVariantNumeric: "tabular-nums" }
  h1:      { fontFamily: "Inter", cqw: 4.2, weight: 600, lineHeight: 0.98, tracking: "-0.035em", color: "text" }
  quote-mark:{ fontFamily: "Inter", cqw: 8.0, weight: 600, lineHeight: 0.5, color: "primary", opacity: 0.15 }

spacing:
  pad-x: "5cqw"
  pad-y-top: "5cqw"
  gap-cards: "1.4cqw"
  accent-line: "60px × 4px"

components:
  card-tinted:
    backgroundColor: "{colors.card-bg}"
    border: "1.5px solid {colors.border}"
    rounded: "{radii.card-lg}"
    shadow: "none"
    description: "Universal content card. Never solid-colored, never opaque-bordered, NO shadow."
  metric-card:
    backgroundColor: "{colors.card-bg}"
    border: "1.5px solid {colors.border}"
    rounded: "{radii.card-lg}"
    typography: "{typography.metric-value} ({colors.primary}) + {typography.metric-label} + {typography.metric-desc}"
    description: "+ optional inline ↑/↓ change chip ({colors.positive}/{colors.negative} text, no fill)."
  tag-pill:
    backgroundColor: "{colors.accent-light}"
    textColor: "{colors.primary}"
    rounded: "{radii.pill}"
    typography: "{typography.tag}"
    description: "Top-right of the slide-header."
  cta-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.bg}"
    rounded: "{radii.pill}"
    typography: "Inter 400"
    shadow: "soft copper on hover only — the system's only shadow"
    description: "The one solid element."
  accent-line:
    backgroundColor: "{colors.primary}"
    size: "60×4, 2px radius"
    description: "Above cover titles / eyebrow separators."
  bar-track:
    backgroundColor: "{colors.accent-light}"
    fill: "{colors.primary} (display:block so width resolves)"
    rounded: "{radii.bar}"
    description: "28px track; fill carries the value."
  step-circle:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.bg}"
    rounded: "50%"
    size: "56px"
    description: "Sequential steps fade opacity 1.0→0.85→0.7→0.55."
  split-highlight:
    backgroundColor: "{colors.accent-light}"
    borderLeft: "4px solid {colors.primary}"
    rounded: "{radii.card-md}"
    description: "Inline pull-quote callout."
  slide-header:
    typography: "{typography.h4-eyebrow} (copper) left, tag-pill right; {typography.h2} below"
    description: "Top band of every content frame."
  atmosphere:
    elements: "clipped diagonal copper-tint panel, 3×3 copper dot grid, concentric closing rings"
    description: "Cover/closing only. Never on content frames."
  progress-bar:
    backgroundColor: "{colors.primary}"
    size: "3px tall, bottom edge, width grows with index"
    description: "Persistent progress strip."
---

# Blue Professional — Frame (video / frame layer)

## Brand adaptation (READ FIRST — the frontmatter is the source of truth)

This is the **blue-professional** preset remixed onto the captured brand. The YAML frontmatter above (colors · typography · components) is **normative and already correct — use it verbatim.** The prose below is the ORIGINAL preset's intent; read it THROUGH the frontmatter:

- **Fonts** — one face, **Inter**, in every role; ignore any preset font name lingering in prose.
- **Weights** — **400 body / 500 chrome / 600 display and numerals.** The auto-remix clamped everything to 400 off a mis-detected fallback face; that clamp is void. Weight contrast is load-bearing here, not decorative.
- **Numerals** — every figure that can be compared renders `tabular-nums`. Non-negotiable per the design system.
- **Colors** — use the frontmatter hex; preset color NAMES in prose (e.g. "copper", "cream") mean the remapped brand values.


## Overview

Blue Professional at frame scale is a **consulting-grade system: restraint with one strong
commitment.** A warm cream canvas and a single saturated copper that carries every accent —
eyebrow, metric, CTA, chart fill, progress bar. No secondary brand color, no pastels, just cream,
copper, and a tight ladder of grays. The register is investment-research / McKinsey briefing:
measured, data-dense without crowding, executive-readable at distance.

The voice is two faces in fixed roles: **Inter** (display, every numeral, all chrome —
eyebrows uppercase 0.06em) and **Inter** (body, muted gray, line 1.55). Headlines are near-black;
copper is reserved for accent moments. Depth is **soft and tinted** — 4% copper card fills with 20%
copper borders and 10–14px radii — never shadowed. The lack of harsh shadows is the premium signal.

**Key characteristics at frame scale:**

- **Warm cream ground** on every frame; **single copper** as the only accent.
- **Inter** (display/numerals/chrome) + **Inter** (body) — near-black headlines, copper numerals.
- **Tinted cards** — copper 4% fill, copper 20% 1.5px border, 10–14px radius, **no shadow**.
- **Pill chrome** (100px) — tag pills + the one solid copper CTA; copper **progress bar**.
- **Soft rounded corners everywhere** (no square corners save the progress bar).
- **Atmosphere** (diagonal panel, dot grid, concentric rings) on cover/closing only.

## The Frame

### Frame Craft Bar

Three eyeball tests gate every frame before any structural check:

- **Squint** — one **near-black headline or copper numeral** dominates at 3–6× its neighbor.
- **Silence** — content frames read **balanced, not crowded**; the **dashboard is the one dense exception**.
- **Restraint** — a **single copper accent** carries everything; headlines stay near-black (never copper); no shadows (tinted cards do the lift); positive/negative inline-text only.
- **Reference** — aim at an **investment-research / McKinsey quarterly briefing**; failure looks like a **heavy-outlined, multi-color dashboard**.

- **Primary:** 1920×1080 (16:9). Display authored in **`cqw`** (`px ÷ 1920 × 100 = cqw`).
- **Vertical:** 1080×1920 (9:16). **Square:** 1080×1080 (1:1).
- **Safe area:** `pad-x` 5cqw; bottom reserves room for the counter + progress bar.

**The container law (load-bearing).** Every frame ground sets `container-type: size`; ALL
frame-relative units are `cqw`/`cqh` against it — never `vw`. Card radii stay px (10–14px); the
pill radius stays 100px; borders stay 1–1.5px.

## Colors

Tokens identical to the source. `{colors.bg}` cream is the universal ground; `{colors.primary}`
copper is the **only** accent — every eyebrow, numeral, CTA, chart fill, progress bar, and the 4px
highlight left-rule. Headlines are `{colors.text}` near-black (never copper); body is
`{colors.text-muted}`; tertiary is `{colors.text-light}`. Cards fill `{colors.card-bg}` (4%) with
`{colors.border}` (20%) borders. `{colors.positive}`/`{colors.negative}` appear **only inline** on
directional change chips — never as fills. **No second accent color.**

## Typography

Two ramps. The **reading ramp** (Inter body 0.85cqw muted; Inter eyebrow uppercase 0.08em
copper) carries copy + chrome; the **display/numerical ramp** (Inter `h3` 1.25cqw → `h1`
4.2cqw near-black; numerals `stat-num`/`metric-value` in copper) carries headings and figures.

- **Legibility floor:** any load-bearing line ≥ **1.4cqw**; px chrome (tag/counter) is colophon only.
- **Fit-to-measure:** size the headline to its length. Cap the block at **≤ 78cqw**; ≤3 words → `h1`; 4–6 → `h2`; 7+ → `h3`. Copper numerals scale `metric-value`→`stat-num` by card size.
- **Headlines near-black, −0.02em**; **eyebrows copper, uppercase, 0.08em**; **numerals copper 600–700**; **body Inter 400 muted, line 1.6**. No italic, no uppercase body, no copper headline.

## Depth & Surface

Soft and tinted — never offset. Depth from:

- **Tinted cards** — 4% copper fill + 20% copper 1.5px border + 10–14px radius reads as lifted without offset.
- **Border-left accent** — the 4px copper rule on split-highlight blocks pulls a callout forward.
- **Rounded corners** — the 10–14px radius is part of the softness; square corners break it.

**Ceiling:** zero box-shadow on content (the only shadow is a soft copper CTA _hover_); no opaque copper borders; no harsh outlines.

## Shapes

- **100px** — tag pills, CTA, nav buttons (pill chrome).
- **14/12/10px** — cards by size (large metric / standard stat / detail + mini).
- **6px** — bar tracks + fills. **50%** — step circles, nav circles, dots, closing rings.
- **0** — only the progress bar. No square-cornered content.

## Components

- **card-tinted / metric-card** — the universal soft-tint content cards (no shadow).
- **tag-pill / cta-button / accent-line** — the copper pill chrome + the one solid CTA + the 60×4 rule.
- **bar-track / step-circle / split-highlight** — copper data + sequence + callout patterns.
- **slide-header** (eyebrow + tag pill) — the structural rhythm; **atmosphere** (diagonal/dots/rings) on cover/closing only; **progress-bar** on every frame.

## Frame Treatments

> Recipe: ground · container · composes · focal · chrome · accent · silence · Fixed/Free · density.
> Atmosphere only on cover/closing; content frames carry the slide-header rhythm.

### 1 · Cover (identity · move: diagonal accent · left)

**Ground** cream + the clipped diagonal copper-tint panel (right ~36%) + a 3×3 copper dot grid.
**Composes** accent-line, meta, h1, body sub. **Focal** a 2-line Inter `h1` near-black, left,
under a copper accent-line + meta. **Chrome** counter + progress bar. **Accent** the copper line +
diagonal panel. **Silence** the diagonal panel holds the right third. **Fixed** near-black h1, copper
accents, atmosphere here only. **Free** title, meta. **Density** low.

### 2 · Dashboard (data · move: 3-up metric grid · the dense frame)

**Ground** cream, `pad-x`. **Composes** slide-header (eyebrow + tag-pill), h2, 3× metric/tinted card.
**Focal** a row of tinted cards — copper `metric-value` + Inter label + muted desc + optional
green/red change chip. **Chrome** eyebrow left, tag-pill right; progress bar. **Accent** the copper
numerals. **Silence** tight — the density exception. **Fixed** 4% tint cards, 20% borders, no shadow,
copper numerals. **Free** figures (from script), labels. **Density** dense-exception.

### 3 · Bar Ranking (data · move: copper bars · left)

**Ground** cream, `pad-x`. **Composes** eyebrow, h2, bar-track rows. **Focal** 3–5 labeled
copper-fill bars on copper-8% tracks with copper percentages. **Chrome** eyebrow; progress bar.
**Accent** the copper fills + figures. **Silence** moderate. **Fixed** 6px tracks, copper fills.
**Free** rows, values (from script). **Density** standard.

### 4 · Pull Quote (quote · move: concentric rings · centered)

**Ground** cream, centered, with faint concentric closing-rings behind. **Composes** quote-mark,
blockquote, cite. **Focal** a Inter `blockquote` near-black under a 15%-opacity copper
quote-mark; an uppercase copper-muted cite beneath. **Accent** the faint rings + quote-mark. **Silence**
~55%. **Fixed** near-black quote, soft rings. **Free** quote, cite. **Density** low.

### 5 · Split + Highlight (content · move: asymmetric split · left)

**Ground** cream, two columns. **Composes** eyebrow, h2, body, split-highlight block. **Focal** an
Inter body column beside a copper-8% highlight block (4px copper left rule) carrying an inline pull
quote. **Accent** the highlight's left rule. **Silence** generous gutter. **Fixed** tinted highlight,
4px copper rule. **Free** body, callout. **Density** standard.

### 6 · Closing / CTA (closer · move: centered rings + CTA)

**Ground** cream + concentric closing-rings. **Composes** accent-line, h1, body, cta-button. **Focal**
a Inter `h1` near-black, centered, with the one solid copper `cta-button` pill below. **Accent**
the CTA + rings. **Silence** ~60%. **Fixed** one CTA, near-black h1, soft rings. **Free** sign-off, CTA
label. **Density** low.

## Composition Rules

### Do

- Start every frame on **warm cream**; let **copper carry every accent** (eyebrow, numeral, CTA, bar, progress).
- Set headlines **near-black, −0.02em**; eyebrows **copper uppercase 0.08em**; numerals **copper 600–700**.
- Use **tinted cards** (4% fill, 20% border, 10–14px radius, no shadow); body Inter 400 muted, line 1.6.
- Keep all chrome **pill-shaped (100px)**; one solid copper CTA per closing frame.
- Reserve **atmosphere** (diagonal panel, dots, rings) for cover/closing; content frames keep the slide-header rhythm.
- Lean left on cover/dashboard/split, centered on quote/closer.

### Don't

- No second accent color; no copper headlines.
- No drop shadows on content (only the soft copper CTA hover); no opaque copper borders.
- No square corners (save the progress bar); no font substitutes; no uppercase body.
- Don't use the green/red change chips as general accents — directional comparisons only.
- Don't fill space with heavier borders — add substance; don't blow a headline edge-to-edge.

## Aspect-Ratio Behavior

| Treatment         | 16:9                       | 9:16                           | 1:1                      |
| ----------------- | -------------------------- | ------------------------------ | ------------------------ |
| Cover             | title left, diagonal right | title top, diagonal band below | title upper, dots corner |
| Dashboard         | 3 cards across             | 3 stacked                      | 2×2                      |
| Bar Ranking       | 3–5 bars                   | 3–5 bars (tighter)             | 3 bars                   |
| Pull Quote        | centered, rings behind     | centered, taller               | centered                 |
| Split + Highlight | side-by-side               | stacked                        | stacked                  |
| Closing / CTA     | centered + CTA             | centered + CTA                 | centered + CTA           |

`pad-x` holds on the short edge; re-step display above the 1.4cqw floor. The diagonal cover panel
becomes a top/bottom band on 9:16. Numerals stay Latin Arabic digits in CJK builds.

## Approved Entities

No real customers, logos, or vendors are defined in the source — render any such mark as a
placeholder. Figures, metrics, and quotes are content; the system supplies cream + copper + grays.

## Numerals & Claims (hard rule)

Never invent figures, financials, percentages, or dates at frame scale. Render slots as `— figure —`,
`{metric}`, `+NN%`, `↑ —`. Metric cards, bar values, and stat cells especially carry placeholders
until the script supplies them. Directional chips require a real comparison from the script.

## Pre-Render Self-Audit

- **Squint** — one near-black headline or copper numeral dominates per frame.
- **Silence** — content frames balanced, not crowded; only the dashboard runs dense.
- **Single accent** — copper only; headlines near-black; positive/negative inline only.
- **Type** — Inter headings −0.02em near-black, copper eyebrows 0.08em + numerals; Inter body muted line 1.6; ≥1.4cqw floor.
- **Depth** — tinted cards (no shadow), soft rounded corners, 20% copper borders; no square content corners.
- **Anchor** — left on cover/dashboard/split, centered on quote/closer; atmosphere on cover/closing only.
- **Fabrication** — every numeral traces to the script, else placeholder.

## Known Gaps

- **Motion intentionally out of scope.** frame.md specifies composition only; the source's 500ms translateX transitions + bar-fill animations are deck mechanics.
- **Inter + Inter via Google Fonts.** CJK pairing (Noto Sans SC 700 display / Noto Serif SC 400 body) carries over; the eyebrow's uppercase+tracking signal weakens in CJK — pair it with the accent-line.
- **9:16 / 1:1 are guidance**; verify the floor and that the diagonal panel reflows to a band.
- Diagonal panel (clip-path), dot grid, concentric rings, and bars are CSS-only; no external imagery is required.
