---
workflow: product-launch-video
flow: automation
storyboard: no
message: "Revenue tells you nothing about what you keep — ProfitMe shows the four things it hides."
destination: shorts
aspect: 1080x1920
language: en
length: 30s
angle: four-blind-spots
narration: no
---

## Intent

A launch promo for ProfitMe, a profit-analytics product for operators who
already have a revenue dashboard and still cannot answer "did we make money."

The angle is the site's own four sections, read as four blind spots a revenue
number leaves behind: everything in one view, the margin you are losing, when
the cash actually lands, and the signal that arrives before the quarter does.
Roughly seven seconds each, bookended by the hero's own thesis.

Tone: composed and precise, the register of a tool a finance professional keeps
open all day. Not a hype reel — the product's credibility is the pitch.

## Assets

- landing/dist/index.html — the built ProfitMe landing page, served locally at
  http://127.0.0.1:4173/ and captured for the landscape cut; this portrait
  version reuses that capture and its derived frame.md rather than re-scraping.

## Customizations

- Silent by design: no narration and no BGM. On-screen typography carries the
  whole piece. HeyGen is signed out and the local TTS/music engines are not
  installed, but this is a deliberate choice rather than a fallback — a synthetic
  voice would undercut the restraint the product's design system is built on.
- Brand tokens come from `references/design-system.md` via the page's own
  `tokens.css`: copper accent (`hsl(28,58%,45%)`), warm-tinted ink neutrals,
  never blue. Green and red stay reserved for profit/loss semantics and never
  appear as brand chrome.

## Notes

- ProfitMe's `CLAUDE.md` makes `references/design-system.md` binding on anything
  styled for this product. The video conforms to it: copper for chrome only,
  semantic color never carried by hue alone, motion that reveals with opacity
  rather than sliding, and a held beat at the end rather than a hard stop.
- Numbers on screen render in tabular figures — the design system calls this
  non-negotiable wherever figures can be compared.
- The euro figures shown (€184,200 and the margin breakdown) are the landing
  page's own sample data, not real customer numbers.
