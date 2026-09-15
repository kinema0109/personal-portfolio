import type { GalleryItem } from './types'

/**
 * Pixel-art album, opened from the photo album on the desk.
 * Put the image files in public/gallery/ and list them here in display order.
 *
 * MISSING: Thọ will supply the pictures. Example entry:
 *   { file: 'gallery/rooftop.png', title: 'Rooftop at night', alt: 'Pixel art of …', credit: '…' }
 */
export const galleryItems: readonly GalleryItem[] = []

/** Empty frames shown while the album has no pictures. */
export const EMPTY_FRAME_COUNT = 6

export function galleryUrl(item: GalleryItem): string {
  return `${import.meta.env.BASE_URL}${item.file}`
}
