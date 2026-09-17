/**
 * Checks the night zombie in a real browser: one appears within 6 s of night, walks right to left,
 * stays clipped to the window glass, and never appears by day. Switching to day removes it.
 *
 * The page clock drives the schedule; the walk itself is a CSS animation on real time.
 *
 * Run the dev server, then: node scripts/verify-zombie.mjs [url]
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
await mkdir('artifacts', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const errors = []

async function openAt(time) {
  const context = await browser.newContext({ timezoneId: 'Asia/Ho_Chi_Minh', viewport: { width: 1440, height: 900 }, locale: 'en-US' })
  const page = await context.newPage()
  page.on('pageerror', (e) => errors.push(e.message))
  await page.clock.install({ time: new Date(time) })
  await page.goto(url)
  return { context, page }
}

try {
  // Night: a zombie within 6 s, walking left, clipped to the glass.
  {
    const { context, page } = await openAt('2026-06-15T22:00:00+07:00')
    const zombie = page.locator('[data-zombie]')
    await page.clock.runFor(2500)
    assert.equal(await zombie.count(), 0, 'not before 3 s')
    await page.clock.runFor(3500)
    assert.equal(await zombie.count(), 1, 'a zombie within 6 s of night')

    const clip = await zombie.evaluate((g) => g.parentElement.getAttribute('clip-path'))
    assert.equal(clip, 'url(#apt-window-glass)', 'the zombie is clipped to the window glass')

    const x = () => zombie.evaluate((g) => g.getBoundingClientRect().left)
    const start = await x()
    await page.waitForTimeout(2000)
    const later = await x()
    assert.ok(later < start - 5, `it walks right to left (${start} -> ${later})`)
    await page.screenshot({ path: 'artifacts/zombie-night.png' })

    // Switching to day removes it at once.
    await page.getByRole('button', { name: 'Night mode' }).click()
    assert.equal(await zombie.count(), 0, 'no zombie once it is day')
    await context.close()
  }

  // Day: never a zombie.
  {
    const { context, page } = await openAt('2026-06-15T12:00:00+07:00')
    await page.clock.runFor(30000)
    assert.equal(await page.locator('[data-zombie]').count(), 0, 'no zombie by day')
    await context.close()
  }

  assert.deepEqual(errors, [])
  console.log('zombie: appears at night within 6 s, walks left, clipped to the glass, never by day PASS')
} finally {
  await browser.close()
}
