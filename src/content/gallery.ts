import type { GalleryItem } from './types'

/**
 * Pixel-art album, opened from the photo album on the desk.
 * Put the image files in public/gallery/ and list them here in display order.
 *
 * Owner-approved selection: 1, 3, 4, 5 (v2), 6 (original adaptation), 7.
 * Untouched sources and analysis: references/album/ and docs/ALBUM_IMPLEMENTATION.md.
 * The album shows pictures only (owner request): no visible titles or captions. `alt` is for screen readers.
 */
export const galleryItems: readonly GalleryItem[] = [
  { file: 'gallery/01-storm-castle.png', alt: 'Two cloaked figures face a distant castle beneath lightning; purple flowers cover the hill.' },
  { file: 'gallery/03-golden-field.png', alt: 'A white-haired figure raises a wand over a golden field at sunset, their coat and scarf blowing left.' },
  { file: 'gallery/04-fractured-world.png', alt: 'Two figures hold hands in a wheat field beneath immense fragmented architectural bands of light.' },
  { file: 'gallery/05-starlit-rest-v2.png', alt: 'Two light-haired characters rest together beneath a starry blue sky, illuminated in gold.' },
  { file: 'gallery/06-rain-confrontation.png', alt: 'Two people kneel before a red-cloaked figure carrying a pink weapon beneath a violet rainstorm.' },
  { file: 'gallery/07-white-haired-portrait.png', alt: 'A smiling white-haired horned character with orange eyes, a gold collar, red ribbons and turquoise sash.' },
]

export function galleryUrl(item: GalleryItem): string {
  return `${import.meta.env.BASE_URL}${item.file}`
}
