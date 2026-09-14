import { C, H, W, type Px } from './palette'
import { PixelRects } from './PixelRects'

/**
 * PLACEHOLDER ARTWORK, drawn in code on a 320×180 grid.
 * The composition is final: window left, poster right, desk with laptop, fan,
 * glass of water, cartridge and headphones. The drawing itself is not.
 * The developer figure is a generic placeholder, not Thọ's likeness.
 */

const room: Px[] = [
  [0, 0, W, 130, C.wall],
  [0, 0, W, 5, C.wallDark],
  [0, 130, W, 50, C.navy],
  // floor planks
  [0, 142, W, 1, C.night], [0, 158, W, 1, C.night], [0, 172, W, 1, C.night],
  [40, 131, 1, 11, C.night], [210, 131, 1, 11, C.night], [120, 143, 1, 15, C.night],
  [70, 159, 1, 13, C.night], [280, 159, 1, 13, C.night], [170, 173, 1, 7, C.night],
  // moonlight on the floor
  [48, 132, 50, 3, C.slate], [44, 135, 50, 3, C.slate], [40, 138, 50, 3, C.slate],
  // baseboard
  [0, 126, W, 4, C.slate], [0, 129, W, 1, C.night],
]

const windowPx: Px[] = [
  [22, 18, 82, 78, C.slate],
  [26, 22, 74, 70, C.night],
  // stars
  [34, 28, 1, 1, C.cream], [58, 34, 1, 1, C.creamDim], [72, 26, 1, 1, C.cream],
  [46, 44, 1, 1, C.creamDim], [94, 46, 1, 1, C.cream],
  // moon
  [83, 29, 6, 8, C.cream], [82, 30, 8, 6, C.cream], [85, 32, 2, 2, C.creamDim],
  // city silhouette
  [26, 70, 12, 22, C.navy], [38, 62, 10, 30, C.navy], [48, 74, 14, 18, C.navy],
  [62, 58, 12, 34, C.navy], [74, 68, 10, 24, C.navy], [84, 64, 16, 28, C.navy],
  // lit windows
  [41, 66, 2, 2, C.ochre], [44, 72, 2, 2, C.ochreDark], [67, 62, 2, 2, C.ochre],
  [70, 70, 2, 2, C.ochre], [67, 80, 2, 2, C.ochreDark], [88, 70, 2, 2, C.ochre],
  [93, 78, 2, 2, C.ochreDark], [30, 76, 2, 2, C.ochreDark], [53, 82, 2, 2, C.ochre],
  // frame cross
  [62, 22, 2, 70, C.slate], [26, 55, 74, 2, C.slate],
  // sill
  [18, 94, 90, 4, C.slateLight], [18, 98, 90, 1, C.night],
  // curtains + rod
  [8, 10, 106, 2, C.woodDark],
  [12, 12, 12, 88, C.red], [15, 12, 2, 88, C.redDark], [20, 12, 1, 88, C.redDark],
  [104, 12, 9, 84, C.red], [107, 12, 1, 84, C.redDark],
]

/** Poster with an original symbol: a cog, a wrench and a curled tail. */
const posterPx: Px[] = [
  [238, 24, 36, 52, C.wallDark],
  [236, 22, 36, 52, C.creamDim],
  [239, 25, 30, 46, C.red],
  // cog
  [248, 36, 12, 12, C.ochre],
  [252, 33, 4, 3, C.ochre], [252, 48, 4, 3, C.ochre], [245, 40, 3, 4, C.ochre], [260, 40, 3, 4, C.ochre],
  [246, 34, 3, 3, C.ochre], [259, 34, 3, 3, C.ochre], [246, 47, 3, 3, C.ochre], [259, 47, 3, 3, C.ochre],
  [252, 40, 4, 4, C.red],
  // wrench across the cog
  [242, 52, 2, 2, C.cream], [244, 50, 2, 2, C.cream], [246, 48, 2, 2, C.cream],
  // curled tail
  [248, 58, 14, 1, C.cream], [262, 56, 1, 2, C.cream], [260, 54, 2, 2, C.cream], [258, 55, 2, 1, C.cream],
  // title bars
  [243, 63, 22, 2, C.cream], [247, 67, 14, 1, C.creamDim],
  [253, 23, 2, 2, C.mist],
]

const desk: Px[] = [
  [118, 104, 188, 5, C.wood], [118, 104, 188, 1, C.ochreDark],
  [118, 109, 188, 3, C.woodDark],
  [122, 112, 5, 30, C.woodDark], [298, 112, 5, 30, C.woodDark],
  [262, 112, 36, 26, C.wood], [262, 112, 36, 1, C.woodDark], [262, 124, 36, 1, C.woodDark],
  [277, 117, 6, 1, C.ochre], [277, 130, 6, 1, C.ochre],
  [118, 140, 190, 3, C.night],
]

const laptop: Px[] = [
  [196, 72, 44, 30, C.night],
  [198, 74, 40, 26, C.screen],
  [201, 77, 14, 1, C.cream], [201, 80, 20, 1, C.mist], [204, 83, 16, 1, C.ochre],
  [204, 86, 22, 1, C.mist], [201, 89, 10, 1, C.cream], [204, 92, 18, 1, C.mist],
  [201, 95, 8, 1, C.ochre],
  [194, 101, 48, 1, C.mist], [192, 102, 52, 2, C.slateLight],
]

/** Placeholder human: seen from behind at three-quarters, hoodie, short hair. */
const developer: Px[] = [
  // left elbow
  [152, 86, 6, 16, C.redDark],
  // torso
  [158, 74, 32, 2, C.red], [156, 76, 36, 34, C.red], [156, 76, 4, 34, C.redDark],
  [164, 76, 20, 3, C.redDark],
  // neck + head
  [170, 72, 10, 5, C.skinShade],
  [168, 52, 14, 2, C.hair], [165, 54, 20, 18, C.hair], [167, 72, 14, 2, C.hair],
  [182, 60, 4, 10, C.skin], [185, 62, 1, 6, C.skinShade], [180, 62, 2, 5, C.skin],
  // right arm reaching the keyboard
  [188, 80, 6, 14, C.red], [190, 94, 14, 5, C.red], [203, 97, 6, 4, C.skin],
]

const chair: Px[] = [
  [152, 90, 36, 2, C.slate], [150, 92, 40, 26, C.slate], [150, 92, 40, 2, C.slateLight],
  [150, 116, 40, 2, C.navy],
  [168, 118, 4, 14, C.night],
  [154, 132, 32, 3, C.night],
  [154, 135, 3, 2, C.night], [168, 135, 4, 2, C.night], [183, 135, 3, 2, C.night],
]

const deskItems: Px[] = [
  // game cartridge
  [134, 97, 14, 7, C.mist], [136, 98, 10, 4, C.red], [137, 99, 8, 1, C.cream], [134, 103, 14, 1, C.slate],
  // glass of water
  [248, 90, 1, 14, C.mist], [255, 90, 1, 14, C.mist], [248, 103, 8, 1, C.mist],
  [249, 95, 6, 8, C.water], [250, 96, 1, 5, C.cream],
  // fan: base, neck, cage
  [268, 100, 18, 4, C.night], [276, 90, 3, 10, C.slate],
  [271, 72, 12, 1, C.slate], [269, 73, 16, 1, C.slate], [268, 74, 18, 15, C.slate],
  [269, 89, 16, 1, C.slate], [271, 90, 12, 1, C.slate],
  [270, 75, 14, 13, C.night],
  // headphones
  [292, 88, 10, 2, C.night], [290, 90, 2, 7, C.night], [302, 90, 2, 7, C.night],
  [288, 96, 6, 8, C.slateLight], [300, 96, 6, 8, C.slateLight],
  [293, 97, 1, 6, C.cream], [300, 97, 1, 6, C.cream],
]

const fanBladesA: Px[] = [[271, 81, 13, 1, C.mist], [277, 76, 1, 11, C.mist]]
const fanBladesB: Px[] = [
  [272, 77, 2, 2, C.mist], [274, 79, 2, 2, C.mist], [279, 83, 2, 2, C.mist], [281, 85, 2, 2, C.mist],
  [281, 77, 2, 2, C.mist], [279, 79, 2, 2, C.mist], [274, 83, 2, 2, C.mist], [272, 85, 2, 2, C.mist],
]
const fanHub: Px[] = [[276, 80, 3, 3, C.cream]]

export function ApartmentScene() {
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
      <PixelRects px={windowPx} />
      <PixelRects px={posterPx} />
      <PixelRects px={desk} />
      <PixelRects px={laptop} />
      <rect className="anim-cursor" x={211} y={95} width={2} height={2} fill={C.cream} />
      <PixelRects px={developer} />
      <PixelRects px={chair} />
      <PixelRects px={deskItems} />
      <PixelRects px={fanBladesA} className="anim-fan-a" />
      <PixelRects px={fanBladesB} className="anim-fan-b" />
      <PixelRects px={fanHub} />
    </svg>
  )
}

/** Poster bounds on the grid, used to place the HTML hotspot button. */
export const POSTER_BOX = { x: 236, y: 22, w: 36, h: 52 } as const
