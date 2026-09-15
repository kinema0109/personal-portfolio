# Personal reference preservation and placement

## Room redesign verification — 2026-09-15

The owner rejected the overlapping screenshot patches and authorized redesigning the entire room. Implemented a separate cabinet and desk, individual display bays, source-coordinate SVG silhouette clips, a left-side fan, unobstructed water glass, single pendant light, plant and softer room lighting. The album tooltip now appears on hover/focus instead of covering the room. Browser checks cover 1440×900, 390×844 and 844×390, reference visibility, horizontal overflow, collection selection and Escape dismissal. Screenshots were inspected locally. The source resolution still limits close-up detail; these are clipped approved images, not high-resolution reconstructions.

Status: originals archived; first runtime integration implemented after the owner's explicit “vậy làm đi, sửa tiếp UI” approval. ReferenceDisplay.tsx renders non-destructive SVG windows into the approved room screenshot for the five display groups. This preserves the screenshot artwork, not a new high-resolution reconstruction. The collection dialog exposes all six named items and available full-size originals. Browser visual QA remains outstanding; production build and TypeScript checks passed.

## Owner-confirmed identities — 2026-09-15

These collectibles express the owner's personal interests and game history. Preserve their identities across future redesigns.

- Images 1 and 6: Gran Centurio, Yggdra Union. Use the monochrome concept for silhouette and ornament placement; use the colour image for gold and teal materials. Do not inherit the perspective distortion of the close-up as the full sword's proportions.
- Images 2 and 5: Alhazard and Langrisser, Langrisser series. Image 2 is the supplied standalone dark sword. Image 5 is visible inline in the conversation, but has no supplied local file path; it has NOT been archived. Do not substitute Alhazard for both swords.
- Images 3 and 4: Ambicion, Tactics Ogre / Ogre Battle Saga, as identified by the owner. The character image gives contextual scale and the sprite gives the small-game representation; neither supports invented fine engraving.
- Desk miniature: Skaven Grey Seer, as identified by the owner. Preserve the rat-like profile, horns, robes, staff and green stone visible in the room screenshot. Exact sculpt and paint scheme need a larger source.
- Shelf miniature: Alpha Legion, as identified by the owner. Preserve the armoured silhouette and teal metallic palette visible in the room screenshot. Do not assume a specific marine model or unseen insignia from faction identity alone.

The previous chat's generic object count is not a source of truth. It included unverified objects and duplicate categories.

## Archived originals

Untouched copies live in `public/references/locked/`; filenames and SHA-256 checksums are recorded in DESIGN_CONTRACT.md. All six archived copies were checked against their source hashes. Five are supplied item references; one is the original room screenshot. There is no cloud memory write in this task.

## Concrete placement proposal

Preserve the screenshot's visual hierarchy: developer and working area first, collectibles grouped on the right. The user's current request authorizes suitable positioning. The first integration follows these positions, with Ambicion on an extended desk surface; no chessboard has been added.

| Reference | Intended placement | Recognition and overlap requirements |
| --- | --- | --- |
| Alhazard + Langrisser | Framed upper-right wall display, left of the shelving | Cross the blades above the guards; both hilts and tips fully visible, no overlap hiding the red core or Langrisser hilt. Fit the complete pair inside the frame. |
| Gran Centurio | Dedicated upper shelf bay, upright, point downward | Entire pommel, spiral guards and blade visible; dark plain backing; move surrounding books away from the silhouette. Front-view proportions from concept, colour from image 6. |
| Grey Seer | Right edge of the desk, beside the fan with clear separation | Base visibly rests on the desktop; no intersection with laptop, fan cage or Ambicion; staff and horns remain readable. |
| Alpha Legion | Middle shelf beside headphones, matching screenshot | Own base and clear space around shoulder armour; headphones do not obscure the figure. Current code places it on the lower shelf, so this requires a deliberate placement update. |
| Ambicion | Horizontal on the lower-right display surface beside the chessboard in the screenshot | Keep the slender blade and restrained hilt; provide a long clear surface and avoid clipping the tip. Current runtime lacks the screenshot's chessboard: do not assume it exists. |

## Runtime findings

- `src/art/LockedReferences.tsx` currently approximates the swords with a handful of SVG polygons/rectangles. Gran Centurio occupies roughly 29 scene units vertically; Ambicion only about 3. Intricate original detail cannot survive this sampling.
- `src/art/ApartmentScene.tsx` puts Grey Seer at roughly x=224–242, y=81–103, intersecting the laptop's x=196–240, y=72–102 region.
- Gran Centurio shares its upper bay with book geometry; the composition needs clear negative space around its guards.
- Room screenshot and current procedural runtime are different artworks. Archiving the screenshot does not make the runtime match it.

## Faithful asset workflow when the model requirement is resolved

1. Use the archived originals as references; produce separate transparent derivatives under `public/art/derived/`. Never overwrite originals.
2. Match silhouette, length-to-width proportions, guard geometry, pommel, ornament placement and signature colours before applying room lighting or pixel treatment.
3. Keep sufficient source resolution for inspectable detail. Avoid translating complex swords into a few blocks on a 320-unit room grid. Render separate detailed assets in scene coordinates and judge them at actual screen size.
4. Compare each derivative side by side with its original before integration; do not claim exactness where the source is only a tiny sprite or screenshot.
5. Integrate the five collectible groups as independent scene assets so adjustments do not redraw the whole room. Preserve the existing single album and its hotspot.
6. Verify desktop and narrow layouts: full item silhouettes, real supporting surfaces, clear spacing, no dialogue/navigation overlap, and a deliberate way to inspect items if the room crop hides them.
7. Run typecheck/build and visually inspect the integrated scene before claiming implementation complete.

## Outstanding inputs / restriction

- The owner clarified that Astra with light effort was intended, not a separate image model. The earlier unavailable-image-model blocker was incorrect. Screenshot-based runtime integration is implemented; generated/reconstructed transparent assets remain future work.
- Langrisser image 5 needs a durable original file; its inline appearance is available only in the conversation.
- Larger Grey Seer and Alpha Legion photos are needed to reproduce exact sculpts rather than merely the faction's general appearance.
