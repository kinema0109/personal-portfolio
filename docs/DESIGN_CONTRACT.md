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

2026-09-18 owner-approved Qliphoth counter (spec `docs/superpowers/specs/2026-09-18-qliphoth-and-bonfire-design.md`, kept from the Room Props Lab prototype): **the Sunflower is a contained Lobotomy Corporation Abnormality** (`src/hooks/useQliphoth.ts`, pips in `src/art/Sunflower.tsx`). Its counter starts at 3; a click less than 800 ms after the previous one lowers it by 1 and still drops a sun, and after 3 s without a click it refills 1 per 1.5 s. Below 3 it shows three ochre pips over the head (4-unit ink-framed pips, y 81–84, centred on the face). At 0 it breaches: the whole plant rattles a pixel to each side (the pips hold still), the pips become five red suppression pips, the button becomes "Suppress the sunflower", and it tosses a real sun every 400 ms through the normal drop, so suns land on free `SUN_SPOTS`, stop when the floor is full and give energy as usual. Five clicks suppress it; those clicks drop no sun and each puts out one red pip; the counter resets to 3. It works by day and night and with the pylon off; reduced motion drops the shake only; nothing is persisted. `data-qliphoth="calm"|"breach"` and `data-qliphoth-counter` sit on the Sunflower's group. Checked by `scripts/verify-qliphoth.mjs`; `verify-sunflower.mjs` finds the flower by either label, since its ten quick clicks now breach it.

2026-09-18 owner-approved bonfire (same spec): **a Dark Souls bonfire stands on the window sill** (`src/art/Bonfire.tsx`): a coiled sword leaning in an ash mound with bones and embers, 10 × 12 units at x 72–81, y 82–93, on the sill top at y 94, clear of the Sunflower's head, the glazing bar and the desk fan. The sprite is drawn from character grids. The fire swaps two frames; firelight tints the sill under it. "Rest at the bonfire" (`BONFIRE_BOX`, with the one-unit hover rim) flares the fire up past the hilt for 1 s and shows a gold "BONFIRE LIT" caption on a dark band that fades out at both ends, centred over the uncovered room, for 2.5 s, in an always-mounted live region. Nothing else in the room changes. It needs no power; under reduced motion the fire holds its first frame and the caption appears without fading. Like the Sunflower, it is a desktop and landscape feature (portrait phones crop x < 86). Checked by `scripts/verify-bonfire.mjs`.

2026-09-17 owner-approved pylon: **a StarCraft Protoss pylon under the desk is the room's power** (`src/art/Pylon.tsx`). It replaces the power strip on the floor at x 106–122 and the wall socket above it at x 110–115, which are both gone: with the pylon standing under it, the socket read as a face. The gold base sits on the floor line at x 103–117 and the tower's lead now starts there; the blue crystal floats above it, bobbing a unit, with a faint stepped-diamond glow rather than a box. Clicking it powers the room down: the crystal goes dark, the PC screen goes black, the tower's RGB, the desk fan (which can no longer be switched) and the ceiling bulb with its cone of light go out, Thọ stops typing and loses his speech bubble, the build bar hides and holds its progress, and for about 3 s he says "You must construct additional pylons." in a caption above his head that always stays on screen. **The story is disabled, not hidden**: the dialogue box and the choices stay where they are at half opacity and `inert`, so Next, the choices, Back, Home, clicking Thọ and Enter/Space/1–9 do nothing, and the camera does not move. **Only the PC needs power**: "See projects" is unavailable, but the album still opens the Game Gallery and the drawer still opens the CV, and both close normally (backdrop, Close, Escape). Clicking the dark pylon warps it in over about 1.5 s — a pulsing floor ring and the crystal's wireframe, top half then bottom half — ignoring clicks meanwhile, and then everything works again; under reduced motion it comes on at once. Power is not persisted. Checked by `scripts/verify-pylon.mjs`.

2026-09-17 owner-approved slime: **a blue Terraria slime hops past the window from left to right**, the opposite way to the night zombie, by day and by night, in hopping arcs along the foot of the skyline over about 7 s. The first comes 3–5 s after the room opens, then one every 15–25 s, on its own schedule, so it can share the window with the zombie. It is clipped to the window glass like the zombie, cannot be clicked, and does not appear under reduced motion. Checked by `scripts/verify-slime.mjs`.

2026-09-16 Horde identity correction: owner rejected the first abstract mark and supplied the canonical red crest reference. Use its outer crest, open central loop, separate central diamond and unequal tapered tails. The 23x29 code-native pixel silhouette follows that supplied image; do not restore the previous crossed/tusk-like placeholder. Frame and cup placement remain unchanged.

2026-09-16 Horde placement revision: owner found the cup mark unreadable and approved a small framed pixel emblem between the window and crossed-sword frame. Frame bounds x143 y10 w30 h38, dark backing and muted red emblem, no lettering or glow. Cup is plain again. Keep clear of the character and speech bubble; other references and interactions are unchanged.

2026-09-16 owner-approved Horde reference: the existing water glass beside the laptop carries a tiny dark-red, code-native pixel interpretation of the Horde emblem. Preserve the glass position and size; no caption or new interaction. Warcraft/Horde is an explicitly confirmed personal interest.

2026-09-16 owner-approved shelf fit: **both rows in the cabinet fill their compartment with exactly one unit of backing at each end.** The books were pushed to the right, 2.5 units clear on the left and 0.4 on the right, and the Fire Emblem row was centred but 3 units short at each end. Spine widths now make the sums land: the thirteen books measure 34 in the 36-unit left compartment (307–343) and stand packed with no gaps, the way books on a full shelf do; the twenty-two games measure 74 in the 76-unit bottom bay (307–383), with the chunky formats widened — Famicom 4, Super Famicom 3, GameCube and Wii 3 — which is both true of the real boxes and what makes the total work. Both rows start at x=308, and the brass plate moved 2 units left to sit on the bay's centre. **Adding a game or a book breaks this**, so `scripts/verify-reference-refresh.mjs` measures both rows against their compartments and fails if the gaps stop matching.

2026-09-16 owner-approved hover: **pointing at something in the room outlines that thing, never a box around it.** A click box says nothing about what is clickable when the object is not a rectangle, and around the sunflower it was four times the plant's area. Two mechanisms, both in `src/art/outline.ts`: objects drawn from rectangles grow every rectangle by one unit and paint it behind themselves, leaving a one-unit rim on the silhouette (laptop, album, drawer, fan, sunflower — the sunflower's head rim lives inside the bobbing group so it bobs with the head); sprites loaded as images use the `pick-rim` SVG filter, which dilates the image's own alpha (Grey Seer, Alpha Legion, Master Ball). `.hotspot` and `.shelf-spine-figure` therefore paint no border, background or outline of their own. The book and game spines keep their thin outline: they are rectangles their buttons match exactly. Keyboard focus keeps the global outline, which is a keyboard user's only cue. Checked by `scripts/verify-hover.mjs`, which counts rim pixels before and after pointing.

2026-09-16 owner-approved chair rebuild and fan switch: the chair keeps its swivel base — it is the right chair for someone at a PC desk — but the base is redrawn so it reads as one. Only three legs are drawn: on a star base the two pointing towards the viewer are almost fully foreshortened and end up behind the sitter's feet, so drawing all five turns the base into a solid bar, which is what the first version looked like. **Armrests were tried and removed**: at this scale a real armrest sits level with the desk surface, so it lands on the desk's own front edge and reads as a shelf. A lumbar seam and a seat edge carry the chair instead. The desk fan is now a click target (`FAN_BOX`): clicking steps low → mid → high → off → low, driven by the animation duration on the blades' existing two-frame swap, with the off state holding one blade position. Checked by `scripts/verify-fan.mjs`. The fan sits at x 94–114, so it is reachable at every breakpoint, phones included.

2026-09-16 owner-approved floor line and seated legs: **everything standing in the room lands on y=146** — desk legs, the tower, the paint case, the power strip and now the chair. The chair's castors used to stop at y=138, which made it the one object floating above the floor; its gas column is longer and its base reaches the floor. Thọ's legs are **deliberately not drawn**. They were added as trouser cuffs and shoes either side of the gas column, and the owner looked at them and decided they were not needed: seen from directly behind, a seated person shows almost nothing below the chair back, and the cuffs only crowded the base. Do not add them again without being asked. The chair base and castors are drawn in mid greys rather than near-black, because the desk casts a shadow across that strip and true black disappears into it. The tower grows from 14x28 to 18x33 at x 206–224, filling the 35 units of clearance under the desk instead of looking undersized beside the drawer.

2026-09-16 owner decision on the collectibles: the Grey Seer and the Alpha Legion **keep their existing sprites**; only the Master Ball is redrawn in code (`src/art/Figures.tsx`). Background, so this is not reopened by mistake: the sprites carry 252–254 colours each against 113 for the whole room, but that is a symptom — requantising them to fourteen colours changed almost nothing to look at. The real difference is spatial: a different material on nearly every pixel, where the room is built from large flat blocks. So matching the room means redrawing, not recolouring, and a smooth plastic sphere redraws cleanly at this size while two painted miniatures do not. Drafts of both were made and rejected by the owner; they are in commit 926354f if anyone wants to take them further. All three collectibles carry a hover label in their own voice rather than their name.

2026-09-16 owner-approved paint case: the two plain cardboard boxes under the desk are replaced by the case the shelf miniatures were painted out of, with two paint pots and a brush. It gives the painted figures someone who paints them.

2026-09-16 owner-approved desk underside, revised: the PC case stands at x 208–222, **under the screen it drives** (the laptop occupies x 192–244). Its first placement at x 118–132 put it on the far side of the chair from the screen, with nothing above it on the desk, which the owner rejected. Seen through its glass side panel; the lighting drifts between two dim colours on the room's usual two-frame swap and is deliberately dimmer than the lamp and the window. The rest of the underside: a power strip on the floor at x 106–122 fed from the wall socket that was already at x 110–115, a lead running from it across the floor to the tower, and two stacked storage boxes at x 126–148. All of it sits at x>=86, so unlike the sunflower it is visible at every breakpoint. The chair's base was a flat bar with three stubs, one of them directly under the gas column, which read as a letter T; it is now a star base whose legs step down and out to four castors.

2026-09-16 owner quality-of-life pass: a sun left on the floor now blinks out on its own after 8 seconds, and a collected sun flies into Thọ at the desk with a brief warm flash in his own silhouette, instead of drifting up and vanishing. The Horde print is resized to 33x57 at x=125, y=12, so all three wall frames share a top and bottom edge and read as one hung set; it moved left to clear Thọ's head, and the emblem keeps its own 1:1 pixel grid, centred in the mat rather than scaled. The two Armageddon pegs move to x=257 and x=274 so both carry the blade: the right peg used to sit at the sword's three-quarter point, which is underneath the gold guard, so it was hidden and the rack looked lopsided.

2026-09-16 owner-approved daylight and sunflower: the view through the window is daytime — blue sky, clouds, a sun in the corner and a front-lit skyline — and the light it throws on the floor is warmer and stronger than the moonlight it replaces. **The room itself stays night-toned on purpose**: only the view changed, and the pendant lamp, the wall, the floor and the UI palette are untouched. The potted plant by the window is now a Plants vs. Zombies sunflower (`src/art/Sunflower.tsx`): an orange-brown face disc ringed with twelve yellow petals, with only the head group bobbing, because the game animates the head apart from the plant. Clicking it tosses a sun out of the flower's face, up over the plant and down onto the floor, up to one per landing spot in `SUN_SPOTS`; clicking a sun collects it. There is no counter and no score — the owner asked for the reference, not the game. Checked by `scripts/verify-sunflower.mjs`. Known limit the owner accepted: the flower sits at x 26–53, and the camera crops everything left of x=86 on portrait phones and x=48 on portrait tablets, so it is a desktop and landscape feature only.

2026-09-16 owner rule for everything in the room: **the room decorates with the owner's hobbies, not with his profession.** Professional material belongs in the CV panel and the project pages only. Do not put technical books, certificates, conference badges, architecture diagrams, "how I work" boards or any other career signalling into the scene. The established hobbies are tactics RPGs (the framed blades and the boxed Fire Emblem row), Warhammer miniatures (the painted figures and the paint pots), Pokémon (the Master Ball) and pixel art (the desk album). Do not invent a hobby the owner has not named.

2026-09-16 owner-approved book shelf: the left compartment of the cabinet's top bay holds the book behind each Limbus Company sinner, twelve sinners plus Dante, replacing the anonymous spines that stood there. Drawn by `src/art/BookShelf.tsx`, anchored at `LIMBUS_SHELF` (x=309, floor=66); the headphones, paint pots and brush keep the right compartment. Spine thickness comes from the length of the work and the thirteen spines plus gaps measure 32.7 units, so they fit the 36-unit compartment. Each spine names itself on hover, focus or tap, reusing the Fire Emblem shelf's label mechanism in Scene.tsx. Binding colours are a choice, not canon; edit the table in BookShelf.tsx to change them. Note for any future room content: the camera crops everything left of x=86 on portrait phones and left of x=-10 on 16:9 screens, so the wall left of the window cannot hold anything that must be seen.

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

## 2026-09-16 — the man at the desk matches the portrait (REJECTED)

Codex's portrait gave Thọ a face; the figure at the desk still had the placeholder head — a 20×18
rectangle of hair with a slab of cheek beside it, which read as a helmet. Redrawn to agree with the
portrait: the crown steps in over three rows and the skull rounds off at the bottom, the hair stops
short at the nape so the neck shows, the sliver of face tapers to a jaw instead of standing there as
a slab, and the same lit sweep catches the lamp on the left of the crown. The glasses arm runs out
of the hair over the temple — one pixel row, and the only thing on the figure that says he wears
them. The ear stays under the hair; at 20 units wide it only ever made a stripe.

The hover rim comes from `outlineOf([...developerBody, ...developerArm])`, so it followed the new
silhouette without being touched.

**Rejected the same day.** Everything above is what the drawing was *meant* to do; at native size it
does not do it. The head is 22 rows of near-black with almost no value break, so it reads as a blob
rather than a skull, and the sliver of face beside it reads as a stripe glued to the blob rather
than as a cheek in front of it. The lit sweep and the glasses arm are both invisible at 1:1 — they
only appear when you zoom in, which is the tell that the drawing was checked at the wrong size.
Handed to Codex, who redrew it the same day: a broad lamp-facing plane and a mid tone break the
rear skull into three values, and the cheek, ear and a side-on lens make a profile instead of a skin
stripe. Accepted. The lesson worth keeping is the process one — the draft was judged at 5× and the
owner saw it at 1:1, which is the only size that counts.

## 2026-09-16 — the figure's torso, after the head

With the head fixed, the body underneath it was the next thing that read as a placeholder: a 36×34
block of red with a flat collar spanning the whole width, and an arm that was two rectangles. Codex
reshaped it — shoulders that slope in four steps, a back that narrows and then widens at the hips, a
short collar hugging the nape instead of crossing the shoulders, a shaded left sleeve behind the
chair, and a forearm with a shadow along its underside reaching to the keyboard.

The hover rim is still `outlineOf([...developerBody, ...developerArm])`, so it took the new
silhouette for free. Everything below the chair's backrest is hidden anyway, which is why the torso
spends its detail on the shoulders and the collar.

2026-09-16 owner-approved day and night, and the Sun-shroom: **the room follows the visitor's own day and night, and at night only the window changes.** Auto reads the browser's time zone and places the visitor at that zone's principal city (`src/daylight/zoneCoords.ts`, generated by `scripts/build-zone-coords.mjs` from tzdb `zone.tab`, `zone1970.tab` and `backward`). It then asks whether the sun is above the horizon there (`src/daylight/solar.ts`). There is no IP lookup and no network call. A ☀/☾ top-bar button swaps the phase; the choice is kept in `tho-vn:phase` only while it differs from the clock.

- **Night** changes the window and nothing else: it shows the original night view (moon, twinkling stars, city silhouette with blinking lights, slate glazing bars). The rest of the room, including the light on the floor, stays exactly as it is by day. A light UI for day and a navy dimming layer over the room were both built and rejected; do not bring them back without being asked.
- **The UI is identical in both phases.**
- **The Sun-shroom** from Plants vs. Zombies (`src/art/SunShroom.tsx`) sits in its own pot right of the Sunflower. The pot is smaller than the Sunflower's and uses the same colours: rim x 63–76, 10 units tall, on the floor line y = 146.
  - The sun spot that was at (56, 130) moved to (80, 132) to make room.
  - As in the game, it sleeps by day: shut eyes, rising Zs, and a click only stirs it. It works at night: small suns at half size.
  - After the visitor collects three small suns it grows and gives normal suns. The game's two-minute timer was replaced on purpose, since visits are shorter. Growth is not saved.
  - Like the Sunflower, it is a desktop and landscape feature.
- **Suns** are drawn after everything else, in one place, so switching the phase never remounts them and replays their toss.
- **Checks:** `scripts/verify-daylight.mjs` and `scripts/verify-sunshroom.mjs`. `verify-hover.mjs` pins day, so the Sun-shroom is in the same state on every run.
