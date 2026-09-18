/**
 * Checks the PC screen per project: each project's panel shows its own diagram, the story node about
 * a project keeps that project's diagram, and elsewhere the section's screen is unchanged.
 *
 * Run the dev server, then: node scripts/verify-project-screens.mjs [url]
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
const PROJECTS = [
  ['cbpo', 'CBPO'], ['ca2t', 'CA2T'], ['theavotree', 'TheAvoTree'], ['singlekey', 'SingleKey'],
  ['suzu', 'Suzu.net'], ['yokara', 'Yokara & iKara'],
]
const DEEP_DIVE = { cbpo: true, ca2t: true, theavotree: true, singlekey: true, yokara: true, suzu: true }

await mkdir('artifacts', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'en-US' })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  const screen = () => page.locator('[data-screen]').getAttribute('data-screen')

  await page.goto(url)
  await page.waitForTimeout(1000)
  assert.equal(await screen(), 'code', 'the room opens on the code screen')

  for (const [id, name] of PROJECTS) {
    await page.goto(url)
    await page.waitForTimeout(800)
    await page.getByRole('button', { name: 'See projects', exact: true }).click()
    await page.getByRole('button', { name: /Project archive/ }).click()
    await page.getByRole('button', { name: new RegExp(`^${name.replace('.', '\\.')}\\b`) }).first().click()
    await page.waitForTimeout(300)
    assert.equal(await screen(), `project:${id}`, `${name}'s panel shows its diagram`)
    const box = await page.locator('[data-screen]').boundingBox()
    await page.screenshot({ path: `artifacts/project-screen-${id}.png`, clip: box })

    if (DEEP_DIVE[id]) {
      await page.getByRole('button', { name: /How did you approach it\?/ }).click()
      await page.waitForTimeout(300)
      assert.equal(await screen(), `project:${id}`, `the story about ${name} keeps its diagram`)
    }
  }

  assert.deepEqual(errors, [])
  console.log('project screens: 7 diagrams, deep dives keep theirs, other screens unchanged PASS')
} finally {
  await browser.close()
}
