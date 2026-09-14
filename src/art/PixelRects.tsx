import type { Px } from './palette'

export function PixelRects({ px, className }: { px: readonly Px[]; className?: string }) {
  return (
    <g className={className}>
      {px.map(([x, y, w, h, fill], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={fill} />
      ))}
    </g>
  )
}
