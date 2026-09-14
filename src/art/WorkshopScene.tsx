import { SpeechBubble } from './ApartmentScene'
import type { SceneFocus } from './camera'
import { C, type Px } from './palette'
import { PixelRects } from './PixelRects'

/**
 * PLACEHOLDER ARTWORK: the optional rat-mechanic workshop.
 * Original design: overalls, goggles, wrench, cogs. It uses no characters,
 * symbols or colours from any existing franchise.
 */

export const WORKSHOP_FOCUS: SceneFocus = {
  primary: { x: 60, y: 18, w: 200, h: 128 },
  secondary: { x: 8, y: 8, w: 304, h: 140 },
}

const X0 = -800
const XW = 1920

const shell: Px[] = [
  [X0, -600, XW, 722, C.wallDark],
  [X0, 122, XW, 600, C.woodDark],
  [X0, 122, XW, 2, C.night],
]

const pegboard: Px[] = [
  [18, 20, 104, 62, C.wood], [18, 20, 104, 2, C.ochreDark], [18, 80, 104, 2, C.night],
  [30, 30, 3, 36, C.mist], [26, 26, 11, 6, C.mist], [30, 26, 3, 3, C.wood],
  [50, 34, 3, 34, C.ochreDark], [44, 28, 16, 7, C.slateLight],
  [72, 30, 30, 12, C.mist], [72, 42, 30, 2, C.slate], [100, 30, 10, 12, C.redDark],
  [76, 54, 16, 16, C.redDark], [80, 58, 8, 8, C.wood],
]

const porthole: Px[] = [
  [246, 16, 36, 36, C.slateLight], [250, 20, 28, 28, C.night],
  [266, 24, 4, 4, C.cream], [256, 36, 1, 1, C.creamDim],
]

const lamp: Px[] = [
  [200, -200, 1, 228, C.night], [193, 28, 15, 6, C.ochreDark], [198, 34, 5, 3, C.cream],
]

const bench: Px[] = [
  [150, 98, 160, 6, C.wood], [150, 98, 160, 1, C.ochreDark], [150, 104, 160, 3, C.woodDark],
  [156, 107, 5, 30, C.woodDark], [300, 107, 5, 30, C.woodDark],
  [150, 136, 160, 3, C.night],
  [170, 90, 10, 8, C.ochre], [173, 92, 4, 3, C.woodDark], [182, 92, 8, 6, C.ochreDark], [176, 86, 8, 5, C.ochre],
  [214, 72, 34, 26, C.slateLight], [214, 72, 34, 2, C.mist],
  [222, 77, 14, 14, C.cream], [238, 80, 6, 3, C.red], [238, 86, 6, 3, C.ochre],
  [248, 62, 4, 36, C.ochreDark], [252, 62, 14, 4, C.ochreDark],
  [276, 86, 12, 12, C.red], [288, 84, 8, 2, C.redDark], [280, 83, 4, 3, C.redDark],
]
const needleA: Px[] = [[228, 80, 2, 6, C.redDark]]
const needleB: Px[] = [[229, 82, 4, 2, C.redDark]]

/** Wide screens: jar shelf and barrel on the left, pipes and crate on the right. */
const extras: Px[] = [
  [-84, 60, 72, 3, C.wood], [-84, 90, 72, 3, C.wood],
  [-78, 48, 8, 12, C.slateLight], [-78, 46, 8, 2, C.ochre],
  [-66, 50, 8, 10, C.slateLight], [-66, 48, 8, 2, C.ochre],
  [-50, 48, 10, 10, C.ochre], [-47, 51, 4, 4, C.wallDark],
  [-34, 80, 14, 10, C.redDark],
  [-72, 100, 22, 26, C.wood], [-72, 106, 22, 2, C.ochreDark], [-72, 118, 22, 2, C.ochreDark],
  [332, -200, 4, 322, C.ochreDark], [344, -200, 4, 322, C.ochreDark],
  [326, 60, 16, 4, C.red], [332, 54, 4, 16, C.red],
  [356, 100, 30, 22, C.wood], [356, 100, 30, 2, C.ochreDark], [370, 102, 2, 20, C.woodDark],
]

const mechanicBody: Px[] = [
  [94, 48, 12, 12, C.fur], [97, 51, 6, 6, C.pink],
  [114, 46, 12, 12, C.fur], [117, 49, 6, 6, C.pink],
  [98, 58, 28, 20, C.fur], [98, 74, 28, 4, C.furDark],
  [126, 64, 10, 10, C.fur], [135, 67, 3, 3, C.pink],
  [118, 63, 3, 3, C.night], [119, 63, 1, 1, C.cream],
  [134, 72, 8, 1, C.creamDim], [134, 75, 7, 1, C.creamDim],
  [98, 57, 28, 3, C.night], [104, 53, 8, 7, C.ochre], [106, 55, 4, 3, C.mist],
  [114, 53, 8, 7, C.ochre], [116, 55, 4, 3, C.mist],
  [98, 78, 28, 42, C.red], [98, 78, 4, 42, C.redDark],
  [104, 82, 16, 12, C.redDark], [105, 84, 2, 2, C.ochre], [117, 84, 2, 2, C.ochre],
  [90, 80, 8, 24, C.fur], [90, 102, 8, 5, C.pink],
  [126, 80, 8, 14, C.fur], [128, 94, 8, 6, C.fur], [134, 94, 5, 5, C.pink],
  [135, 76, 3, 26, C.mist], [131, 70, 11, 6, C.mist], [135, 70, 3, 3, C.wallDark],
  [100, 120, 10, 18, C.redDark], [114, 120, 10, 18, C.redDark],
  [96, 138, 16, 4, C.pink], [112, 138, 16, 4, C.pink],
]
const tailA: Px[] = [[70, 118, 4, 6, C.pink], [66, 124, 4, 8, C.pink], [70, 132, 28, 3, C.pink]]
const tailB: Px[] = [[62, 120, 4, 5, C.pink], [66, 124, 4, 8, C.pink], [70, 132, 28, 3, C.pink]]

export function WorkshopScene({ viewBox, speaking }: { viewBox: string; speaking: boolean }) {
  return (
    <svg
      className="pixel-svg"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id="ws-bricks" width="24" height="18" patternUnits="userSpaceOnUse" y="8">
          <rect x="0" y="0" width="24" height="1" fill={C.navy} />
          <rect x="0" y="1" width="1" height="8" fill={C.navy} />
          <rect x="0" y="9" width="24" height="1" fill={C.navy} />
          <rect x="12" y="10" width="1" height="8" fill={C.navy} />
        </pattern>
        <pattern id="ws-floor" width="70" height="18" patternUnits="userSpaceOnUse" y="124">
          <rect x="0" y="17" width="70" height="1" fill={C.night} />
          <rect x="35" y="0" width="1" height="17" fill={C.night} />
        </pattern>
      </defs>

      <PixelRects px={shell} />
      <rect x={X0} y={-600} width={XW} height={722} fill="url(#ws-bricks)" />
      <rect x={X0} y={124} width={XW} height={600} fill="url(#ws-floor)" />
      <PixelRects px={extras} />
      <PixelRects px={pegboard} />
      <PixelRects px={porthole} />
      <PixelRects px={lamp} />
      <PixelRects px={bench} />
      <PixelRects px={needleA} className="f-needle-a" />
      <PixelRects px={needleB} className="f-needle-b" />
      <PixelRects px={[[94, 142, 36, 2, C.night]]} />
      <PixelRects px={tailA} className="f-tail-a" />
      <PixelRects px={tailB} className="f-tail-b" />
      <PixelRects px={mechanicBody} className="f-breathe" />
      {speaking && <SpeechBubble x={138} y={40} />}
    </svg>
  )
}
