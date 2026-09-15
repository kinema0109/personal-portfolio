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

2026-09-15 owner request: the top-bar shortcuts (Collection, Projects, Album, CV) and the dialogue "Projects" button are removed so visitors discover destinations in the room. Laptop opens projects, the album (same `ALBUM_BOX`) opens the gallery, the desk drawer opens the CV. The sword frame and display cabinet are references only and must stay non-interactive. Locked art is unchanged.

2026-09-15 room redesign authorized by owner after overlap review: separate desk (x=90–286) and cabinet (x=302–388); Gran Centurio and Alpha Legion occupy separate upper bays, Ambicion sits on a stand in the middle bay, headphones/books use lower storage, and Grey Seer remains on the desktop. Screenshot references now use silhouette clip paths to avoid carrying rectangular background patches. These placements supersede the earlier placement exception below. Album position and interaction remain intact.

2026-09-15 implementation exception explicitly authorized by the owner: reference placement updated for readability. Grey Seer sits on the extended right desktop, Alpha Legion on the middle shelf beside headphones, Ambicion horizontally on the right desktop. The single album and ALBUM_BOX remain unchanged. Runtime ReferenceDisplay uses non-destructive screenshot windows; it does not claim new exact source reconstructions. Full-size source viewing is available through the separate collection dialog.

1. Read this file before editing `src/art/**`, `src/components/GalleryPanel.tsx`, `src/content/gallery.ts`, `public/gallery/**`, or any future scene-image asset.
2. Owner clarification (2026-09-15): **Astra with light reasoning effort** is the requested agent configuration; `astra-light` is not a separate image-generation model. The exposed identifier is `gpt-6-astra`, with `low` as its lowest exposed reasoning effort. Do not infer that visual work is blocked by the absence of an image model named astra-light, or claim an unverified model/effort switch.
3. Do not change a locked item's position, interaction, identity, silhouette, or signature colours without explicit owner approval in the current request.
4. A theme or Pixiv-style change affects the *rendering layer* only. It does not authorize changing the locked concept-art layer.
5. Any replacement scene asset must preserve the locked item bounds and the album click target. Update `ALBUM_BOX` only when the owner explicitly approves moving the album.
6. Do not remove a locked item for responsive layouts. Crop or reframe only if the item remains available at an intentional focus/state.
7. If source art is missing, do not fabricate an "exact" asset. Work on unlocked areas, or request the source file.
8. Before finishing visual work, verify every locked item against this inventory and report any intentional exception.

## Canon source asset procedure

Owner sources were partially archived on 2026-09-15. See [REFERENCE_IMPLEMENTATION.md](REFERENCE_IMPLEMENTATION.md) for confirmed identities, remaining source gaps, and a proposed placement handoff. For additional originals:

1. Save untouched originals in `public/references/locked/`; use clear immutable names such as `gran-centurio-concept.png` and `langrisser-reference.png`.
2. Add each filename and SHA-256 checksum below.
3. Use those files as the sole visual source when redrawing/pixelising the corresponding locked reference.
4. Do not overwrite the originals. Create a new derived asset under `public/art/derived/` when needed.

| Asset ID | Canonical source filename | SHA-256 | Status |
| --- | --- | --- | --- |
| `wall-sword-set` / Alhazard | `alhazard-reference.png` | `8AFA6145A580F182347217B6068D8B6E630ECC7235DFD4005CAEB7489C1AA3FB` | Original archived; Langrisser standalone source still missing |
| `shelf-gran-centurio` / concept | `gran-centurio-concept.png` | `D7A52609902ACAA7DA8223476D3780639877BFCED8858E5F8C6154E8D5FB8AE7` | Original archived |
| `shelf-gran-centurio` / colour | `gran-centurio-color.png` | `D2939470978F9A4B7FAD43815CFB945433107A715095D244C269B3BF55509F0E` | Original archived |
| `desk-ambicion` / character | `ambicion-character-reference.png` | `C9B069D68FCDAAFED6500BD489AAF53D3B4A525F6C383A2286223792B6A394C9` | Original archived; contextual reference |
| `desk-ambicion` / sprite | `ambicion-sprite.png` | `C8D3D623249A9EAC92E9F80E54906FF30B71449F28963C84705F98F865A03AC3` | Original archived; tiny source limits detail |
| Overall approved room, figures | `approved-room-screenshot.png` | `CCB48ABCE42AC415EB5D7D5519B28B12DE25CA0C6E9A6B1DD3C1607F9555A7C2` | Composition reference; standalone figure sources missing |
| `desk-album` | Not added | Not recorded | Waiting for owner source files |

## Unlocked design surface

The rest of the room and portfolio remains open to improve using the existing project direction: walls, window/city, desk, laptop screen, chair, books, plants, lighting, dialogue UI, copy, navigation, project panels, motion, and responsive behavior. Changes must not obscure, replace, or break interactions with locked references.
