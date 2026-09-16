/**
 * Checks the desk fan's switch: three speeds, then off, then round again.
 *
 * Run the dev server, then: node scripts/verify-fan.mjs [url]
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

  const fan = page.locator('[data-fan]')
  const knob = page.locator('button[aria-label^="Desk fan"]')
  assert.equal(await knob.count(), 1, 'the fan must be clickable')

  const read = async () => ({
    speed: await fan.getAttribute('data-fan'),
    // The blades' frame rate is what actually changes, so read it off the element.
    blade: await page.locator('[data-fan] .f-fan-a').evaluate((e) => {
      const style = getComputedStyle(e)
      return style.animationName === 'none' ? 'stopped' : style.animationDuration
    }),
  })

  const seen = []
  for (let i = 0; i < 5; i++) {
    seen.push(await read())
    await knob.click()
    await page.waitForTimeout(150)
  }
  console.log(seen.map((s) => `${s.speed}/${s.blade}`).join(' -> '))

  assert.deepEqual(seen.map((s) => s.speed), ['low', 'mid', 'high', 'off', 'low'], 'the switch must go round')
  const rate = (d) => parseFloat(d)
  assert.ok(rate(seen[0].blade) > rate(seen[1].blade), 'mid must be faster than low')
  assert.ok(rate(seen[1].blade) > rate(seen[2].blade), 'high must be faster than mid')
  assert.equal(seen[3].blade, 'stopped', 'off must hold the blades still')
  assert.deepEqual(errors, [])
  console.log('fan: three speeds, off, and back round again PASS')
} finally {
  await browser.close()
}
