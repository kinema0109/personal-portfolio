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
  { file: 'gallery/08-cradle.png', alt: 'A dark-haired girl with braids walks between wooden grave markers beneath a stormy sunset.' },
  { file: 'gallery/09-garden-reunion.png', alt: 'Eight people and two dogs gather for a picnic by the sea; a blond man takes a photograph.' },
  { file: 'gallery/10-group-portrait.png', alt: 'Eleven characters pose together against a white background, surrounding a seated smiling woman.' },
  { file: 'gallery/11-artanis.png', alt: 'Artanis stands in gold and blue armor with green and blue energy blades, surrounded by alien creatures.' },
  { file: 'gallery/12-frozen-duel-selected.png', alt: 'A horned fighter and a white-haired swordsman clash weapons in a snowy frozen landscape.' },
  { file: 'gallery/13-bedside.png', alt: 'A monochrome scene of a dark-haired person sitting on a stool beside someone resting in bed beneath a window.' },
  { file: 'gallery/14-resting-blades.png', alt: 'A pale hand with a bandaged wrist rests on ornate dark blades laid over rust-red cloth.' },
  { file: 'gallery/15-golden-warrior.png', alt: 'A golden armored warrior holds two curved swords, with a pale long-haired figure behind his shoulders and a ruined gate overhead.' },
  { file: 'gallery/16-crimson-knight.png', alt: 'A dark armored knight holds a sword beneath a flowing crimson cape, red light, and a distant gothic tower.' },
  { file: 'gallery/17-held-hand.png', alt: 'A standing armored knight holds the hand of a long-haired person bowing from a tall carved chair, in muted gray and sepia.' },
  { file: 'gallery/18-red-core.png', alt: 'A party and a white dog face a towering spiked dark mass with a glowing red core above castle rooftops.' },
  { file: 'gallery/19-nagash.png', alt: 'Nagash raises a book and a long staff amid turquoise spirits, floating books, lightning and dark ruins.' },
  { file: 'gallery/20-sunset-archer.png', alt: 'A red-haired archer in dark armor holds a bow and a bright curved blade against an orange sunset.' },
]

export function galleryUrl(item: GalleryItem): string {
  return `${import.meta.env.BASE_URL}${item.file}`
}
