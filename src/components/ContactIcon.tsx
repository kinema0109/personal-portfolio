import type { ContactId } from '../content/types'

/** [x, y, width, height] on a 16 × 16 grid. `ink` rects use the link colour; `cut` rects use the paper. */
type Rect = readonly [number, number, number, number]

const ICONS: Record<ContactId, { ink: readonly Rect[]; cut?: readonly Rect[] }> = {
  // An envelope with its flap folded down to a point.
  email: {
    ink: [
      [1, 3, 14, 1], [1, 12, 14, 1], [1, 3, 1, 10], [14, 3, 1, 10],
      [2, 4, 1, 1], [3, 5, 1, 1], [4, 6, 1, 1], [5, 7, 1, 1], [6, 8, 4, 1],
      [13, 4, 1, 1], [12, 5, 1, 1], [11, 6, 1, 1], [10, 7, 1, 1],
    ],
  },
  // The GitHub cat's head: two ears, a round face and two eyes.
  github: {
    ink: [
      [3, 2, 1, 1], [12, 2, 1, 1], [3, 3, 2, 1], [11, 3, 2, 1], [3, 4, 10, 1],
      [2, 5, 12, 5], [3, 10, 10, 1], [5, 11, 6, 1], [6, 12, 4, 2],
    ],
    cut: [[5, 7, 2, 2], [9, 7, 2, 2]],
  },
  // A filled square with "in" cut out of it.
  linkedin: {
    ink: [[1, 1, 14, 14]],
    cut: [[3, 3, 2, 2], [3, 6, 2, 7], [7, 6, 2, 7], [9, 6, 3, 2], [11, 7, 2, 6]],
  },
}

/** A small pixel icon for a contact link. Decorative: the link carries the accessible name. */
export function ContactIcon({ id }: { id: ContactId }) {
  const { ink, cut = [] } = ICONS[id]
  return (
    <svg className="contact-icon" viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      {ink.map(([x, y, w, h], i) => (
        <rect key={`i${i}`} x={x} y={y} width={w} height={h} fill="currentColor" />
      ))}
      {cut.map(([x, y, w, h], i) => (
        <rect key={`c${i}`} x={x} y={y} width={w} height={h} fill="var(--paper)" />
      ))}
    </svg>
  )
}
