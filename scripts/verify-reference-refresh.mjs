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
    for (const kind of ['alhazard', 'langrisser', 'gran', 'armageddon', 'seer', 'alpha']) {
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
    // The Master Ball is drawn in code, so it has no image to decode.
    for (const kind of ['master-ball']) {
      const figure = page.locator(`[data-figure="${kind}"]`)
      assert.equal(await figure.count(), 1, `${kind} must be displayed`)
      const fits = await figure.evaluate((e) => {
        const box = e.getBoundingClientRect()
        return box.width > 0 && box.top >= document.querySelector('.topbar').getBoundingClientRect().bottom
          && box.bottom <= document.querySelector('.dialogue').getBoundingClientRect().top
      })
      assert.ok(fits, `${kind} must fit the room`)
    }
    // Both rows are sized to fill their compartment with one unit of backing at each end. Adding a
    // game or a book, or changing a spine width, silently breaks that, so it is measured here.
    const scene = await page.locator('.scene-art svg, .scene svg').first()
      .evaluate((svg) => {
        const [vx, , vw] = svg.getAttribute('viewBox').trim().split(' ').map(Number)
        const box = svg.getBoundingClientRect()
        return { left: box.left, scale: box.width / vw, origin: vx }
      })
    const toScreen = (unit) => scene.left + (unit - scene.origin) * scene.scale
    for (const [row, selector, from, to] of [
      ['Fire Emblem', '[data-shelf="fire-emblem"] rect', 307, 383],
      ['the book shelf', '[data-shelf="limbus-books"] rect', 307, 343],
    ]) {
      const edges = await page.locator(selector).evaluateAll((rs) => {
        const boxes = rs.map((r) => r.getBoundingClientRect())
        return { left: Math.min(...boxes.map((b) => b.left)), right: Math.max(...boxes.map((b) => b.right)) }
      })
      const leftGap = edges.left - toScreen(from)
      const rightGap = toScreen(to) - edges.right
      assert.ok(
        Math.abs(leftGap - rightGap) <= scene.scale * 0.6 && leftGap > 0 && leftGap < scene.scale * 2.5,
        `${row} must fill its compartment evenly (gaps ${leftGap.toFixed(1)} and ${rightGap.toFixed(1)} px)`,
      )
    }

    await page.screenshot({ path: `artifacts/reference-refresh-${width}.png` })
    for (const [label, panel] of [['Profile', '#cv-title'], ['Open Game Gallery', '.album-viewer[open]']]) {
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
