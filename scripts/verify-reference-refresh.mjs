import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  const page = await browser.newPage({ locale: 'en-US' })
  const errors = []
  page.on('pageerror', e => errors.push(e.message))
  await mkdir('artifacts', { recursive: true })
  for (const [width, height] of [[1440, 900], [1920, 1080]]) {
    await page.setViewportSize({ width, height })
    await page.goto(process.env.ROOM_URL || 'http://127.0.0.1:5181')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.locator('[data-reference="gran"]').waitFor()
    // Catches a missing replacement, broken asset URL, or sprite clipped by the UI.
    for (const kind of ['alhazard', 'langrisser', 'gran', 'seer', 'alpha', 'armageddon', 'master-ball']) {
      const ref = page.locator(`[data-reference="${kind}"]`)
      assert.equal(await ref.count(), 1, `${kind} must be displayed`)
      const result = await ref.evaluate(async e => {
        const image = e.tagName.toLowerCase() === 'image' ? e : e.querySelector('image')
        const bitmap = new Image()
        bitmap.src = image.getAttribute('href')
        await bitmap.decode()
        const box = e.getBoundingClientRect()
        return { width: bitmap.width, visible: box.left >= 0 && box.right <= innerWidth && box.top >= document.querySelector('.topbar').getBoundingClientRect().bottom && box.bottom <= document.querySelector('.dialogue').getBoundingClientRect().top }
      })
      assert.ok(result.width > 0 && result.visible, `${kind} must load and fit the room`)
    }
    await page.screenshot({ path: `artifacts/reference-refresh-${width}.png` })
    for (const [label, panel] of [['Open CV', '#cv-title'], ['Open album', '.album-viewer[open]']]) {
      await page.goto(process.env.ROOM_URL || 'http://127.0.0.1:5181')
      await page.getByRole('button', { name: label, exact: true }).click()
      await page.locator(panel).waitFor()
    }
    console.log(`${width}x${height}: assets, room bounds, CV and album PASS`)
  }
  assert.deepEqual(errors, [])
} finally {
  await browser.close()
}
