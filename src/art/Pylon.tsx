import { PixelRects } from './PixelRects'
import { outlineOf } from './outline'
import type { Px } from './palette'

/**
 * A StarCraft Protoss pylon under the desk, standing where the power strip was: the room's own power.
 * On, its crystal glows and bobs. Off, it is dark and nothing electric in the room works. Warping in
 * plays a floor ring and the crystal's wireframe, top half then bottom half, before it lights up.
 */

export type Power = 'on' | 'off' | 'warping'

/** How long a warp-in takes before power returns. Keep in step with the `.f-warp-*` delays. */
export const WARP_MS = 1500
/** How long Thọ's caption asking for pylons stays up. */
export const PYLON_LINE_MS = 3000

/**
 * Click target over the pylon, in scene units. Scene.tsx places the button here. Padded past the art
 * (x 103–117, y 123–146) to at least 23 × 28, so it is an easy target on a phone; it stays clear of the
 * fan above (y ≤ 105), the Sun-shroom and the nearest sun spot (x ≤ 94).
 */
export const PYLON_BOX = { x: 99, y: 119, w: 23, h: 28 } as const

const GLOW = '#3fa7ff'
const WIRE = '#7fd4ff'

const base = (lit: boolean): Px[] => [
  [103, 142, 15, 4, '#6b5220'],
  [104, 141, 13, 1, '#c9a45c'],
  [105, 143, 11, 1, '#a8843a'],
  [107, 144, 2, 1, lit ? GLOW : '#1b2230'],
  [112, 144, 2, 1, lit ? GLOW : '#1b2230'],
]

const crystalShape = (core: string, light: string, shade: string): Px[] => [
  [110, 123, 1, 1, core], [109, 124, 3, 2, core], [108, 126, 5, 3, core],
  [107, 129, 7, 4, core], [108, 133, 5, 3, core], [109, 136, 3, 1, core], [110, 137, 1, 1, core],
  [109, 126, 1, 6, light], [112, 127, 1, 6, shade],
]
const crystalLit = crystalShape(GLOW, '#b8e4ff', '#2a6fc0')
const crystalDark = crystalShape('#3d4a5e', '#566378', '#2b3444')

/**
 * A soft glow behind the lit crystal: a stepped diamond one to two units past the crystal's own shape,
 * so it reads as light around the crystal rather than a box. Drawn as one group, so the overlapping
 * steps share one opacity instead of stacking.
 */
const halo: Px[] = [
  [109, 121, 3, 19, GLOW],
  [107, 123, 7, 15, GLOW],
  [105, 127, 11, 7, GLOW],
]

/** The crystal's edges only, split so the warp can draw the top first and the bottom second. */
const wireTop: Px[] = [
  [110, 123, 1, 1, WIRE], [109, 124, 1, 2, WIRE], [111, 124, 1, 2, WIRE], [108, 126, 1, 3, WIRE],
  [112, 126, 1, 3, WIRE], [107, 129, 1, 2, WIRE], [113, 129, 1, 2, WIRE],
]
const wireBottom: Px[] = [
  [107, 131, 1, 2, WIRE], [113, 131, 1, 2, WIRE], [108, 133, 1, 3, WIRE], [112, 133, 1, 3, WIRE],
  [109, 136, 1, 1, WIRE], [111, 136, 1, 1, WIRE], [110, 137, 1, 1, WIRE],
]
const warpRing: Px[] = [[99, 145, 23, 1, WIRE], [102, 144, 17, 1, GLOW]]

/**
 * The hover rim, in two parts: the base's stays on the floor, and the crystal's is drawn inside the
 * bobbing group so it moves with the crystal. During the warp there is no crystal yet, so only the base
 * is outlined.
 */
const baseRim = outlineOf(base(true))
const crystalRim = outlineOf(crystalLit)

export function Pylon({ power, highlight }: { power: Power; highlight: boolean }) {
  const lit = power === 'on'
  return (
    <g data-pylon={power}>
      {highlight && <PixelRects px={baseRim} />}
      <PixelRects px={base(lit)} />
      {power === 'warping' ? (
        <g className="f-warp">
          <PixelRects px={warpRing} className="f-warp-ring" />
          <PixelRects px={wireTop} className="f-warp-top" />
          <PixelRects px={wireBottom} className="f-warp-bottom" />
        </g>
      ) : (
        <g className={lit ? 'f-pylon-bob' : undefined}>
          {highlight && <PixelRects px={crystalRim} />}
          {lit && <PixelRects px={halo} className="f-pylon-glow" />}
          <PixelRects px={lit ? crystalLit : crystalDark} />
        </g>
      )}
    </g>
  )
}
