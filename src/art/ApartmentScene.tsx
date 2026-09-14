import type { SceneFocus } from './camera'
import { C, type Px } from './palette'
import { PixelRects } from './PixelRects'

/**
 * PLACEHOLDER ARTWORK, drawn in code. Scene pixels: the room core spans 0–320 × 0–180,
 * and wall/floor extend in every direction so the scene can fill any screen.
 * The developer figure is a generic placeholder, not Thọ's likeness.
 */

export type ScreenMode = 'code' | 'diagram' | 'game' | 'docs'

export const APARTMENT_FOCUS: SceneFocus = {
  primary: { x: 112, y: 20, w: 198, h: 126 },
  secondary: { x: -6, y: 6, w: 332, h: 142 },
}

/** Poster bounds, used to place the HTML hotspot button. */
export const POSTER_BOX = { x: 236, y: 22, w: 36, h: 52 } as const

const X0 = -800
const XW = 1920

const shell: Px[] = [
  [X0, -600, XW, 562, C.navy], // ceiling
  [X0, -38, XW, 2, C.slate],
  [X0, -36, XW, 166, C.wall],
  [X0, 130, XW, 600, C.navy], // floor
]

const baseboard: Px[] = [
  [X0, 126, XW, 4, C.slate],
  [X0, 129, XW, 1, C.night],
]

const floorDetails: Px[] = [
  // moonlight from the window
  [48, 132, 50, 3, C.slate], [44, 135, 50, 3, C.slate], [40, 138, 50, 3, C.slate],
  // rug
  [132, 131, 168, 9, C.redDark], [132, 132, 168, 1, C.red], [132, 138, 168, 1, C.red],
  // ceiling pendant (off)
  [200, -36, 1, 18, C.night], [193, -18, 15, 5, C.slate], [195, -13, 11, 1, C.slateLight],
  // wall socket
  [110, 116, 5, 6, C.creamDim], [111, 118, 1, 2, C.night], [113, 118, 1, 2, C.night],
]

const windowPx: Px[] = [
  [22, 18, 82, 78, C.slate],
  [26, 22, 74, 70, C.night],
  [83, 29, 6, 8, C.cream], [82, 30, 8, 6, C.cream], [85, 32, 2, 2, C.creamDim],
  // city silhouette
  [26, 70, 12, 22, C.navy], [38, 62, 10, 30, C.navy], [48, 74, 14, 18, C.navy],
  [62, 58, 12, 34, C.navy], [74, 68, 10, 24, C.navy], [84, 64, 16, 28, C.navy],
  [44, 72, 2, 2, C.ochreDark], [67, 62, 2, 2, C.ochre], [67, 80, 2, 2, C.ochreDark],
  [93, 78, 2, 2, C.ochreDark], [30, 76, 2, 2, C.ochreDark],
]
const starsA: Px[] = [[34, 28, 1, 1, C.cream], [72, 26, 1, 1, C.cream], [94, 46, 1, 1, C.cream]]
const starsB: Px[] = [[58, 34, 1, 1, C.creamDim], [46, 44, 1, 1, C.creamDim], [40, 38, 1, 1, C.cream]]
const cityLightsA: Px[] = [[41, 66, 2, 2, C.ochre], [70, 70, 2, 2, C.ochre], [88, 70, 2, 2, C.ochre]]
const cityLightsB: Px[] = [[53, 82, 2, 2, C.ochre], [89, 84, 2, 2, C.ochre], [77, 74, 2, 2, C.ochre]]
const windowFront: Px[] = [
  [62, 22, 2, 70, C.slate], [26, 55, 74, 2, C.slate],
  [18, 94, 90, 4, C.slateLight], [18, 98, 90, 1, C.night],
  [8, 10, 106, 2, C.woodDark],
  [12, 12, 12, 88, C.red], [15, 12, 2, 88, C.redDark], [20, 12, 1, 88, C.redDark],
  [104, 12, 9, 84, C.red], [107, 12, 1, 84, C.redDark],
]

/** Poster with an original symbol: cog, wrench and curled tail. */
const posterPx: Px[] = [
  [238, 24, 36, 52, C.wallDark],
  [236, 22, 36, 52, C.creamDim],
  [239, 25, 30, 46, C.red],
  [248, 36, 12, 12, C.ochre],
  [252, 33, 4, 3, C.ochre], [252, 48, 4, 3, C.ochre], [245, 40, 3, 4, C.ochre], [260, 40, 3, 4, C.ochre],
  [246, 34, 3, 3, C.ochre], [259, 34, 3, 3, C.ochre], [246, 47, 3, 3, C.ochre], [259, 47, 3, 3, C.ochre],
  [252, 40, 4, 4, C.red],
  [242, 52, 2, 2, C.cream], [244, 50, 2, 2, C.cream], [246, 48, 2, 2, C.cream],
  [248, 58, 14, 1, C.cream], [262, 56, 1, 2, C.cream], [260, 54, 2, 2, C.cream], [258, 55, 2, 1, C.cream],
  [243, 63, 22, 2, C.cream], [247, 67, 14, 1, C.creamDim],
  [253, 23, 2, 2, C.mist],
]

/** Left of the room (wide screens): low shelf with a generic retro console. */
const shelf: Px[] = [
  [-80, 56, 72, 3, C.wood],
  [-78, 59, 68, 71, C.woodDark],
  [-74, 62, 60, 20, C.night], [-74, 86, 60, 20, C.night], [-74, 110, 60, 16, C.night],
  [-78, 82, 68, 4, C.wood], [-78, 106, 68, 4, C.wood],
  // books + cartridges
  [-72, 66, 4, 16, C.red], [-67, 64, 3, 18, C.slateLight], [-63, 68, 5, 14, C.ochreDark], [-57, 65, 4, 17, C.creamDim],
  [-50, 78, 12, 4, C.slate],
  [-36, 74, 6, 8, C.mist], [-35, 75, 4, 3, C.red],
  [-29, 74, 6, 8, C.mist], [-28, 75, 4, 3, C.ochre],
  [-22, 74, 6, 8, C.mist], [-21, 75, 4, 3, C.slateLight],
  // console + controller
  [-70, 96, 26, 10, C.creamDim], [-70, 96, 26, 2, C.cream], [-64, 98, 12, 2, C.night], [-48, 101, 3, 3, C.red],
  [-40, 101, 10, 5, C.creamDim], [-38, 102, 2, 2, C.night], [-33, 103, 1, 1, C.red], [-31, 103, 1, 1, C.red],
  [-20, 90, 8, 16, C.slate], [-19, 92, 6, 1, C.cream],
  // boxes
  [-72, 114, 20, 12, C.slate], [-48, 114, 20, 12, C.redDark], [-24, 116, 10, 10, C.ochreDark],
]

/** Right of the room (wide screens): door and light switch. */
const door: Px[] = [
  [312, 70, 4, 6, C.creamDim],
  [322, 28, 48, 102, C.slate],
  [326, 32, 40, 98, C.woodDark],
  [330, 38, 32, 36, C.wood], [330, 80, 32, 44, C.wood],
  [358, 78, 3, 3, C.ochre],
]

const desk: Px[] = [
  [118, 104, 188, 5, C.wood], [118, 104, 188, 1, C.ochreDark],
  [118, 109, 188, 3, C.woodDark],
  [122, 112, 5, 30, C.woodDark], [298, 112, 5, 30, C.woodDark],
  [262, 112, 36, 26, C.wood], [262, 112, 36, 1, C.woodDark], [262, 124, 36, 1, C.woodDark],
  [277, 117, 6, 1, C.ochre], [277, 130, 6, 1, C.ochre],
  [118, 140, 190, 3, C.night],
]

const laptopFrame: Px[] = [
  [196, 72, 44, 30, C.night],
  [194, 101, 48, 1, C.mist], [192, 102, 52, 2, C.slateLight],
]

function Screen({ mode }: { mode: ScreenMode }) {
  switch (mode) {
    case 'code':
      return (
        <g>
          <PixelRects px={[[198, 74, 40, 26, C.screen]]} />
          <PixelRects
            className="f-code-a"
            px={[
              [201, 77, 14, 1, C.cream], [201, 80, 20, 1, C.mist], [204, 83, 16, 1, C.ochre],
              [204, 86, 22, 1, C.mist], [201, 89, 10, 1, C.cream], [204, 92, 18, 1, C.mist],
            ]}
          />
          <PixelRects
            className="f-code-b"
            px={[
              [201, 77, 20, 1, C.mist], [204, 80, 16, 1, C.ochre], [204, 83, 22, 1, C.mist],
              [201, 86, 10, 1, C.cream], [204, 89, 18, 1, C.mist], [204, 92, 12, 1, C.cream],
            ]}
          />
          <PixelRects px={[[201, 95, 8, 1, C.ochre]]} />
          <rect className="f-cursor" x={211} y={94} width={2} height={2} fill={C.cream} />
        </g>
      )
    case 'diagram':
      return (
        <g>
          <PixelRects
            px={[
              [198, 74, 40, 26, C.screen],
              [202, 79, 9, 9, C.mist], [202, 78, 9, 2, C.cream], [202, 83, 9, 1, C.slate],
              [226, 79, 9, 9, C.ochre], [226, 78, 9, 2, C.cream], [226, 83, 9, 1, C.ochreDark],
              [213, 83, 9, 1, C.cream], [221, 82, 1, 3, C.cream],
              [202, 92, 2, 2, C.cream], [206, 92, 14, 1, C.mist],
              [202, 96, 2, 2, C.ochre], [206, 96, 20, 1, C.mist],
            ]}
          />
          <rect className="f-third-1" x={213} y={81} width={2} height={1} fill={C.ochre} />
          <rect className="f-third-2" x={216} y={81} width={2} height={1} fill={C.ochre} />
          <rect className="f-third-3" x={219} y={81} width={2} height={1} fill={C.ochre} />
        </g>
      )
    case 'game':
      return (
        <g>
          <PixelRects
            px={[
              [198, 74, 40, 26, C.night],
              [203, 77, 1, 1, C.cream], [232, 78, 1, 1, C.creamDim],
              [198, 95, 40, 5, C.woodDark], [198, 95, 40, 1, C.ochre],
              [220, 87, 10, 2, C.ochre],
              [214, 92, 4, 3, C.mist],
            ]}
          />
          <rect className="f-cursor" x={224} y={82} width={2} height={2} fill={C.cream} />
          <PixelRects className="f-hero-a" px={[[206, 90, 3, 5, C.red], [206, 88, 3, 2, C.skin]]} />
          <PixelRects className="f-hero-b" px={[[207, 85, 3, 5, C.red], [207, 83, 3, 2, C.skin]]} />
        </g>
      )
    case 'docs':
      return (
        <PixelRects
          px={[
            [198, 74, 40, 26, C.screen],
            [201, 77, 16, 11, C.cream], [201, 77, 16, 2, C.ochre], [203, 81, 10, 1, C.slate], [203, 84, 8, 1, C.slate],
            [220, 77, 15, 11, C.mist], [220, 77, 15, 2, C.slate], [222, 81, 9, 1, C.cream],
            [201, 92, 34, 1, C.mist], [201, 95, 22, 1, C.mist],
          ]}
        />
      )
  }
}

/** Placeholder human seen from behind at three-quarters. */
const developerBody: Px[] = [
  [152, 86, 6, 16, C.redDark],
  [158, 74, 32, 2, C.red], [156, 76, 36, 34, C.red], [156, 76, 4, 34, C.redDark],
  [164, 76, 20, 3, C.redDark],
  [170, 72, 10, 5, C.skinShade],
  [168, 52, 14, 2, C.hair], [165, 54, 20, 18, C.hair], [167, 72, 14, 2, C.hair],
  [182, 60, 4, 10, C.skin], [185, 62, 1, 6, C.skinShade], [180, 62, 2, 5, C.skin],
]
const developerArm: Px[] = [[188, 80, 6, 14, C.red], [190, 94, 14, 5, C.red]]
const handA: Px[] = [[203, 97, 6, 4, C.skin]]
const handB: Px[] = [[204, 96, 6, 4, C.skin]]

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
  // fan
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

export function SpeechBubble({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <PixelRects px={[[x, y, 15, 8, C.cream], [x + 2, y + 8, 2, 2, C.cream]]} />
      <rect className="f-dot-1" x={x + 3} y={y + 3} width={2} height={2} fill={C.navy} />
      <rect className="f-dot-2" x={x + 7} y={y + 3} width={2} height={2} fill={C.navy} />
      <rect className="f-dot-3" x={x + 11} y={y + 3} width={2} height={2} fill={C.navy} />
    </g>
  )
}

interface ApartmentSceneProps {
  viewBox: string
  screen: ScreenMode
  speaking: boolean
}

export function ApartmentScene({ viewBox, screen, speaking }: ApartmentSceneProps) {
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
        <pattern id="apt-wall" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect x="8" y="8" width="1" height="1" fill={C.wallDark} />
        </pattern>
        <pattern id="apt-floor" width="90" height="30" patternUnits="userSpaceOnUse" y="130">
          <rect x="0" y="14" width="90" height="1" fill={C.night} />
          <rect x="0" y="29" width="90" height="1" fill={C.night} />
          <rect x="20" y="0" width="1" height="14" fill={C.night} />
          <rect x="65" y="15" width="1" height="14" fill={C.night} />
        </pattern>
      </defs>

      <PixelRects px={shell} />
      <rect x={X0} y={-36} width={XW} height={162} fill="url(#apt-wall)" />
      <rect x={X0} y={130} width={XW} height={600} fill="url(#apt-floor)" />
      <PixelRects px={baseboard} />
      <PixelRects px={floorDetails} />

      <PixelRects px={windowPx} />
      <PixelRects px={starsA} className="f-twinkle-1" />
      <PixelRects px={starsB} className="f-twinkle-2" />
      <PixelRects px={cityLightsA} />
      <PixelRects px={cityLightsB} className="f-city" />
      <PixelRects px={windowFront} />

      <PixelRects px={posterPx} />
      <PixelRects px={shelf} />
      <PixelRects px={door} />

      <PixelRects px={desk} />
      <PixelRects px={laptopFrame} />
      <Screen mode={screen} />

      <PixelRects px={developerBody} className="f-breathe" />
      <PixelRects px={developerArm} />
      <PixelRects px={handA} className={speaking ? undefined : 'f-type-a'} />
      {!speaking && <PixelRects px={handB} className="f-type-b" />}

      <PixelRects px={chair} />
      <PixelRects px={deskItems} />
      <PixelRects px={fanBladesA} className="f-fan-a" />
      <PixelRects px={fanBladesB} className="f-fan-b" />
      <rect x={276} y={80} width={3} height={3} fill={C.cream} />

      {speaking && <SpeechBubble x={186} y={40} />}
    </svg>
  )
}
