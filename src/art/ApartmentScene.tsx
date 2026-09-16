import type { SceneFocus } from './camera'
import { C, type Px } from './palette'
import { PixelRects } from './PixelRects'
import { FireEmblemShelf } from './GameShelf'
import { LimbusBookShelf } from './BookShelf'
import { Figure } from './Figures'
import { Fumo } from './Fumo'
import { ReferenceDisplay } from './ReferenceDisplay'
import { Sun, Sunflower } from './Sunflower'
import { REFRESHED_SPRITES } from './refreshedSprites'

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

/** Where the Fire Emblem row stands in the cabinet's bottom bay; Scene.tsx uses it to place the name labels. */
export const FIRE_EMBLEM_SHELF = { x: 310, floor: 136 } as const

/** Where the sinners' books stand in the cabinet's top bay; Scene.tsx uses it for the name labels. */
export const LIMBUS_SHELF = { x: 309, floor: 66 } as const

/** The point the two framed blades cross at. */
const SWORD_CROSS = { x: 229, y: 40 } as const

/** Album bounds on the desk, used to place the gallery hotspot button. */
// LOCKED: See docs/DESIGN_CONTRACT.md before changing this album hotspot.
export const ALBUM_BOX = { x: 118, y: 84, w: 34, h: 21 } as const

/** Other objects the visitor can discover by clicking; Scene.tsx places a button over each. */
export const LAPTOP_BOX = { x: 192, y: 72, w: 52, h: 32 } as const
export const DRAWER_BOX = { x: 246, y: 112, w: 28, h: 31 } as const

/** Brass on the paint case latches. */
const GOLD_CASE = '#c9a45c'

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
  // daylight through the window
  [48, 132, 50, 3, '#4d5a80'], [44, 135, 50, 3, '#4d5a80'], [40, 138, 50, 3, '#4d5a80'],
  [52, 133, 42, 1, '#5d6b94'], [48, 136, 42, 1, '#5d6b94'],
  // rug
  [132, 131, 168, 9, C.redDark], [132, 132, 168, 1, C.red], [132, 138, 168, 1, C.red],
  // wall socket
  [110, 116, 5, 6, C.creamDim], [111, 118, 1, 2, C.night], [113, 118, 1, 2, C.night],
]

const windowPx: Px[] = [
  [22, 18, 82, 78, C.slate],
  // Daylight sky, deeper overhead than at the rooftops.
  [26, 22, 74, 70, '#9cc3e2'],
  [26, 22, 74, 16, '#84b0d6'],
  [26, 60, 74, 32, '#b6d6ea'],
  // The sun, high in the corner where the moon used to hang.
  [82, 26, 12, 12, '#ffe9a8'], [84, 24, 8, 16, '#ffe9a8'], [80, 28, 16, 8, '#ffe9a8'],
  [84, 28, 8, 8, '#fff6d2'],
  // Clouds.
  [30, 33, 15, 4, '#eef4f9'], [34, 30, 8, 3, '#eef4f9'], [33, 37, 9, 1, '#d5e3ee'],
  [55, 45, 17, 4, '#e6eef6'], [60, 42, 9, 3, '#e6eef6'], [58, 49, 11, 1, '#cfdeeb'],
  [74, 34, 11, 3, '#e6eef6'], [77, 32, 6, 2, '#e6eef6'],
  // Skyline, lit from the front instead of silhouetted.
  [26, 70, 12, 22, '#7d93ad'], [38, 62, 10, 30, '#8ea3bb'], [48, 74, 14, 18, '#7688a0'],
  [62, 58, 12, 34, '#93a8c0'], [74, 68, 10, 24, '#8398b0'], [84, 64, 16, 28, '#8ba0b8'],
  [26, 70, 12, 2, '#9db1c7'], [38, 62, 10, 2, '#a3b6ca'], [48, 74, 14, 2, '#93a5bb'],
  [62, 58, 12, 2, '#a7bacd'], [74, 68, 10, 2, '#9aaec4'], [84, 64, 16, 2, '#a2b5c9'],
  // Windows read dark in daylight, the opposite of the night view.
  [44, 72, 2, 3, '#5d7091'], [67, 62, 2, 3, '#5d7091'], [67, 80, 2, 3, '#5d7091'],
  [93, 78, 2, 3, '#5d7091'], [30, 76, 2, 3, '#5d7091'], [52, 80, 2, 3, '#5d7091'],
  [88, 70, 2, 3, '#5d7091'], [41, 68, 2, 3, '#5d7091'], [77, 74, 2, 3, '#5d7091'],
]
const windowFront: Px[] = [
  [62, 22, 2, 70, C.slateLight], [26, 55, 74, 2, C.slateLight],
  [18, 94, 90, 4, C.slateLight], [18, 98, 90, 1, C.night],
  [8, 10, 106, 2, C.woodDark],
  [12, 12, 12, 88, C.red], [15, 12, 2, 88, C.redDark], [20, 12, 1, 88, C.redDark],
  [104, 12, 9, 84, C.red], [107, 12, 1, 84, C.redDark],
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

/**
 * The desktop tower, under the screen it drives: the laptop sits at x 192–244, so the case stands at
 * x 208–222 rather than on the far side of the chair where it used to be. Its lead runs along the
 * floor to a power strip by the wall socket at x 110–115, which is also what ties the two halves of
 * the desk's underside together.
 */
const tower: Px[] = [
  // Case, with a lighter top edge and feet.
  [208, 118, 14, 28, '#24272f'],
  [208, 118, 14, 1, '#343949'],
  [208, 118, 1, 28, '#31353f'],
  [209, 144, 3, 2, '#15171d'], [218, 144, 3, 2, '#15171d'],
  // Glass side panel.
  [210, 121, 10, 21, '#12151b'],
  [210, 121, 10, 1, '#1d222c'],
  // Cooler at the top, graphics card across the middle, drives below.
  [212, 123, 6, 6, '#2b303c'], [213, 124, 4, 4, '#3b4252'], [214, 125, 2, 2, '#22262f'],
  [211, 132, 8, 3, '#353b49'], [211, 132, 8, 1, '#464e60'],
  [211, 137, 8, 2, '#2a2f3a'],
  // Front panel: power button and a drive slot.
  [220, 120, 1, 1, '#6fb3a6'],
  [220, 123, 1, 4, '#191c23'],
]

/**
 * The power strip on the floor under the socket, and the leads running to it. The socket at x 110–115
 * was already on that wall; this is what it now feeds.
 */
const cables: Px[] = [
  // Down the wall from the socket to the strip.
  [112, 122, 1, 21, '#15171d'],
  // The strip itself, with its own pilot light.
  [106, 143, 16, 3, '#2b2f38'], [106, 143, 16, 1, '#3c414d'],
  [108, 144, 1, 1, '#6fb3a6'],
  // The tower's lead, crossing the floor and dipping on the way.
  [122, 144, 40, 1, '#15171d'], [161, 144, 1, 2, '#15171d'], [162, 145, 46, 1, '#15171d'],
  [207, 141, 1, 5, '#15171d'],
]

/**
 * Under the desk, where two plain cardboard boxes used to sit: the case the miniatures on the shelf
 * were painted out of. It ties the painted figures to someone who actually paints, and it stands to
 * the right of the power strip so neither hides the other.
 */
const paintCase: Px[] = [
  // Carry handle.
  [133, 128, 8, 1, '#2e3a36'], [132, 129, 2, 2, '#2e3a36'], [140, 129, 2, 2, '#2e3a36'],
  // Case body, split by the lid seam, with two brass latches.
  [126, 131, 22, 15, '#3c4a45'],
  [126, 131, 22, 1, '#50625b'],
  [126, 137, 22, 1, '#26302d'], [126, 138, 22, 1, '#45554f'],
  [126, 131, 1, 15, '#50625b'], [146, 131, 2, 15, '#2e3a36'],
  [129, 136, 3, 3, GOLD_CASE], [142, 136, 3, 3, GOLD_CASE],
  [130, 137, 1, 1, '#8a6a22'], [143, 137, 1, 1, '#8a6a22'],
  // Two paint pots and a brush standing beside it.
  [121, 140, 4, 6, '#2b2f38'], [121, 140, 4, 1, '#c4413a'],
  [122, 143, 2, 2, '#c4413a'],
  [128, 126, 4, 5, '#2b2f38'], [128, 126, 4, 1, '#3f8ba0'],
  [129, 128, 2, 2, '#3f8ba0'],
  [143, 123, 1, 8, '#6b4a2c'], [143, 121, 1, 2, '#c9b48c'],
]

/**
 * The lit parts of the tower, shown in turn so the case drifts between two colours. Kept inside the
 * glass and kept dim: the lamp and the window are the bright things in this room, not the PC.
 */
const towerGlowA: Px[] = [
  [212, 130, 7, 1, '#357f92'], [218, 124, 1, 14, '#357f92'], [214, 129, 3, 1, '#23596a'],
]
const towerGlowB: Px[] = [
  [212, 130, 7, 1, '#7a4276'], [218, 124, 1, 14, '#7a4276'], [214, 129, 3, 1, '#552f54'],
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

/**
 * Office chair seen from behind. The base used to be one flat bar with three stubs under it, and the
 * middle stub sat directly under the column, so the whole thing read as a letter T. It is now a star
 * base: the column drops to a hub, the legs step down and outwards, and each one ends in a castor.
 * The pair angled towards the viewer ends lower and further in than the pair going straight out.
 */
const chair: Px[] = [
  [152, 90, 36, 2, C.slate], [150, 92, 40, 26, C.slate], [150, 92, 40, 2, C.slateLight],
  [150, 116, 40, 2, C.navy],
  // Gas column down to the hub.
  [168, 118, 4, 11, C.night], [167, 127, 6, 2, C.night],
  [164, 129, 12, 3, C.night],
  // The two legs that run straight out to the sides.
  [157, 131, 8, 2, C.night], [151, 133, 7, 2, C.night],
  [175, 131, 8, 2, C.night], [182, 133, 7, 2, C.night],
  [150, 135, 4, 2, '#0c0f16'], [186, 135, 4, 2, '#0c0f16'],
  // The two legs angled towards the viewer, so they finish lower and closer in.
  [161, 132, 6, 2, C.night], [158, 134, 6, 2, C.night],
  [173, 132, 6, 2, C.night], [176, 134, 6, 2, C.night],
  [157, 136, 4, 2, '#0c0f16'], [179, 136, 4, 2, '#0c0f16'],
]

const deskItems: Px[] = [
  // Water glass beside the laptop.
  [248, 93, 1, 11, C.mist], [255, 93, 1, 11, C.mist],
  [249, 98, 6, 5, C.water], [249, 103, 6, 1, C.mist], [250, 96, 1, 6, C.cream],
  // Fan on the left end of the desk, clear of the album and laptop.
  [95, 101, 18, 3, C.night], [103, 92, 2, 9, C.slate],
  [98, 74, 12, 1, C.slate], [96, 75, 16, 1, C.slate], [95, 76, 18, 15, C.slate],
  [96, 91, 16, 1, C.slate], [98, 92, 12, 1, C.slate], [97, 77, 14, 13, C.night],
]

// Pixel silhouette traced from the owner's Horde reference: outer crest,
// open central loop, floating diamond and two unequal tapered tails.
const hordePrint = [
  '00000000000000000000000',
  '00000000000110000000000',
  '00000000001111000000000',
  '00000110011111100000000',
  '00000111111111110000000',
  '00000111111111111110000',
  '00000111111111111110000',
  '00001111100000011110000',
  '00011111000100011111000',
  '00011111001110001111000',
  '00111110011111001111100',
  '00001110001111001110000',
  '00001110001110001110000',
  '01000110000100011100110',
  '00111110000000011111100',
  '00111111000000011111100',
  '00011111000000111111000',
  '00000001100000110001000',
  '00000000100001100000000',
  '00000000010001100000000',
  '00000000010001100000000',
  '00000000010001110000000',
  '00000001110001110000000',
  '00000000111001100000000',
  '00000000111001000000000',
  '00000000011001000000000',
  '00000000010000000000000',
  '00000000000000000000000',
  '00000000000000000000000',
] as const

// LOCKED SWORD REFERENCES: see docs/DESIGN_CONTRACT.md before editing.
/**
 * Wooden wall frame with a drop shadow and a backing for a reference.
 * `backing` should match the backdrop sampled around the reference in the source image, so any backdrop
 * left inside the silhouette clip blends into the frame instead of showing as patches.
 */
function WallFrame({ x, y, w, h, backing = '#101b27' }: { x: number; y: number; w: number; h: number; backing?: string }) {
  return <PixelRects px={[[x + 2, y + 2, w, h, '#18222e'], [x, y, w, h, '#80674c'], [x + 2, y + 2, w - 4, h - 4, backing]]} />
}

/**
 * Personal references grouped by theme (owner-approved, see docs/DESIGN_CONTRACT.md):
 * the tactics-RPG blades share the wall, the Warhammer minis share the lit figure bay, the Fire Emblem games fill the bottom bay.
 */
function ReferenceDisplays() {
  return (
    <g>
      {/* Personal faction print in the free wall bay; clear of the head and speech bubble. */}
      <g data-decoration="horde-frame">
        {/* Same top and bottom as the two sword frames, so the three read as one hung set. Moved left
            to x=125 so the taller frame clears Thọ's head, which starts at x=165. The emblem keeps its
            own 1:1 pixel grid and is centred in the mat rather than scaled up. */}
        <WallFrame x={125} y={12} w={33} h={57} backing="#1b1c24" />
        <g fill="#a33436" transform="translate(130 26)">
          {hordePrint.flatMap((row, y) => [...row].flatMap((ink, x) =>
            ink === '1' ? [<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} />] : []
          ))}
        </g>
      </g>
      {/* Tactics corner: Alhazard + Langrisser, Gran Centurio in its own tall frame, Armageddon on wall pegs below. */}
      {/* Positions are optically centred: measured artwork bounds sit mid-frame (see frame-measure QA). */}
      <WallFrame x={207} y={12} w={44} h={57} backing="#1b1e31" />
      {/* The blades hang crossed around one point. The tilt is baked into each sprite so its pixels stay
          square, so each one is hung by its centre instead of being rotated here. */}
      <g data-reference="swords">
        {(['alhazard', 'langrisser'] as const).map(kind => {
          const { units, pivot } = REFRESHED_SPRITES[kind]
          return (
            <ReferenceDisplay key={kind} kind={kind}
              x={SWORD_CROSS.x + pivot.dx - units.w / 2} y={SWORD_CROSS.y + pivot.dy - units.h / 2}
              width={units.w} height={units.h} />
          )
        })}
      </g>
      <WallFrame x={259} y={12} w={26} h={57} backing="#10161f" />
      <ReferenceDisplay kind="gran" x={260} y={16} width={24} height={49} />
      {/* Both pegs carry the blade, which runs x 250–279. The right one used to sit at the sword's
          three-quarter point, which is under the gold guard, so it was hidden and the rack looked
          lopsided. Peg tops meet the underside of the blade at y≈82. */}
      <PixelRects px={[[257, 81, 2, 5, '#806747'], [274, 81, 2, 5, '#806747'], [256, 85, 4, 1, '#5c4a33'], [273, 85, 4, 1, '#5c4a33']]} />
      <ReferenceDisplay kind="armageddon" x={250} y={75} width={44} height={9} />

      <PixelRects px={cabinet} />
      {/* Figure bay: the tallest bay, with a warm shelf light so the dark minis read against the backing.
          Both minis share one scale (0.45 scene units per source pixel) and their own painted bases stand on the bay floor (y 108).
          The right-hand base displays the owner's Master Ball collectible. */}
      <defs>
        <linearGradient id="figure-bay-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2d29a" stopOpacity={0.2} />
          <stop offset="1" stopColor="#f2d29a" stopOpacity={0} />
        </linearGradient>
      </defs>
      <ellipse cx={319.8} cy={107.4} rx={10.5} ry={1.3} fill="#05080c" opacity={0.55} />
      <ellipse cx={346.6} cy={107.4} rx={10} ry={1.3} fill="#05080c" opacity={0.55} />
      <Figure kind="seer" />
      <Figure kind="alpha" />
      <ellipse cx={371} cy={106.9} rx={9} ry={1.6} fill="#221c18" />
      <ellipse cx={371} cy={106} rx={9} ry={1.5} fill="#4a3d30" />
      <ellipse cx={371} cy={106} rx={5} ry={0.8} fill="#11151c" opacity={0.65} />
      <Figure kind="master-ball" />
      {/* The light is drawn over the minis, so the backing and any leftover photo backdrop brighten together. */}
      <rect x={307} y={71} width={76} height={37} fill="url(#figure-bay-light)" />
      <rect x={309} y={71} width={72} height={1} fill="#f2d29a" opacity={0.4} />
      {/* Top bay: the book behind each Limbus Company sinner on the left, named on hover or tap;
          the Sparkle and Sparxie plushes sitting together on the right. */}
      <LimbusBookShelf x={LIMBUS_SHELF.x} floor={LIMBUS_SHELF.floor} />
      <Fumo kind="sparkle" x={348} floor={66} />
      <Fumo kind="sparxie" x={366} floor={66} />
      {/* Bottom bay: every boxed Fire Emblem game, in release order (see GameShelf.tsx), with a brass name plate on the shelf edge. */}
      <FireEmblemShelf x={FIRE_EMBLEM_SHELF.x} floor={FIRE_EMBLEM_SHELF.floor} />
      <rect x={329} y={136.8} width={36} height={3.6} fill="#c9a45c" />
      <rect x={329} y={136.8} width={36} height={0.6} fill="#e8cf8f" />
      <text
        x={347}
        y={139.55}
        textAnchor="middle"
        fontFamily="ui-monospace, Consolas, monospace"
        fontSize={2.6}
        fontWeight={700}
        letterSpacing={0.25}
        fill="#2a2018"
      >
        FIRE EMBLEM
      </text>
    </g>
  )
}

/** Display cabinet, independent of the desk. The top shelf sits high so the figure bay is the tallest bay. */
const cabinet: Px[] = [
  [302, 16, 86, 126, '#312b2a'], [307, 21, 76, 115, '#131f29'],
  [302, 16, 86, 3, '#876a45'], [302, 19, 4, 122, '#654d36'],
  [384, 19, 4, 122, '#493b2e'],
  [307, 66, 76, 3, '#876a45'], [307, 69, 76, 2, '#392e28'],
  [307, 108, 76, 3, '#876a45'], [307, 111, 76, 2, '#392e28'],
  [343, 22, 3, 44, '#493b2e'],
  [306, 136, 79, 5, '#654d36'], [307, 141, 5, 8, '#392e28'], [378, 141, 5, 8, '#392e28'],
]

/** A closed notebook and pen on the right of the desk, which only holds work items. */
const notebookPx: Px[] =[[262, 101, 18, 3, C.slate], [262, 101, 18, 1, C.slateLight], [264, 99, 10, 1, C.ochre]]
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
  /** Suns the visitor has shaken out of the sunflower and not collected yet. */
  suns: readonly DroppedSun[]
  /** Counts suns taken in. Changing it replays the flash, which is why it is a number. */
  charge: number
}

/** One sun lying on the floor. `collecting` plays it up and out before Scene drops it. */
export interface DroppedSun {
  id: number
  x: number
  y: number
  /** idle: lying on the floor · taken: flying into Thọ · fading: left too long and going out. */
  state: 'idle' | 'taken' | 'fading'
}

export function ApartmentScene({ viewBox, screen, speaking, sparkle, suns, charge }: ApartmentSceneProps) {
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
      <PixelRects px={windowPx} />
      <PixelRects px={windowFront} />

      {/* Potted sunflower in the daylight, and any sun it has dropped. */}
      <Sunflower />
      {suns.map((sun) => (
        <Sun key={sun.id} x={sun.x} y={sun.y} state={sun.state} />
      ))}

      <ReferenceDisplays />

      <PixelRects px={desk} />
      <PixelRects px={cables} />
      <PixelRects px={paintCase} />
      <PixelRects px={tower} />
      <PixelRects px={towerGlowA} className="f-rgb-a" />
      <PixelRects px={towerGlowB} className="f-rgb-b" />
      <PixelRects px={laptopFrame} />
      <Screen mode={screen} />

      <PixelRects px={developerBody} className="f-breathe" />
      {charge > 0 && (
        <g key={charge} className="f-charge" aria-hidden="true">
          <PixelRects px={developerBody} />
          <PixelRects px={developerArm} />
        </g>
      )}
      <PixelRects px={developerArm} />
      <PixelRects px={handA} className={speaking ? undefined : 'f-type-a'} />
      {!speaking && <PixelRects px={handB} className="f-type-b" />}

      <PixelRects px={chair} />
      <PixelRects px={deskItems} />
      <PixelRects px={notebookPx} />
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
