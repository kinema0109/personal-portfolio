/**
 * Checks the Terraria slime: by day and by night one appears within 6 s, hops left to right, and
 * stays clipped to the window glass. The page clock drives the schedule; the hop itself runs on
 * real time.
 *
 * Run the dev server, then: node scripts/verify-slime.mjs [url]
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
await mkdir('artifacts', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const errors = []

try {
  for (const [phase, time] of [['day', '2026-06-15T12:00:00+07:00'], ['night', '2026-06-15T22:00:00+07:00']]) {
    const context = await browser.newContext({ timezoneId: 'Asia/Ho_Chi_Minh', viewport: { width: 1440, height: 900 }, locale: 'en-US' })
    const page = await context.newPage()
    page.on('pageerror', (e) => errors.push(e.message))
    await page.clock.install({ time: new Date(time) })
    await page.clock.pauseAt(new Date(time))
    await page.goto(url)

    const slime = page.locator('[data-slime]')
    await page.clock.runFor(2500)
    assert.equal(await slime.count(), 0, `${phase}: not before 3 s`)
    await page.clock.runFor(3500)
    assert.equal(await slime.count(), 1, `${phase}: a slime within 6 s`)
    assert.equal(await slime.evaluate((g) => g.parentElement.getAttribute('clip-path')), 'url(#apt-window-glass)')

    const x = () => slime.evaluate((g) => g.getBoundingClientRect().left)
    const start = await x()
    await page.waitForTimeout(2000)
    const later = await x()
    assert.ok(later > start + 5, `${phase}: it hops left to right (${start} -> ${later})`)
    await page.screenshot({ path: `artifacts/slime-${phase}.png` })
    await context.close()
  }

  assert.deepEqual(errors, [])
  console.log('slime: appears by day and by night within 6 s, hops left to right, clipped to the glass PASS')
} finally {
  await browser.close()
}
