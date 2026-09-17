import type { WalkerTiming } from '../hooks/useWalker'
import { PixelRects } from './PixelRects'
import type { Px } from './palette'
import { WINDOW_GLASS_CLIP } from './Zombie'

/**
 * A blue slime from Terraria, hopping past the window by day and by night. It enters from the left,
 * the opposite way to the zombie, squashing flat each time it lands. It starts just outside the
 * glass's left edge with its base at the foot of the skyline, and CSS carries it off the right edge.
 */

export const SLIME_TIMING: WalkerTiming = { first: [3000, 5000], every: [15000, 25000], walkMs: 7000 }

const SLIME = '#4f8fe0'
const LIGHT = '#8fc0ff'
const DARK = '#2a5aa8'
const EYE = '#0e1826'

/** Top-left of the 8 × 6 body, before it starts hopping. */
const X = 14
const Y = 86

const at = (px: readonly Px[]): Px[] => px.map(([x, y, w, h, fill]) => [X + x, Y + y, w, h, fill] as Px)

/** In the air: a rounded dome with a highlight and two eyes. */
const air = at([
  [2, 0, 4, 1, DARK], [1, 1, 6, 1, SLIME], [0, 2, 8, 3, SLIME], [0, 5, 8, 1, DARK],
  [0, 2, 1, 3, DARK], [7, 2, 1, 3, DARK], [2, 1, 2, 1, LIGHT], [1, 2, 1, 1, LIGHT],
  [2, 3, 1, 1, EYE], [5, 3, 1, 1, EYE],
])
/** Landing: squashed wider and lower. */
const land = at([
  [1, 1, 6, 1, DARK], [0, 2, 8, 1, SLIME], [-1, 3, 10, 2, SLIME], [-1, 5, 10, 1, DARK],
  [-1, 3, 1, 2, DARK], [8, 3, 1, 2, DARK], [1, 2, 2, 1, LIGHT],
  [2, 3, 1, 1, EYE], [5, 3, 1, 1, EYE],
])

export function Slime() {
  return (
    <g clipPath={`url(#${WINDOW_GLASS_CLIP})`}>
      <g className="f-slime-walk" data-slime style={{ animationDuration: `${SLIME_TIMING.walkMs}ms` }}>
        <g className="f-slime-hop">
          <PixelRects px={air} className="f-slime-air" />
          <PixelRects px={land} className="f-slime-land" />
        </g>
      </g>
    </g>
  )
}
