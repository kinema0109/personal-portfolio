import { site } from '../content/site'
import { C, type Px } from './palette'
import { PixelRects } from './PixelRects'

/** 16×16 placeholder portraits. The human one is NOT Thọ's likeness. */
const HUMAN: Px[] = [
  [0, 0, 16, 16, C.slate],
  [4, 2, 8, 2, C.hair], [3, 3, 10, 3, C.hair],
  [4, 5, 8, 6, C.skin], [3, 5, 1, 4, C.hair], [12, 5, 1, 4, C.hair],
  [6, 7, 1, 1, C.hair], [9, 7, 1, 1, C.hair],
  [7, 9, 2, 1, C.skinShade],
  [7, 11, 2, 1, C.skinShade],
  [3, 12, 10, 4, C.red], [6, 12, 4, 1, C.redDark],
]

const RAT: Px[] = [
  [0, 0, 16, 16, C.wall],
  [2, 2, 4, 4, C.fur], [3, 3, 2, 2, C.pink], [10, 2, 4, 4, C.fur], [11, 3, 2, 2, C.pink],
  [3, 5, 10, 7, C.fur],
  [3, 5, 10, 1, C.night], [4, 4, 3, 2, C.ochre], [9, 4, 3, 2, C.ochre],
  [5, 8, 1, 1, C.night], [10, 8, 1, 1, C.night],
  [6, 10, 4, 2, C.furDark], [7, 10, 2, 1, C.pink],
  [3, 12, 10, 4, C.red], [5, 12, 1, 2, C.ochre], [10, 12, 1, 2, C.ochre],
]

const PORTRAITS: Record<string, { px: Px[]; label: string }> = {
  'THỌ': { px: HUMAN, label: 'Chân dung tạm của Thọ' },
  'THỢ MÁY': { px: RAT, label: 'Thợ máy chuột hư cấu' },
}

export function hasPortrait(speaker: string): boolean {
  return speaker in PORTRAITS
}

export function Portrait({ speaker }: { speaker: string }) {
  const portrait = PORTRAITS[speaker]
  if (!portrait) return null
  return (
    <div className="portrait" title={portrait.label}>
      <svg viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
        <PixelRects px={portrait.px} />
      </svg>
      {site.review.showArtworkNotice && <span className="portrait-tag">Tạm</span>}
    </div>
  )
}
