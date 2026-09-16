import { PixelRects } from './PixelRects'
import type { Px } from './palette'

/**
 * The two sitting fumo plushes in the cabinet's top bay: Sparkle and Sparxie from Honkai: Star Rail.
 *
 * Revised from the owner's supplied photos; pending visual acceptance.
 * Narrow separated tails, visible seated bodies, glint eyes and an overlapping hat.
 * The placement, size and the way they are drawn (flat rectangles on the room grid, never a
 * generated sprite) are settled; only the pixels below need replacing.
 *
 * They are a deliberate pair, so they are drawn as mirror images of one another: Sparkle is black
 * hair over a red kimono, Sparxie is white hair over the same reds, the way their names invert each
 * other (花火 / 火花). Each is 17 x 18 scene units, drawn on the room's own pixel grid rather than
 * from a sprite, so they carry the same amount of detail as everything else in the room.
 */

const INK = '#1b1b26'
const SKIN = '#f2dccb'
const BLUSH = '#e8a09c'
const RED = '#b02a34'
const RED_DARK = '#7d1c25'
const GOLD = '#d8a94a'
const WHITE = '#efe9e4'
const HAIR_WHITE = '#e4dfe2'
const PINK = '#e2588f'

/** Sparkle: black twintails, red kimono, fox mask at her temple. */
function sparklePx(x: number, y: number): Px[] {
  return [
    // Twintails, falling past the body on both sides.
    [x, y + 5, 2, 11, INK], [x + 15, y + 5, 2, 11, INK],
    [x, y + 15, 3, 1, '#2c2c3c'], [x + 14, y + 15, 3, 1, '#2c2c3c'],
    // Head, then the fringe over it.
    [x + 3, y + 2, 11, 9, SKIN],
    [x + 3, y + 1, 11, 4, INK], [x + 4, y, 9, 1, INK],
    [x + 3, y + 5, 1, 3, INK], [x + 13, y + 5, 1, 3, INK],
    // Red hair ties and the fox mask she wears pushed to one side.
    [x + 1, y + 2, 3, 2, RED], [x + 13, y + 2, 3, 2, RED],
    [x + 12, y + 1, 2, 4, WHITE], [x + 12, y + 2, 1, 1, RED], [x + 13, y + 4, 1, 1, RED],
    // Face.
    [x + 5, y + 6, 2, 2, INK], [x + 10, y + 6, 2, 2, INK],
    [x + 5, y + 6, 1, 1, BLUSH], [x + 10, y + 6, 1, 1, BLUSH],
    [x + 4, y + 8, 1, 1, BLUSH], [x + 12, y + 8, 1, 1, BLUSH],
    [x + 8, y + 9, 1, 1, '#c98d86'],
    // Kimono, with the white collar crossed over and a gold obi.
    [x + 5, y + 11, 7, 6, RED],
    [x + 3, y + 12, 2, 3, RED_DARK], [x + 12, y + 12, 2, 3, RED_DARK],
    [x + 3, y + 14, 2, 1, SKIN], [x + 12, y + 14, 2, 1, SKIN],
    [x + 6, y + 11, 1, 1, WHITE], [x + 10, y + 11, 1, 1, WHITE],
    [x + 7, y + 12, 1, 1, WHITE], [x + 9, y + 12, 1, 1, WHITE], [x + 8, y + 13, 1, 1, WHITE],
    [x + 5, y + 14, 7, 1, INK], [x + 8, y + 14, 1, 1, GOLD],
    // Legs folded in front.
    [x + 2, y + 16, 5, 2, WHITE], [x + 10, y + 16, 5, 2, WHITE],
    [x + 2, y + 17, 5, 1, '#d9c0ad'], [x + 10, y + 17, 5, 1, '#d9c0ad'],
  ]
}

/** Sparxie: white twintails, black brimmed hat with rabbit ears, harlequin red and white. */
function sparxiePx(x: number, y: number): Px[] {
  return [
    // Twintails, the same silhouette as Sparkle's but white.
    [x, y + 5, 2, 11, HAIR_WHITE], [x + 15, y + 5, 2, 11, HAIR_WHITE],
    [x, y + 14, 3, 2, '#cdc7cb'], [x + 14, y + 14, 3, 2, '#cdc7cb'],
    // Head and fringe.
    [x + 3, y + 2, 11, 9, SKIN],
    [x + 3, y + 1, 11, 4, HAIR_WHITE], [x + 4, y, 9, 1, HAIR_WHITE],
    [x + 3, y + 5, 1, 3, HAIR_WHITE], [x + 13, y + 5, 1, 3, HAIR_WHITE],
    // Black hat tipped over one side, red band, rabbit ears standing out of it.
    [x + 1, y + 1, 8, 1, INK], [x + 2, y - 1, 6, 2, INK],
    [x, y + 2, 4, 1, INK], [x + 7, y, 3, 1, INK],
    [x + 3, y - 1, 5, 1, RED],
    [x + 4, y - 4, 1, 3, WHITE], [x + 6, y - 4, 1, 3, WHITE],
    [x + 4, y - 3, 1, 1, PINK], [x + 6, y - 3, 1, 1, PINK],
    // Face: one eye winking shut, the other marked with her pink cross.
    [x + 5, y + 7, 2, 1, INK],
    [x + 10, y + 6, 3, 3, PINK],
    [x + 10, y + 6, 1, 1, WHITE], [x + 12, y + 6, 1, 1, WHITE], [x + 11, y + 7, 1, 1, WHITE],
    [x + 10, y + 8, 1, 1, WHITE], [x + 12, y + 8, 1, 1, WHITE],
    [x + 4, y + 8, 1, 1, BLUSH], [x + 12, y + 8, 1, 1, BLUSH],
    [x + 8, y + 9, 1, 1, '#c98d86'],
    // Harlequin bodice over a white apron.
    [x + 5, y + 11, 7, 6, RED],
    [x + 3, y + 11, 11, 1, RED_DARK],
    [x + 3, y + 12, 2, 2, INK], [x + 7, y + 12, 2, 2, INK], [x + 11, y + 12, 2, 2, INK],
    [x + 5, y + 14, 2, 2, INK], [x + 9, y + 14, 2, 2, INK],
    [x + 6, y + 13, 5, 5, WHITE],
    // Blue ribbon and its bell at her collar.
    [x + 7, y + 11, 3, 2, '#5aa9c4'], [x + 8, y + 12, 1, 1, GOLD],
    // Boots.
    [x + 2, y + 16, 5, 2, INK], [x + 10, y + 16, 5, 2, INK],
    [x + 4, y + 16, 1, 1, RED], [x + 12, y + 16, 1, 1, RED],
  ]
}

/** One sitting plush, 17 x 18 scene units, standing on `floor`. */
export function Fumo({ kind, x, floor }: { kind: 'sparkle' | 'sparxie'; x: number; floor: number }) {
  const y = floor - 18
  return (
    <g data-fumo={kind}>
      <PixelRects px={kind === 'sparkle' ? sparklePx(x, y) : sparxiePx(x, y)} />
    </g>
  )
}
