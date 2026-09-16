import type { Px } from './palette'

/** The warm rim drawn around whatever the visitor is pointing at. */
export const HALO = '#f4dca8'

/**
 * Grows every rectangle of a drawn object by one unit, to be painted behind the object itself.
 * Only the one-unit rim survives, so the highlight follows the silhouette instead of boxing it.
 *
 * Use this for anything drawn from rectangles. Sprites loaded as images have no rectangles to grow,
 * so those use the `PICK_RIM` filter instead, which dilates the image's own alpha.
 */
export const outlineOf = (px: readonly Px[]): Px[] =>
  px.map(([x, y, w, h]) => [x - 1, y - 1, w + 2, h + 2, HALO] as Px)

/** Filter id for outlining an image sprite; defined once in ApartmentScene's defs. */
export const PICK_RIM = 'pick-rim'

/** What the visitor is pointing at. Nothing here changes on click; it is purely the highlight. */
export type Highlight = string | null
