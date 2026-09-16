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

2026-09-16 owner feedback, room pixel grid: the coarse pass was still too sharp for the room. Every refreshed sprite is now stored at the size it is drawn at, 1.5 sprite pixels per scene unit, by `scripts/coarsen-references.mjs`, and the app upscales it with image-rendering: pixelated, so one sprite pixel covers roughly the same area as one room pixel. The tilt of the two framed blades is baked into their sprites before the downsample instead of being applied as an SVG rotation, which keeps their pixels square; the exporter records how far each rotated silhouette sits from the point the pair crosses at (x=229, y=40), and the room adds it back, so the composition, sizes and all other positions are unchanged. Identities, placement, album, hotspots, camera and Master Ball are unchanged. The generated HD sources (`*-coarse.png`, `*-v2.png`, `*-v3.png`, `master-ball.png`) are the exporter's input only: they are kept locally and git-ignored, like the locked screenshots and the album PNGs, so `public/` only serves the 28 kB the room actually draws. See the grid-pass notes in REFERENCE_REFRESH.md.

2026-09-16 latest owner feedback: the HD refresh was too detailed for the room, including ALL swords. Active sprites now use the `*-coarse.png` simplified pixel adaptations. Prefer larger contiguous color blocks and restrained highlights; do not restore HD v2/v3 assets by default. Preserve identities, placement, album and Master Ball. See the coarse-pass notes in REFERENCE_REFRESH.md.

2026-09-16 owner-approved reference refresh (supersedes older asset locks below for these items): install separate pixel-art adaptations of Alpha Legion, Grey Seer, Gran Centurio, Alhazard and Langrisser; replace Ambicion with Armageddon on the wall supports. Preserve old derived assets and exporter as legacy fallback, not the active rendering source. The reserved third figure position now holds the approved Master Ball. Keep album, hotspots and camera unchanged. New inline figure/sword references supersede screenshot identities where applicable; these are generated approximations, not exact source pixels. See [REFERENCE_REFRESH.md](REFERENCE_REFRESH.md) for provenance, prompts and verification.

2026-09-16 owner-approved desktop polish: preserve the sword and miniature source assets; render ReferenceDisplay images with nearest-neighbour pixelated sampling. Narrow Gran Centurio's frame from 30 to 26 scene units around its existing centre x=272. Shift Ambicion left 4 scene units and align its supporting pegs underneath. Album, interaction bounds and mobile camera are unchanged. Garchomp is authorized for the reserved third base, but image generation was blocked by the image service; no new sprite has been installed and the base remains empty.

2026-09-15 owner-approved themed room (supersedes the placements below): wall = tactics corner — Alhazard + Langrisser in one frame (silhouette clip without the source painting's own border), Gran Centurio in a separate tall frame, Ambicion horizontal on wall pegs beneath it; both frames are optically centred and their backings match the sampled source backdrops. Display cabinet = figure bay (tallest bay, shelf light) with Grey Seer and Alpha Legion at one shared scale on their own painted bases, plus an empty base reserved for Garchomp; the bottom bay holds every boxed Fire Emblem game with hover/tap name labels. The desk holds only work items (laptop, album, notebook, drawer). Album position, ALBUM_BOX and the album interaction are unchanged; references stay non-interactive.

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

### Derived runtime assets (2026-09-15)

Production builds from GitHub, where `public/references/locked/` is deliberately absent, so the room no longer crops the screenshot at runtime. `scripts/export-derived-references.mjs` exports each reference from `approved-room-screenshot.png` using the crop and silhouette data in `src/art/referenceData.ts` (Grey Seer additionally keyed on its blue photo backdrop) into `public/art/derived/`, which is committed. Re-run the script after changing any crop or silhouette. Pixels are the source's own, at native resolution; nothing is redrawn.

| Asset ID | Derived file | Source crop (x y w h) | SHA-256 |
| --- | --- | --- | --- |
| `wall-sword-set` | `public/art/derived/wall-sword-set.png` | 745 84 90 104 | `999C76F5F08BA5E40EE4ECBE8241BBEB723AE1A4D93D36B4F66399B114876BEF` |
| `shelf-gran-centurio` | `public/art/derived/shelf-gran-centurio.png` | 896 82 75 143 | `F6B122F7C557CCE3D0FD92EEE274F44B2A8A0080E0DBCC069563DA8F9B7DCCE3` |
| `desk-ambicion` | `public/art/derived/desk-ambicion.png` | 970 309 77 34 | `BF251F56C813E5A470F25D78B9B4C49F35417AD7E25CEDF698925DE34691FA8B` |
| `approved-figures` / Grey Seer | `public/art/derived/figure-grey-seer.png` | 802 270 52 52 | `C5A670664BE807C7F540AB9465CFB44152ECDAAAE3CB10F1E0888F405B4B6B00` |
| `approved-figures` / Alpha Legion | `public/art/derived/figure-alpha-legion.png` | 957 235 46 59 | `6D4B6F0FC6331C8B2C1392053AFB13FF0D11B4E6B2D4871582767FDE6C2494FA` |

### Runtime sprites on the room grid (2026-09-16)

Served from `public/art/derived/`, regenerated with `npm install --no-save sharp && node scripts/coarsen-references.mjs`. Their sizes and the crossing offset are written to `src/art/refreshedSprites.ts`, which is generated with them, so the viewBox can never drift from the file. The HD inputs are local-only.

| Asset ID | Runtime file | Size | SHA-256 |
| --- | --- | --- | --- |
| `wall-sword-set` / Alhazard | `alhazard-px.png` | 39x57 | `B8600CAAC92657B968088B498D29CC5AD985DC8DBC92849C3E20D7C7B7E6DDD4` |
| `wall-sword-set` / Langrisser | `langrisser-px.png` | 37x55 | `207C543D77A700839440536A2B8C6D376B4F99932D58BD7C31F0BB19D097144E` |
| `shelf-gran-centurio` | `gran-px.png` | 31x74 | `E06E88E853106CF221E70A2A1B3036CE0DF175BF034957D5EA18C0D3772565B9` |
| Armageddon (replaced `desk-ambicion`) | `armageddon-px.png` | 66x13 | `3FDDF2A0763E1D95503A80130875BF3F04FF5050154D260BF55602EF1A70EBE2` |
| `approved-figures` / Grey Seer | `seer-px.png` | 32x50 | `0B185656ACE87B8E09179E8BF8C7D1CCA8FEA0A5F11E19BF96C3B3DBB07A51E6` |
| `approved-figures` / Alpha Legion | `alpha-px.png` | 36x46 | `AE739B1E807416F8ACFA8D9467EAAFB2AE36F005758D9458D4941587987EA531` |
| `approved-figures` / Master Ball | `master-ball-px.png` | 30x29 | `154FF5EFC699B239EEA4D87B289A24FDDFEC196ED410E0490D3C744603257B52` |

## Unlocked design surface

The rest of the room and portfolio remains open to improve using the existing project direction: walls, window/city, desk, laptop screen, chair, books, plants, lighting, dialogue UI, copy, navigation, project panels, motion, and responsive behavior. Changes must not obscure, replace, or break interactions with locked references.
