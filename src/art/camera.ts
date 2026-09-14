/** A rectangle in scene (pixel-grid) coordinates. */
export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

/** The part of the screen (CSS px) not covered by UI. */
export interface Region {
  left: number
  top: number
  width: number
  height: number
}

export interface Camera {
  x: number
  y: number
  w: number
  h: number
  /** CSS px per scene pixel. */
  scale: number
}

export interface SceneFocus {
  /** Must always be visible (e.g. the desk and the person). */
  primary: Rect
  /** Shown whole when there is enough room (e.g. the full room). */
  secondary: Rect
}

/** Below this many CSS px per art pixel we prefer cropping to the primary focus. */
const MIN_DETAIL_SCALE = 3

/**
 * Fills the whole screen with the scene and places the focus inside the free region.
 * Integer scales are used when possible so the pixel art stays crisp.
 */
export function frameCamera(width: number, height: number, region: Region, focus: SceneFocus): Camera {
  const rw = Math.max(region.width, 80)
  const rh = Math.max(region.height, 60)
  const fit = (r: Rect) => Math.min(rw / r.w, rh / r.h)

  const secondaryScale = fit(focus.secondary)
  let scale = Math.min(fit(focus.primary), Math.max(secondaryScale, MIN_DETAIL_SCALE))
  const target = scale <= secondaryScale ? focus.secondary : focus.primary
  if (scale >= 2) scale = Math.floor(scale)

  const cx = target.x + target.w / 2
  const cy = target.y + target.h / 2
  const x = Math.round(cx * scale - (region.left + rw / 2)) / scale
  const y = Math.round(cy * scale - (region.top + rh / 2)) / scale

  return { x, y, w: width / scale, h: height / scale, scale }
}
