/**
 * Where the sun is, from nothing but a moment and a place: the U.S. Naval Observatory's "approximate
 * solar coordinates", good to about a minute of arc, which is far more than day-or-night needs.
 * Deliberately free of imports so `node --test` can load it on its own.
 */

export type Phase = 'day' | 'night'

const RAD = Math.PI / 180

/** The sun's altitude above the horizon in degrees; negative when it is below. */
export function solarAltitude(date: Date, lat: number, lon: number): number {
  const d = date.getTime() / 86_400_000 + 2440587.5 - 2451545.0
  const g = (357.529 + 0.98560028 * d) * RAD
  const q = 280.459 + 0.98564736 * d
  const eclipticLon = (q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * RAD
  const obliquity = (23.439 - 0.00000036 * d) * RAD
  const rightAscension = Math.atan2(Math.cos(obliquity) * Math.sin(eclipticLon), Math.cos(eclipticLon))
  const declination = Math.asin(Math.sin(obliquity) * Math.sin(eclipticLon))
  const siderealHours = 18.697374558 + 24.06570982441908 * d
  const hourAngle = (siderealHours * 15 + lon) * RAD - rightAscension
  const phi = lat * RAD
  const sinAltitude =
    Math.sin(phi) * Math.sin(declination) + Math.cos(phi) * Math.cos(declination) * Math.cos(hourAngle)
  return Math.asin(sinAltitude) / RAD
}

/** Day while any of the sun is meant to be up: its centre above the horizon. */
export const phaseAt = (date: Date, lat: number, lon: number): Phase =>
  solarAltitude(date, lat, lon) > 0 ? 'day' : 'night'

const STEP_MS = 10 * 60_000
const HORIZON_MS = 48 * 3600_000

/** The next sunrise or sunset within 48 hours, to the minute; null under polar day or polar night. */
export function nextPhaseChange(from: Date, lat: number, lon: number): Date | null {
  const start = phaseAt(from, lat, lon)
  const t0 = from.getTime()
  for (let t = t0 + STEP_MS; t <= t0 + HORIZON_MS; t += STEP_MS) {
    if (phaseAt(new Date(t), lat, lon) === start) continue
    let lo = t - STEP_MS
    let hi = t
    while (hi - lo > 60_000) {
      const mid = (lo + hi) / 2
      if (phaseAt(new Date(mid), lat, lon) === start) lo = mid
      else hi = mid
    }
    return new Date(hi)
  }
  return null
}
