import { test } from 'node:test'
import assert from 'node:assert/strict'
import { placeFor } from '../src/daylight/place.ts'

test('Vietnam resolves to Ho Chi Minh City under both of its zone names', () => {
  const [lat, lon] = placeFor('Asia/Ho_Chi_Minh', -420)
  assert.ok(Math.abs(lat - 10.75) < 0.1 && Math.abs(lon - 106.67) < 0.1, `${lat}, ${lon}`)
  // Chrome still reports the old name.
  assert.deepEqual(placeFor('Asia/Saigon', -420), placeFor('Asia/Ho_Chi_Minh', -420))
})

test('Antarctica/Troll is in the table, deep in the south', () => {
  const [lat] = placeFor('Antarctica/Troll', 0)
  assert.ok(lat < -70, `${lat}`)
})

test('an unknown zone falls back to the equator at the offset longitude', () => {
  assert.deepEqual(placeFor('Mars/Olympus_Mons', -420), [0, 105])
  assert.deepEqual(placeFor(undefined, 300), [0, -75])
})
