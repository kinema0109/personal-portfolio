import { PixelRects } from './PixelRects'
import { outlineOf } from './outline'
import type { Px } from './palette'
import { SUN_SIZE } from './Sunflower'

/**
 * The Sun-shroom beside the Sunflower, from Plants vs. Zombies, and it follows the game: a gold cap
 * with brown spots on a short cream stem, the face on the stem rather than on the cap, asleep by day
 * with Zs rising off it and awake at night.
 *
 * It starts small and gives small suns, and it grows once the visitor has collected three of them at
 * night. In the game it grows after two minutes awake, which is longer than most visits.
 */

const OUT = '#2a2119'
const CAP = '#d89c00'
const CAP_SHADE = '#a87400'
const CAP_HI = '#fcd824'
const SPOT = '#9c4800'
const STEM = '#f0e4cc'
const STEM_SHADE = '#c0a878'
const INK = '#2a2119'
const Z_INK = '#eadfc3'

/** Small suns collected at night before it grows. */
export const GROW_AFTER = 3

/** Click target over the pot, the grown plant and the air just above it, in scene units. */
export const SUNSHROOM_BOX = { x: 60, y: 114, w: 20, h: 32 } as const

/** What Scene keeps about the Sun-shroom and hands down for drawing. */
export interface ShroomState {
  grown: boolean
  /** Counts night clicks; a change replays the flash before a sun comes out. */
  flash: number
  /** Counts day clicks; a change replays the sleepy shake and an extra Z. */
  nudge: number
}

/**
 * Where its sun sits as it leaves the plant: centred on the cap. Both sizes sit on the soil in the
 * pot, so the small cap is lower.
 */
export const shroomToss = (grown: boolean) =>
  grown ? { x: 70 - SUN_SIZE / 2, y: 124 - SUN_SIZE / 2 } : { x: 70 - SUN_SIZE / 2, y: 129 - SUN_SIZE / 2 }

const at = (ox: number, oy: number, px: readonly Px[]): Px[] =>
  px.map(([x, y, w, h, fill]) => [ox + x, oy + y, w, h, fill] as Px)

/**
 * Its own pot, in the Sunflower pot's colours and about two thirds its width: 14 across at the rim,
 * 10 tall, standing on the floor line at x 63–76. The soil top is y 136, which is where the plant sits.
 */
const POT = '#946b50'
const POT_RIM = '#b28b64'
const POT_SHADE = '#7b5740'
const pot: Px[] = [
  [64, 138, 12, 6, POT],
  [65, 144, 10, 2, POT_SHADE],
  [64, 138, 1, 6, POT_SHADE], [74, 138, 2, 6, POT_SHADE],
  [63, 136, 14, 2, POT_RIM],
  [65, 136, 10, 1, '#4a3526'],
]

/* Grown: 16 × 16 at x 62–77, y 120–135, its stem planted in the pot's soil. */
const GROWN = { x: 62, y: 120 }
const grownBody = at(GROWN.x, GROWN.y, [
  // Cap: the silhouette in the outline colour, then the fill one unit in.
  [5, 0, 6, 1, OUT], [3, 1, 10, 1, OUT], [2, 2, 12, 1, OUT], [1, 3, 14, 2, OUT], [0, 5, 16, 3, OUT], [1, 8, 14, 1, OUT],
  [4, 1, 8, 1, CAP], [3, 2, 10, 1, CAP], [2, 3, 12, 2, CAP], [1, 5, 14, 2, CAP], [1, 7, 14, 1, CAP_SHADE],
  // The window is up and to the left, so that is where the cap catches the light.
  [4, 2, 3, 1, CAP_HI], [3, 3, 2, 1, CAP_HI],
  // Spots: one big one low in the middle, small ones near the top.
  [6, 5, 4, 2, SPOT], [10, 2, 2, 1, SPOT], [12, 4, 2, 1, SPOT], [2, 5, 2, 1, SPOT],
  // Stem, shaded away from the window.
  [3, 9, 10, 6, OUT], [4, 15, 8, 1, OUT],
  [4, 9, 8, 5, STEM], [10, 9, 2, 5, STEM_SHADE], [4, 14, 8, 1, STEM_SHADE],
])
const grownEyesOpen = at(GROWN.x, GROWN.y, [[6, 10, 1, 2, INK], [9, 10, 1, 2, INK]])
const grownEyesShut = at(GROWN.x, GROWN.y, [[5, 11, 2, 1, INK], [9, 11, 2, 1, INK]])
const grownMouth = at(GROWN.x, GROWN.y, [[7, 13, 2, 1, INK]])

/* Small: 9 × 9 at x 66–74, y 127–135, in the same pot. Drawn on its own, because halving the grown one
   breaks the grid. */
const SMALL = { x: 66, y: 127 }
const smallBody = at(SMALL.x, SMALL.y, [
  [2, 0, 5, 1, OUT], [1, 1, 7, 1, OUT], [0, 2, 9, 2, OUT], [1, 4, 7, 1, OUT],
  [2, 1, 5, 1, CAP], [1, 2, 7, 1, CAP], [1, 3, 7, 1, CAP_SHADE],
  [2, 1, 2, 1, CAP_HI], [4, 3, 2, 1, SPOT],
  [2, 5, 5, 4, OUT],
  [3, 5, 3, 3, STEM], [5, 5, 1, 3, STEM_SHADE],
])
const smallEyesOpen = at(SMALL.x, SMALL.y, [[3, 6, 1, 1, INK], [5, 6, 1, 1, INK]])
const smallEyesShut = at(SMALL.x, SMALL.y, [[3, 7, 1, 1, INK], [5, 7, 1, 1, INK]])

/** A "Z" in whole pixels: 3 × 3, or 4 × 4 for the larger one that follows it. */
const zGlyph = (x: number, y: number, big: boolean): Px[] =>
  big
    ? [[x, y, 4, 1, Z_INK], [x + 2, y + 1, 1, 1, Z_INK], [x + 1, y + 2, 1, 1, Z_INK], [x, y + 3, 4, 1, Z_INK]]
    : [[x, y, 3, 1, Z_INK], [x + 1, y + 1, 1, 1, Z_INK], [x, y + 2, 3, 1, Z_INK]]

/** Where the Zs start, above the cap and to the right: a small one first, then a bigger one. */
const zStart = (grown: boolean) => (grown ? [{ x: 75, y: 115 }, { x: 77, y: 109 }] : [{ x: 72, y: 122 }, { x: 74, y: 117 }])

export function SunShroom({
  shroom,
  asleep,
  highlight,
}: {
  shroom: ShroomState
  asleep: boolean
  highlight: boolean
}) {
  const { grown, flash, nudge } = shroom
  const body = grown ? grownBody : smallBody
  const eyes = grown ? (asleep ? grownEyesShut : grownEyesOpen) : asleep ? smallEyesShut : smallEyesOpen
  const [z1, z2] = zStart(grown)
  const motion = asleep ? (nudge > 0 ? 'f-shroom-nudge' : undefined) : 'f-shroom-sway'
  return (
    <g data-plant="sunshroom" data-grown={grown} data-asleep={asleep}>
      {/* The pot stays put: it neither grows nor sways, and its rim is part of the hover outline. */}
      {highlight && <PixelRects px={outlineOf(pot)} />}
      <PixelRects px={pot} />
      {/* Growing plays once, when the grown plant first appears. */}
      <g key={grown ? 'grown' : 'small'} className={grown ? 'f-grow' : undefined}>
        <g key={`nudge-${nudge}`} className={motion}>
          {highlight && <PixelRects px={outlineOf(body)} />}
          <PixelRects px={body} />
          <PixelRects px={eyes} className={asleep ? undefined : 'f-blink'} />
          {grown && !asleep && <PixelRects px={grownMouth} />}
          {flash > 0 && !asleep && (
            <g key={`flash-${flash}`} className="f-shroom-flash">
              <PixelRects px={body} />
            </g>
          )}
        </g>
      </g>
      {asleep && (
        <g className="f-zzz">
          <PixelRects px={zGlyph(z1.x, z1.y, false)} className="f-z-1" />
          <PixelRects px={zGlyph(z2.x, z2.y, true)} className="f-z-2" />
          {nudge > 0 && <PixelRects key={`burst-${nudge}`} px={zGlyph(z1.x + 2, z1.y - 2, false)} className="f-z-burst" />}
        </g>
      )}
    </g>
  )
}
