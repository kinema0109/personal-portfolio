import { test } from 'node:test'
import assert from 'node:assert/strict'
import { nextPhaseChange, phaseAt, solarAltitude } from '../src/daylight/solar.ts'

const HCM_LAT = 10.75
const HCM_LON = 106.67

test('Ho Chi Minh City is day at noon and night at 22:00 local', () => {
  assert.equal(phaseAt(new Date('2026-06-15T12:00:00+07:00'), HCM_LAT, HCM_LON), 'day')
  assert.equal(phaseAt(new Date('2026-06-15T22:00:00+07:00'), HCM_LAT, HCM_LON), 'night')
})

test('the June noon sun over Ho Chi Minh City stands high', () => {
  const altitude = solarAltitude(new Date('2026-06-15T12:00:00+07:00'), HCM_LAT, HCM_LON)
  assert.ok(altitude > 70 && altitude < 90, `altitude ${altitude}`)
})

test('the next change after noon in Ho Chi Minh City is sunset, around 18:15 local', () => {
  const change = nextPhaseChange(new Date('2026-06-15T12:00:00+07:00'), HCM_LAT, HCM_LON)
  assert.ok(change, 'there must be a sunset')
  const local = new Date(change.getTime() + 7 * 3600_000)
  const minutes = local.getUTCHours() * 60 + local.getUTCMinutes()
  assert.ok(Math.abs(minutes - (18 * 60 + 15)) <= 12, `sunset at ${local.toISOString()} (local)`)
})

test('Troll station has the midnight sun on 1 January and no change within 48 hours', () => {
  const at = new Date('2027-01-01T00:00:00Z')
  assert.equal(phaseAt(at, -72.01, 2.53), 'day')
  assert.equal(nextPhaseChange(at, -72.01, 2.53), null)
})

test('Tromsø is dark at noon on the winter solstice', () => {
  assert.equal(phaseAt(new Date('2026-12-21T12:00:00+01:00'), 69.65, 18.96), 'night')
})
