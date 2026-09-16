import { PixelRects } from './PixelRects'
import type { Px } from './palette'

/**
 * The three collectibles in the cabinet's middle bay, drawn on the room's own pixel grid.
 *
 * They replace downsampled renders that carried 252-254 colours each — more than twice the whole
 * room's 113 — which is why they read as photographs propped up inside pixel art. Each one here
 * keeps its identity (see docs/DESIGN_CONTRACT.md) in about fifteen flat colours, the same way the
 * fumo plushes and the sunflower are drawn.
 *
 * Sizes match the slots the old sprites were drawn into, so nothing else in the bay moves.
 */

/* ── Grey Seer: horned rat wizard, 21 x 33 ───────────────────── */

const FUR = '#a9a49a'
const FUR_DARK = '#7d786f'
const ROBE = '#2f7f96'
const ROBE_DARK = '#1f5a6b'
const ROBE_LIGHT = '#48a0b4'
const HORN = '#cbb894'
const WOOD = '#6b4a2c'
const GOLD = '#d4a53a'
const GOLD_DARK = '#9a7526'
const GEM = '#c4413a'
const STEEL = '#b9c0cb'
const TAIL = '#c98b8b'
const MOSS = '#4f7f3a'
const BASE = '#17171c'
const INK = '#1b1b22'

function greySeerPx(x: number, y: number): Px[] {
  const p = (dx: number, dy: number, w: number, h: number, fill: string): Px => [x + dx, y + dy, w, h, fill]
  const robe: Px[] = [
    [8, 16, 6], [8, 17, 6], [7, 18, 8], [7, 19, 8], [6, 20, 10], [6, 21, 10], [6, 22, 10],
    [5, 23, 12], [5, 24, 12], [5, 25, 12], [4, 26, 14], [4, 27, 14], [4, 28, 14], [4, 29, 14],
  ].map(([dx, dy, w]) => p(dx, dy, w, 1, ROBE))
  return [
    // Staff: sunburst head, red stone, long shaft.
    p(17, 1, 1, 1, GOLD), p(16, 2, 3, 1, GOLD), p(15, 3, 5, 1, GOLD),
    p(16, 4, 3, 1, GOLD), p(17, 5, 1, 1, GOLD),
    p(14, 3, 1, 1, GOLD_DARK), p(20, 3, 1, 1, GOLD_DARK), p(17, 0, 1, 1, GOLD_DARK),
    p(17, 6, 2, 2, GEM), p(17, 6, 1, 1, '#e8756a'),
    p(17, 8, 2, 21, WOOD), p(18, 8, 1, 21, '#4e3520'),
    ...robe,
    // Robe: lit on the left, folded and shaded towards the staff.
    p(4, 26, 2, 4, ROBE_LIGHT), p(6, 20, 1, 9, ROBE_LIGHT),
    p(13, 18, 3, 12, ROBE_DARK), p(9, 20, 1, 10, ROBE_DARK),
    p(4, 29, 14, 1, ROBE_DARK),
    // Head: skull, snout to the right, one red eye.
    p(8, 9, 6, 6, FUR), p(14, 11, 3, 2, FUR), p(7, 10, 1, 3, FUR),
    p(9, 15, 5, 1, FUR_DARK), p(14, 13, 2, 1, FUR_DARK), p(13, 9, 1, 6, FUR_DARK),
    p(16, 12, 1, 1, INK), p(12, 11, 1, 1, GEM),
    // Two horns curling up and back over the skull.
    p(8, 7, 3, 2, HORN), p(6, 5, 3, 2, HORN), p(5, 3, 2, 2, HORN),
    p(11, 6, 2, 2, '#a89477'), p(10, 4, 2, 2, '#a89477'),
    // Curved blade in his other hand.
    p(5, 16, 2, 2, WOOD),
    p(4, 14, 2, 2, STEEL), p(3, 12, 2, 2, STEEL), p(3, 10, 1, 2, STEEL),
    p(4, 14, 1, 2, '#e2e7ee'),
    // Tail, curling out from under the robe.
    p(17, 25, 3, 1, TAIL), p(19, 26, 1, 2, TAIL), p(16, 28, 4, 1, TAIL),
    // Painted base: broken wood and moss on a black oval.
    p(4, 27, 4, 1, MOSS), p(13, 27, 4, 1, WOOD),
    p(3, 29, 15, 2, BASE), p(4, 31, 13, 1, '#0d0d11'),
    p(4, 29, 5, 1, MOSS), p(12, 29, 5, 1, WOOD),
  ]
}

/* ── Alpha Legion marine, 24 x 31 ────────────────────────────── */

const PLATE = '#2b6b7d'
const PLATE_DARK = '#1c4a58'
const PLATE_LIGHT = '#3f8ba0'
const TRIM = '#9aa3ad'
const HYDRA = '#4f9a3a'
const TABARD = '#8a5a2c'

function alphaLegionPx(x: number, y: number): Px[] {
  const p = (dx: number, dy: number, w: number, h: number, fill: string): Px => [x + dx, y + dy, w, h, fill]
  // The polearm is one continuous staircase rather than spaced blocks, with a gold blade at each end.
  const polearm: Px[] = []
  for (let i = 0; i < 23; i++) {
    polearm.push(p(1 + i, 1 + Math.round(i * 1.1), 2, 2, i < 3 || i > 19 ? GOLD : HYDRA))
  }
  return [
    // Helmet with the red eye slits.
    p(10, 4, 4, 1, PLATE), p(9, 5, 6, 4, PLATE), p(10, 9, 4, 1, PLATE),
    p(10, 4, 4, 1, PLATE_LIGHT),
    p(10, 7, 1, 1, GEM), p(13, 7, 1, 1, GEM),
    // Torso.
    p(7, 10, 10, 9, PLATE), p(7, 10, 10, 1, TRIM),
    p(7, 14, 10, 1, PLATE_DARK), p(11, 11, 2, 7, PLATE_LIGHT),
    p(15, 11, 2, 8, PLATE_DARK),
    // Shoulder pads, rounded, hydra green on his left.
    p(3, 9, 5, 1, PLATE), p(2, 10, 6, 4, PLATE), p(3, 14, 5, 1, PLATE),
    p(3, 9, 5, 1, TRIM), p(2, 13, 6, 1, PLATE_DARK),
    p(16, 9, 5, 1, PLATE), p(16, 10, 6, 4, PLATE), p(16, 14, 5, 1, PLATE),
    p(16, 9, 5, 1, TRIM), p(16, 13, 6, 1, PLATE_DARK),
    p(18, 10, 3, 1, HYDRA), p(19, 11, 1, 1, HYDRA), p(17, 11, 1, 2, HYDRA),
    // Legs, boots and the tabard hanging between them.
    p(6, 19, 4, 8, PLATE), p(14, 19, 4, 8, PLATE),
    p(6, 19, 1, 8, PLATE_LIGHT), p(17, 19, 1, 8, PLATE_DARK),
    p(5, 26, 5, 2, PLATE_DARK), p(14, 26, 5, 2, PLATE_DARK),
    p(9, 18, 6, 9, TABARD), p(9, 18, 6, 1, '#a87038'), p(13, 19, 2, 8, '#6b4522'),
    // Slate base.
    p(3, 28, 18, 2, '#2a2c33'), p(4, 30, 16, 1, '#15161b'),
    ...polearm,
  ]
}

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

/** Slot each figure stands in, in scene units. Scene.tsx puts a hover label over each. */
export const FIGURES = {
  seer: { x: 309, y: 75, w: 21, h: 33, label: 'Yes-yes!' },
  alpha: { x: 335, y: 77, w: 24, h: 31, label: 'I am Alpharius.' },
  'master-ball': { x: 361, y: 88, w: 20, h: 19, label: 'Grrrgh…' },
} as const

export type FigureKind = keyof typeof FIGURES

const DRAW: Record<FigureKind, (x: number, y: number) => Px[]> = {
  seer: greySeerPx,
  alpha: alphaLegionPx,
  'master-ball': masterBallPx,
}

/** One collectible on the bay floor. */
export function Figure({ kind }: { kind: FigureKind }) {
  const { x, y } = FIGURES[kind]
  return (
    <g data-figure={kind}>
      <PixelRects px={DRAW[kind](x, y)} />
    </g>
  )
}
