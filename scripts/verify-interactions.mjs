/**
 * Checks the two ways out of a dead end that the owner asked for:
 * clicking Thọ himself advances the story, and an open panel carries its own Back.
 *
 * Run the dev server, then: node scripts/verify-interactions.mjs [url]
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-US' })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(url)
  await page.waitForTimeout(1200)

  const lines = () => page.locator('.lines').innerText()
  const speaker = page.getByRole('button', { name: 'Keep listening' })

  assert.equal(await speaker.count(), 1, 'Thọ must be clickable while the story can go on')
  const first = await lines()
  await speaker.click()
  await page.waitForTimeout(400)
  const second = await lines()
  assert.notEqual(first, second, 'clicking Thọ must move the story on')

  // On the last step of a node he stops being a click target, rather than doing nothing.
  let guard = 12
  while ((await speaker.count()) && guard--) {
    await speaker.click()
    await page.waitForTimeout(250)
  }
  assert.equal(await speaker.count(), 0, 'Thọ must stop offering himself once the step is the last')

  // An open panel carries its own Back, and it goes back.
  await page.reload()
  await page.waitForTimeout(1200)
  await page.getByRole('button', { name: 'Open CV' }).click()
  await page.waitForTimeout(600)
  assert.ok(await page.locator('#cv-title').count(), 'the CV must open')
  const back = page.locator('.doc-back')
  assert.equal(await back.count(), 1, 'an open panel must carry a Back of its own')
  await back.click()
  await page.waitForTimeout(600)
  assert.equal(await page.locator('#cv-title').count(), 0, 'Back must close the panel')

  // An open panel is the top of the screen stack, so focus belongs inside it.
  await page.getByRole('button', { name: 'Open CV' }).click()
  await page.waitForTimeout(600)
  const focused = await page.evaluate(() => {
    const active = document.activeElement
    return { inPanel: !!active?.closest('.doc'), tag: active?.className || active?.tagName }
  })
  assert.ok(focused.inPanel, `focus must land in the open panel, went to ${focused.tag}`)

  // Escape backs out of it, the same as the panel's own Back.
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)
  assert.equal(await page.locator('#cv-title').count(), 0, 'Escape must close the panel')

  assert.deepEqual(errors, [])
  console.log('interactions: clicking Thọ advances, a panel backs out of itself, and focus lands inside it PASS')
} finally {
  await browser.close()
}
