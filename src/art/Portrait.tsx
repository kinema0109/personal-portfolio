import type { CSSProperties } from 'react'
import { site } from '../content/site'
import type { SpeakerId } from '../content/types'
import { useLocale } from '../i18n/LocaleProvider'
import { C, type Px } from './palette'
import { PixelRects } from './PixelRects'

/**
 * Thọ's portrait, 24×24, drawn from his own photograph.
 *
 * 24 is not arbitrary: the frame is 72 screen pixels, so one portrait pixel covers three, the same
 * as one pixel of the room. The old portrait was 16×16, which could not hold a face with glasses —
 * the eyes and the frames landed on the same row.
 *
 * Photo-led revision: swept hair and exposed forehead, broad face, added light frames.
 * Grid, frame size and talking wiring are unchanged. Visual likeness awaits owner review.
 */

const HAIR = '#202027'
const HAIR_LIT = '#34333a'
const SKIN = '#dfac8e'
const SKIN_SHADE = '#c39077'
const SKIN_LIT = '#e9ba9b'
const GLASS = '#675653'
const EYE = '#352c2c'
const LIP = '#ab7771'

const THO: Px[] = [
  [0, 0, 24, 24, C.slate],
  // Sloped shoulders and a shallow sweater neckline, not a column neck.
  [6, 20, 12, 4, C.red], [3, 21, 18, 3, C.red],
  [1, 23, 22, 1, C.red], [9, 18, 6, 3, SKIN_SHADE],
  [10, 19, 4, 2, SKIN], [8, 21, 2, 1, C.redDark],
  [10, 22, 4, 1, C.redDark], [14, 21, 2, 1, C.redDark],

  // Short swept hair, wider at the crown, exposing the forehead.
  [8, 2, 8, 1, HAIR], [6, 3, 11, 1, HAIR],
  [5, 4, 13, 3, HAIR], [4, 6, 15, 3, HAIR],
  [7, 3, 6, 1, HAIR_LIT], [6, 4, 4, 1, HAIR_LIT],
  // Broad face narrowing gradually to the chin.
  [8, 6, 8, 1, SKIN], [6, 7, 11, 2, SKIN],
  [6, 9, 12, 7, SKIN], [7, 16, 10, 2, SKIN],
  [8, 18, 8, 1, SKIN_SHADE], [9, 18, 6, 1, SKIN],
  [7, 7, 3, 2, SKIN_LIT], [6, 9, 1, 6, SKIN_LIT],
  [17, 9, 1, 6, SKIN_SHADE], [16, 15, 1, 2, SKIN_SHADE],
  [7, 16, 1, 1, SKIN_SHADE],
  // Ears and slim temples. No hair crossing the forehead.
  [4, 10, 2, 3, SKIN_SHADE], [18, 10, 1, 3, SKIN_SHADE],
  [5, 7, 1, 3, HAIR], [17, 7, 1, 2, HAIR],

  // Brows remain distinct from the subdued thin frames.
  [7, 9, 3, 1, '#70534a'], [14, 9, 3, 1, '#70534a'],
  // Two 5x4 lenses: 3x2 skin interiors and a two-pixel bridge on one row.
  [6, 10, 5, 1, GLASS], [6, 11, 1, 2, GLASS],
  [10, 11, 1, 2, GLASS], [7, 13, 3, 1, GLASS],
  [13, 10, 5, 1, GLASS], [13, 11, 1, 2, GLASS],
  [17, 11, 1, 2, GLASS], [14, 13, 3, 1, GLASS],
  [11, 11, 2, 1, GLASS],
  [8, 11, 1, 1, EYE], [15, 11, 1, 1, EYE],
  // Small nose and restrained closed lips embedded in the lower face.
  [12, 13, 1, 2, SKIN_LIT], [11, 15, 2, 1, SKIN_SHADE],
  [10, 17, 4, 1, LIP], [11, 18, 2, 1, '#d29a89'],
]

/** Same mouth position; lower lip stays on the face, above the neck. */
const THO_MOUTH: Px[] = [
  [10, 17, 4, 1, '#79524c'],
  [11, 18, 2, 1, LIP],
]

/** `mouth` is the open-mouth frame drawn over the portrait while a line appears. */
const PORTRAITS: Partial<Record<SpeakerId, { px: Px[]; mouth: Px[] }>> = {
  tho: { px: THO, mouth: THO_MOUTH },
}

export function hasPortrait(speaker: SpeakerId): boolean {
  return speaker in PORTRAITS
}

interface PortraitProps {
  speaker: SpeakerId
  /** Changes on every new line, which restarts the mouth animation. */
  talkKey: string
  /** How many times the mouth opens. */
  talkFlaps: number
}

export function Portrait({ speaker, talkKey, talkFlaps }: PortraitProps) {
  const ui = useLocale().content.text.ui
  const portrait = PORTRAITS[speaker]
  if (!portrait) return null
  return (
    <div className="portrait" title={ui.portrait}>
      <svg viewBox="0 0 24 24" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
        <PixelRects px={portrait.px} />
        <g key={talkKey} className="f-talk" style={{ '--talk': talkFlaps } as CSSProperties}>
          <PixelRects px={portrait.mouth} />
        </g>
      </svg>
      {site.review.showArtworkNotice && <span className="portrait-tag">{ui.portraitTemp}</span>}
    </div>
  )
}
