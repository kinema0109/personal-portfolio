/**
 * Checks the Sun-shroom in a real browser: asleep and sunless by day; by night a small sun from its
 * cap, growth after three collected small suns, and a normal sun afterwards.
 *
 * Time zone and clock are fixed per context, so day and night do not depend on when this runs.
 *
 * Run the dev server, then: node scripts/verify-sunshroom.mjs [url]
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const errors = []

async function openAt(time) {
  const context = await browser.newContext({
    timezoneId: 'Asia/Ho_Chi_Minh',
    viewport: { width: 1440, height: 900 },
    locale: 'en-US',
  })
  const page = await context.newPage()
  page.on('pageerror', (e) => errors.push(e.message))
  await page.clock.setFixedTime(new Date(time))
  await page.goto(url)
  await page.waitForTimeout(1200)
  return { context, page }
}

try {
  // Day: asleep, Zs up, and a click gives no sun.
  {
    const { context, page } = await openAt('2026-06-15T12:00:00+07:00')
    const plant = page.locator('[data-plant="sunshroom"]')
    assert.equal(await plant.getAttribute('data-asleep'), 'true')
    assert.equal(await page.locator('[data-plant="sunshroom"] .f-zzz').count(), 1, 'Zs rise off it by day')
    await page.getByRole('button', { name: 'The Sun-shroom is asleep' }).click()
    await page.waitForTimeout(800)
    assert.equal(await page.locator('[data-sun]').count(), 0, 'a sleeping Sun-shroom drops no sun')
    await context.close()
  }

  // Night: small suns from the cap, growth after three, then normal suns.
  {
    const { context, page } = await openAt('2026-06-15T22:00:00+07:00')
    const plant = page.locator('[data-plant="sunshroom"]')
    const shroom = page.getByRole('button', { name: 'Shake the Sun-shroom' })
    assert.equal(await plant.getAttribute('data-asleep'), 'false')
    assert.equal(await plant.getAttribute('data-grown'), 'false')

    // The toss starts on the cap: the first frame of the sun sits close to the plant.
    await shroom.click()
    await page.waitForTimeout(220)
    const cap = await plant.evaluate((g) => {
      const r = g.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 3 }
    })
    const start = await page.locator('[data-sun]').first().evaluate((g) => {
      const r = g.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    })
    assert.ok(Math.hypot(start.x - cap.x, start.y - cap.y) < 40, 'the sun starts at the cap')
    assert.equal(await page.locator('[data-sun]').first().getAttribute('data-sun-size'), 'small')

    for (let i = 0; i < 3; i++) {
      if (i > 0) await shroom.click()
      await page.waitForTimeout(1000)
      await page.getByRole('button', { name: 'Collect the sun' }).first().click()
      await page.waitForTimeout(700)
    }
    assert.equal(await plant.getAttribute('data-grown'), 'true', 'three collected small suns grow it')

    await page.waitForTimeout(1100)
    await shroom.click()
    await page.waitForTimeout(1000)
    assert.equal(
      await page.locator('[data-sun="idle"]').last().getAttribute('data-sun-size'),
      'normal',
      'once grown it gives normal suns',
    )
    await context.close()
  }

  assert.deepEqual(errors, [])
  console.log('sunshroom: asleep by day, small suns at night, growth and normal suns all PASS')
} finally {
  await browser.close()
}
