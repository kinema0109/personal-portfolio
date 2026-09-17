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

/** Where the glow sits inside Thọ, in scene units: shoulders at the top, waist at the bottom. */
export const GLOW_SHOULDERS = 74
export const GLOW_WAIST = 110

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
  const seconds = Math.max(0, e.seconds - dt)
  if (e.okFor > 0) {
    const okFor = Math.max(0, e.okFor - dt)
    return { seconds, build: okFor > 0 ? 1 : 0, okFor }
  }
  const tier = tierOf(e.seconds)
  if (tier === 0 || seconds === 0) return { seconds, build: 0, okFor: 0 }
  const build = e.build + dt / BUILD_SECONDS[tier]
  return build >= 1 ? { seconds, build: 1, okFor: OK_SECONDS } : { seconds, build, okFor: 0 }
}

/** The top edge of the glow in whole scene units: at the shoulders when full, at the waist when empty. */
export const glowTop = (seconds: number): number =>
  GLOW_WAIST - Math.round(((GLOW_WAIST - GLOW_SHOULDERS) * Math.min(seconds, ENERGY_MAX)) / ENERGY_MAX)
