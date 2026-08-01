# Design References

Visual research library for ProfitMe. Screenshots, GIFs and videos of products
whose craft we want to match.

**These are references, not templates.** Nothing here gets copied — not a
layout, not a component, not a color ramp, not a marketing line. The job is to
extract *principles* and re-synthesize them into something that is
unmistakably ProfitMe.

## Structure

| Folder         | What goes here                                                          |
| -------------- | ----------------------------------------------------------------------- |
| `apple/`       | Product pages, scroll narratives, typography, restraint                 |
| `tesla/`       | Configurators, minimal chrome, full-bleed imagery                       |
| `porsche/`     | Luxury detail, material feel, precision layout                          |
| `stripe/`      | Developer-grade UI, docs, gradients, information density done well      |
| `linear/`      | Speed, keyboard-first UX, dark UI, subtle depth                         |
| `vercel/`      | Monochrome systems, dashboards, empty states, deployment UI             |
| `animations/`  | Motion studies — easing, transitions, micro-interactions, scroll effects |
| `dashboards/`  | Data-dense layouts, charts, tables, filters, analytics IA               |

## How to add assets

Drop files straight into the relevant folder. Descriptive names help a lot —
`stripe-pricing-hover-state.png` beats `Screenshot 2026-08-01 at 14.22.31.png`,
but an undescriptive name is far better than not adding the asset.

Accepted: `.png` `.jpg` `.webp` `.gif` `.mp4` `.mov` `.webm`

If an asset needs context ("look at the easing on the card lift, not the
colors"), add a line to the folder's `NOTES.md` or just say it in chat.

## The workflow

Whenever a page is designed or improved, every asset in `references/` gets
analyzed first. The extraction dimensions and the rules that keep output
original are specified in [`../CLAUDE.md`](../CLAUDE.md) under *Design
Workflow* — that file is the contract, this one is the map.
