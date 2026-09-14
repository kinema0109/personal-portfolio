import { C, H, W, type Px } from './palette'
import { PixelRects } from './PixelRects'

/**
 * PLACEHOLDER ARTWORK: the optional rat-mechanic workshop.
 * Original design: overalls, goggles, wrench, cogs. It uses no characters,
 * symbols or colours from any existing franchise.
 */

function bricks(): Px[] {
  const out: Px[] = []
  for (let row = 0; row < 12; row++) {
    const y = 8 + row * 9
    out.push([0, y, W, 1, C.navy])
    const offset = row % 2 === 0 ? 0 : 12
    for (let x = offset; x < W; x += 24) out.push([x, y + 1, 1, 8, C.navy])
  }
  return out
}

const room: Px[] = [
  [0, 0, W, 122, C.wallDark],
  ...bricks(),
  [0, 122, W, 58, C.woodDark],
  [0, 122, W, 2, C.night],
  [0, 140, W, 1, C.night], [0, 160, W, 1, C.night],
  [60, 124, 1, 16, C.night], [190, 141, 1, 19, C.night], [260, 124, 1, 16, C.night],
]

const pegboard: Px[] = [
  [18, 20, 104, 62, C.wood], [18, 20, 104, 2, C.ochreDark], [18, 80, 104, 2, C.night],
  // wrench
  [30, 30, 3, 36, C.mist], [26, 26, 11, 6, C.mist], [30, 26, 3, 3, C.wood],
  // hammer
  [50, 34, 3, 34, C.ochreDark], [44, 28, 16, 7, C.slateLight],
  // saw
  [72, 30, 30, 12, C.mist], [72, 42, 30, 2, C.slate], [100, 30, 10, 12, C.redDark],
  // coil of wire
  [76, 54, 16, 16, C.redDark], [80, 58, 8, 8, C.wood],
]

const porthole: Px[] = [
  [246, 16, 36, 36, C.slateLight], [250, 20, 28, 28, C.night],
  [266, 24, 4, 4, C.cream], [256, 36, 1, 1, C.creamDim],
]

const lamp: Px[] = [
  [200, 0, 1, 28, C.night], [193, 28, 15, 6, C.ochreDark], [198, 34, 5, 3, C.cream],
]

const bench: Px[] = [
  [150, 98, 160, 6, C.wood], [150, 98, 160, 1, C.ochreDark], [150, 104, 160, 3, C.woodDark],
  [156, 107, 5, 30, C.woodDark], [300, 107, 5, 30, C.woodDark],
  [150, 136, 160, 3, C.night],
  // cog pile
  [170, 90, 10, 8, C.ochre], [173, 92, 4, 3, C.woodDark], [182, 92, 8, 6, C.ochreDark], [176, 86, 8, 5, C.ochre],
  // contraption with a dial
  [214, 72, 34, 26, C.slateLight], [214, 72, 34, 2, C.mist],
  [222, 77, 14, 14, C.cream], [228, 80, 2, 6, C.redDark], [238, 80, 6, 3, C.red], [238, 86, 6, 3, C.ochre],
  [248, 62, 4, 36, C.ochreDark], [252, 62, 14, 4, C.ochreDark],
  // oil can
  [276, 86, 12, 12, C.red], [288, 84, 8, 2, C.redDark], [280, 83, 4, 3, C.redDark],
]

const mechanic: Px[] = [
  // tail
  [70, 118, 4, 6, C.pink], [66, 124, 4, 8, C.pink], [70, 132, 26, 3, C.pink],
  // ears
  [94, 48, 12, 12, C.fur], [97, 51, 6, 6, C.pink],
  [114, 46, 12, 12, C.fur], [117, 49, 6, 6, C.pink],
  // head + snout
  [98, 58, 28, 20, C.fur], [98, 74, 28, 4, C.furDark],
  [126, 64, 10, 10, C.fur], [135, 67, 3, 3, C.pink],
  [118, 63, 3, 3, C.night], [119, 63, 1, 1, C.cream],
  [134, 72, 8, 1, C.creamDim], [134, 75, 7, 1, C.creamDim],
  // goggles on forehead
  [98, 57, 28, 3, C.night], [104, 53, 8, 7, C.ochre], [106, 55, 4, 3, C.mist],
  [114, 53, 8, 7, C.ochre], [116, 55, 4, 3, C.mist],
  // overalls
  [98, 78, 28, 42, C.red], [98, 78, 4, 42, C.redDark],
  [104, 82, 16, 12, C.redDark], [105, 84, 2, 2, C.ochre], [117, 84, 2, 2, C.ochre],
  // arms
  [90, 80, 8, 24, C.fur], [90, 102, 8, 5, C.pink],
  [126, 80, 8, 14, C.fur], [128, 94, 8, 6, C.fur], [134, 94, 5, 5, C.pink],
  // wrench in hand
  [135, 76, 3, 26, C.mist], [131, 70, 11, 6, C.mist], [135, 70, 3, 3, C.wallDark],
  // legs + feet
  [100, 120, 10, 18, C.redDark], [114, 120, 10, 18, C.redDark],
  [96, 138, 16, 4, C.pink], [112, 138, 16, 4, C.pink],
  [94, 142, 36, 2, C.night],
]

export function WorkshopScene() {
  return (
    <svg
      className="pixel-svg"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <PixelRects px={room} />
      <PixelRects px={pegboard} />
      <PixelRects px={porthole} />
      <PixelRects px={lamp} />
      <PixelRects px={bench} />
      <PixelRects px={mechanic} />
    </svg>
  )
}
