/**
 * Checks the pylon under the desk: powering it down stops everything electric, hides the visual
 * novel and shows Thọ's caption; warping it in plays the warp and brings everything back. Under
 * reduced motion power returns at once.
 *
 * Run the dev server, then: node scripts/verify-pylon.mjs [url]
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
await mkdir('artifacts', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const errors = []

try {
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-US' })
    page.on('pageerror', (e) => errors.push(e.message))
    await page.addInitScript(() => localStorage.setItem('tho-vn:phase', 'day'))
    await page.goto(url)
    await page.waitForTimeout(1200)

    const pylon = page.locator('[data-pylon]')
    assert.equal(await pylon.getAttribute('data-pylon'), 'on')
    assert.equal(await page.locator('.hud').count(), 1, 'the visual novel is up with power on')

    await page.getByRole('button', { name: 'Power down the pylon' }).click()
    assert.equal(await pylon.getAttribute('data-pylon'), 'off')
    assert.equal(await page.locator('.hud').count(), 0, 'the visual novel steps aside with power off')
    assert.equal(await page.getByRole('button', { name: 'See projects' }).count(), 0, 'room destinations are unavailable')
    assert.equal(await page.locator('[data-screen]').getAttribute('data-screen'), 'off', 'the PC screen is off')
    assert.equal(await page.locator('.f-rgb-a').count(), 0, 'the tower lights are off')
    assert.equal(await page.locator('[data-fan]').getAttribute('data-fan'), 'off', 'the fan stops')
    await assert.doesNotReject(page.locator('.pylon-line', { hasText: 'You must construct additional pylons.' }).waitFor())
    await page.screenshot({ path: 'artifacts/pylon-off.png' })

    // Story shortcuts do nothing while the power is off. (Not Enter: focus is on the pylon button, and
    // Enter would press it.)
    await page.keyboard.press('Escape')
    assert.equal(await page.locator('.hud').count(), 0)
    assert.equal(await pylon.getAttribute('data-pylon'), 'off')

    await page.getByRole('button', { name: 'Warp in the pylon' }).click()
    assert.equal(await pylon.getAttribute('data-pylon'), 'warping')
    assert.equal(await page.locator('.f-warp').count(), 1, 'the warp plays')
    await page.waitForTimeout(700)
    await page.screenshot({ path: 'artifacts/pylon-warping.png' })
    await page.waitForTimeout(1100)

    assert.equal(await pylon.getAttribute('data-pylon'), 'on', 'power returns after the warp')
    assert.equal(await page.locator('.hud').count(), 1, 'the visual novel returns')
    assert.equal(await page.getByRole('button', { name: 'See projects' }).count(), 1)
    assert.notEqual(await page.locator('[data-screen]').getAttribute('data-screen'), 'off')
    await page.screenshot({ path: 'artifacts/pylon-on.png' })
    await page.close()
  }

  // Reduced motion: no warp, power at once.
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-US', reducedMotion: 'reduce' })
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto(url)
    await page.waitForTimeout(800)
    await page.getByRole('button', { name: 'Power down the pylon' }).click()
    await page.getByRole('button', { name: 'Warp in the pylon' }).click()
    assert.equal(await page.locator('[data-pylon]').getAttribute('data-pylon'), 'on')
    await page.close()
  }

  assert.deepEqual(errors, [])
  console.log('pylon: power down hides the story and stops the electrics, warp-in restores them, reduced motion skips the warp PASS')
} finally {
  await browser.close()
}
