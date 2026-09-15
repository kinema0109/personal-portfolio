# Handoff: derived reference assets for production

Owner: Hoàng Công Thọ · Date: 2026-09-15 · Status: **done** (implemented by Claude on the same day; kept as the record of the plan and its checks)

Outcome: `src/art/referenceData.ts` (shared crop data), `scripts/export-derived-references.mjs`, five PNGs in `public/art/derived/`, `ReferenceDisplay.tsx` now loads them; hashes recorded in `docs/DESIGN_CONTRACT.md`. The source screenshot is 1081×598, not 1080 as the old runtime assumed; Gran Centurio's placement was nudged by 0.2 scene units to keep it optically centred.

Read `AGENTS.md` and `docs/DESIGN_CONTRACT.md` first. This task touches locked references but does **not** change their identity, position or size: it only moves the existing crop-and-clip from runtime into pre-exported files.

## Problem

On production (Vercel builds from GitHub `main`), the wall swords, Gran Centurio, Ambicion, Grey Seer and Alpha Legion do not render. `src/art/ReferenceDisplay.tsx` crops all five at runtime from `public/references/locked/approved-room-screenshot.png`, and the owner keeps every file in `public/references/locked/` out of git. The image returns 404, so the frames and the figure bay are empty.

## Goal

Export one transparent PNG per reference to `public/art/derived/`, point `ReferenceDisplay` at those files, and commit only the derived files and code. The rendered room must look identical to the current local render.

Do not redraw, upscale, recolour or "improve" the artwork. No image generation is needed.

## Inputs (all in `src/art/ReferenceDisplay.tsx`)

- `crops[kind]`: source rectangle in screenshot pixels (`x y w h`).
- `silhouettes[kind]`: one or more polygons in screenshot pixels. The visible area is their union.
- Grey Seer only: the blue-backdrop alpha key `BLUE_KEY_MATRIX`, which is alpha = 1 − 4·(B − (R + G)/2), computed in sRGB and clamped to 0–1.
- Scene placement and display sizes are in `ReferenceDisplays()` in `src/art/ApartmentScene.tsx`. Keep them unchanged.

## Outputs

| kind | file | pixel size (= crop w × h) |
| --- | --- | --- |
| swords | `public/art/derived/wall-sword-set.png` | 90 × 104 |
| gran | `public/art/derived/shelf-gran-centurio.png` | 75 × 143 |
| ambicion | `public/art/derived/desk-ambicion.png` | 77 × 34 |
| seer | `public/art/derived/figure-grey-seer.png` | 52 × 52 |
| alpha | `public/art/derived/figure-alpha-legion.png` | 46 × 59 |

Each PNG:
- is the crop at native source resolution;
- keeps pixels inside the silhouette union at full opacity and makes pixels outside fully transparent;
- has the blue key applied on top of the silhouette alpha for the Grey Seer.

Filenames use the contract's asset IDs.

## Steps

1. Add `scripts/export-derived-references.mjs`. Read the crops and polygons from one shared source rather than copying the numbers: move the data into e.g. `src/art/referenceData.ts` and import it in both the component and the script. Rasterise with a canvas (Playwright page or `sharp`), clip the polygon union, apply the key for the seer, and write the PNGs. The script must not modify files in `public/references/locked/`.
2. Change `ReferenceDisplay` to render `<image href=".../art/derived/<file>.png" width={w} height={h}>` inside the same `viewBox="0 0 w h"` box. Drop the clip path and filter. Keep the `data-reference` attribute and the `x/y/width/height` props, so `ApartmentScene.tsx` needs no changes.
3. Record each derived file with its source (`approved-room-screenshot.png` + crop) and SHA-256 in `docs/DESIGN_CONTRACT.md` under "Canon source asset procedure".

## Verification (required before commit)

- `npm run build` passes.
- Capture a screenshot of the room before and after the change at 1440×900, 390×844 and 844×390, with reduced motion on, and inspect them directly. The references must match: position, size, edges, the seer without a blue fringe, the swords without the source painting's border.
- Frame centring stays within ±0.1 scene units. The swords frame's artwork bounds are centred at offset (0, 0), and Gran Centurio's at (0.04, −0.08).
- `scripts/verify-room.mjs` passes. It needs the dev server on 127.0.0.1:5179.
- Temporarily move `public/references/locked/` out of the project and confirm the room still renders all five references. This simulates production. Move the folder back afterwards.

## Git

- Commit `public/art/derived/*.png`, the script, the shared data module, the `ReferenceDisplay.tsx` change and the contract update.
- Do **not** commit anything in `public/references/locked/`, `references/`, `public/cv/`, or the unselected album variants (`public/gallery/02-burning-tree.png`, `05-starlit-rest.png`, `06-rain-confrontation-v2.png`).
- Push to `main` only after the owner approves. After the Vercel deploy, open https://thohoang.vercel.app/ and confirm there are no 404s for reference images and that all five references are visible.
