# Animations

Motion studies. **GIFs and video are more useful here than stills** — timing and
easing are the whole point and a screenshot loses both.

**Study:** easing curves, duration, stagger, choreography between elements,
scroll-linked motion, hover and press feedback, layout transitions, skeleton and
loading behavior.

**Watch for:** what triggers the motion (entry, hover, scroll, state change); what
property actually animates (transform and opacity should dominate — anything
animating layout is a warning sign); whether motion clarifies a state change or
merely decorates it; how it degrades under `prefers-reduced-motion`.

**When adding a clip, note the moment that matters** — "the card lift at 0:03",
"the stagger on the table rows" — otherwise the interesting 400ms gets lost in a
30-second recording.

## Read these at the same reduced weight as `concepts/`

The six clips below are one TikTok compilation (@webloved) showcasing four
different agency/AI-builder sites, filmed off a laptop screen. Same caveat as
`concepts/`: built to look striking as a 9-second vertical clip, not to survive
being someone's daily tool. Composition and motion ideas only — token values,
copy, wordmarks and the specific palettes below are that site's brand identity,
not ProfitMe's to reuse.

## Contents

**Anyflow** (agency site) — `webloved-anyflow-loader-and-hero-reveal.mov`,
`webloved-anyflow-kinetic-type-and-vortex-mark.mov`. Lime-on-black/white, bold
condensed display type. Two techniques worth the extraction: color used on a
single keyword inside an otherwise all-black headline ("Your brand **DESERVES**
more...") rather than washed across the section, and a section transition built
from a blocky mosaic of the accent color that dissolves/resolves into the next
panel's content instead of a plain crossfade. The lime palette itself is exactly
the "consensus disqualifies it" logic already applied to blue — noted, not
adopted.

**Monolith** (tattoo studio) — `webloved-monolith-bust-hero-and-slide-type.mov`.
Full-bleed black-and-white hero photography with an oversized condensed wordmark
overlapping the image, and a kinetic-type entrance where the line shears/repeats
horizontally for a couple of frames before settling — a punchier relative of the
blur-resolve reveal already in `design-system.md`'s Motion section.

**Drip** (product e-commerce) — `webloved-drip-ecommerce-hero-and-product-scroll.mov`.
The one clip in this set whose *palette* register (warm cream ground, dark
product photography, minimal nav) sits close to ProfitMe's own warm-neutral
direction, which makes its restraint worth studying even though the product is
unrelated: generous whitespace, one product hero image, a circular badge/icon as
the sole transition device between the hero and the feature panel.

**Dragonfly** (crypto fund) — `webloved-dragonfly-glitch-wordmark-intro.mov`,
`webloved-dragonfly-dense-table-and-dotmap.mov`. Near-black, monospace UI
chrome, bracket-style corner marks, a chromatic-aberration/glitch wordmark
reveal, and a genuinely dense monospace directory table plus a dotted world map.
The glitch/red register is off-brand for ProfitMe, but the dense-table treatment
(tight monospace rows, no card chrome around each entry) is a useful counterpoint
to how `dashboards/` handles data density, worth a look next time a list-heavy
surface (e.g. the Signals chapter) gets revisited.

**Common thread across all four, worth naming explicitly:** every hero is a
typographic event, not a photo — the big kinetic headline *is* the hero, and
color is spent on exactly one word or shape per screen rather than a themed
wash. That's a punchier, faster-cut register than the calm Apple/Rimac crossfade
already measured into `design-system.md`; it's a legitimate alternate direction,
not a correction to the existing one, and was not adopted wholesale here — see
`observations.md`, 2026-08-02.
