import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EMPTY_ENERGY, addSun, glowTop, tick, tierOf } from '../src/state/energy.ts'

test('tiers follow the seconds left', () => {
  assert.equal(tierOf(0), 0)
  assert.equal(tierOf(0.2), 1)
  assert.equal(tierOf(20), 1)
  assert.equal(tierOf(20.5), 2)
  assert.equal(tierOf(40), 2)
  assert.equal(tierOf(41), 3)
  assert.equal(tierOf(60), 3)
})

test('each sun adds 20 seconds, up to 60', () => {
  let e = EMPTY_ENERGY
  e = addSun(e)
  assert.equal(e.seconds, 20)
  e = addSun(addSun(addSun(e)))
  assert.equal(e.seconds, 60)
})

test('energy drains one second per second and stops at zero', () => {
  const e = tick({ ...EMPTY_ENERGY, seconds: 30 }, 12)
  assert.equal(e.seconds, 18)
  assert.equal(tick(e, 100).seconds, 0)
})

test('a build fills at the pace of the tier and then shows OK for a second', () => {
  // Tier 3 fills in 4 s.
  let e = tick({ ...EMPTY_ENERGY, seconds: 60 }, 2)
  assert.equal(e.build, 0.5)
  e = tick(e, 2)
  assert.equal(e.build, 1)
  assert.equal(e.okFor, 1)
  e = tick(e, 0.5)
  assert.equal(e.okFor, 0.5)
  assert.equal(e.build, 1)
  e = tick(e, 0.5)
  assert.equal(e.okFor, 0)
  assert.equal(e.build, 0, 'a new build starts from empty')
})

test('running out of energy mid-build hides the bar', () => {
  const e = tick({ seconds: 1, build: 0.4, okFor: 0 }, 2)
  assert.equal(e.seconds, 0)
  assert.equal(e.build, 0)
})

test('the glow runs from the chair back to the shoulders, and any energy shows a row', () => {
  assert.equal(glowTop(60), 74)
  assert.equal(glowTop(30), 82)
  assert.equal(glowTop(0), 90)
  assert.equal(glowTop(0.5), 89)
})

test('without power energy drains but the build holds where it is', () => {
  const e = tick({ seconds: 30, build: 0.4, okFor: 0 }, 5, false)
  assert.deepEqual(e, { seconds: 25, build: 0.4, okFor: 0 })
  const ok = tick({ seconds: 30, build: 1, okFor: 0.5 }, 2, false)
  assert.deepEqual(ok, { seconds: 28, build: 1, okFor: 0.5 }, 'the OK flash holds too')
  // Power back: the build carries on from where it stopped (tier 2 fills in 7 s).
  assert.equal(tick(e, 3.5).build, 0.4 + 3.5 / 7)
})

test('without power, running out of energy still drops an unfinished build', () => {
  const e = tick({ seconds: 1, build: 0.4, okFor: 0 }, 2, false)
  assert.deepEqual(e, { seconds: 0, build: 0, okFor: 0 })
  assert.equal(tick(e, 0.5, false), e, 'an idle state is returned as is')
})

test('a clock stepping backwards does not refill energy', () => {
  assert.equal(tick({ seconds: 10, build: 0, okFor: 0 }, -30).seconds, 10)
})
