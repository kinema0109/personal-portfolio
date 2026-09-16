import type { SceneFocus } from './camera'
import { C, type Px } from './palette'
import { PixelRects } from './PixelRects'
import { FireEmblemShelf } from './GameShelf'
import { LimbusBookShelf } from './BookShelf'
import { MasterBall } from './Figures'
import { Fumo } from './Fumo'
import { ReferenceDisplay } from './ReferenceDisplay'
import { Sun, Sunflower, type SunSize } from './Sunflower'
import { SunShroom, type ShroomState } from './SunShroom'
import { HALO, PICK_RIM, outlineOf, type Highlight } from './outline'
import { REFRESHED_SPRITES } from './refreshedSprites'
import type { Phase } from '../daylight/phase'

/**
 * Room layout with separate work and display zones, drawn in code. Scene pixels: the room core spans 0–320 × 0–180,
 * and wall/floor extend in every direction so the scene can fill any screen.
 * The figure at the desk is Thọ, seen from behind, drawn to match the portrait in the dialogue box.
 */

export type ScreenMode = 'code' | 'diagram' | 'game' | 'docs'

export const APARTMENT_FOCUS: SceneFocus = {
  primary: { x: 86, y: 8, w: 308, h: 146 },
  secondary: { x: 8, y: 4, w: 390, h: 152 },
}

/** Where the Fire Emblem row stands in the cabinet's bottom bay; Scene.tsx uses it to place the name labels. */
export const FIRE_EMBLEM_SHELF = { x: 308, floor: 136 } as const

/** Where the sinners' books stand in the cabinet's top bay; Scene.tsx uses it for the name labels. */
export const LIMBUS_SHELF = { x: 308, floor: 66 } as const

/** The point the two framed blades cross at. */
const SWORD_CROSS = { x: 229, y: 40 } as const

/** Album bounds on the desk, used to place the gallery hotspot button. */
// LOCKED: See docs/DESIGN_CONTRACT.md before changing this album hotspot.
export const ALBUM_BOX = { x: 118, y: 84, w: 34, h: 21 } as const

/** Other objects the visitor can discover by clicking; Scene.tsx places a button over each. */
export const LAPTOP_BOX = { x: 192, y: 72, w: 52, h: 32 } as const
export const DRAWER_BOX = { x: 246, y: 112, w: 28, h: 31 } as const

/** Thọ at the desk. Clicking him advances the story, so the reader never has to aim at the textbox. */
export const SPEAKER_BOX = { x: 150, y: 52, w: 44, h: 60 } as const

/** The desk fan. Clicking it steps through its speeds and then switches it off. */
export const FAN_BOX = { x: 94, y: 73, w: 20, h: 32 } as const

/** Fan settings in the order the switch goes round. */
export const FAN_SPEEDS = ['low', 'mid', 'high', 'off'] as const
export type FanSpeed = (typeof FAN_SPEEDS)[number]

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
  // rug
  [132, 131, 168, 9, C.redDark], [132, 132, 168, 1, C.red], [132, 138, 168, 1, C.red],
  // wall socket
  [110, 116, 5, 6, C.creamDim], [111, 118, 1, 2, C.night], [113, 118, 1, 2, C.night],
]

/** Daylight through the window, thrown across the floor. */
const windowLight: Px[] = [
  [48, 132, 50, 3, '#4d5a80'], [44, 135, 50, 3, '#4d5a80'], [40, 138, 50, 3, '#4d5a80'],
  [52, 133, 42, 1, '#5d6b94'], [48, 136, 42, 1, '#5d6b94'],
]

const windowFrame: Px[] = [[22, 18, 82, 78, C.slate]]

/** The view by day: blue sky, clouds, the sun and a front-lit skyline. */
const dayView: Px[] = [
  // Daylight sky, deeper overhead than at the rooftops.
  [26, 22, 74, 70, '#9cc3e2'],
  [26, 22, 74, 16, '#84b0d6'],
  [26, 60, 74, 32, '#b6d6ea'],
  // The sun, high in the corner.
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
  // Windows read dark in daylight.
  [44, 72, 2, 3, '#5d7091'], [67, 62, 2, 3, '#5d7091'], [67, 80, 2, 3, '#5d7091'],
  [93, 78, 2, 3, '#5d7091'], [30, 76, 2, 3, '#5d7091'], [52, 80, 2, 3, '#5d7091'],
  [88, 70, 2, 3, '#5d7091'], [41, 68, 2, 3, '#5d7091'], [77, 74, 2, 3, '#5d7091'],
]

/**
 * The view by night, from before the window opened onto daylight (commit 254f596): moon, city
 * silhouette and lit windows, with stars and some of the lights blinking. The window is the only
 * thing in the room that changes with the phase (owner decision 2026-09-16).
 */
const nightView: Px[] = [
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

/** The glazing bars catch the daylight; at night they sink back into the frame. */
const dayMullions: Px[] = [[62, 22, 2, 70, C.slateLight], [26, 55, 74, 2, C.slateLight]]
const nightMullions: Px[] = [[62, 22, 2, 70, C.slate], [26, 55, 74, 2, C.slate]]

const windowFront: Px[] = [
  [18, 94, 90, 4, C.slateLight], [18, 98, 90, 1, C.night],
  [8, 10, 106, 2, C.woodDark],
  [12, 12, 12, 88, C.red], [15, 12, 2, 88, C.redDark], [20, 12, 1, 88, C.redDark],
  [104, 12, 9, 84, C.red], [107, 12, 1, 84, C.redDark],
]

const desk: Px[] = [
  [90, 104, 196, 4, '#95734d'], [90, 108, 196, 3, '#4d3c30'],
  [94, 111, 5, 35, '#493b2e'], [278, 111, 5, 35, '#493b2e'],
]

/** The drawer unit, kept apart from the desk so pointing at it can outline exactly this. */
const drawerPx: Px[] = [
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
  // Case, with a lighter top edge and feet. It fills the desk's 35 units of clearance.
  [206, 113, 18, 33, '#24272f'],
  [206, 113, 18, 1, '#343949'],
  [206, 113, 1, 33, '#31353f'],
  [207, 144, 4, 2, '#15171d'], [219, 144, 4, 2, '#15171d'],
  // Glass side panel.
  [208, 116, 14, 26, '#12151b'],
  [208, 116, 14, 1, '#1d222c'],
  // Cooler at the top, graphics card across the middle, drives below.
  [210, 118, 8, 8, '#2b303c'], [211, 119, 6, 6, '#3b4252'], [213, 121, 2, 2, '#22262f'],
  [209, 129, 12, 4, '#353b49'], [209, 129, 12, 1, '#464e60'],
  [209, 136, 12, 3, '#2a2f3a'],
  // Front panel: power button and a drive slot.
  [222, 115, 1, 1, '#6fb3a6'],
  [222, 118, 1, 5, '#191c23'],
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
  [122, 144, 40, 1, '#15171d'], [161, 144, 1, 2, '#15171d'], [162, 145, 44, 1, '#15171d'],
  [205, 141, 1, 5, '#15171d'],
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
  [210, 127, 10, 1, '#357f92'], [220, 119, 1, 20, '#357f92'], [212, 126, 4, 1, '#23596a'],
]
const towerGlowB: Px[] = [
  [210, 127, 10, 1, '#7a4276'], [220, 119, 1, 20, '#7a4276'], [212, 126, 4, 1, '#552f54'],
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

/**
 * Thọ at the desk, seen from behind at three-quarters — the same man as the portrait in the
 * dialogue box, so the two have to agree: the same swept hair catching the lamp on the left of the
 * crown, the same glasses, the same red sweater.
 *
 * The head used to be a 20×18 rectangle of hair with a slab of cheek beside it, which read as a
 * helmet. The stepped crown and short nape remain, with a broad lamp-facing plane breaking up
 * the rear skull. The visible cheek, ear and side-on lens form a profile rather than a skin stripe.
 * Keep these masses readable at native room scale; do not add fine hair strands or extra texture.
 *
 * The draft before this one had the silhouette right and one flat dark value inside it, so the head
 * read as a blob at 1:1 and only came apart when you zoomed in. Judge any change to it on an
 * unresampled 1440×900 crop first; docs/handoffs/2026-09-16-seated-figure.md has the recipe.
 */
const HAIR_LIT = '#59505a'
const GLASS = '#675653'

const developerBody: Px[] = [
  // Sloping shoulders, a fitted back and the shaded left sleeve behind the chair.
  [165, 74, 19, 2, C.red], [161, 76, 26, 2, C.red],
  [158, 78, 32, 3, C.red], [157, 81, 34, 9, C.red],
  [159, 90, 31, 20, C.red],
  [157, 81, 3, 5, C.redDark], [155, 86, 4, 16, C.redDark],
  // A short curved collar hugs the nape instead of spanning the shoulders.
  [168, 75, 2, 3, C.redDark], [170, 77, 10, 2, C.redDark],
  [180, 75, 2, 3, C.redDark],
  [185, 84, 2, 7, C.redDark], [187, 91, 3, 10, C.redDark],
  // Neck first; the hair falls over it.
  [170, 70, 10, 7, C.skinShade], [172, 70, 6, 4, C.skin],
  // Hair: a crown that steps in, and a nape that stops above the collar.
  [169, 52, 12, 1, C.hair], [167, 53, 16, 1, C.hair], [166, 54, 18, 1, C.hair],
  [165, 55, 20, 14, C.hair], [166, 69, 18, 2, C.hair], [167, 71, 15, 1, C.hair],
  [168, 72, 13, 2, C.hair],
  // Broad lamp-facing plane: the sweep must read at room scale, not just enlarged.
  [168, 54, 12, 3, HAIR_LIT], [166, 57, 11, 3, HAIR_LIT],
  [166, 60, 6, 6, '#403a43'], [172, 60, 6, 3, '#403a43'],
  [167, 66, 5, 3, '#403a43'],
  // Visible temple and cheek form a stepped profile in front of the rear skull.
  [180, 59, 6, 5, C.skin], [179, 64, 7, 4, C.skin],
  [181, 68, 4, 3, C.skinShade], [181, 68, 3, 2, C.skin],
  [186, 64, 1, 2, C.skin],
  // Sideburn and ear anchor the glasses arm; the lens keeps skin inside it.
  [179, 59, 1, 5, C.hair], [178, 64, 2, 3, C.skinShade],
  [179, 64, 1, 2, C.skin],
  [179, 62, 4, 1, GLASS], [183, 61, 4, 1, GLASS],
  [183, 62, 1, 2, GLASS], [186, 62, 1, 2, GLASS], [184, 64, 2, 1, GLASS],
]
const developerArm: Px[] = [
  [188, 81, 4, 4, C.red], [189, 85, 5, 9, C.red],
  [190, 94, 14, 5, C.red],
  [188, 88, 2, 7, C.redDark], [190, 97, 12, 2, C.redDark],
  [202, 94, 2, 5, C.redDark],
]
const handA: Px[] = [[203, 97, 6, 4, C.skin]]
const handB: Px[] = [[204, 96, 6, 4, C.skin]]

/**
 * Office chair seen from behind: back, armrests, gas column and a five-star base.
 *
 * Only three legs are drawn. On a star base the two that point towards the viewer are almost fully
 * foreshortened and end up behind the sitter's feet, so drawing all five turns the base into a solid
 * bar — which is what the first version looked like. Two legs stepping out to castors plus a stub in
 * front reads as a star base; a bar does not. The castors land on y=146 with everything else.
 */
const chair: Px[] = [
  [152, 90, 36, 2, C.slate], [150, 92, 40, 26, C.slate], [150, 92, 40, 2, C.slateLight],
  [150, 116, 40, 2, C.navy],
  // No armrests: a real one sits level with the desk surface at this scale, so it lands on the desk's
  // own edge and reads as a shelf rather than part of the chair. The star base carries the read.
  [152, 112, 36, 2, C.navy], [152, 112, 36, 1, '#39405e'],
  // Gas column down to the hub.
  [168, 118, 4, 14, '#2b3040'], [168, 118, 1, 14, '#3a4157'],
  [165, 132, 10, 4, '#333a4d'], [165, 132, 10, 1, '#454c63'],
  // Two legs stepping out to castors, and the stub of a third pointing at the viewer.
  [160, 135, 6, 2, '#333a4d'], [154, 137, 6, 2, '#333a4d'], [148, 139, 6, 2, '#333a4d'],
  [175, 135, 6, 2, '#333a4d'], [181, 137, 6, 2, '#333a4d'], [187, 139, 6, 2, '#333a4d'],
  [160, 136, 6, 1, '#1e2230'], [154, 138, 6, 1, '#1e2230'], [148, 140, 6, 1, '#1e2230'],
  [175, 136, 6, 1, '#1e2230'], [181, 138, 6, 1, '#1e2230'], [187, 140, 6, 1, '#1e2230'],
  [167, 136, 6, 3, '#2b3040'],
  [145, 141, 5, 5, '#1e2230'], [190, 141, 5, 5, '#1e2230'],
  [145, 141, 5, 1, '#454c63'], [190, 141, 5, 1, '#454c63'],
]

const deskItems: Px[] = [
  // Water glass beside the laptop.
  [248, 93, 1, 11, C.mist], [255, 93, 1, 11, C.mist],
  [249, 98, 6, 5, C.water], [249, 103, 6, 1, C.mist], [250, 96, 1, 6, C.cream],
]

/** The fan on the left end of the desk, clear of the album and laptop. */
const fanPx: Px[] = [
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
function ReferenceDisplays({ highlight }: { highlight: Highlight }) {
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
      <g filter={highlight === 'seer' ? `url(#${PICK_RIM})` : undefined}>
        <ReferenceDisplay kind="seer" x={309.3} y={74} width={21} height={34} />
      </g>
      <g filter={highlight === 'alpha' ? `url(#${PICK_RIM})` : undefined}>
        <ReferenceDisplay kind="alpha" x={334.6} y={77} width={24} height={31} />
      </g>
      <ellipse cx={371} cy={106.9} rx={9} ry={1.6} fill="#221c18" />
      <ellipse cx={371} cy={106} rx={9} ry={1.5} fill="#4a3d30" />
      <ellipse cx={371} cy={106} rx={5} ry={0.8} fill="#11151c" opacity={0.65} />
      <g filter={highlight === 'master-ball' ? `url(#${PICK_RIM})` : undefined}>
        <MasterBall />
      </g>
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
      <rect x={327} y={136.8} width={36} height={3.6} fill="#c9a45c" />
      <rect x={327} y={136.8} width={36} height={0.6} fill="#e8cf8f" />
      <text
        x={345}
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

/** Rims for the objects the visitor can point at, built once from the objects themselves. */
const OUTLINES = {
  laptop: outlineOf(laptopFrame),
  drawer: outlineOf(drawerPx),
  fan: outlineOf(fanPx),
  speaker: outlineOf([...developerBody, ...developerArm]),
} as const

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
  /** Day or night where the visitor is; only the view through the window changes. */
  phase: Phase
  screen: ScreenMode
  speaking: boolean
  /** Glint on the album. */
  sparkle: boolean
  /** Suns the visitor has shaken out of the sunflower and not collected yet. */
  suns: readonly DroppedSun[]
  /** The Sun-shroom's size and the click counters that replay its animations. */
  shroom: ShroomState
  /** Counts suns taken in. Changing it replays the flash, which is why it is a number. */
  charge: number
  /** How fast the desk fan is turning, or whether it is off. */
  fanSpeed: FanSpeed
  /** What the visitor is pointing at, so that object can outline itself rather than show a box. */
  highlight: Highlight
}

/** One sun lying on the floor. `collecting` plays it up and out before Scene drops it. */
export interface DroppedSun {
  id: number
  x: number
  y: number
  /** idle: lying on the floor · taken: flying into Thọ · fading: left too long and going out. */
  state: 'idle' | 'taken' | 'fading'
  /** Which plant dropped it. Only the Sun-shroom's small suns count towards its growth. */
  plant: 'sunflower' | 'shroom'
  size: SunSize
  /** Where the sun sits as it leaves the plant, so the toss starts from the right head. */
  origin: { x: number; y: number }
}

export function ApartmentScene({ viewBox, phase, screen, speaking, sparkle, suns, shroom, charge, fanSpeed, highlight }: ApartmentSceneProps) {
  const night = phase === 'night'
  const sunLayer = suns.map((sun) => (
    <Sun key={sun.id} x={sun.x} y={sun.y} size={sun.size} from={sun.origin} state={sun.state} />
  ))
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
        {/* Rims a sprite by growing its own alpha, for the collectibles that are images rather
            than rectangles. Radius is in scene units, so it matches the one-unit rims elsewhere. */}
        <filter id={PICK_RIM}>
          <feMorphology in="SourceAlpha" operator="dilate" radius="1" result="fat" />
          <feFlood floodColor={HALO} result="colour" />
          <feComposite in="colour" in2="fat" operator="in" result="rim" />
          <feMerge>
            <feMergeNode in="rim" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
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
      <PixelRects px={windowLight} />
      <ellipse cx={207} cy={143} rx={115} ry={6} fill="#0e1826" opacity={0.6} />
      <path d="M154 -8H215L283 104H107Z" fill="#e7b568" opacity={0.055} />
      <path d="M184 -36V-5" stroke="#17212d" strokeWidth={2} />
      <path d="M180 -5H188L196 2H172Z" fill="#142330" />
      <rect x={176} y={2} width={16} height={1} fill="#f2d29a" />
      <PixelRects px={windowFrame} />
      <g data-window={phase}>
        {night ? (
          <>
            <PixelRects px={nightView} />
            <PixelRects px={starsA} className="f-twinkle-1" />
            <PixelRects px={starsB} className="f-twinkle-2" />
            <PixelRects px={cityLightsA} />
            <PixelRects px={cityLightsB} className="f-city" />
          </>
        ) : (
          <PixelRects px={dayView} />
        )}
        <PixelRects px={night ? nightMullions : dayMullions} />
      </g>
      <PixelRects px={windowFront} />

      {/* Potted sunflower and Sun-shroom by the window. Their suns are drawn last, above the night
          dimming, so they still shine; drawing them in one place also keeps a phase switch from
          remounting them and replaying their toss. */}
      <Sunflower highlight={highlight === 'flower'} />
      <SunShroom shroom={shroom} asleep={!night} highlight={highlight === 'shroom'} />

      <ReferenceDisplays highlight={highlight} />

      {highlight === 'drawer' && <PixelRects px={OUTLINES.drawer} />}
      <PixelRects px={desk} />
      <PixelRects px={drawerPx} />
      <PixelRects px={cables} />
      <PixelRects px={paintCase} />
      <PixelRects px={tower} />
      <PixelRects px={towerGlowA} className="f-rgb-a" />
      <PixelRects px={towerGlowB} className="f-rgb-b" />
      {highlight === 'laptop' && <PixelRects px={OUTLINES.laptop} />}
      <PixelRects px={laptopFrame} />
      <Screen mode={screen} />

      {highlight === 'speaker' && <PixelRects px={OUTLINES.speaker} className="f-breathe" />}
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
      {highlight === 'fan' && <PixelRects px={OUTLINES.fan} />}
      <PixelRects px={fanPx} />
      <PixelRects px={notebookPx} />
      {highlight === 'album' && <PixelRects px={outlineOf(albumPx)} />}
      <PixelRects px={albumPx} />
      {sparkle && <PixelRects px={glintPx} className="f-glint" />}
      <g transform="translate(-174 2)" className={`fan fan-${fanSpeed}`} data-fan={fanSpeed}>
        <PixelRects px={fanBladesA} className="f-fan-a" />
        <PixelRects px={fanBladesB} className="f-fan-b" />
        <rect x={276} y={80} width={3} height={3} fill={C.cream} />
      </g>

      {sunLayer}

      {speaking && <SpeechBubble x={186} y={40} />}
    </svg>
  )
}
