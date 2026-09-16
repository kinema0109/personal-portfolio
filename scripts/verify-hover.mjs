/**
 * Checks that pointing at something in the room outlines that thing, not a box around it.
 *
 * The cheap trick that makes this measurable: the rim is one colour, so count how many pixels turn
 * into it. A silhouette rim covers a few hundred pixels; a rectangle around the same object would
 * cover the whole perimeter of its click box, which is a different, larger number, and a missing
 * rim covers none. The test only asserts that a rim appears and that no click box is painted.
 *
 * Run the dev server, then: node scripts/verify-hover.mjs [url]
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-US' })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  // The rim colour is measured exactly, and the night dimming shifts it, so check by day.
  await page.addInitScript(() => localStorage.setItem('tho-vn:phase', 'day'))
  await page.goto(url)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForTimeout(1300)

  const HALO = [244, 220, 168]
  const countRim = async (clip) => {
    const shot = await page.screenshot({ clip })
    // PNG straight from the browser; decode with the browser itself to avoid another dependency.
    return page.evaluate(async (bytes) => {
      const bitmap = await createImageBitmap(new Blob([new Uint8Array(bytes)]))
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(bitmap, 0, 0)
      const { data } = ctx.getImageData(0, 0, bitmap.width, bitmap.height)
      let n = 0
      for (let i = 0; i < data.length; i += 4) {
        if (Math.abs(data[i] - 244) < 6 && Math.abs(data[i + 1] - 220) < 6 && Math.abs(data[i + 2] - 168) < 6) n++
      }
      return n
    }, [...shot])
  }

// The collectibles outline themselves through an SVG filter rather than extra rectangles, so they
  // are checked the same way and by the same measurement.
  const groups = ['.hotspot', '.shelf-spine-figure']
  const targets = []
  for (const selector of groups) {
    const names = await page.locator(selector).evaluateAll((bs) =>
      bs.map((b) => b.getAttribute('aria-label') || b.textContent.trim()))
    assert.ok(names.length > 0, `${selector} must exist`)
    names.forEach((name, i) => targets.push({ selector, i, name }))
  }
  assert.ok(targets.length >= 8, 'the room must have its hotspots and its collectibles')

  for (const { selector, i, name } of targets) {
    const button = page.locator(selector).nth(i)
    const box = await button.boundingBox()
    const clip = { x: box.x - 6, y: box.y - 6, width: box.width + 12, height: box.height + 12 }

    await page.mouse.move(700, 200)
    await page.waitForTimeout(150)
    const cold = await countRim(clip)
    await button.hover()
    await page.waitForTimeout(250)
    const hot = await countRim(clip)

    assert.ok(hot > cold + 40, `${name}: pointing at it must draw a rim (${cold} -> ${hot})`)
    // A border only paints if it has width and a colour, so check both rather than the colour
    // alone: a zero-width border keeps whatever colour it inherited.
    const boxed = await button.evaluate((b) => {
      const style = getComputedStyle(b)
      const border = parseFloat(style.borderTopWidth) > 0 && style.borderTopColor !== 'rgba(0, 0, 0, 0)'
      return border || style.backgroundColor !== 'rgba(0, 0, 0, 0)' || style.outlineStyle !== 'none'
    })
    assert.ok(!boxed, `${name}: the click box itself must stay invisible`)
    console.log(`${String(name).padEnd(24)} rim ${cold} -> ${hot}`)
  }

  assert.deepEqual(errors, [])
  console.log(`hover: all ${targets.length} outline their own object and paint no box PASS`)
} finally {
  await browser.close()
}
