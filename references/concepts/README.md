# Concepts

Portfolio and concept work — Dribbble, Behance, agency case studies.

## Read these at lower weight than shipped product

Everything else in `references/` is a live product that real users navigate.
Concept shots are optimized to look good as a static image in a feed. That
difference matters:

- They are rendered at one viewport, usually one state, with ideal placeholder
  content. Empty, loading, error and overflow states are typically absent
  because a portfolio image never has to survive them.
- Motion is implied by a caption rather than executed.
- Density is chosen for visual impact, not for a user reading it daily.
- They over-index on the trend of the moment — currently bento grids, heavy
  gradients, and stock photography used as texture.

Use them for composition ideas and for spotting what *not* to do. Do not let
them set tokens. When a concept shot and a shipped product disagree, the
shipped product wins.

## Contents

**RideLux car rental landing** (MQoS/MultiQoS) — three captures: full page,
annotated flow breakdown, bento value-prop section.

Worth noting honestly: several patterns here are on the *generic* list in
`CLAUDE.md` — the bento grid of stock photos, the saturated red used decoratively
across every surface, four equal icon-topped feature cards. The useful extraction
is narrower: the four-step "How It Works" reduction of a complex process, and the
search/filter bar overlapping the bottom edge of the hero, which is a genuinely
good spatial idea.

**Logistics dashboard** (The Ash Design) — three captures: overview, perspective
mockup, component closeups. **The most transferable concept work in the folder**,
and the library's only light-mode data-dense layout, which makes it a useful
counterweight to the dark dashboard in `dashboards/`. See `observations.md` for
what was extracted.

**Rydex car marketplace app** (Excellent Webworld) — dark mobile commerce
concept. Useful for the detail-page tab structure and the score-triplet row;
otherwise heavily photographic in a way that does not transfer to analytics.
