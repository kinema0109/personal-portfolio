# Album artwork

Six approved adaptations are displayed: 01, 03, 04, 05-v2, 06 (original), 07.
Burning Tree and the revised head variant of 06 are excluded. Unselected files remain on disk for history.
Untouched supplied sources are stored in references/album/ at the repo root.
Analysis and exact generation prompts: docs/ALBUM_IMPLEMENTATION.md.
Original authors/owners retain their artwork; the portfolio does not claim authorship.
The album shows pictures only (no visible titles or captions); `alt` text in `src/content/gallery.ts` is for screen readers.
Only the six approved PNGs are committed; unselected variants and references/album/ stay local.

Put the pixel-art pictures for the album in this folder, then list each one in
`src/content/gallery.ts`:

    { file: 'gallery/rooftop.png', title: 'Rooftop at night', alt: 'Pixel art of a rooftop at night', credit: '…' }

Export pixel art at its native size or an exact multiple (2×, 3×, …). The app draws it
with `image-rendering: pixelated`, so a smoothed upscale will look blurry.
Opening the desk album shows the first picture immediately. Browse with Prev/Next or
arrow keys, Finish at the last image, and Close/Escape at any point.
