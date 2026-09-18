/**
 * Checks the sunflower and its suns in a real browser.
 *
 * Covers the things that break silently: the click target disappearing, suns piling up past the
 * landing spots, a collected sun never being removed from state, and the arc starting somewhere
 * other than the flower's head.
 *
 * Run the dev server, then: node scripts/verify-sunflower.mjs [url]
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-US' })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(url)
  await page.waitForTimeout(1200)

  const flower = page.getByRole('button', { name: 'Shake the sunflower' })
  const suns = () => page.locator('[data-sun]')
  assert.equal(await flower.count(), 1, 'the sunflower must be clickable')
  assert.equal(await suns().count(), 0, 'the room starts with no suns lying about')

  // The toss starts on the flower's face and ends on the floor, having risen in between.
  await flower.click()
  const path = []
  for (let i = 0; i < 9; i++) {
    path.push(await suns().first().evaluate((g) => {
      const r = g.getBoundingClientRect()
      return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) }
    }))
    await page.waitForTimeout(90)
  }
  const head = await page.locator('[data-plant="sunflower"] .f-bob').evaluate((g) => {
    const r = g.getBoundingClientRect()
    return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) }
  })
  assert.ok(Math.hypot(path[0].x - head.x, path[0].y - head.y) < 30, 'the sun starts at the flower head')
  const highest = Math.min(...path.map((p) => p.y))
  assert.ok(highest < path[0].y - 15, 'the sun rises before it falls')
  assert.ok(path.at(-1).y > path[0].y + 15, 'the sun ends up below where it started')

  // One sun per landing spot, and no more. Ten quick clicks also breach the Qliphoth counter on the
  // fourth and suppress it on the next five (see verify-qliphoth.mjs), which renames the button in
  // between, so this loop finds the flower by either name. The breach's own suns must respect the cap.
  const anyFlower = page.getByRole('button', { name: /^(Shake|Suppress) the sunflower$/ })
  for (let i = 0; i < 10; i++) {
    await anyFlower.click()
    await page.waitForTimeout(80)
  }
  const capped = await suns().count()
  assert.ok(capped > 1 && capped <= 6, `suns must be capped at the landing spots, saw ${capped}`)

  // Every sun can be collected, and none is left behind.
  let guard = 20
  while ((await page.getByRole('button', { name: 'Collect the sun' }).count()) && guard--) {
    await page.getByRole('button', { name: 'Collect the sun' }).first().click()
    await page.waitForTimeout(600)
  }
  assert.equal(await suns().count(), 0, 'collected suns must be removed')

  assert.deepEqual(errors, [])
  console.log(`sunflower: toss arc, cap of ${capped} suns, and collection all PASS`)
} finally {
  await browser.close()
}
