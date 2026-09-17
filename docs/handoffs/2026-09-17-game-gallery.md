# Game Gallery extension — 2026-09-17

Owner approved six new pixel-art adaptations in supplied order and the display name Game Gallery. Existing nineteen images are unchanged. The six new images occupy pages 20–25 (asset numbering remains 21–26 because the removed burning-tree asset left a gap).

## Assets

Built-in imagegen was used, followed by lossless WebP encoding without resizing. Runtime files are in `public/gallery/`:

| Source in owner's Downloads | Runtime file |
| --- | --- |
| Vs_Hector.webp | 21-vs-hector.webp |
| DESKMAT_TERRARIA_MOON_LORD.webp | 22-moon-lord.webp |
| images (11).jpg | 23-monika.webp |
| images (10).jpg | 24-radiance.webp |
| 35d19a20a6d8cd44820d5bff7ca9b109.jpg | 25-dante-vergil.webp |
| images (9).jpg | 26-reaching-sky.webp |

These are AI adaptations, not exact reproductions or original artwork by the portfolio owner. Final art remains subject to owner review.

## Prompt set

Common specification: Use case style-transfer; supplied image is the edit target and sole composition source. Authentic 8-bit pixel art with consistent square clusters, apparent 256–320px logical width, stepped contours, limited 24–32-color palette and sparse ordered dithering. Preserve characters, poses, clothing, lighting and identifiable silhouettes. No smooth painting, blur, fake grid, text, logos, signatures, UI, borders or added objects. These palette/grid values describe the requested appearance, not measured output limits.

Per-image constraints:

1. Blue-scarfed brown-haired swordsman at left with raised sword; purple hooded winged adversary at right; blue backdrop; preserve landscape framing.
2. Moon Lord, four armored heroes, four celestial pillars, moon and landscape; remove rounded deskmat border, white product backdrop and brand tag; fill a rectangular illustration.
3. Monika centered, chin on interlocked hands, auburn ponytail and white bow, classroom windows and warm lighting; preserve landscape composition.
4. Small back-facing horned knight facing enormous radiant crowned winged moth above, yellow circular light and dark reaching shadows; remove lower-right signature.
5. Dante crouched in red coat with gun and sword, Vergil behind back-to-back in dark coat with katana, red crystalline scenery; preserve portrait framing and both figures.
6. Dark-haired suited man in profile reaching toward bright sky above distant buildings and trees; preserve landscape framing and pose.

The existing uniform viewer uses `object-fit: contain`: landscape and portrait pictures keep their original aspect ratios rather than being cropped to the same shape. No captions were added. Updated test selectors follow the renamed opening button.
