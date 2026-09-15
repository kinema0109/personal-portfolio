import type { CSSProperties } from 'react'
import { site } from '../content/site'
import { C, type Px } from './palette'
import { PixelRects } from './PixelRects'

/** 16×16 placeholder portraits. */
const HUMAN: Px[] = [
  [0, 0, 16, 16, C.slate],
  [4, 2, 8, 2, C.hair], [3, 3, 10, 3, C.hair],
  [4, 5, 8, 6, C.skin], [3, 5, 1, 4, C.hair], [12, 5, 1, 4, C.hair],
  [6, 7, 1, 1, C.hair], [9, 7, 1, 1, C.hair],
  [7, 9, 2, 1, C.skinShade],
  [7, 11, 2, 1, C.skinShade],
  [3, 12, 10, 4, C.red], [6, 12, 4, 1, C.redDark],
]

/** `mouth` is the open-mouth frame drawn over the portrait while a line appears. */
const PORTRAITS: Record<string, { px: Px[]; mouth: Px[]; label: string }> = {
  'THỌ': { px: HUMAN, mouth: [[7, 9, 2, 2, C.hair]], label: 'Developer portrait (placeholder)' },
}

export function hasPortrait(speaker: string): boolean {
  return speaker in PORTRAITS
}

interface PortraitProps {
  speaker: string
  /** Changes on every new line, which restarts the mouth animation. */
  talkKey: string
  /** How many times the mouth opens. */
  talkFlaps: number
}

export function Portrait({ speaker, talkKey, talkFlaps }: PortraitProps) {
  const portrait = PORTRAITS[speaker]
  if (!portrait) return null
  return (
    <div className="portrait" title={portrait.label}>
      <svg viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
        <PixelRects px={portrait.px} />
        <g key={talkKey} className="f-talk" style={{ '--talk': talkFlaps } as CSSProperties}>
          <PixelRects px={portrait.mouth} />
        </g>
      </svg>
      {site.review.showArtworkNotice && <span className="portrait-tag">Temp</span>}
    </div>
  )
}
