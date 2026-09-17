/**
 * Thọ's energy from collected suns, as pure functions so the rules can be tested without a browser.
 * No imports, so `node --test` can load this file on its own.
 *
 * Energy is seconds left, 0–60. Every sun adds 20 and it drains one per second. The tier (0–3) sets
 * how fast he works, and a build on the PC screen fills at the tier's pace, shows OK for a second
 * and starts again while energy lasts.
 */

export interface Energy {
  /** Seconds of energy left, 0–60. */
  seconds: number
  /** How full the current build is, 0–1. */
  build: number
  /** Seconds left of the "OK" flash after a build completes; 0 when none is showing. */
  okFor: number
}

export const EMPTY_ENERGY: Energy = { seconds: 0, build: 0, okFor: 0 }

export const ENERGY_PER_SUN = 20
export const ENERGY_MAX = 60
/** Seconds a build takes to fill at tiers 1, 2 and 3; index 0 is unused. */
export const BUILD_SECONDS = [0, 12, 7, 4] as const
export const OK_SECONDS = 1

/**
 * Where the glow's level runs inside Thọ, in scene units. The chair back hides him from y 90 down,
 * so the level runs from there (empty) to the shoulders (full); below it everything glows.
 */
export const GLOW_SHOULDERS = 74
export const GLOW_WAIST = 90
/** The glow's clip reaches past the bottom of the sprite, and past its one-unit breath. */
export const GLOW_BOTTOM = 112
/** The neck shows between the collar pieces; the glow stops below it so it never tints his skin. */
export const GLOW_NECK = { x: 170, width: 10, below: 77 } as const

export type Tier = 0 | 1 | 2 | 3

export function tierOf(seconds: number): Tier {
  if (seconds <= 0) return 0
  if (seconds <= 20) return 1
  if (seconds <= 40) return 2
  return 3
}

export const addSun = (e: Energy): Energy => ({ ...e, seconds: Math.min(ENERGY_MAX, e.seconds + ENERGY_PER_SUN) })

/** Advances energy and the build by `dt` seconds. */
export function tick(e: Energy, dt: number): Energy {
  // A clock that steps backwards must not refill energy.
  const step = Math.max(0, dt)
  const seconds = Math.max(0, e.seconds - step)
  if (e.okFor > 0) {
    const okFor = Math.max(0, e.okFor - step)
    return { seconds, build: okFor > 0 ? 1 : 0, okFor }
  }
  const tier = tierOf(e.seconds)
  if (tier === 0 || seconds === 0) return { seconds, build: 0, okFor: 0 }
  const build = e.build + step / BUILD_SECONDS[tier]
  return build >= 1 ? { seconds, build: 1, okFor: OK_SECONDS } : { seconds, build, okFor: 0 }
}

/**
 * The top edge of the glow in whole scene units: at the shoulders when full, at the chair back when
 * empty. Rounded up, so any energy at all shows at least one row.
 */
export const glowTop = (seconds: number): number =>
  GLOW_WAIST - Math.ceil(((GLOW_WAIST - GLOW_SHOULDERS) * Math.min(Math.max(seconds, 0), ENERGY_MAX)) / ENERGY_MAX)
