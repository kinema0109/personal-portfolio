import { PixelRects } from './PixelRects'
import type { Px } from './palette'

/**
 * The Master Ball on the cabinet's middle shelf, drawn on the room's own pixel grid, and the hover
 * labels for all three collectibles beside it.
 *
 * Why this one is drawn and the two miniatures are not: the sprites carry 252-254 colours each,
 * against 113 for the whole room, and every pixel of them is a different material where the room is
 * built from large flat blocks. Requantising them to a dozen colours changed almost nothing, so
 * matching the room means redrawing, not recolouring. A smooth plastic sphere redraws cleanly at
 * this size; a painted Grey Seer and an Alpha Legion marine do not, so the owner kept their sprites.
 */

/* ── Master Ball, 20 x 19 ────────────────────────────────────── */

const SHELL = '#6b3fa0'
const SHELL_LIGHT = '#8a5cc4'
const SHELL_DARK = '#4e2b78'
const WING = '#e2508f'
const WING_LIGHT = '#f58fc0'
const BAND = '#16161d'
const WHITE = '#eceff2'
const WHITE_DIM = '#c4c9d2'

/** Half-widths of a 19-pixel circle, row by row, so the ball is actually round. */
const BALL_ROWS = [3, 5, 6, 7, 8, 8, 9, 9, 9, 9, 9, 9, 9, 8, 8, 7, 6, 5, 3]

function masterBallPx(x: number, y: number): Px[] {
  const p = (dx: number, dy: number, w: number, h: number, fill: string): Px => [x + dx, y + dy, w, h, fill]
  // The band sits on the ball's equator; purple above it, white below.
  const shell = BALL_ROWS.map((half, row) =>
    p(9 - half, row, half * 2 + 1, 1, row < 9 ? SHELL : row < 11 ? BAND : WHITE),
  )
  return [
    ...shell,
    // Light from the upper left, shade on the lower right.
    p(4, 1, 3, 1, SHELL_LIGHT), p(2, 2, 3, 1, SHELL_LIGHT), p(1, 4, 2, 2, SHELL_LIGHT),
    p(15, 2, 2, 1, SHELL_DARK), p(16, 3, 2, 2, SHELL_DARK), p(17, 5, 2, 3, SHELL_DARK),
    p(12, 15, 5, 1, WHITE_DIM), p(10, 16, 5, 1, WHITE_DIM), p(8, 17, 6, 1, WHITE_DIM),
    p(6, 18, 7, 1, WHITE_DIM),
    // The two wing marks: small rounded blobs high on the shell, not half the ball.
    p(3, 2, 3, 1, WING), p(2, 3, 5, 3, WING), p(3, 6, 3, 1, WING),
    p(13, 2, 3, 1, WING), p(12, 3, 5, 3, WING), p(13, 6, 3, 1, WING),
    p(3, 3, 2, 1, WING_LIGHT), p(13, 3, 2, 1, WING_LIGHT),
    // M between them: two uprights and a V dropped between their tops.
    p(7, 1, 1, 5, WHITE), p(11, 1, 1, 5, WHITE),
    p(8, 1, 1, 1, WHITE), p(10, 1, 1, 1, WHITE),
    p(8, 2, 1, 1, WHITE), p(10, 2, 1, 1, WHITE), p(9, 3, 1, 1, WHITE),
    // Catch: a small black ring with a white button in it, straddling the band.
    p(8, 6, 3, 1, BAND), p(7, 7, 5, 5, BAND), p(8, 12, 3, 1, BAND),
    p(8, 7, 3, 1, WHITE), p(8, 8, 3, 3, WHITE), p(9, 11, 1, 1, WHITE),
    p(9, 9, 1, 1, WHITE_DIM),
  ]
}

/**
 * Where each collectible stands, in scene units, and the line it says when pointed at. All three get
 * a label; only the Master Ball is drawn from this file.
 */
export const FIGURES = {
  seer: { x: 309, y: 75, w: 21, h: 33, label: 'Yes-yes!' },
  alpha: { x: 335, y: 77, w: 24, h: 31, label: 'I am Alpharius.' },
  'master-ball': { x: 361, y: 88, w: 20, h: 19, label: 'Grrrgh…' },
} as const

export type FigureKind = keyof typeof FIGURES

/** The Master Ball on its painted base. */
export function MasterBall() {
  const { x, y } = FIGURES['master-ball']
  return (
    <g data-figure="master-ball">
      <PixelRects px={masterBallPx(x, y)} />
    </g>
  )
}
