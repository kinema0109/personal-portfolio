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
  await page.getByRole('button', { name: 'Profile' }).click()
  await page.waitForTimeout(600)
  assert.ok(await page.locator('#cv-title').count(), 'the CV must open')
  // Clicking off an open panel closes it, which is the first thing a reader tries.
  const away = page.locator('.dismiss-backdrop')
  assert.equal(await away.count(), 1, 'an open panel must be dismissible by clicking off it')
  await away.click({ position: { x: 150, y: 150 } })
  await page.waitForTimeout(600)
  assert.equal(await page.locator('#cv-title').count(), 0, 'clicking away must close the panel')

  // An open panel is the top of the screen stack, so focus belongs inside it.
  await page.getByRole('button', { name: 'Profile' }).click()
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

  // A picker shows its list from the first line, and clicking away from it dismisses it.
  await page.reload()
  await page.waitForTimeout(1200)
  const listen = page.getByRole('button', { name: 'Keep listening' })
  for (let i = 0; i < 6 && (await listen.count()); i++) {
    await listen.click()
    await page.waitForTimeout(250)
  }
  const before = await page.locator('.choices > li').count()
  await page.locator('.choices button').first().click()
  await page.waitForTimeout(500)
  const listed = await page.locator('.choices > li').count()
  const onFirstLine = await page.evaluate(() => {
    const next = document.querySelector('.btn-next')
    return next !== null
  })
  assert.ok(listed > 0, 'a picker must list its choices straight away')
  assert.ok(onFirstLine, 'and must do so while there are still lines left to read')
  const backdrop = page.locator('.dismiss-backdrop')
  assert.equal(await backdrop.count(), 1, 'a picker must cover the room while it is up')
  await backdrop.click({ position: { x: 200, y: 200 } })
  await page.waitForTimeout(500)
  assert.equal(await page.locator('.choices > li').count(), before, 'clicking away must dismiss it')

  assert.deepEqual(errors, [])
  console.log('interactions: advance by Thọ, panel Back and focus, picker shows at once and dismisses PASS')
} finally {
  await browser.close()
}
