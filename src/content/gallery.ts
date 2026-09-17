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
  { file: 'gallery/01-storm-castle.webp', alt: 'Two cloaked figures face a distant castle beneath lightning; purple flowers cover the hill.' },
  { file: 'gallery/03-golden-field.webp', alt: 'A white-haired figure raises a wand over a golden field at sunset, their coat and scarf blowing left.' },
  { file: 'gallery/04-fractured-world.webp', alt: 'Two figures hold hands in a wheat field beneath immense fragmented architectural bands of light.' },
  { file: 'gallery/05-starlit-rest-v2.webp', alt: 'Two light-haired characters rest together beneath a starry blue sky, illuminated in gold.' },
  { file: 'gallery/06-rain-confrontation.webp', alt: 'Two people kneel before a red-cloaked figure carrying a pink weapon beneath a violet rainstorm.' },
  { file: 'gallery/07-white-haired-portrait.webp', alt: 'A smiling white-haired horned character with orange eyes, a gold collar, red ribbons and turquoise sash.' },
  { file: 'gallery/08-cradle.webp', alt: 'A dark-haired girl with braids walks between wooden grave markers beneath a stormy sunset.' },
  { file: 'gallery/09-garden-reunion.webp', alt: 'Eight people and two dogs gather for a picnic by the sea; a blond man takes a photograph.' },
  { file: 'gallery/10-group-portrait.webp', alt: 'Eleven characters pose together against a white background, surrounding a seated smiling woman.' },
  { file: 'gallery/11-artanis.webp', alt: 'Artanis stands in gold and blue armor with green and blue energy blades, surrounded by alien creatures.' },
  { file: 'gallery/12-frozen-duel-selected.webp', alt: 'A horned fighter and a white-haired swordsman clash weapons in a snowy frozen landscape.' },
  { file: 'gallery/13-bedside.webp', alt: 'A monochrome scene of a dark-haired person sitting on a stool beside someone resting in bed beneath a window.' },
  { file: 'gallery/14-resting-blades.webp', alt: 'A pale hand with a bandaged wrist rests on ornate dark blades laid over rust-red cloth.' },
  { file: 'gallery/15-golden-warrior.webp', alt: 'A golden armored warrior holds two curved swords, with a pale long-haired figure behind his shoulders and a ruined gate overhead.' },
  { file: 'gallery/16-crimson-knight.webp', alt: 'A dark armored knight holds a sword beneath a flowing crimson cape, red light, and a distant gothic tower.' },
  { file: 'gallery/17-held-hand.webp', alt: 'A standing armored knight holds the hand of a long-haired person bowing from a tall carved chair, in muted gray and sepia.' },
  { file: 'gallery/18-red-core.webp', alt: 'A party and a white dog face a towering spiked dark mass with a glowing red core above castle rooftops.' },
  { file: 'gallery/19-nagash.webp', alt: 'Nagash raises a book and a long staff amid turquoise spirits, floating books, lightning and dark ruins.' },
  { file: 'gallery/20-battlefield-duel.webp', alt: 'Two armed fighters face each other across a muddy battlefield, with distant soldiers, small fires and an overcast sky.' },
  { file: 'gallery/21-vs-hector.webp', alt: 'A blue-scarfed swordsman confronts a purple winged hooded adversary.' },
  { file: 'gallery/22-moon-lord.webp', alt: 'Four armored heroes face the Moon Lord beneath a starry sky and four celestial pillars.' },
  { file: 'gallery/23-monika.webp', alt: 'Monika rests her chin on her hands at a desk in a warmly lit classroom.' },
  { file: 'gallery/24-radiance.webp', alt: 'A small horned knight faces a vast crowned winged being against golden light.' },
  { file: 'gallery/25-dante-vergil.webp', alt: 'Dante and Vergil fight back to back amid red crystalline demonic scenery.' },
  { file: 'gallery/26-reaching-sky.webp', alt: 'A dark-haired man in a suit reaches toward the bright sky above trees and city buildings.' },
]

export function galleryUrl(item: GalleryItem): string {
  return `${import.meta.env.BASE_URL}${item.file}`
}
