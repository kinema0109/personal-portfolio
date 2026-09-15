import type { SceneFocus } from './camera'
import { C, type Px } from './palette'
import { PixelRects } from './PixelRects'
import { ReferenceDisplay } from './ReferenceDisplay'

/**
 * Room layout with separate work and display zones, drawn in code. Scene pixels: the room core spans 0–320 × 0–180,
 * and wall/floor extend in every direction so the scene can fill any screen.
 * The developer figure is a generic placeholder.
 */

export type ScreenMode = 'code' | 'diagram' | 'game' | 'docs'

export const APARTMENT_FOCUS: SceneFocus = {
  primary: { x: 86, y: 8, w: 308, h: 146 },
  secondary: { x: 8, y: 4, w: 390, h: 152 },
}

/** Album bounds on the desk, used to place the gallery hotspot button. */
// LOCKED: See docs/DESIGN_CONTRACT.md before changing this album hotspot.
export const ALBUM_BOX = { x: 118, y: 84, w: 34, h: 21 } as const

/** Other objects the visitor can discover by clicking; Scene.tsx places a button over each. */
export const LAPTOP_BOX = { x: 192, y: 72, w: 52, h: 32 } as const
export const DRAWER_BOX = { x: 246, y: 112, w: 28, h: 31 } as const

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

/** Cabinet is independent of the desk; each collectible has its own bay. */
const rightShelf: Px[] = [
  [302, 16, 86, 126, '#312b2a'], [307, 21, 76, 115, '#131f29'],
  [302, 16, 86, 3, '#876a45'], [302, 19, 4, 122, '#654d36'],
  [384, 19, 4, 122, '#493b2e'],
  [307, 76, 76, 3, '#876a45'], [307, 79, 76, 2, '#392e28'],
  [307, 108, 76, 3, '#876a45'], [307, 111, 76, 2, '#392e28'],
  [343, 22, 3, 54, '#493b2e'],
  [306, 136, 79, 5, '#654d36'], [307, 141, 5, 8, '#392e28'], [378, 141, 5, 8, '#392e28'],
  // Low storage, separated from display bays.
  [348, 119, 4, 17, C.redDark], [354, 116, 5, 20, C.slate],
  [361, 120, 4, 16, C.ochreDark], [367, 118, 4, 18, C.creamDim],
  [374, 122, 5, 14, C.tealDark],
]

const desk: Px[] = [
  [90, 104, 196, 4, '#95734d'], [90, 108, 196, 3, '#4d3c30'],
  [94, 111, 5, 35, '#493b2e'], [278, 111, 5, 35, '#493b2e'],
  [246, 112, 28, 31, '#584631'], [248, 113, 24, 13, '#70573a'],
  [248, 128, 24, 13, '#70573a'], [257, 118, 7, 1, '#c8a36e'],
  [257, 133, 7, 1, '#c8a36e'],
  // A sheet of the CV peeking out of the top drawer: a quiet hint that it opens.
  [251, 126, 13, 2, C.cream], [253, 125, 7, 1, C.creamDim],
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
  // Water has its own gap between the laptop and the Grey Seer.
  [248, 93, 1, 11, C.mist], [255, 93, 1, 11, C.mist],
  [249, 98, 6, 5, C.water], [249, 103, 6, 1, C.mist], [250, 96, 1, 6, C.cream],
  // Fan on the left end of the desk, clear of the album and laptop.
  [95, 101, 18, 3, C.night], [103, 92, 2, 9, C.slate],
  [98, 74, 12, 1, C.slate], [96, 75, 16, 1, C.slate], [95, 76, 18, 15, C.slate],
  [96, 91, 16, 1, C.slate], [98, 92, 12, 1, C.slate], [97, 77, 14, 13, C.night],
]

// LOCKED SWORD REFERENCES: see docs/DESIGN_CONTRACT.md before editing.
const wallReferencePx: Px[] = [
  [245, 18, 44, 57, '#18222e'], [243, 16, 44, 57, '#80674c'],
  [245, 18, 40, 53, '#101b27'],
]
/** Open photo album standing on the desk; clicking it opens the gallery. Original placeholder art. */
// LOCKED SINGLE ALBUM: see docs/DESIGN_CONTRACT.md before editing.
const albumPx: Px[] = [
  [120, 86, 30, 18, C.redDark], // cover
  [122, 88, 12, 15, C.cream], // left page
  [136, 88, 12, 15, C.creamDim], // right page
  [134, 87, 2, 17, C.red], // spine
  [124, 90, 8, 6, C.water], [126, 91, 2, 2, C.cream], [124, 94, 8, 2, C.slate],
  [138, 90, 8, 6, C.ochre], [140, 92, 3, 3, C.red],
  [124, 98, 7, 1, C.slateLight], [124, 100, 5, 1, C.slateLight],
  [138, 98, 6, 1, C.slateLight], [138, 100, 7, 1, C.slateLight],
]

/** Small cross-shaped glint on the album's top corner. */
const glintPx: Px[] = [[150, 82, 1, 5, C.cream], [148, 84, 5, 1, C.cream]]

const fanBladesA: Px[] =[[271, 81, 13, 1, C.mist], [277, 76, 1, 11, C.mist]]
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
  /** Glint on the album. */
  sparkle: boolean
}

export function ApartmentScene({ viewBox, screen, speaking, sparkle }: ApartmentSceneProps) {
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
      <ellipse cx={207} cy={143} rx={115} ry={6} fill="#0e1826" opacity={0.6} />
      <path d="M154 -8H215L283 104H107Z" fill="#e7b568" opacity={0.055} />
      <path d="M184 -36V-5" stroke="#17212d" strokeWidth={2} />
      <path d="M180 -5H188L196 2H172Z" fill="#142330" />
      <rect x={176} y={2} width={16} height={1} fill="#f2d29a" />
      <g fill="#477367"><path d="M39 128Q12 103 19 96Q37 99 39 128ZM39 128Q58 97 65 100Q62 118 39 128ZM39 128Q31 90 37 85Q48 98 39 128Z" /></g>
      <path d="M29 125H49L46 145H32Z" fill="#946b50" />
      <rect x={28} y={124} width={22} height={3} fill="#b28b64" />

      <PixelRects px={windowPx} />
      <PixelRects px={starsA} className="f-twinkle-1" />
      <PixelRects px={starsB} className="f-twinkle-2" />
      <PixelRects px={cityLightsA} />
      <PixelRects px={cityLightsB} className="f-city" />
      <PixelRects px={windowFront} />

      <PixelRects px={wallReferencePx} />
      <ReferenceDisplay kind="swords" x={246} y={20} width={38} height={48} />
      <PixelRects px={rightShelf} />
      <ReferenceDisplay kind="gran" x={314} y={24} width={23} height={48} />
      <ReferenceDisplay kind="alpha" x={352} y={46} width={22} height={28} />
      <rect x={314} y={73} width={23} height={2} fill="#67553b" />
      <rect x={351} y={74} width={24} height={2} fill="#67553b" />
      <ReferenceDisplay kind="ambicion" x={317} y={91} width={57} height={14} />
      <path d="M334 108V99M355 108V99" stroke="#806747" strokeWidth={1} />
      <path d="M316 129V122Q325 111 334 122V129" fill="none" stroke="#62748a" strokeWidth={2} />
      <rect x={315} y={126} width={5} height={8} rx={1} fill="#8090a3" />
      <rect x={330} y={126} width={5} height={8} rx={1} fill="#8090a3" />

      <PixelRects px={desk} />
      <PixelRects px={laptopFrame} />
      <Screen mode={screen} />

      <PixelRects px={developerBody} className="f-breathe" />
      <PixelRects px={developerArm} />
      <PixelRects px={handA} className={speaking ? undefined : 'f-type-a'} />
      {!speaking && <PixelRects px={handB} className="f-type-b" />}

      <PixelRects px={chair} />
      <PixelRects px={deskItems} />
      <ReferenceDisplay kind="seer" x={264} y={81} width={19} height={23} />
      <PixelRects px={albumPx} />
      {sparkle && <PixelRects px={glintPx} className="f-glint" />}
      <g transform="translate(-174 2)">
        <PixelRects px={fanBladesA} className="f-fan-a" />
        <PixelRects px={fanBladesB} className="f-fan-b" />
        <rect x={276} y={80} width={3} height={3} fill={C.cream} />
      </g>

      {speaking && <SpeechBubble x={186} y={40} />}
    </svg>
  )
}
