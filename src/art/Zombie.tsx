import { PixelRects } from './PixelRects'
import type { Px } from './palette'

/**
 * A Plants vs. Zombies basic zombie shambling past the window at night: brown coat, white shirt,
 * red tie, grey-green skin, arms held out in front. It faces left, the way zombies cross the lawn.
 *
 * It starts just outside the right edge of the glass with its feet at the foot of the skyline
 * (y 91), and CSS walks it off the left edge. The window clip hides it outside the glass.
 */

/** Delay before the first zombie once night begins, and between zombies after that, in ms. */
export const ZOMBIE_FIRST_MS: readonly [number, number] = [3000, 5000]
export const ZOMBIE_EVERY_MS: readonly [number, number] = [15000, 25000]
/** How long one walk across the window takes; keep in step with `.f-zombie-walk` in styles.css. */
export const ZOMBIE_WALK_MS = 8000

/** Clip id for the window glass; defined in ApartmentScene's defs. */
export const WINDOW_GLASS_CLIP = 'apt-window-glass'

const HAIR = '#3a3a3a'
const SKIN = '#8fa68a'
const SKIN_DARK = '#6f8a6b'
const EYE = '#eeeeee'
const PUPIL = '#2a2a2a'
const MOUTH = '#3a2a2a'
const COAT = '#6b4a33'
const COAT_DARK = '#4f3524'
const SHIRT = '#d9d2c0'
const TIE = '#b8322c'
const PANTS = '#4a4e5c'

/** Top-left of the sprite's head block, before it starts walking. */
const X = 103
const Y = 78

const at = (px: readonly Px[]): Px[] => px.map(([x, y, w, h, fill]) => [X + x, Y + y, w, h, fill] as Px)

const body = at([
  // Head: messy hair, one staring eye, a slack mouth.
  [2, 0, 4, 1, HAIR], [1, 1, 5, 4, SKIN], [1, 4, 5, 1, SKIN_DARK],
  [1, 2, 2, 1, EYE], [1, 2, 1, 1, PUPIL], [1, 4, 2, 1, MOUTH],
  // Coat over a white shirt and red tie; the back is in shadow.
  [2, 5, 4, 5, COAT], [2, 5, 2, 3, SHIRT], [2, 6, 1, 3, TIE], [5, 5, 1, 5, COAT_DARK],
])

/** Two shuffling steps: legs apart with the arms level, then legs together with the arms sagging. */
const stepA = at([
  [-2, 6, 4, 1, COAT], [-3, 6, 1, 1, SKIN],
  [2, 10, 1, 3, PANTS], [4, 10, 1, 2, PANTS], [5, 12, 1, 1, PANTS],
  [1, 12, 2, 1, COAT_DARK], [4, 12, 2, 1, COAT_DARK],
])
const stepB = at([
  [-2, 7, 4, 1, COAT], [-3, 7, 1, 1, SKIN],
  [3, 10, 1, 3, PANTS], [4, 10, 1, 3, PANTS],
  [2, 12, 2, 1, COAT_DARK], [4, 12, 2, 1, COAT_DARK],
])

export function Zombie() {
  return (
    <g clipPath={`url(#${WINDOW_GLASS_CLIP})`}>
      <g className="f-zombie-walk" data-zombie>
        <PixelRects px={body} />
        <PixelRects px={stepA} className="f-zombie-a" />
        <PixelRects px={stepB} className="f-zombie-b" />
      </g>
    </g>
  )
}
