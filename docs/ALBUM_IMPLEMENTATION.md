# Album source analysis and generation

## Page 19 replacement — 2026-09-16

Owner requested the supplied battlefield duel screenshot instead of the last album picture. Page 19 now uses `public/gallery/20-battlefield-duel.webp`; page 18 (`19-nagash.webp`) is unchanged. Previous sunset archer assets remain archived. Album still has 19 pages. Built-in ImageGen produced the PNG adaptation, then WebP quality 95 conversion preserved dimensions. Black letterbox bands are removed; two foreground fighters and the actual battlefield remain. Inline source was not supplied as a local file. Generated output visually checked; this is a pixel-style adaptation, not an exact reconstruction.

Prompt: Use case: style-transfer. Edit the user's attached battlefield screenshot into coarse authentic 8-bit pixel art for a retro artwork album. Sole source is this screenshot. Preserve composition: two main full-body fighters facing each other, dark long-haired armored fighter left seen from back/side with upright sword, short dark-haired fighter right facing left with bright white weapon reflection across upper body. Muddy brown battlefield with puddles, scattered distant silhouettes, low olive hills, small orange fires, heavy gray overcast sky. Keep original poses, clothing silhouettes, spacing, camera and subdued olive brown gray palette. Remove black letterbox bands top/bottom, any text logos watermarks and screenshot UI, not actual battlefield elements. Output landscape about 2:1 matching actual scene without bands; no invented extra foreground or cropping characters. Strong deliberate square pixel clusters on apparent 256-320px wide grid, limited 24-32 colors, restrained dithering, stepped edges. No smooth HD painting, blur, glow effects beyond source weapon highlight, new characters, borders or captions. Single complete artwork.

## WebP delivery — 2026-09-16

The 19 album pictures are served as WebP (quality 95, exported by scripts/export-album-webp.mjs); pixel dimensions are unchanged, so the pixel-art grid is intact. Chosen after comparing 3x crops of the dithered (19-nagash), flat-white (10-group-portrait) and saturated (07-white-haired-portrait) images plus the two lowest-PSNR files against the PNGs: no visible difference, worst PSNR 35.1 dB, total 33.4 MB -> 6.4 MB (81% smaller). Quality 85 was rejected: visible halos around dark outlines on white. Downscaling was rejected: the non-integer ratio would blur the pixel grid. The generated PNGs stay local and are git-ignored.

## Additional pages and selected duel — 2026-09-16

Owner requested attachment 2 to replace current album page 11 (the frozen duel, NOT the file numbered 11-artanis). Exact prior generated 4:3 image exec-c97746bf-5c9f-4506-ac4e-7a651d6a4fb0.png matches the attachment and is copied unchanged to public/gallery/12-frozen-duel-selected.png. The wide alternative remains on disk but is not displayed. This overrides the earlier wide-duel framing decision. Artanis and the original approved six pictures are unchanged.

The other four attachments are appended in supplied order as pages 16–19: 17-held-hand, 18-red-core, 19-nagash, 20-sunset-archer. Total: 19 pages. Native proportions and contain scaling remain; no UI changes or universal zoom. Sources are archived untouched in references/album/ with matching numbered filenames. New derived PNGs are saved in public/gallery/. Built-in ImageGen used separately for each new picture; all four outputs visually inspected for composition, palette and absence of lettering. They remain pending individual owner review.

### Additional exact prompts

Verification: build passed; all 19 pages passed desktop, phone and landscape checks for exact order, decoding, fit, focus, boundaries, finish, close and Escape. Page 11 selected file is byte-identical to the earlier generated version supplied by the owner.

Common prompt: Use case: style-transfer. Input image is the edit target and sole composition source. Adapt into authentic coarse 8-bit pixel art for an existing retro artwork album: apparent 320-pixel-wide logical grid, hard square clusters, stepped contours, limited 24-32 scene colors and sparse ordered dithering. Preserve original aspect ratio, exact characters and poses, identities, silhouettes, weapons, placement and lighting. No blur, smooth painting, fake grid overlay, extra objects or border. Remove any text, logos, watermark lettering and screenshot UI and reconstruct their background. Do not force a uniform aspect ratio or crop/stretch subjects. Single complete image. Specific invariants:

- 17-held-hand (source: bo5azp0mmneb1.jpg): Landscape 953:645 muted gray sepia sketch scene. Tall dark-haired armored knight standing left facing right, sword sheathed at hip, gently holds hand of long-haired seated person bowing head on right, tall carved throne at far right. Preserve connected hands, exact two people, quiet restrained expressions, desaturated mood; do not add colors or scenery.
- 18-red-core (source: images (7).jpg): 16:9 fantasy party back-facing in lower foreground looking up at enormous black spiked floating mass with glowing red core. Preserve ALL source figures including partially clipped blue figure far left, blue-coated tall figure left, brown-coated sword bearer lower left, pale armored figure center-left, purple figure center, red figure center-right, blue-haired armored figure right, white dog bottom-right. Castle roofs and sepia sky behind. Do not merge figures.
- 19-nagash (source: speaking-of-loading-screens-what-about-the-nagash-artwork-v0-0iuxtiyxipkh1.webp): 16:9 Nagash skeletal sorcerer, extremely tall crowned headdress, raised left arm holding ornate book, long staff diagonal to upper right, dark bone armor and robes, turquoise ghost spirits carrying books, lightning and ruins. Keep rich dark teal spectral green mood and dynamic diagonals. Remove bottom-right Total War Warhammer logo and bottom-left copyright line.
- 20-sunset-archer (source: images (8).jpg): Near square 318:323. Red-haired pale pointed-ear fantasy archer in fitted dark ornate armor centered, bow held right, bright curved blade down-left, sunset orange sky, dark terrain and bare branches. Preserve exact pose, face, weapon shapes, original crop and orange-black palette. No invented text or objects.


## Album extension — 2026-09-16

Owner authorized nine additional pixel-art adaptations, appended after the six previously approved pictures (15 pages total). The original six assets remain unchanged. New pictures are reviewable adaptations, not yet individually approved.

Final framing instruction supersedes the proposed uniform 16:9 plan: retain each source composition and aspect ratio; scale only where needed. Keep the existing fixed album viewport and `object-fit: contain`, which maximizes each image without stretching or clipping. Remove screenshot UI, lettering, logos and watermark text from the derived pictures only. Source files remain untouched. Do not add titles or captions to the viewer.

Built-in ImageGen was used separately per image, with a second pass on the frozen duel to correct framing. Outputs are `public/gallery/08-cradle.png` through `16-crimson-knight.png`; untouched inputs are archived in `references/album/` using matching numbered names.

### Extension prompt set

Common prompt: Use case: style-transfer. Edit the supplied image into authentic coarse 8-bit pixel art for a retro portfolio album. Reference is edit target, preserve original composition, aspect ratio, identities, exact character count, poses, clothing, weapons and mood. Apparent 320 pixel wide logical grid, consistent hard square pixel clusters, stepped contours, limited scene-specific 24-32 colors, sparse ordered dithering. No smooth painting, blur, photoreal texture or fake grid overlay. Remove all text logos watermarks captions and screenshot UI, naturally reconstruct background. No new text, borders, characters or objects. Do not force 16:9, stretch or crop subjects. Single complete artwork.

Specific invariants appended to each prompt:

- 08-cradle: Wide 2.23:1 graveyard, braided dark-haired girl right, wooden crosses, sunset. Remove ALL review/auto/skip/dialogue/name/next/waveform UI.
- 09-garden-reunion: Garden family gathering, preserve all eight people including two children, two dogs, camera, picnic and sea tower. Keep 1.72:1.
- 10-group-portrait: 4:3 group portrait on white, preserve exactly all eleven characters their hair colors outfits heights and arrangement, full bodies. Remove narrow black side borders only.
- 11-artanis: 16:9 Artanis centered surrounded by alien creatures; ornate gold blue armor, left green energy blade and right blue blade, back blue energy. Remove bottom-right logo.
- 12-frozen-duel: Snow duel, horned fighter left and white-haired armored swordsman right, crossed weapons. Remove black letterbox padding, preserve actual wide scene and faces.
- 13-bedside: 4:3 grayscale bedside vigil, dark-haired person back to viewer seated stool, light-haired person in bed right, window upper left, wood room. Keep monochrome! Remove circular chevron UI top and bottom.
- 14-resting-blades: Square closeup pale bandaged wrist and hand on ornate broad dark blades resting on rust-red cloth. Preserve weapon geometry and hand anatomy. Remove RS Gaming text.
- 15-golden-warrior: 16:9 low-angle golden armored warrior with TWO huge curved swords, long flowing pale hair, pale figure behind shoulders, ruined gate and gold green sky. Preserve both figures and sword arcs.
- 16-crimson-knight: 1.9:1 dark armored knight with crimson flowing cape and red aura, sword down-left, fog and gothic tower behind. Preserve tilted camera and silhouette.

These are generated pixel-style adaptations, not exact pixel-for-pixel reproductions or verified hardware-palette exports. Original artwork is not claimed as the portfolio owner's work.

Frozen duel final prompt replaces its first specific prompt: Snow duel. IMPORTANT output landscape aspect ratio 480:260 (~1.846:1), the aspect ratio of the ACTUAL visible artwork excluding black padding. Do not use the padded 4:3 canvas. Keep EXACT cropped scene composition from reference: close-up horned fighter on lower left and white-haired swordsman on right, crossed weapons at middle, their lower bodies outside bottom image like original. Do not invent full bodies or extra sky. Remove black top and bottom padding rather than filling it with extra scenery.

Verification for this extension: `npm.cmd run build` passed. `node scripts/verify-album.mjs` passed for all 15 pages at 1440x900, 390x844 and 844x390: exact file order, image decoding, contain rendering, focus containment, visible controls, no overflow, navigation boundaries, finish, close, Escape on every page and restart at page one. All nine generated outputs were visually inspected; representative desktop, phone and landscape album screenshots were also inspected. Existing contain rendering already uses the largest uncropped size, so no CSS scale adjustment was needed. Room art and original six gallery files were not edited.

## Owner request 2026-09-15: pictures only

The album shows the picture, the page number and the controls only. Visible titles and the credit line were removed at the owner's request; `alt` text stays for screen readers, and the dialogue line when the album opens still says the pieces are artwork reinterpreted as pixel art. Earlier mentions of captions below are superseded. Unselected variants (02, 05 v1, 06 v2) and the untouched sources in references/album/ are kept out of git.

## Approved final selection — supersedes earlier revisions below

Owner approved exactly six images in this order: 1, 3, 4, 5 (new, no logos), 6 (original pixel adaptation), 7. Burning Tree (2) is excluded because it does not fit. The revised head in 06-rain-confrontation-v2.png is rejected; use 06-rain-confrontation.png. The original 05-starlit-rest.png is superseded by 05-starlit-rest-v2.png. Unselected files remain archived on disk but are not in the album. Treat this selection and these versions as approved; do not reintroduce excluded variants in later work.

## Owner-requested revisions to pages 5 and 6

Built-in ImageGen edits, saved as `public/gallery/05-starlit-rest-v2.png` and `public/gallery/06-rain-confrontation-v2.png`; the previous PNGs remain available. Gallery data now references v2. Page 5 removes the four upper-left credit/logo marks and fills the area with matching pixel sky, as explicitly requested. This supersedes the original prompt's mark-preservation instruction; external attribution remains in the album caption. Page 6 uses the owner's attached isolated red-armoured, white-haired female character with gold horned crown as the head identity reference. Preserve rain composition, kneeling pair, standing body and raised-weapon pose; correct the female face, hair, crown and neck. A second localized pass converts the initially over-detailed head/hair/crown to coarse 5–6-pixel clusters matching the scene. Original supplied source images are untouched.

Owner authorized seven 8-bit adaptations and direct album implementation, 2026-09-15.

Images are displayed in supplied order, one at a time. Native dialog traps focus. Previous/Next and arrow keys browse without wrapping; the final button finishes. Escape and Close return to the prior navigation location at any page. Reopening starts at 1. Original aspect ratios use object-fit: contain. Labels follow the current locale content system. During this task concurrent workspace edits restricted enabled languages to English and removed VI/JA; those edits were preserved.

Verification: production build passed. Playwright with Edge tested all seven images at 1440×900, 390×844 and 844×390; image decoding, visible controls, no dialog overflow, previous/next boundaries, finish, close, focus inside the dialog, Escape from all seven pages and restarting at page one passed. Desktop, portrait and landscape screenshots were visually inspected in artifacts/album-*.png.

Untouched inputs: references/album/. Generated project assets: public/gallery/01-*.png through 07-*.png. Source titles/authors were not supplied, so descriptive captions are not official titles. Do not claim these artworks were created by the portfolio owner. Existing marks on source 5 were requested to be preserved. AI adaptations may differ in small details; this is an 8-bit visual style, not a verified hardware-palette export.

## Built-in ImageGen prompt set

### 01-storm-castle

Source: C:/Users/Le Nguyen/Downloads/1024px-S624.webp

Use case: style-transfer. Edit the supplied artwork into strongly authentic 8-bit pixel art for a retro game album. Input image is the edit target and sole composition source. Preserve all characters, poses, counts, expressions, placement, distinctive clothing, key silhouettes, lighting direction and original aspect ratio. Render like a hand-crafted 8-bit adventure cutscene: apparent 256-320 pixel wide logical grid (portrait 144x256), hard square pixel clusters of consistent size, crisp stepped contours, limited approximately 24-32-color scene-specific palette, deliberate sparse ordered dithering, no smooth gradients, no soft blur, no modern painted strokes, no fake grid overlay. Preserve visual hierarchy and original mood. No added objects, frames, UI, captions or signatures. Existing source marks must remain. Single complete image only. Specific invariants: Wide 16:9 storm scene: two back-facing dark cloaked figures on right hill, blond figure on right of the pair, castle at left middle, two grave crosses at far right, purple flowers in foreground, black clouds and branching white lightning, amber horizon.

### 02-burning-tree

Source: C:/Users/Le Nguyen/Downloads/images.jpg

Use case: style-transfer. Edit the supplied artwork into strongly authentic 8-bit pixel art for a retro game album. Input image is the edit target and sole composition source. Preserve all characters, poses, counts, expressions, placement, distinctive clothing, key silhouettes, lighting direction and original aspect ratio. Render like a hand-crafted 8-bit adventure cutscene: apparent 256-320 pixel wide logical grid (portrait 144x256), hard square pixel clusters of consistent size, crisp stepped contours, limited approximately 24-32-color scene-specific palette, deliberate sparse ordered dithering, no smooth gradients, no soft blur, no modern painted strokes, no fake grid overlay. Preserve visual hierarchy and original mood. No added objects, frames, UI, captions or signatures. Existing source marks must remain. Single complete image only. Specific invariants: Portrait 9:16 burning gigantic orange-red tree filling upper sky, central trunk, medieval towers in mist below, autumn trees, stone carved slab across foreground. Keep original portrait composition.

### 03-golden-field

Source: C:/Users/Le Nguyen/Downloads/anime-sunset-wallpaper-4k-3840x2160 (1).png

Use case: style-transfer. Edit the supplied artwork into strongly authentic 8-bit pixel art for a retro game album. Input image is the edit target and sole composition source. Preserve all characters, poses, counts, expressions, placement, distinctive clothing, key silhouettes, lighting direction and original aspect ratio. Render like a hand-crafted 8-bit adventure cutscene: apparent 256-320 pixel wide logical grid (portrait 144x256), hard square pixel clusters of consistent size, crisp stepped contours, limited approximately 24-32-color scene-specific palette, deliberate sparse ordered dithering, no smooth gradients, no soft blur, no modern painted strokes, no fake grid overlay. Preserve visual hierarchy and original mood. No added objects, frames, UI, captions or signatures. Existing source marks must remain. Single complete image only. Specific invariants: Wide 16:9 white-haired back-facing female figure in center, raised thin wand in right hand, long dark burgundy coat and scarf blowing left, black stockings, golden reed field, orange pastel sunset and distant tiny figures. Preserve pose and framing.

### 04-fractured-world

Source: C:/Users/Le Nguyen/Downloads/50_i35.png

Use case: style-transfer. Edit the supplied artwork into strongly authentic 8-bit pixel art for a retro game album. Input image is the edit target and sole composition source. Preserve all characters, poses, counts, expressions, placement, distinctive clothing, key silhouettes, lighting direction and original aspect ratio. Render like a hand-crafted 8-bit adventure cutscene: apparent 256-320 pixel wide logical grid (portrait 144x256), hard square pixel clusters of consistent size, crisp stepped contours, limited approximately 24-32-color scene-specific palette, deliberate sparse ordered dithering, no smooth gradients, no soft blur, no modern painted strokes, no fake grid overlay. Preserve visual hierarchy and original mood. No added objects, frames, UI, captions or signatures. Existing source marks must remain. Single complete image only. Specific invariants: Wide 16:9 surreal scene: tiny pink-haired white-cloaked figure left and black-clad figure right holding hands at center bottom, wheat foreground, immense glitch-like stretched horizontal and vertical architectural light bands with ghostlike scenes overhead. Those distortions are intentional art: preserve them.

### 05-starlit-rest

Source: C:/Users/Le Nguyen/Downloads/images (1).jpg

Use case: style-transfer. Edit the supplied artwork into strongly authentic 8-bit pixel art for a retro game album. Input image is the edit target and sole composition source. Preserve all characters, poses, counts, expressions, placement, distinctive clothing, key silhouettes, lighting direction and original aspect ratio. Render like a hand-crafted 8-bit adventure cutscene: apparent 256-320 pixel wide logical grid (portrait 144x256), hard square pixel clusters of consistent size, crisp stepped contours, limited approximately 24-32-color scene-specific palette, deliberate sparse ordered dithering, no smooth gradients, no soft blur, no modern painted strokes, no fake grid overlay. Preserve visual hierarchy and original mood. No added objects, frames, UI, captions or signatures. Existing source marks must remain. Single complete image only. Specific invariants: Wide 16:9 intimate scene of two light-haired anime characters resting together on right, closed eyes, leaning heads, joined hands center bottom, knees at left, golden light against dark blue star-filled sky. Preserve all four tiny original creator/brand marks at top left in their original locations; do not erase them.

### 06-rain-confrontation

Source: C:/Users/Le Nguyen/Downloads/images (2).jpg

Use case: style-transfer. Edit the supplied artwork into strongly authentic 8-bit pixel art for a retro game album. Input image is the edit target and sole composition source. Preserve all characters, poses, counts, expressions, placement, distinctive clothing, key silhouettes, lighting direction and original aspect ratio. Render like a hand-crafted 8-bit adventure cutscene: apparent 256-320 pixel wide logical grid (portrait 144x256), hard square pixel clusters of consistent size, crisp stepped contours, limited approximately 24-32-color scene-specific palette, deliberate sparse ordered dithering, no smooth gradients, no soft blur, no modern painted strokes, no fake grid overlay. Preserve visual hierarchy and original mood. No added objects, frames, UI, captions or signatures. Existing source marks must remain. Single complete image only. Specific invariants: Wide 16:9 rain scene: two kneeling people on lower left, dark-haired blue cape and blond head, towering red-robed white-haired standing figure at right holding an ornate pink weapon overhead, bright violet-white storm opening, rain diagonal across frame, pale petal-covered ground. Preserve composition and exact three-person arrangement.

### 07-white-haired-portrait

Source: C:/Users/Le Nguyen/Downloads/images (3).jpg

Use case: style-transfer. Edit the supplied artwork into strongly authentic 8-bit pixel art for a retro game album. Input image is the edit target and sole composition source. Preserve all characters, poses, counts, expressions, placement, distinctive clothing, key silhouettes, lighting direction and original aspect ratio. Render like a hand-crafted 8-bit adventure cutscene: apparent 256-320 pixel wide logical grid (portrait 144x256), hard square pixel clusters of consistent size, crisp stepped contours, limited approximately 24-32-color scene-specific palette, deliberate sparse ordered dithering, no smooth gradients, no soft blur, no modern painted strokes, no fake grid overlay. Preserve visual hierarchy and original mood. No added objects, frames, UI, captions or signatures. Existing source marks must remain. Single complete image only. Specific invariants: Wide approximately 2.17:1 close portrait: cheerful white braided-haired horned girl, orange eyes, black gold red elaborate outfit, fluffy yellow collar, red bow and ribbons, turquoise patterned sash flying right, expansive white hair and bright background. Preserve horns, pose, braid, eyes and costume silhouette.
