import { ZONE_COORDS } from './zoneCoords.ts'

/**
 * Roughly where the visitor is, from their time zone alone: the zone's principal city. A zone the
 * table does not know falls back to the equator at the longitude its UTC offset implies, which
 * still puts sunrise and sunset within about an hour.
 *
 * `offsetMinutes` is `Date#getTimezoneOffset()`: positive west of Greenwich, so UTC+7 is -420.
 */
export function placeFor(timeZone: string | undefined, offsetMinutes: number): readonly [number, number] {
  const known = timeZone ? ZONE_COORDS[timeZone] : undefined
  return known ?? [0, (-offsetMinutes / 60) * 15]
}
