import { REFERENCES, type ReferenceKind } from './referenceData'
import { REFRESHED_SPRITES, type RefreshedKind } from './refreshedSprites'

/**
 * Owner-approved pixel adaptations, with legacy screenshot crops retained as fallback.
 *
 * The refreshed sprites are stored at the size they are drawn at, so one sprite pixel covers
 * the same area as one room pixel and they no longer read as HD pictures pasted into the room.
 * Regenerate them with scripts/coarsen-references.mjs; the size table is generated with them.
 */
export function ReferenceDisplay({ kind, x, y, width, height }: {
  kind: ReferenceKind | RefreshedKind
  x: number; y: number; width: number; height: number
}) {
  const { w, h, file } = kind in REFRESHED_SPRITES
    ? REFRESHED_SPRITES[kind as RefreshedKind]
    : REFERENCES[kind as ReferenceKind]
  return (
    <svg x={x} y={y} width={width} height={height} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" overflow="hidden" data-reference={kind}>
      <image href={`${import.meta.env.BASE_URL}art/derived/${file}`} width={w} height={h} style={{ imageRendering: 'pixelated' }} />
    </svg>
  )
}
