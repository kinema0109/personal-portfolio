import { chromium } from 'playwright'
// Local QA utility: npm install --no-save --package-lock=false playwright
// Run the Vite server on 127.0.0.1:5179 before executing this file.
// Needs the locked reference images in public/references/locked/ (kept out of git).
import { mkdir } from 'node:fs/promises'
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ locale: 'en-US' })
const errors = []
page.on('pageerror', error => errors.push(error.message))
await mkdir('artifacts', { recursive: true })
for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844], ['landscape', 844, 390]]) {
  await page.setViewportSize({ width, height })
  await page.goto('http://127.0.0.1:5179')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForTimeout(600)
  await page.screenshot({ path: `artifacts/room-${name}.png` })
  const checks = await page.evaluate(() => {
    const refs = [...document.querySelectorAll('[data-reference]')].map(e => {
      const box = e.getBoundingClientRect()
      return { name: e.getAttribute('data-reference'), box }
    })
    const top = document.querySelector('.topbar').getBoundingClientRect().bottom
    const bottom = document.querySelector('.dialogue').getBoundingClientRect().top
    return {
      refs: refs.map(r => ({ name: r.name, visible: r.box.left >= 0 && r.box.right <= innerWidth && r.box.top >= top && r.box.bottom <= bottom })),
      shelfSpines: document.querySelectorAll('.shelf-spine').length,
      overflow: document.documentElement.scrollWidth > innerWidth,
    }
  })
  if (checks.overflow || checks.refs.some(r => !r.visible)) throw Error(`${name}: ${JSON.stringify(checks)}`)
  // Destinations are discovered through room hotspots; there is no top navigation.
  for (const [label, panel] of [['See projects', null], ['Profile', '#cv-title'], ['Open album', '.album-viewer[open]']]) {
    await page.goto('http://127.0.0.1:5179')
    await page.getByRole('button', { name: label, exact: true }).click()
    if (panel) await page.locator(panel).waitFor()
  }
  console.log(name, JSON.stringify(checks))
}
await browser.close()
if (errors.length) throw Error(errors.join('\n'))
