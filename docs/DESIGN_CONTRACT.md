# Visual reference lock

Status: **active and mandatory**  
Owner: Hoàng Công Thọ  
Scope: the entire portfolio, especially `src/art/ApartmentScene.tsx`, gallery assets, and future replacement PNG/SVG art.

## Purpose

The room is a portfolio interface, but it is also a personal game-history display. The following references are not disposable decoration. Their identity must survive all future UI, theme, responsive, and rendering changes.

## Locked reference inventory

| ID | Location / interaction | Must remain unchanged in identity | Allowed presentation changes |
| --- | --- | --- | --- |
| `wall-sword-set` | Upper-right framed display | The approved crossed sword composition and every approved sword's distinctive silhouette, guard, blade geometry, and signature palette. The display remains a framed wall reference. | Frame material, room palette, pixel density, non-destructive Pixiv-inspired rendering, lighting, and camera crop—only if all blades remain recognisable. |
| `shelf-gran-centurio` | Upper-right shelf | Gran Centurio concept: thin white shield/kite blade; central black ornamental spine; narrow wrapped grip; small round upper mechanism; paired scroll-like side guard; compact deep-teal and warm-gold mechanism directly below the grip. It must not become a generic broad sword or decorative shield. | Pixel-art resolution, outline treatment, shelf/frame material, lighting, and background. The off-white, ink-black, deep teal, and warm gold identity must remain. |
| `desk-ambicion` | Lower-right desktop | The approved compact, slender, pale one-handed sword with restrained gold/brass guard and short grip. It remains horizontal on the desk as a subtle tactical reference. | Pixel density, lighting, desk material, and background only. No ornate fantasy guard, gems, oversized blade, or relocation. |
| `approved-figures` | Current desk and right shelf miniature positions | Every miniature/figure currently approved by the owner: its role as a painted collectible, its surface placement, and its visual identity. Treat all approved figures as locked even if a later scene asset merges them into one sprite sheet. | Pixel rendering, display base, lighting, and surrounding shelf decor only. |
| `desk-album` | Desk; opens the gallery | The single approved album: one physical album, same desk role, and same gallery-opening interaction/hotspot. | Cover treatment, photo/page treatment, and Pixiv-inspired art inside the album. Do not replace it with a second album, generic gallery icon, or unrelated prop. |

## Rules for all agents

1. Read this file before editing `src/art/**`, `src/components/GalleryPanel.tsx`, `src/content/gallery.ts`, `public/gallery/**`, or any future scene-image asset.
2. Use design model **`astra-light` only** for visual/reference generation. If it is unavailable, stop visual work and report it. Never silently fall back to another model.
3. Do not change a locked item's position, interaction, identity, silhouette, or signature colours without explicit owner approval in the current request.
4. A theme or Pixiv-style change affects the *rendering layer* only. It does not authorize changing the locked concept-art layer.
5. Any replacement scene asset must preserve the locked item bounds and the album click target. Update `ALBUM_BOX` only when the owner explicitly approves moving the album.
6. Do not remove a locked item for responsive layouts. Crop or reframe only if the item remains available at an intentional focus/state.
7. If source art is missing, do not fabricate an "exact" asset. Work on unlocked areas, or request the source file.
8. Before finishing visual work, verify every locked item against this inventory and report any intentional exception.

## Canon source asset procedure

The exact reference images have not yet been added to this repository. When the owner supplies them:

1. Save untouched originals in `public/references/locked/`; use clear immutable names such as `gran-centurio-concept.png` and `langrisser-reference.png`.
2. Add each filename and SHA-256 checksum below.
3. Use those files as the sole visual source when redrawing/pixelising the corresponding locked reference.
4. Do not overwrite the originals. Create a new derived asset under `public/art/derived/` when needed.

| Asset ID | Canonical source filename | SHA-256 | Status |
| --- | --- | --- | --- |
| `wall-sword-set` | Not added | Not recorded | Waiting for owner source files |
| `shelf-gran-centurio` | Not added | Not recorded | Waiting for owner source files |
| `desk-ambicion` | Not added | Not recorded | Waiting for owner source files |
| `approved-figures` | Not added | Not recorded | Waiting for owner source files |
| `desk-album` | Not added | Not recorded | Waiting for owner source files |

## Unlocked design surface

The rest of the room and portfolio remains open to improve using the existing project direction: walls, window/city, desk, laptop screen, chair, books, plants, lighting, dialogue UI, copy, navigation, project panels, motion, and responsive behavior. Changes must not obscure, replace, or break interactions with locked references.
