# Reference refresh — 2026-09-16

## Coarse pixel pass — owner feedback, 2026-09-16

The owner found the first refresh too HD, explicitly including every sword. Built-in ImageGen edited each of the six existing sprites separately. Active files are public/art/derived/{alpha,seer,gran,alhazard,langrisser,armageddon}-coarse.png. Previous v2/v3 files are retained. Only sprite mapping/dimensions/alpha-bound viewBoxes changed; room positions, Master Ball, album and camera did not change.

Prompt used for each asset (its existing sprite was the sole edit target):

Use case: style-transfer. Edit this single transparent sprite ONLY. It is far too HD and detailed for a chunky low resolution pixel room. REDRAW it as an extremely simple classic 8-bit sprite on an apparent 48-pixel-long grid, enlarged nearest neighbor. Large square pixels, flat contiguous areas of color, 12 muted colors maximum, just one shadow tone per material. Remove all microtextures, engraving, tiny scales, tiny highlights and dithering. No gradient, no shine, no bloom or glow, NO tiny noisy pixels. Keep the exact subject, overall proportions, pose, orientation, silhouette and key identifying colors. Keep weapons and miniature base where present. Simplify decoration to a few readable block marks. True transparent alpha background, no checkerboard, no backdrop, no text. Tight framing full object. This must look like a small in-game room prop, NOT high definition pixel illustration.

The 48px/12-color wording is an art-direction target, not a measured technical guarantee; generated output still has more colors and detail. Visually checked in the room at 1920x1080. Build and verify-reference-refresh.mjs passed at both 1440x900 and 1920x1080, including image loading, visible bounds, CV and album opening.


Owner approved rebuilding room references and replacing Ambicion with Armageddon. Album, hotspots, camera, CV content and third Master Ball are unchanged. Old derived assets and screenshot exporter remain intact; refreshed runtime mapping lives in ReferenceDisplay.tsx.

## Sources and rendering

Gran: archived gran-centurio-concept.png (geometry) and gran-centurio-color.png (palette). Alhazard: archived alhazard-reference.png. Alpha Legion, Grey Seer, Langrisser and Armageddon: user supplied inline references; those originals are not archived locally. Generated sprites are adaptations, NOT exact reconstructions or source pixels. Langrisser and Armageddon first attempts mixed designs and were rejected; corrected v3 assets are used. Tiny details are approximate, particularly sword guards. Figures retain more detail than room geometry.

Alpha bounds were measured from decoded alpha >240. SVG viewBoxes fit those silhouettes with 4px safety margins, preserve aspect ratio and use pixelated sampling. No originals were edited. Crossed swords rotate -33/+33 degrees around their shared centre. Gran remains centered at x272. Figure bases land on y108. Armageddon replaces Ambicion on the wall supports.

## Output assets

- public/art/derived/alpha-v2.png
- public/art/derived/seer-v2.png
- public/art/derived/gran-v2.png
- public/art/derived/alhazard-v2.png
- public/art/derived/langrisser-v3.png
- public/art/derived/armageddon-v3.png

## Generation prompts

### alpha-v2 

Use case: style-transfer. Create a single isolated transparent-alpha pixel-art collectible sprite from the specified one of the four user reference images. The four are: 1 teal armored miniature with green double-ended polearm; 2 horned rat wizard miniature on base; 3 silver sword in glass display; 4 long dark sword with gold fan guard. Use ONLY the specified target, other images are not parts to combine. Preserve its identity, silhouette, colors and proportions. Handcrafted restrained 24-color pixel art, hard square pixel clusters and stepped contours, apparent logical resolution 96 pixels on long axis. NO painterly smoothing, photoreal surface, gradients, text, fake checkerboard, scene, frame or ground plane. True transparent background, tight 3 percent margin, whole object visible. 

Target image 1 only: teal-blue scale-armored Alpha Legion miniature with silver trim, red helmet eyes, green hydra shoulder, brown tabard and cloak, green polearm diagonally from top left to bottom right with gold blades BOTH ends. Preserve the broad planted stance and detailed helmet. Add only a simple low charcoal oval miniature base under boots for shelf display. Warm top-left lighting.

### seer-v2 

Use case: style-transfer. Create a single isolated transparent-alpha pixel-art collectible sprite from the specified one of the four user reference images. The four are: 1 teal armored miniature with green double-ended polearm; 2 horned rat wizard miniature on base; 3 silver sword in glass display; 4 long dark sword with gold fan guard. Use ONLY the specified target, other images are not parts to combine. Preserve its identity, silhouette, colors and proportions. Handcrafted restrained 24-color pixel art, hard square pixel clusters and stepped contours, apparent logical resolution 96 pixels on long axis. NO painterly smoothing, photoreal surface, gradients, text, fake checkerboard, scene, frame or ground plane. True transparent background, tight 3 percent margin, whole object visible. 

Target image 2 only: exact horned rat wizard facing left, cyan-blue ragged robes, curved blade held left, very tall staff held right with gold angular circular emblem and red crystal, curled pink tail, standing on broken wood and green rocks on black oval base. Preserve pose, staff height, horns and full painted base. Do not invent green warpstone on staff: use supplied gold emblem. Warm top-left lighting.

### langrisser-v2 (rejected)

Use case: style-transfer. Create a single isolated transparent-alpha pixel-art collectible sprite from the specified one of the four user reference images. The four are: 1 teal armored miniature with green double-ended polearm; 2 horned rat wizard miniature on base; 3 silver sword in glass display; 4 long dark sword with gold fan guard. Use ONLY the specified target, other images are not parts to combine. Preserve its identity, silhouette, colors and proportions. Handcrafted restrained 24-color pixel art, hard square pixel clusters and stepped contours, apparent logical resolution 96 pixels on long axis. NO painterly smoothing, photoreal surface, gradients, text, fake checkerboard, scene, frame or ground plane. True transparent background, tight 3 percent margin, whole object visible. 

Target image 3 only: extract and reconstruct the sword WITHOUT glass reflections, display case or frame. Silver straight slim blade with central groove, precise angular swept gold crossguard and gold pommel/grip details as reference. Place perfectly vertical tip UP, handle DOWN. Show whole single sword, do not add gems or ornate spikes absent in source. Narrow portrait composition.

### armageddon-v2 (rejected)

Use case: style-transfer. Create a single isolated transparent-alpha pixel-art collectible sprite from the specified one of the four user reference images. The four are: 1 teal armored miniature with green double-ended polearm; 2 horned rat wizard miniature on base; 3 silver sword in glass display; 4 long dark sword with gold fan guard. Use ONLY the specified target, other images are not parts to combine. Preserve its identity, silhouette, colors and proportions. Handcrafted restrained 24-color pixel art, hard square pixel clusters and stepped contours, apparent logical resolution 96 pixels on long axis. NO painterly smoothing, photoreal surface, gradients, text, fake checkerboard, scene, frame or ground plane. True transparent background, tight 3 percent margin, whole object visible. 

Target image 4 only: preserve very long dark steel straight blade, serrations at root, narrow central slot at root, gold ribbed fan/wing-shaped guard with small blue edge studs, red long wrapped handle, round gold pommel. Rotate whole sword to horizontal, blade tip LEFT, handle RIGHT. Do not shorten blade, fatten guard, add extra spikes or change design. Wide tightly fitted canvas.

### gran-v2

Use case: style-transfer. Produce a single isolated sword sprite on truly transparent alpha background. Faithful to attached source geometry and palette. Handcrafted pixel art, crisp hard square clusters, stepped outlines, limited palette, apparent logical height 128 pixels, no smooth painting or blur. Tight portrait canvas, 3 percent transparent margins, full object visible. No frame, text, scenery, checkerboard or other objects. 

Gran Centurio: first reference controls EXACT full front silhouette, second controls colors only (it is foreshortened, do not copy its perspective). Upright grip at TOP, tip DOWN. Narrow wrapped white grip and small ring-cross pommel, paired GOLD scroll side guards, compact gold and deep teal circular mechanism below grip, off-white thin kite-shaped blade narrowing in middle then flaring modestly towards tip, BLACK ornamental spine and runes along blade. Preserve exact proportions of concept; not a generic sword or broad shield. Symmetric front elevation.

### alhazard-v2

Use case: style-transfer. Produce a single isolated sword sprite on truly transparent alpha background. Faithful to attached source geometry and palette. Handcrafted pixel art, crisp hard square clusters, stepped outlines, limited palette, apparent logical height 128 pixels, no smooth painting or blur. Tight portrait canvas, 3 percent transparent margins, full object visible. No frame, text, scenery, checkerboard or other objects. 

Alhazard from supplied source. Rotate to vertical tip UP handle DOWN; preserve the black/dark purple segmented irregular blade, gold branching inlays, black jagged gold-edged crossguard, circular RED center gem, black wrapped grip and gold pommel. Do not straighten distinctive jagged silhouette or invent extra ornament. Full single sword, not crossed pair.

### langrisser-v3

Correct this sprite to Langrisser. REPLACE the guard entirely: not wings, not ribs, not round gemstone. Angular gold crossguard shaped like a broad shallow asymmetric V with straight triangular prongs angled toward blade and a diamond-shaped geometric gold plate behind central grip. Gold short grip and simple gold pommel, NO red grip. Slim long silver double-edged blade with subtle straight central ridge. Match original Langrisser from the user's angled glass case: restrained straight geometric golden hilt, no fancy fan. Vertical tip up. Remove ALL glow and background. Hard pixel clusters at logical 128px height, true transparent alpha, whole sword narrow tightly fitted canvas. Only one sword.

### armageddon-v3

Correct this to the user's Armageddon sword: REMOVE red gems, gold blade inlays and bat-shaped crossguard. Very LONG plain DARK STEEL STRAIGHT blade (70 percent of entire length), pointed tip left, small regular sawtooth serrations ONLY near blade root, a thin straight empty slot in root. Crossguard is GOLD FAN: two curved stacked parallel ribs spreading like a small ribbed semicircular fan perpendicular to blade, with tiny blue studs at outer tips. Small smooth plain gold bulb at center, NO gem. Long slender RED wrapped handle (22 percent entire length) and SIMPLE ROUND GOLD BALL pommel right with no jewel. Horizontal tip LEFT handle RIGHT. Transparent background. Single faithful restrained pixel sprite, no glow no smooth painting, crisp squared pixel clusters. Tight wide canvas. Do not preserve the incorrect fantasy ornaments from input.

## Verification

- npm.cmd run build: passed (TypeScript + Vite).
- node scripts/verify-reference-refresh.mjs: passed at 1440x900 and 1920x1080; all seven references decode and fit between topbar/dialogue, CV and album open, no page errors.
- Regression test first failed because new alhazard display was missing, then passed after integration.
- Desktop screenshot inspected: artifacts/reference-refresh-1440.png. Wide screenshot: artifacts/reference-refresh-1920.png.
- No mobile redesign or deployment performed.

## Room pixel grid pass — owner feedback, 2026-09-16

The owner found the coarse sprites still too sharp for the room. The cause was resolution, not style: the
room is drawn from integer scene units (1 unit = 3 screen px at 1440 wide), while each sprite was a
~1400 px illustration squeezed into a 20-50 unit slot, so it carried about ten times the room's detail and
the browser resampled it every frame.

`scripts/coarsen-references.mjs` now redraws each sprite at the size it is actually drawn at:

- Crops to the sprite's alpha bounds, so no transparent padding is stored.
- Bakes the tilt of the two framed blades in at full resolution, before the downsample, so their pixels
  stay square. Rotating the finished pixel sprite in SVG instead sheared its grid into ragged steps.
- Downsamples to `PIXELS_PER_UNIT` (1.5) sprite pixels per scene unit, so one sprite pixel covers about
  the same area as one room pixel. 1.0 was tried first and matched the room exactly, but it dissolved the
  Grey Seer's horns, the marine's helmet and the "M" on the Master Ball, which the design contract locks.
- Restores saturation and contrast (averaging a thousand pixels into fifty greys them out), then hardens
  the alpha edge to a hard silhouette and flattens the palette to 20 colours with no dithering.
  Pre-sharpening was tried and rejected: it puts the speckle back.
- Writes `src/art/refreshedSprites.ts` with each file's pixel size, its size in scene units, and how far a
  rotated silhouette sits from the point the framed pair crosses at. The room reads that table, so the
  viewBox and the wall placement cannot drift from the exported files.

Result: 8.8 MB of HD sprites become 28 kB of room art, with positions, sizes and identities unchanged.
The HD inputs stay on the owner's disk and are git-ignored; only the `*-px.png` files are served.

Verified: `npm run build`, `node scripts/verify-reference-refresh.mjs` (1440x900 and 1920x1080), and a
browser pass at 390x844, 844x390, 768x1024 and 1920x1080 with all eight sprites present and no console
or network errors.
