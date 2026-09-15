# Portfolio Design Contract — mandatory

This repository has a visual contract. It applies to every Codex agent, sub-agent, and automated change. Read [docs/DESIGN_CONTRACT.md](docs/DESIGN_CONTRACT.md) before editing visual code, scene code, gallery data, or public art assets.

## Non-negotiable approval gate

Do **not** alter, replace, omit, reinterpret, redraw from memory, resize out of recognition, or move an approved reference asset unless the repository owner gives explicit approval in the current request. This applies even when a change is otherwise described as a redesign, cleanup, refactor, optimization, theme change, or mobile adaptation.

When a requested visual change would touch a locked reference, stop and ask for confirmation. Do not make a "close enough" substitute.

## Model policy

Owner clarification (2026-09-15): `astra-light` means Astra with light reasoning effort, not an image-generation model named astra-light. The exposed model identifier is `gpt-6-astra`; its lowest exposed reasoning effort is `low`. Do not block visual work because no image model named astra-light exists. Do not claim to have changed the active model or effort without confirmation from the environment.

## Source of truth

- Contract and inventory: `docs/DESIGN_CONTRACT.md`
- Future locked source files: `public/references/locked/`
- Runtime scene: `src/art/ApartmentScene.tsx`

The source images are not yet checked into this repository. Until they are, treat the approved visual shown to the team and the inventory descriptions as immutable. When originals are supplied, place them in `public/references/locked/` and update the inventory with their filenames and SHA-256 hashes; do not replace the approved runtime art on assumption.
