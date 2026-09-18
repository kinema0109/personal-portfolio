/**
 * Checks the Sunflower's Qliphoth counter (Lobotomy Corporation) in a real browser.
 *
 * Covers what breaks silently: eager clicks not lowering the counter, the pips not showing, a
 * breach that never starts or never stops, a breach that stops tossing suns (or keeps tossing after
 * suppression), and a lowered counter that never refills. Also that it works with the pylon off and
 * that reduced motion drops the shake but not the breach.
 *
 * Run the dev server, then: node scripts/verify-qliphoth.mjs [url]
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const errors = []

const plant = (page) => page.locator('[data-plant="sunflower"]')
const counter = async (page) => Number(await plant(page).getAttribute('data-qliphoth-counter'))
const mood = (page) => plant(page).getAttribute('data-qliphoth')
const pips = (page) => page.locator('[data-qliphoth-pips]')
const litPips = (page) => page.locator('[data-qliphoth-pips] [data-pip="on"]')
const suns = (page) => page.locator('[data-sun]')
const calmButton = (page) => page.getByRole('button', { name: 'Shake the sunflower' })
const breachButton = (page) => page.getByRole('button', { name: 'Suppress the sunflower' })

/** Collects every sun lying on the floor, so new arrivals can be counted. */
async function collectAll(page) {
  const collect = page.getByRole('button', { name: 'Collect the sun' })
  let guard = 20
  while ((await collect.count()) && guard--) {
    await collect.first().click()
    await page.waitForTimeout(40)
  }
}

/** Four clicks well inside the 800 ms window: the first sets the pace, the next three empty the counter. */
async function breach(page) {
  const seen = []
  for (let i = 0; i < 4; i++) {
    await calmButton(page).click()
    seen.push(await counter(page))
    if (i === 1) {
      assert.equal(await pips(page).count(), 1, 'the pips appear once the counter drops')
      assert.equal(await litPips(page).count(), 2, 'two ochre pips are lit at counter 2')
    }
    await page.waitForTimeout(100)
  }
  assert.deepEqual(seen, [3, 2, 1, 0], 'each eager click lowers the counter by one')
  assert.equal(await mood(page), 'breach', 'the fourth eager click breaches')
  assert.equal(await breachButton(page).count(), 1, 'the button is renamed during the breach')
  assert.equal(await calmButton(page).count(), 0, 'the calm label is gone during the breach')
  assert.equal(await pips(page).getAttribute('data-qliphoth-pips'), '5', 'the breach shows five suppression pips')
  assert.equal(await litPips(page).count(), 5)
}

/** Five clicks, however slow, end the breach and fill the counter. */
async function suppress(page) {
  for (let i = 0; i < 5; i++) {
    await breachButton(page).click()
    await page.waitForTimeout(120)
    if (i < 4) assert.equal(await litPips(page).count(), 4 - i, 'each suppression click puts out one pip')
  }
  assert.equal(await mood(page), 'calm', 'five clicks suppress the breach')
  assert.equal(await counter(page), 3, 'the counter is back to 3')
  assert.equal(await pips(page).count(), 0, 'a full counter hides its pips')
  assert.equal(await calmButton(page).count(), 1, 'the calm label is back')
}

try {
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-US' })
    page.on('pageerror', (e) => errors.push(e.message))
    await page.addInitScript(() => localStorage.setItem('tho-vn:phase', 'day'))
    await page.goto(url)
    await page.waitForTimeout(1200)

    assert.equal(await counter(page), 3, 'the counter starts full')
    assert.equal(await mood(page), 'calm')
    assert.equal(await pips(page).count(), 0, 'a full counter shows no pips')

    // Unhurried clicks never lower it.
    await calmButton(page).click()
    await page.waitForTimeout(900)
    await calmButton(page).click()
    assert.equal(await counter(page), 3, 'a click more than 800 ms after the last does not lower the counter')
    await page.waitForTimeout(3200)
    await collectAll(page)
    await page.waitForTimeout(700)

    await breach(page)
    const shake = await page.locator('.f-breach').evaluate((g) => getComputedStyle(g).animationName)
    assert.equal(shake, 'breach-shake', 'the plant shakes during the breach')

    // Suns keep coming with nobody clicking the flower: take them all, and more arrive.
    let arrived = 0
    for (let round = 0; round < 3; round++) {
      await collectAll(page)
      await page.waitForTimeout(900)
      arrived += await page.getByRole('button', { name: 'Collect the sun' }).count()
    }
    assert.ok(arrived >= 3, `suns keep arriving during the breach (${arrived} in three rounds)`)
    assert.ok(Number(await page.locator('.pixel-svg').getAttribute('data-energy-tier')) > 0, 'breach suns give energy')
    assert.ok((await suns(page).count()) <= 6, 'breach suns still stop at the landing spots')

    await suppress(page)
    await collectAll(page)
    await page.waitForTimeout(1300)
    assert.equal(await suns(page).count(), 0, 'no more suns once the breach is suppressed')

    // Left alone, a lowered counter refills: the first point after 3 s idle, then one per 1.5 s.
    await page.waitForTimeout(900)
    for (let i = 0; i < 3; i++) {
      await calmButton(page).click()
      await page.waitForTimeout(100)
    }
    assert.equal(await counter(page), 1, 'three eager clicks leave one point')
    await page.waitForTimeout(2300)
    assert.equal(await counter(page), 1, 'no refill before 3 s without a click')
    await page.waitForTimeout(1100)
    assert.equal(await counter(page), 2, 'the first point comes back after 3 s')
    await page.waitForTimeout(1600)
    assert.equal(await counter(page), 3, 'the next point comes back 1.5 s later')
    assert.equal(await pips(page).count(), 0, 'the pips go away once it is full again')
    await page.close()
  }

  // With the pylon off, and at night, the Sunflower still breaches: it needs no power.
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-US' })
    page.on('pageerror', (e) => errors.push(e.message))
    await page.addInitScript(() => localStorage.setItem('tho-vn:phase', 'night'))
    await page.goto(url)
    await page.waitForTimeout(1200)
    await page.getByRole('button', { name: 'Power down the pylon' }).click()
    await page.waitForTimeout(300)
    await breach(page)
    await page.waitForTimeout(900)
    assert.ok((await suns(page).count()) >= 4, 'the breach tosses suns with the power off')
    await suppress(page)
    await page.close()
  }

  // Reduced motion: no shake, but the breach and its suns are unchanged.
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-US', reducedMotion: 'reduce' })
    page.on('pageerror', (e) => errors.push(e.message))
    await page.addInitScript(() => localStorage.setItem('tho-vn:phase', 'day'))
    await page.goto(url)
    await page.waitForTimeout(1200)
    await breach(page)
    const shake = await page.locator('.f-breach').evaluate((g) => getComputedStyle(g).animationName)
    assert.equal(shake, 'none', 'no shake under reduced motion')
    await collectAll(page)
    await page.waitForTimeout(900)
    assert.ok((await suns(page).count()) >= 1, 'the breach still tosses suns under reduced motion')
    await suppress(page)
    await page.close()
  }

  assert.deepEqual(errors, [])
  console.log('qliphoth: eager clicks, pips, breach, breach suns, suppression, refill, pylon off and reduced motion all PASS')
} finally {
  await browser.close()
}
