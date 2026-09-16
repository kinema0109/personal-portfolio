import { placeFor } from './place.ts'
import { nextPhaseChange, phaseAt, type Phase } from './solar.ts'

export type { Phase }

/** A day/night choice made by hand, kept only while it differs from what the clock says. */
export const PHASE_KEY = 'tho-vn:phase'

const here = (now: Date) => placeFor(Intl.DateTimeFormat().resolvedOptions().timeZone, now.getTimezoneOffset())

/** Day or night where the visitor is, from their own clock and time zone. No network. */
export function autoPhase(now = new Date()): Phase {
  const [lat, lon] = here(now)
  return phaseAt(now, lat, lon)
}

/** When auto next flips, or null under polar day or night. */
export function nextAutoChange(now = new Date()): Date | null {
  const [lat, lon] = here(now)
  return nextPhaseChange(now, lat, lon)
}

function readOverride(): Phase | null {
  try {
    const saved = localStorage.getItem(PHASE_KEY)
    return saved === 'day' || saved === 'night' ? saved : null
  } catch {
    return null
  }
}

/** Remembers a choice, or forgets it when it matches the clock, which puts the visitor back on auto. */
export function saveOverride(phase: Phase, now = new Date()): Phase | null {
  const override = phase === autoPhase(now) ? null : phase
  try {
    if (override) localStorage.setItem(PHASE_KEY, override)
    else localStorage.removeItem(PHASE_KEY)
  } catch {
    // Storage unavailable: the choice lasts until the tab closes.
  }
  return override
}

/** The phase to open on. An override the clock has since caught up with is forgotten. */
export function initialPhase(now = new Date()): { phase: Phase; override: Phase | null } {
  const saved = readOverride()
  if (saved === null) return { phase: autoPhase(now), override: null }
  return { phase: saved, override: saveOverride(saved, now) }
}

/** Puts the phase on <html>. The UI keeps its colours in both phases; only the room dims at night. */
export function applyPhase(phase: Phase): void {
  document.documentElement.dataset.phase = phase
}
