/**
 * Checks that the room follows the visitor's own day and night, and that the top-bar switch
 * overrides it and forgets the override once it matches the clock again.
 *
 * Each case gets its own browser context with a fixed time zone and a fixed clock, so the result
 * never depends on when the check is run. Screenshots land in artifacts/ for direct inspection.
 *
 * Run the dev server, then: node scripts/verify-daylight.mjs [url]
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
const KEY = 'tho-vn:phase'
const HCM_NOON = '2026-06-15T12:00:00+07:00'
const HCM_NIGHT = '2026-06-15T22:00:00+07:00'

await mkdir('artifacts', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const errors = []

/** Opens the room at a given place and moment, optionally with a saved choice on the first load only. */
async function open({ timezoneId, time, saved, viewport = { width: 1440, height: 900 } }) {
  const context = await browser.newContext({ timezoneId, viewport, locale: 'en-US' })
  const page = await context.newPage()
  page.on('pageerror', (e) => errors.push(e.message))
  await page.clock.setFixedTime(new Date(time))
  if (saved) {
    await page.addInitScript(([key, value]) => {
      if (sessionStorage.getItem('seeded')) return
      localStorage.setItem(key, value)
      sessionStorage.setItem('seeded', '1')
    }, [KEY, saved])
  }
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  return { context, page }
}

const phaseOf = (page) => page.evaluate(() => document.documentElement.dataset.phase)
const storedOf = (page) => page.evaluate((key) => localStorage.getItem(key), KEY)

try {
  // Auto, from the clock and the zone. The attribute is already there when the DOM is ready.
  {
    const { context, page } = await open({ timezoneId: 'Asia/Ho_Chi_Minh', time: HCM_NOON })
    assert.equal(await phaseOf(page), 'day', 'noon in Ho Chi Minh City is day')
    await page.locator('.pixel-svg').waitFor()
    assert.equal(await page.locator('[data-night-dim]').count(), 0, 'the room is not dimmed by day')
    await context.close()
  }
  {
    const { context, page } = await open({ timezoneId: 'Asia/Ho_Chi_Minh', time: HCM_NIGHT })
    assert.equal(await phaseOf(page), 'night', '22:00 in Ho Chi Minh City is night')
    await page.locator('.pixel-svg').waitFor()
    assert.equal(await page.locator('[data-night-dim]').count(), 1, 'the room is dimmed at night')
    await context.close()
  }
  {
    const { context, page } = await open({ timezoneId: 'Antarctica/Troll', time: '2027-01-01T00:00:00Z' })
    assert.equal(await phaseOf(page), 'day', 'Troll has the midnight sun on 1 January')
    await context.close()
  }

  // The switch: swap, remember across a reload, then swap back and forget.
  {
    const { context, page } = await open({ timezoneId: 'Asia/Ho_Chi_Minh', time: HCM_NIGHT })
    const button = page.getByRole('button', { name: 'Night mode' })
    await button.waitFor()
    assert.equal(await button.getAttribute('aria-pressed'), 'true')

    await button.click()
    assert.equal(await phaseOf(page), 'day')
    assert.equal(await button.getAttribute('aria-pressed'), 'false')
    assert.equal(await storedOf(page), 'day', 'an override that differs from the clock is saved')

    await page.reload({ waitUntil: 'domcontentloaded' })
    assert.equal(await phaseOf(page), 'day', 'the override survives a reload')

    await page.getByRole('button', { name: 'Night mode' }).click()
    assert.equal(await phaseOf(page), 'night')
    assert.equal(await storedOf(page), null, 'swapping back to the clock forgets the override')
    await context.close()
  }

  // A saved choice the clock has since caught up with is dropped on load.
  {
    const { context, page } = await open({ timezoneId: 'Asia/Ho_Chi_Minh', time: HCM_NOON, saved: 'day' })
    await page.getByRole('button', { name: 'Night mode' }).waitFor()
    assert.equal(await phaseOf(page), 'day')
    assert.equal(await storedOf(page), null)
    await context.close()
  }

  // Screenshots of both phases at desktop and phone size.
  for (const [phase, time] of [['day', HCM_NOON], ['night', HCM_NIGHT]]) {
    for (const [name, viewport] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
      const { context, page } = await open({ timezoneId: 'Asia/Ho_Chi_Minh', time, viewport })
      await page.waitForTimeout(1500)
      await page.screenshot({ path: `artifacts/daylight-${phase}-${name}.png` })
      await context.close()
    }
  }

  assert.deepEqual(errors, [])
  console.log('daylight: auto day/night, polar day, switch, reload, stale override and screenshots all PASS')
} finally {
  await browser.close()
}
