import { REFERENCES, type ReferenceKind } from './referenceData'

/**
 * One personal reference, pre-cropped to its silhouette (public/art/derived/, exported by
 * scripts/export-derived-references.mjs from the owner's screenshot). Placed in scene units; the image keeps its
 * native source pixels and is scaled by the viewBox, so the room never shows a rectangular photo background.
 */
export function ReferenceDisplay({ kind, x, y, width, height }: {
  kind: ReferenceKind
  x: number; y: number; width: number; height: number
}) {
  const { w, h, file } = REFERENCES[kind]
  return (
    <svg x={x} y={y} width={width} height={height} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" overflow="hidden" data-reference={kind}>
      <image href={`${import.meta.env.BASE_URL}art/derived/${file}`} width={w} height={h} />
    </svg>
  )
}
