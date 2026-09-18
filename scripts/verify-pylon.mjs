/**
 * Checks the pylon under the desk, the room's power.
 *
 * Off: everything electric stops (screen, tower lights, fan, ceiling bulb) and Thọ's caption shows,
 * wholly on screen. The story stays on screen but is inert: its buttons, Thọ and the story shortcuts
 * do nothing. Only the PC needs power, so the album and the drawer still open and close. The camera
 * does not move.
 * Warp in: the warp plays, a second click is ignored, and everything comes back. Under reduced motion
 * power returns at once.
 *
 * Run the dev server, then: node scripts/verify-pylon.mjs [url]
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
const LINE = 'You must construct additional pylons.'
await mkdir('artifacts', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const errors = []

/** Where the story is: the lines on show, the choices offered and whether a panel is open. */
const storyAt = (page) =>
  page.evaluate(() => ({
    lines: document.querySelector('#dialogue .lines')?.textContent,
    choices: document.querySelectorAll('.choice').length,
    panel: document.querySelectorAll('.doc').length,
  }))

const viewBox = (page) => page.locator('svg[viewBox]').first().getAttribute('viewBox')

/** Keys go to the page, not to the pylon button that was just clicked. */
const blur = (page) => page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur())

/** Clicks where an element is drawn, bypassing Playwright's own checks, the way a visitor would. */
async function clickAt(page, locator) {
  const box = await locator.boundingBox()
  assert.ok(box, 'the element is drawn')
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
}

/** Asserts the caption shows its line and lies wholly inside the viewport, 8 px clear of each side. */
async function captionOnScreen(page, width, height) {
  const caption = page.locator('.pylon-line')
  await caption.filter({ hasText: LINE }).waitFor()
  const box = await caption.boundingBox()
  assert.ok(box, 'the caption is drawn')
  assert.ok(box.x >= 8 - 0.5 && box.x + box.width <= width - 8 + 0.5, `caption x ${box.x}–${box.x + box.width} fits ${width} px`)
  assert.ok(box.y >= 0 && box.y + box.height <= height, `caption y ${box.y}–${box.y + box.height} fits ${height} px`)
  return box
}

try {
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-US' })
    page.on('pageerror', (e) => errors.push(e.message))
    await page.addInitScript(() => localStorage.setItem('tho-vn:phase', 'day'))
    await page.goto(url)
    await page.waitForTimeout(1200)

    const pylon = page.locator('[data-pylon]')
    const dialogue = page.locator('#dialogue')
    assert.equal(await pylon.getAttribute('data-pylon'), 'on')
    assert.equal(await page.locator('.hud').count(), 1, 'the visual novel is up with power on')
    assert.equal(await dialogue.getAttribute('inert'), null, 'the story works with power on')
    assert.ok((await page.locator('.f-dot-1').count()) > 0, 'Thọ is speaking at the start')
    assert.equal(await page.locator('.btn-next').count(), 1, 'the first step has a Next button')
    assert.equal(await page.locator('.pylon-line').textContent(), '', 'the caption region is mounted and quiet')
    const camera = await viewBox(page)

    // Power down.
    await page.getByRole('button', { name: 'Power down the pylon' }).click()
    const offAt = Date.now()
    assert.equal(await pylon.getAttribute('data-pylon'), 'off')
    await captionOnScreen(page, 1440, 900)
    await page.waitForTimeout(300)
    assert.equal(await viewBox(page), camera, 'the camera does not move when the power goes')

    assert.equal(await page.locator('.hud').count(), 1, 'the HUD stays on screen')
    assert.equal(await dialogue.getAttribute('inert'), '', 'the dialogue box is inert')
    assert.equal(await dialogue.evaluate((e) => getComputedStyle(e).opacity), '0.5', 'the dialogue box is dimmed')
    assert.equal(await page.getByRole('button', { name: 'See projects' }).count(), 0, 'the PC needs power')
    assert.equal(await page.getByRole('button', { name: 'Keep listening' }).count(), 0, 'Thọ cannot be clicked on')
    assert.equal(await page.getByRole('button', { name: 'Games Gallery' }).count(), 1, 'the album still opens')
    assert.equal(await page.getByRole('button', { name: 'Profile' }).count(), 1, 'the drawer still opens')
    assert.equal(await page.locator('[data-screen]').getAttribute('data-screen'), 'off', 'the PC screen is off')
    assert.equal(await page.locator('.f-rgb-a').count(), 0, 'the tower lights are off')
    assert.equal(await page.locator('[data-fan]').getAttribute('data-fan'), 'off', 'the fan stops')
    assert.equal(await page.locator('rect[x="176"][y="2"]').getAttribute('fill'), '#3a3a44', 'the ceiling bulb is out')
    assert.equal(await page.locator('path[d^="M154 -8"]').count(), 0, 'the bulb casts no light')
    assert.equal(await page.locator('.f-dot-1').count(), 0, 'no speech bubble without power')

    // The fan cannot be switched without power.
    const fan = page.getByRole('button', { name: 'Desk fan: off' })
    assert.equal(await fan.count(), 1, 'the fan says it is off')
    await fan.click()
    assert.equal(await page.locator('[data-fan]').getAttribute('data-fan'), 'off', 'a click does not start the fan')

    // Nothing moves the story: shortcuts, the Next button where it is drawn, Esc with no panel open.
    const before = await storyAt(page)
    await blur(page)
    for (const key of ['Enter', 'Space', '1', 'Escape']) {
      await page.keyboard.press(key)
      await page.waitForTimeout(100)
      assert.deepEqual(await storyAt(page), before, `${key} does nothing with the power off`)
    }
    await clickAt(page, page.locator('.btn-next'))
    await page.waitForTimeout(150)
    assert.deepEqual(await storyAt(page), before, 'the Next button does nothing with the power off')
    assert.equal(await pylon.getAttribute('data-pylon'), 'off')
    await page.mouse.move(700, 300)
    await page.screenshot({ path: 'artifacts/pylon-off.png' })

    // The drawer still opens the CV, and Esc closes it.
    await page.getByRole('button', { name: 'Profile' }).click()
    await page.locator('#cv-title').waitFor()
    await page.keyboard.press('Escape')
    await page.locator('#cv-title').waitFor({ state: 'detached' })
    // And clicking off the panel closes it too.
    await page.getByRole('button', { name: 'Profile' }).click()
    await page.locator('#cv-title').waitFor()
    await page.locator('.dismiss-backdrop').click({ position: { x: 20, y: 200 } })
    await page.locator('#cv-title').waitFor({ state: 'detached' })
    assert.deepEqual(await storyAt(page), before, 'closing the CV leaves the story where it was')

    // The album still opens the gallery, and closes.
    await page.getByRole('button', { name: 'Games Gallery' }).click()
    await page.locator('.album-viewer[open]').waitFor()
    await page.locator('.album-close').click()
    await page.locator('.album-viewer[open]').waitFor({ state: 'detached' })
    assert.equal(await dialogue.getAttribute('inert'), '', 'the story is still inert after the panels')

    // The caption goes after about three seconds.
    await page.waitForTimeout(Math.max(0, 3200 - (Date.now() - offAt)))
    assert.equal(await page.locator('.pylon-line').textContent(), '', 'the caption is gone after ~3 s')
    assert.equal(await page.locator('.pylon-line').count(), 1, 'its live region stays mounted')

    // Warp in; a second click during the warp is ignored.
    const warp = page.getByRole('button', { name: 'Warp in the pylon' })
    await warp.click()
    const warpAt = Date.now()
    assert.equal(await pylon.getAttribute('data-pylon'), 'warping')
    assert.equal(await page.locator('.f-warp').count(), 1, 'the warp plays')
    await page.waitForTimeout(300)
    // A plain mouse click: Playwright's own would wait for the aria-disabled button to become enabled.
    await clickAt(page, warp)
    assert.equal(await pylon.getAttribute('data-pylon'), 'warping', 'a click during the warp is ignored')
    await page.waitForTimeout(400)
    await page.screenshot({ path: 'artifacts/pylon-warping.png' })
    await page.waitForFunction(() => document.querySelector('[data-pylon]')?.dataset.pylon === 'on', null, { timeout: 3000 })
    const warpMs = Date.now() - warpAt
    assert.ok(warpMs < 2100, `power returns ~1.5 s after the first click, not the second (took ${warpMs} ms)`)

    assert.equal(await dialogue.getAttribute('inert'), null, 'the story works again')
    assert.equal(await page.getByRole('button', { name: 'See projects' }).count(), 1, 'the PC is back')
    assert.notEqual(await page.locator('[data-screen]').getAttribute('data-screen'), 'off')
    assert.equal(await viewBox(page), camera, 'the camera does not move when the power returns')
    await blur(page)
    await page.keyboard.press('Enter')
    await page.waitForTimeout(150)
    assert.notDeepEqual(await storyAt(page), before, 'Enter advances the story again')
    await page.screenshot({ path: 'artifacts/pylon-on.png' })
    await page.close()
  }

  // Reduced motion: no warp, power at once. The choices are inert while the power is off too.
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-US', reducedMotion: 'reduce' })
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto(url)
    await page.waitForTimeout(800)
    for (let i = 0; i < 10 && (await page.locator('.btn-next').count()) > 0; i++) await page.locator('.btn-next').click()
    assert.ok((await page.locator('.choice').count()) > 0, 'the choices are up')

    await page.getByRole('button', { name: 'Power down the pylon' }).click()
    assert.equal(await page.locator('.choice-menu').getAttribute('inert'), '', 'the choice menu is inert')
    const before = await storyAt(page)
    await blur(page)
    await page.keyboard.press('1')
    await clickAt(page, page.locator('.choice').first())
    await page.waitForTimeout(150)
    assert.deepEqual(await storyAt(page), before, 'no choice can be taken with the power off')

    await page.getByRole('button', { name: 'Warp in the pylon' }).click()
    assert.equal(await page.locator('.f-warp').count(), 0, 'no warp under reduced motion')
    assert.equal(await page.locator('[data-pylon]').getAttribute('data-pylon'), 'on', 'power returns at once')
    assert.equal(await page.locator('.choice-menu').getAttribute('inert'), null)
    await page.close()
  }

  // Phones: the caption stays wholly on screen.
  for (const [width, height] of [[390, 844], [320, 640]]) {
    const page = await browser.newPage({ viewport: { width, height }, locale: 'en-US', hasTouch: true, isMobile: true })
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto(url)
    await page.waitForTimeout(1200)
    await page.getByRole('button', { name: 'Power down the pylon' }).click()
    const box = await captionOnScreen(page, width, height)
    assert.equal(await page.locator('.hud').count(), 1)
    await page.screenshot({ path: `artifacts/pylon-off-${width}.png` })
    console.log(`${width}x${height}: caption at x ${Math.round(box.x)}–${Math.round(box.x + box.width)}, y ${Math.round(box.y)}–${Math.round(box.y + box.height)}`)
    await page.close()
  }

  assert.deepEqual(errors, [])
  console.log('pylon: power down stops the electrics and disables the story but not the album or CV, warp-in restores it, reduced motion skips the warp, the caption stays on screen PASS')
} finally {
  await browser.close()
}
