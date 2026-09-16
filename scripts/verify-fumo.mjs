import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  await mkdir('artifacts', { recursive: true })
  for (const [width, height] of [[390,844], [844,390], [768,1024], [1440,900], [2560,1440]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' })
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
    page.on('requestfailed', r => errors.push(r.url()))
    page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`) })
    await page.goto(process.env.ROOM_URL || 'http://127.0.0.1:5181', { waitUntil: 'networkidle' })
    const bounds = await page.locator('[data-fumo]').evaluateAll(elements => elements.map(e => {
      const b = e.getBBox(), r = e.getBoundingClientRect()
      return { x:b.x, y:b.y, w:b.width, h:b.height, visible:r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight }
    }))
    assert.equal(bounds.length, 2)
    for (const b of bounds) {
      assert.ok(b.x >= 346 && b.x + b.w <= 383)
      assert.equal(b.y + b.h, 66)
      assert.ok(b.y >= 21 && b.visible)
    }
    assert.ok(bounds[0].x + bounds[0].w <= bounds[1].x)
    assert.deepEqual(errors, [])
    await page.screenshot({ path: `artifacts/fumo-${width}.png` })
    console.log(`PASS ${width}x${height}: both plushes visible, shelf bounds, no overlap or errors`)
    await page.close()
  }
} finally { await browser.close() }
