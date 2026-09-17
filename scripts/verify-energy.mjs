/**
 * Checks sun energy in a real browser: collecting suns raises the tier and the glow inside Thọ, the
 * typing speeds up, a build runs on the PC screen, and energy drains as time passes.
 *
 * The page clock is installed, so time only moves when the check says so.
 *
 * Run the dev server, then: node scripts/verify-energy.mjs [url]
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
await mkdir('artifacts', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US' })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  // Day, so the Sun-shroom sleeps and only the Sunflower drops suns.
  await page.addInitScript(() => localStorage.setItem('tho-vn:phase', 'day'))
  await page.clock.install({ time: new Date('2026-06-15T12:00:00+07:00') })
  await page.goto(url)
  await page.clock.runFor(1500)

  const svg = page.locator('.pixel-svg')
  const tier = async () => Number(await svg.getAttribute('data-energy-tier'))
  const glow = page.locator('.f-energy[data-glow-top]')
  const glowTopOf = async () => Number(await glow.getAttribute('data-glow-top'))
  // The hands rest while Thọ speaks, so the screen's code swap is the speed that is always running.
  const codeDuration = () => page.locator('.f-code-a').evaluate((g) => getComputedStyle(g).animationDuration)

  assert.equal(await tier(), 0, 'no energy on load')
  assert.equal(await glow.count(), 0, 'no glow on load')
  assert.equal(await page.locator('.f-build').count(), 0, 'no build on load')

  const collectOne = async () => {
    await page.getByRole('button', { name: 'Shake the sunflower' }).click()
    await page.clock.runFor(100)
    await page.getByRole('button', { name: 'Collect the sun' }).first().click()
    await page.clock.runFor(600)
  }

  await collectOne()
  assert.equal(await tier(), 1, 'one sun gives tier 1')
  const lowGlow = await glowTopOf()
  assert.equal(await codeDuration(), '3.5s')

  await collectOne()
  await collectOne()
  assert.equal(await tier(), 3, 'three suns give tier 3')
  const highGlow = await glowTopOf()
  assert.ok(highGlow < lowGlow, `more energy glows higher (${highGlow} < ${lowGlow})`)
  assert.equal(await codeDuration(), '1.2s')
  await page.screenshot({ path: 'artifacts/energy-full.png' })

  // A build runs while energy lasts and flashes OK when it fills.
  await page.clock.runFor(2000)
  assert.equal(await page.locator('.f-build').count(), 1, 'a build runs with energy')

  // Draining: after 21 more seconds the tier has dropped and the glow is lower.
  await page.clock.runFor(21000)
  assert.ok((await tier()) < 3, 'energy drains over time')
  assert.ok((await glowTopOf()) > highGlow, 'the glow sinks as energy drains')
  await page.screenshot({ path: 'artifacts/energy-draining.png' })

  // Empty: no glow and no build.
  await page.clock.runFor(60000)
  assert.equal(await tier(), 0)
  assert.equal(await glow.count(), 0)
  assert.equal(await page.locator('.f-build').count(), 0, 'the build hides when energy runs out')

  assert.deepEqual(errors, [])
  console.log('energy: tiers, glow level, work speed, build and draining all PASS')
} finally {
  await browser.close()
}
