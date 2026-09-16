import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errors = []
  page.on('pageerror', e => errors.push(e.message))
  await page.goto(process.env.ROOM_URL || 'http://127.0.0.1:5181')
  const portrait = page.locator('.portrait svg')
  assert.equal(await portrait.getAttribute('viewBox'), '0 0 24 24')
  const mouth = page.locator('.f-talk')
  await mkdir('artifacts', { recursive: true })
  for (const [name, time, opacity] of [['closed', 0, '0'], ['open', 120, '1']]) {
    await mouth.evaluate((e, time) => {
      const animation = e.getAnimations()[0]
      if (!animation) throw Error('Missing talking animation')
      animation.pause()
      animation.currentTime = time
    }, time)
    assert.equal(await mouth.evaluate(e => getComputedStyle(e).opacity), opacity)
    const box = await mouth.evaluate(e => {
      const b = e.getBBox(); return { x: b.x, y: b.y, w: b.width, h: b.height }
    })
    assert.deepEqual(box, { x: 10, y: 17, w: 4, h: 2 })
    await page.screenshot({ path: `artifacts/portrait-${name}-1440.png` })
  }
  assert.deepEqual(errors, [])
  console.log('PASS: 24x24 portrait, closed/open animation and aligned mouth bounds')
} finally { await browser.close() }
