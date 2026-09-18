import { PixelRects } from './PixelRects'
import { outlineOf } from './outline'
import type { Px } from './palette'

/**
 * A Dark Souls bonfire on the window sill: the coiled sword driven into a mound of ash and bones, with
 * a small fire licking up around its blade. Resting at it plays the "BONFIRE LIT" moment and nothing
 * else — no healing, no respawn, no enemies coming back; the owner asked for the reference only.
 *
 * It is 10 units wide and 12 tall (x 72–81, y 82–93), standing on the sill top at y 94, clear of the
 * Sunflower's head (x ≤ 51), the glazing bar (x 62–63) and the desk fan (x ≥ 94).
 *
 * At this size the sword is what sells it. It gets a hilt that reads as a cross, a slight lean so it
 * looks driven in rather than stood up, and the coil: a two-wide blade whose light and dark sides swap
 * every row, so it looks twisted.
 */

/** Click target, in scene units: the sprite plus a unit of slack, and room for the flare above it. */
export const BONFIRE_BOX = { x: 70, y: 79, w: 14, h: 15 } as const

/** How long the fire flares after a rest. */
export const BONFIRE_FLARE_MS = 1000
/** How long the "BONFIRE LIT" caption stays up. Keep in step with `.bonfire-lit`'s animation. */
export const BONFIRE_LIT_MS = 2500

const INK: Record<string, string> = {
  a: '#8d8579', // ash, lit
  s: '#6a635a', // ash
  d: '#48423b', // ash in shadow
  c: '#2c2824', // charcoal at the foot
  b: '#d8ceb6', // bone
  e: '#e2702a', // ember
  L: '#c9d0d6', // blade, lit side
  D: '#6b7480', // blade, shadow side of the twist
  i: '#3b3530', // iron hilt
  I: '#b8703a', // iron hilt catching the firelight
  r: '#b8391a', // flame tip
  f: '#f08a24', // flame
  h: '#ffd060', // flame, hot
  w: '#fff4c8', // flame, white-hot
}

/**
 * Turns a character grid into rectangles, one per horizontal run of a colour. Each string is a row,
 * starting at (x, y); '.' is empty. Grids are far easier to read and tweak than coordinates at a
 * sprite this small.
 */
const fromArt = (x: number, y: number, rows: readonly string[]): Px[] =>
  rows.flatMap((row, dy) => {
    const px: Px[] = []
    let dx = 0
    while (dx < row.length) {
      const key = row[dx]
      let run = 1
      while (row[dx + run] === key) run += 1
      if (key !== '.') px.push([x + dx, y + dy, run, 1, INK[key]])
      dx += run
    }
    return px
  })

/** Columns x 72–81. */
const X = 72

const mound = fromArt(X, 90, [
  '...saaas..',
  '..sbssesa.',
  '.dssbddssd',
  'cccccccccc',
])

/** Blade down, hilt up, leaning left by one column half way down. */
const sword = fromArt(X, 82, [
  '.......L..',
  '.......i..',
  '......iIi.',
  '......LD..',
  '......DL..',
  '......LD..',
  '.....LD...',
  '.....DL...',
])

/** Fire at rest: tongues either side of the blade on a hot bed of ash. Drawn behind the sword. */
const fireA = fromArt(X, 83, [
  '..r.......',
  '..f.....r.',
  '..ff....f.',
  '.rfh...ff.',
  '..fhf..fh.',
  '..fhhf.fhr',
  '..fhhhhhf.',
  '...fhwhf..',
])
/** The other flicker frame: the tongues trade heights and lean the other way. */
const fireB = fromArt(X, 83, [
  '........r.',
  '...r....f.',
  '..rf....ff',
  '..fh....f.',
  '.ffh...fh.',
  '..fhf.ffh.',
  '..fhhhhhf.',
  '...fhwhf..',
])

/** Resting: the fire roars up past the hilt for a moment, white-hot at its heart. */
const flareA = fromArt(X, 77, [
  '....r.....',
  '...rf..r..',
  '..rff.rf..',
  '..fhf.fhr.',
  '.rfhf.fhf.',
  '.fhhf.fhf.',
  '.fhwhffhfr',
  '.fhwhhhwhf',
  '.fhwwhhwhf',
  'rfhwwwwwhf',
  '.fhwwwwwhf',
  '.fhwwwwwh.',
  '..fhwwwhf.',
  '..fhwwwhf.',
])
const flareB = fromArt(X, 77, [
  '.......r..',
  '..r...rf..',
  '..fr..ff..',
  '.rhf.rfhr.',
  '.fhf.fhf..',
  '.fhhffhhf.',
  'rfhwhfhhfr',
  '.fhwhhwwhf',
  '.fhwwhhwhf',
  '.fhwwwwwhr',
  'rfhwwwwwhf',
  '.fhwwwwwh.',
  '..fhwwwhf.',
  '..fhwwwhf.',
])

/** Firelight on the sill either side of the mound, wider while it flares. */
const sillGlow: Px[] = [[71, 94, 12, 1, '#7a6e84']]
const sillFlare: Px[] = [[67, 94, 20, 1, '#8a7384'], [70, 94, 14, 1, '#b08a6a']]

/** The hover rim follows everything the resting bonfire can show, so it does not change per frame. */
const outline = outlineOf([...mound, ...sword, ...fireA, ...fireB])

export function Bonfire({ flare, highlight }: { flare: boolean; highlight: boolean }) {
  return (
    <g data-bonfire={flare ? 'flare' : 'idle'}>
      {highlight && <PixelRects px={outline} />}
      <PixelRects px={flare ? sillFlare : sillGlow} />
      <PixelRects px={mound} />
      {/* Two frames swapped in turn; reduced motion leaves the first one lit. */}
      <PixelRects px={flare ? flareA : fireA} className={flare ? 'f-flare-a' : 'f-fire-a'} />
      <PixelRects px={flare ? flareB : fireB} className={flare ? 'f-flare-b' : 'f-fire-b'} />
      <PixelRects px={sword} />
    </g>
  )
}
