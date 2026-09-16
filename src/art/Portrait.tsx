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
 * REJECTED DRAFT — the pixels below are being redrawn; see docs/handoffs/2026-09-16-portrait.md.
 * The grid, the frame size, the talking frame and the wiring are settled. The drawing is not: it
 * reads as blocky slabs rather than a face. Do not take it as the reference for anything.
 */

const HAIR = '#221d21'
const HAIR_LIT = '#332b30'
const SKIN = '#d3a077'
const SKIN_SHADE = '#b57f59'
const SKIN_LIT = '#e2b48c'
const BROW = '#2c2328'
const GLASS = '#2b2b35'
const GLASS_LIT = '#4b4b5a'
const EYE = '#241c1c'
const LIP = '#b07a6a'
const SHIRT = C.red
const SHIRT_DARK = C.redDark

const THO: Px[] = [
  [0, 0, 24, 24, C.slate],

  // Shirt and collar, behind everything.
  [3, 20, 18, 4, SHIRT],
  [3, 20, 18, 1, '#b05a50'],
  [9, 20, 2, 4, SHIRT_DARK], [13, 20, 2, 4, SHIRT_DARK],

  // Neck.
  [10, 18, 4, 3, SKIN_SHADE],

  // Skull: hair stops at row 7 and never crosses the forehead.
  [9, 2, 6, 1, HAIR], [8, 3, 8, 1, HAIR], [7, 4, 10, 4, HAIR],
  [9, 3, 4, 1, HAIR_LIT],

  // Face.
  [8, 8, 8, 2, SKIN],
  [7, 10, 10, 6, SKIN],
  [8, 16, 8, 2, SKIN],
  [10, 18, 4, 1, SKIN],
  [8, 8, 3, 1, SKIN_LIT], [7, 10, 1, 4, SKIN_LIT],

  // A single column of hair at each temple, and the ears below it.
  [7, 8, 1, 2, HAIR], [16, 8, 1, 2, HAIR],
  [6, 11, 1, 3, SKIN], [17, 11, 1, 3, SKIN],
  [6, 13, 1, 1, SKIN_SHADE], [17, 13, 1, 1, SKIN_SHADE],

  // Brows, with a clear row of skin between them and the frames.
  [8, 9, 3, 1, BROW], [13, 9, 3, 1, BROW],

  /*
   * Glasses. The two lenses are set apart with skin showing between them: drawn edge to edge the
   * top rims join into one bar across the face, which is what the first two attempts looked like.
   * The bridge is a single row, so the skin above and below it still reads.
   */
  [6, 11, 5, 1, GLASS], [6, 13, 5, 1, GLASS],
  [6, 12, 1, 1, GLASS], [10, 12, 1, 1, GLASS],
  [13, 11, 5, 1, GLASS], [13, 13, 5, 1, GLASS],
  [13, 12, 1, 1, GLASS], [17, 12, 1, 1, GLASS],
  [11, 12, 2, 1, GLASS],
  [7, 11, 3, 1, GLASS_LIT], [14, 11, 2, 1, GLASS_LIT],

  // Eyes, with skin still visible inside each lens.
  [7, 12, 2, 1, EYE], [15, 12, 2, 1, EYE],

  // Nose.
  [11, 14, 2, 1, SKIN_SHADE], [12, 15, 1, 1, '#9c6a48'],

  // Mouth, closed.
  [10, 17, 4, 1, LIP],
]

/** The open-mouth frame, drawn over the portrait while a line appears. */
const THO_MOUTH: Px[] = [
  [10, 17, 4, 1, '#7a4a44'],
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
