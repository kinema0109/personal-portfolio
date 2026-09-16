import type { CSSProperties } from 'react'
import { PixelRects } from './PixelRects'
import type { Px } from './palette'

/**
 * The potted Sunflower by the window, and the sun it drops when you click it.
 *
 * A reference to Plants vs. Zombies, so it follows the game: an orange-brown face disc ringed with
 * yellow petals on a green stem, and a bobbing idle. In the game the head and the petal ring are
 * separate sprites animated apart, which is why only the head group sways here while the pot, stem
 * and leaves stay still.
 *
 * There is no sun counter and no score. Clicking the flower drops a sun, clicking a sun collects
 * it, and that is the whole of it — the owner asked for the reference, not the game.
 */

const POT = '#946b50'
const POT_RIM = '#b28b64'
const POT_SHADE = '#7b5740'
const STEM = '#3f7a3a'
const STEM_DARK = '#2e5c2b'
const LEAF = '#4b8f43'
const LEAF_DARK = '#356b31'
const PETAL = '#e8c23a'
const PETAL_MID = '#d7ae2d'
const PETAL_DARK = '#c2991f'
const PETAL_SHADE = '#a8831a'
const FACE = '#b87a33'
const FACE_DARK = '#a4682a'
const INK = '#2a2119'
const GLINT = '#f6e6c0'

/** Click target over the whole plant, in scene units. Scene.tsx puts the hotspot button here. */
export const SUNFLOWER_BOX = { x: 26, y: 85, w: 27, h: 61 } as const

/** Where a dropped sun can land, in the order they are used. All on the floor around the pot. */
export const SUN_SPOTS: readonly { x: number; y: number }[] = [
  // Clear of the Sun-shroom's pot at x 63–76, between it and the desk leg.
  { x: 80, y: 132 },
  { x: 8, y: 134 },
  { x: 62, y: 146 },
  { x: 14, y: 150 },
  { x: 36, y: 152 },
]

/** A sun is 14 x 14 scene units; SUN_SPOTS are its top-left corner. */
export const SUN_SIZE = 14

/**
 * Where a sun is tossed from: the top-left a sun would have if it sat centred on the flower's face.
 * Every drop starts here, arcs up over the plant and falls to its spot on the floor.
 */
export const SUNFLOWER_TOSS = { x: 39 - SUN_SIZE / 2, y: 98 - SUN_SIZE / 2 }

/** A Sun-shroom gives small suns until it has grown: half the size, as in the game. */
export type SunSize = 'small' | 'normal'

/** Where a taken sun flies: Thọ's chest, so it reads as him soaking the sun up. */
const CHEST = { x: 174 - SUN_SIZE / 2, y: 90 - SUN_SIZE / 2 }

/** How long a sun lies on the floor before it goes out, and how long the going-out takes. */
export const SUN_LIFE_MS = 8000
export const SUN_FADE_MS = 700
/** How long the flight into Thọ takes. */
export const SUN_TAKE_MS = 520

const pot: Px[] = [
  [30, 127, 18, 17, POT],
  [31, 144, 16, 2, POT_SHADE],
  [29, 124, 20, 3, POT_RIM],
  [30, 127, 2, 17, POT_SHADE],
  [45, 127, 3, 17, POT_SHADE],
  [32, 124, 14, 1, '#4a3526'],
]

const stem: Px[] = [
  [37, 106, 4, 19, STEM],
  [40, 106, 1, 19, STEM_DARK],
]

const leaves: Px[] = [
  // Left leaf, drooping away from the stem.
  [31, 112, 6, 3, LEAF], [28, 113, 3, 3, LEAF], [26, 115, 2, 2, LEAF],
  [31, 114, 6, 1, LEAF_DARK], [28, 115, 3, 1, LEAF_DARK],
  // Right leaf, a little lower.
  [41, 117, 6, 3, LEAF], [47, 118, 3, 3, LEAF], [50, 120, 2, 2, LEAF],
  [41, 119, 6, 1, LEAF_DARK], [47, 120, 3, 1, LEAF_DARK],
]

/**
 * Twelve petals ringed around the face at a radius of 9, each 5 units across. Neighbours never share
 * a tone, which is what separates them at this size — one flat yellow would read as a single disc.
 * The lower half is darker because the room's light comes from the window above.
 */
const petals: Px[] = [
  [46, 96, 5, 5, PETAL], [44, 91, 5, 5, PETAL_MID], [41, 88, 5, 5, PETAL],
  [37, 87, 5, 5, PETAL_MID], [32, 88, 5, 5, PETAL], [29, 91, 5, 5, PETAL_MID],
  [28, 96, 5, 5, PETAL],
  [29, 100, 5, 5, PETAL_DARK], [32, 103, 5, 5, PETAL_SHADE], [37, 105, 5, 5, PETAL_DARK],
  [41, 103, 5, 5, PETAL_SHADE], [44, 100, 5, 5, PETAL_DARK],
]

/** The face: a smaller disc than the petal ring, with the wide grin the plant is known for. */
const face: Px[] = [
  [35, 92, 9, 1, FACE], [34, 93, 11, 1, FACE], [33, 94, 13, 1, FACE],
  [33, 95, 13, 7, FACE],
  [34, 102, 11, 1, FACE], [35, 103, 9, 1, FACE], [36, 104, 7, 1, FACE],
  [35, 103, 9, 1, FACE_DARK], [36, 104, 7, 1, FACE_DARK],
  // Eyes, each with a glint in the upper corner.
  [36, 95, 2, 3, INK], [41, 95, 2, 3, INK],
  [36, 95, 1, 1, GLINT], [41, 95, 1, 1, GLINT],
  // A grin: wide across the top, narrow underneath, so the curve falls away from the eyes.
  [37, 100, 5, 1, INK], [38, 101, 3, 1, INK],
]

const HALO = '#f4dca8'

/**
 * Grows every rectangle by one unit and paints it behind the real thing, so all that shows is a
 * one-pixel rim around the silhouette. A rectangle drawn around the whole plant would be four times
 * its area and would say nothing about what is clickable.
 */
const outlineOf = (px: readonly Px[]): Px[] =>
  px.map(([rx, ry, rw, rh]) => [rx - 1, ry - 1, rw + 2, rh + 2, HALO] as Px)

const bodyOutline = outlineOf([...pot, ...stem, ...leaves])
const headOutline = outlineOf([...petals, ...face])

/**
 * The potted sunflower. Only the head bobs; the pot and leaves stay put, so the outline is split the
 * same way and the highlighted rim bobs with the head.
 */
export function Sunflower({ highlight }: { highlight: boolean }) {
  return (
    <g data-plant="sunflower">
      {highlight && <PixelRects px={bodyOutline} />}
      <PixelRects px={pot} />
      <PixelRects px={stem} />
      <PixelRects px={leaves} />
      <g className="f-bob">
        {highlight && <PixelRects px={headOutline} />}
        <PixelRects px={petals} />
        <PixelRects px={face} />
      </g>
    </g>
  )
}

/* ── Sun ─────────────────────────────────────────────────────── */

const SUN_CORE = '#ffd94a'
const SUN_HOT = '#fff3b0'
const SUN_RAY = '#f5b731'

const sunCore = (x: number, y: number): Px[] => [
  [x + 5, y + 2, 5, 1, SUN_CORE], [x + 4, y + 3, 7, 1, SUN_CORE],
  [x + 3, y + 4, 9, 1, SUN_CORE], [x + 2, y + 5, 11, 5, SUN_CORE],
  [x + 3, y + 10, 9, 1, SUN_CORE], [x + 4, y + 11, 7, 1, SUN_CORE],
  [x + 5, y + 12, 5, 1, SUN_CORE],
  // Hot centre, offset up and left so the ball reads round. Stepped, not a square block.
  [x + 5, y + 3, 3, 1, SUN_HOT], [x + 4, y + 4, 4, 2, SUN_HOT],
  [x + 4, y + 6, 3, 1, SUN_HOT], [x + 5, y + 7, 2, 1, SUN_HOT],
  // Shaded lower edge.
  [x + 3, y + 10, 9, 1, SUN_RAY], [x + 4, y + 11, 7, 1, SUN_RAY], [x + 5, y + 12, 5, 1, SUN_RAY],
]

/** The small sun: 7 units across, drawn in the middle of the same 14-unit spot a normal sun uses. */
const smallSunCore = (x: number, y: number): Px[] => [
  [x + 2, y, 3, 1, SUN_CORE], [x + 1, y + 1, 5, 1, SUN_CORE], [x, y + 2, 7, 3, SUN_CORE],
  [x + 1, y + 5, 5, 1, SUN_RAY], [x + 2, y + 6, 3, 1, SUN_RAY],
  [x + 2, y + 1, 2, 1, SUN_HOT], [x + 1, y + 2, 2, 2, SUN_HOT],
]
const smallRaysA = (x: number, y: number): Px[] => [
  [x + 3, y - 2, 1, 1, SUN_RAY], [x + 3, y + 8, 1, 1, SUN_RAY],
  [x - 2, y + 3, 1, 1, SUN_RAY], [x + 8, y + 3, 1, 1, SUN_RAY],
]
const smallRaysB = (x: number, y: number): Px[] => [
  [x - 1, y - 1, 1, 1, SUN_RAY], [x + 7, y - 1, 1, 1, SUN_RAY],
  [x - 1, y + 7, 1, 1, SUN_RAY], [x + 7, y + 7, 1, 1, SUN_RAY],
]

/** Two ray sets, shown in turn, so the sun shimmers instead of sitting still. */
const sunRaysA = (x: number, y: number): Px[] => [
  [x + 6, y, 2, 2, SUN_RAY], [x + 6, y + 12, 2, 2, SUN_RAY],
  [x, y + 6, 2, 2, SUN_RAY], [x + 12, y + 6, 2, 2, SUN_RAY],
]

const sunRaysB = (x: number, y: number): Px[] => [
  [x + 1, y + 1, 2, 2, SUN_RAY], [x + 11, y + 1, 2, 2, SUN_RAY],
  [x + 1, y + 11, 2, 2, SUN_RAY], [x + 11, y + 11, 2, 2, SUN_RAY],
]

/**
 * One dropped sun. It is drawn at its landing spot and every movement is a transform away from it,
 * so the arcs are described per sun in these offsets and the keyframes stay shared. `from` is where
 * the sun sits as it leaves the plant, which differs between the Sunflower and the Sun-shroom.
 * A small sun keeps the 14-unit spot, so both kinds share the landing spots and the click target.
 */
export function Sun({
  x,
  y,
  size,
  from,
  state,
}: {
  x: number
  y: number
  size: SunSize
  from: { x: number; y: number }
  state: 'idle' | 'taken' | 'fading'
}) {
  const arc = {
    '--sun-from-x': `${from.x - x}px`,
    '--sun-from-y': `${from.y - y}px`,
    // Apex: part way across, and well above both the plant and the floor.
    '--sun-peak-x': `${(from.x - x) * 0.55}px`,
    '--sun-peak-y': `${from.y - y - 14}px`,
    '--sun-to-x': `${CHEST.x - x}px`,
    '--sun-to-y': `${CHEST.y - y}px`,
  } as CSSProperties
  const phase = state === 'taken' ? ' is-taken' : state === 'fading' ? ' is-fading' : ''
  const small = size === 'small'
  return (
    <g className={`f-sun${phase}`} style={arc} data-sun={state} data-sun-size={size}>
      <PixelRects px={small ? smallSunCore(x + 3, y + 3) : sunCore(x, y)} />
      <PixelRects px={small ? smallRaysA(x + 3, y + 3) : sunRaysA(x, y)} className="f-sun-a" />
      <PixelRects px={small ? smallRaysB(x + 3, y + 3) : sunRaysB(x, y)} className="f-sun-b" />
    </g>
  )
}
