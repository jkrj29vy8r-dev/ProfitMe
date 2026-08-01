# Design References

The single source of truth for ProfitMe's design system. Two layers:

**[`design-system.md`](design-system.md)** — the derived, decided tokens for
this product: color, type, space, radius, shadow, motion. This is the canonical
layer. Components build from it. When a component needs a value it doesn't have,
the value gets derived and added here rather than improvised in a component file.

**[`observations.md`](observations.md)** — the working layer between them. Dated
findings from each analysis pass, with the evidence that produced them.

**The subfolders** — raw screenshots, GIFs and video of products whose craft we
want to match. **References, not templates.** Nothing here gets copied — not a
layout, not a component, not a color ramp, not a marketing line. The job is to
extract *principles* and re-synthesize them into something unmistakably ProfitMe.

## Structure

| Folder         | What goes here                                                          |
| -------------- | ----------------------------------------------------------------------- |
| `apple/`       | Product pages, scroll narratives, typography, restraint                 |
| `mercedes/`    | Serif-over-sans hierarchy, calm density, quiet controls                 |
| `rimac/`       | Dark craft, section transitions, staggered reveals — best motion source |
| `spline/`      | Dark SaaS marketing, elevated panels, interactive hero                  |
| `audi/`        | Translucent controls on photography, full-screen chapters               |
| `tesla/`       | Configurators, minimal chrome, full-bleed imagery                       |
| `porsche/`     | Luxury detail, material feel, precision layout                          |
| `stripe/`      | Developer-grade UI, docs, gradients, information density done well      |
| `linear/`      | Speed, keyboard-first UX, dark UI, subtle depth                         |
| `vercel/`      | Monochrome systems, dashboards, empty states, deployment UI             |
| `animations/`  | Motion studies — easing, transitions, micro-interactions, scroll effects |
| `dashboards/`  | Data-dense layouts, charts, tables, filters, analytics IA               |
| `concepts/`    | Dribbble/portfolio work — lower evidentiary weight, see folder README   |

## How to add assets

Drop files straight into the relevant folder. Descriptive names help a lot —
`stripe-pricing-hover-state.png` beats `Screenshot 2026-08-01 at 14.22.31.png`,
but an undescriptive name is far better than not adding the asset.

Accepted: `.png` `.jpg` `.webp` `.gif` `.mp4` `.mov` `.webm`

> **Storage: Git LFS is the intended home for this media, and is not set up yet.**
> The migration was prepared and verified locally but could not be pushed —
> `lfs.github.com` is blocked by this workspace's egress policy, so LFS objects
> cannot upload from an agent session. Until that host is allowed, media is
> committed as ordinary git blobs and the folder grows the repo permanently.
> Running `git lfs migrate import --include="references/**"` from a machine with
> normal network access will complete the move.

If an asset needs context ("look at the easing on the card lift, not the
colors"), add a line to the folder's `NOTES.md` or just say it in chat.

## The workflow

Every new UI component starts from `design-system.md`. Every page design or
improvement starts from a full read of every asset in these folders, and folds
what it learns back into `design-system.md`.

Both paths, the extraction dimensions, and the rules that keep output original
are specified in [`../CLAUDE.md`](../CLAUDE.md) under *Design Workflow* — that
file is the contract, this one is the map.
