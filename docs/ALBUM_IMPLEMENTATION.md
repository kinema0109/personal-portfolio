# Album source analysis and generation

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
