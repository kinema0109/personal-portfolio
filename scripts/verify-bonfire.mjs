/**
 * Checks the Dark Souls bonfire on the window sill in a real browser.
 *
 * Covers what breaks silently: the bonfire drifting off the sill or into the Sunflower or the fan,
 * its button going missing, the rest not flaring or its "BONFIRE LIT" caption never showing or never
 * going away, a rest changing anything else in the room, and the bonfire depending on the pylon's
 * power. Under reduced motion the fire holds still and the caption shows without a fade.
 *
 * Run the dev server, then: node scripts/verify-bonfire.mjs [url]
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
const LINE = 'BONFIRE LIT'
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const errors = []

/** The bonfire's drawn bounds in scene units, from the svg's own geometry. */
const sceneBounds = (page) =>
  page.locator('[data-bonfire]').evaluate((g) => {
    const b = g.getBBox()
    return { x: b.x, y: b.y, right: b.x + b.width, bottom: b.y + b.height }
  })

/** Everything a rest must leave alone. */
const roomState = (page) =>
  page.evaluate(() => ({
    suns: document.querySelectorAll('[data-sun]').length,
    tier: document.querySelector('.pixel-svg')?.getAttribute('data-energy-tier'),
    screen: document.querySelector('[data-screen]')?.getAttribute('data-screen'),
    fan: document.querySelector('[data-fan]')?.getAttribute('data-fan'),
    viewBox: document.querySelector('.pixel-svg')?.getAttribute('viewBox'),
    lines: document.querySelector('#dialogue .lines')?.textContent,
  }))

/** Rests, then waits for the caption to show and to go again, checking the flare in between. */
async function rest(page, { reduced = false } = {}) {
  const bonfire = page.locator('[data-bonfire]')
  const caption = page.locator('.bonfire-line')
  assert.equal(await caption.textContent(), '', 'the caption is empty between rests')
  await page.getByRole('button', { name: 'Rest at the bonfire' }).click()
  assert.equal(await bonfire.getAttribute('data-bonfire'), 'flare', 'the fire flares on a rest')
  await caption.filter({ hasText: LINE }).waitFor()
  assert.equal(await caption.getAttribute('role'), 'status', 'the caption is a live region')
  const text = page.locator('.bonfire-lit')
  if (reduced) {
    assert.equal(await text.evaluate((el) => getComputedStyle(el).opacity), '1', 'under reduced motion the caption shows at once')
  } else {
    assert.equal(await text.evaluate((el) => getComputedStyle(el).animationName), 'bonfire-lit', 'the caption fades')
  }
  const box = await text.boundingBox()
  const viewport = page.viewportSize()
  assert.ok(box && box.x >= 0 && box.x + box.width <= viewport.width, 'the caption is on screen')
  await page.waitForTimeout(1300)
  assert.equal(await bonfire.getAttribute('data-bonfire'), 'idle', 'the flare dies down after about 1 s')
  assert.equal(await caption.textContent(), LINE, 'the caption is still up after 1.3 s')
  await page.waitForTimeout(1500)
  assert.equal(await caption.textContent(), '', 'the caption goes after about 2.5 s')
}

try {
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-US' })
    page.on('pageerror', (e) => errors.push(e.message))
    await page.addInitScript(() => localStorage.setItem('tho-vn:phase', 'day'))
    await page.goto(url)
    await page.waitForTimeout(1200)

    // On the sill: base on its top (y 94), inside x 64–90, clear of the Sunflower's head and the fan.
    const b = await sceneBounds(page)
    assert.ok(b.bottom <= 95 && b.bottom >= 94, `the bonfire stands on the sill top (bottom ${b.bottom})`)
    assert.ok(b.x >= 64 && b.right <= 90, `the bonfire sits between x 64 and 90 (${b.x}–${b.right})`)
    assert.ok(b.x > 52 && b.right < 94, 'clear of the Sunflower head and the desk fan')
    assert.equal(await page.locator('[data-bonfire]').getAttribute('data-bonfire'), 'idle')
    assert.equal(await page.locator('.f-fire-a').evaluate((g) => getComputedStyle(g).animationName), 'show-first-half', 'the fire flickers')

    const button = page.getByRole('button', { name: 'Rest at the bonfire' })
    assert.equal(await button.count(), 1, 'the bonfire has its button')

    // Hover rim, like every other room object.
    const rectsBefore = await page.locator('[data-bonfire] rect').count()
    await button.hover()
    assert.ok((await page.locator('[data-bonfire] rect').count()) > rectsBefore, 'hovering draws the rim')
    await page.mouse.move(5, 5)

    const before = await roomState(page)
    await rest(page)
    assert.deepEqual(await roomState(page), before, 'resting changes nothing else in the room')

    // With the pylon off, it still works.
    await page.getByRole('button', { name: 'Power down the pylon' }).click()
    await page.waitForTimeout(3300)
    await rest(page)
    await page.close()
  }

  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-US', reducedMotion: 'reduce' })
    page.on('pageerror', (e) => errors.push(e.message))
    await page.addInitScript(() => localStorage.setItem('tho-vn:phase', 'night'))
    await page.goto(url)
    await page.waitForTimeout(1200)
    assert.equal(await page.locator('.f-fire-a').evaluate((g) => getComputedStyle(g).animationName), 'none', 'no flicker under reduced motion')
    assert.equal(await page.locator('.f-fire-b').evaluate((g) => getComputedStyle(g).opacity), '0', 'only one fire frame shows under reduced motion')
    await rest(page, { reduced: true })
    await page.close()
  }

  assert.deepEqual(errors, [])
  console.log('bonfire: on the sill, button and rim, flare, BONFIRE LIT caption, pylon off and reduced motion all PASS')
} finally {
  await browser.close()
}
