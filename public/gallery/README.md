# Gallery asset slot

Put the pixel-art pictures for the album in this folder, then list each one in
`src/content/gallery.ts`:

    { file: 'gallery/rooftop.png', title: 'Rooftop at night', alt: 'Pixel art of a rooftop at night', credit: '…' }

Export pixel art at its native size or an exact multiple (2×, 3×, …). The app draws it
with `image-rendering: pixelated`, so a smoothed upscale will look blurry.
While the list is empty, the gallery shows empty frames and a placeholder note.
