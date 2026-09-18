/**
 * Checks every case study step in a real browser: the case panel and its diagram are shown, the lit
 * blocks are exactly that step's focus, the result chips appear only on the last step, and the PC
 * screen shows the story's project. Also checks the CBPO picker, the way back to it, and that CA2T's
 * "How did you approach it?" still reaches the role-based access control deep dive.
 *
 * Run the dev server, then: node scripts/verify-case-studies.mjs [url]
 * Saves artifacts/case-<id>.png of each story's last step.
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'
import { CASES, CASE_IDS } from '../src/content/caseDiagrams.ts'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
/** How each story is reached: the project to open, and for a CBPO sub-story the picker label. */
const ROUTES = {
  cbpo: ['CBPO', null],
  'cbpo-migration': ['CBPO', 'Moving MongoDB off Atlas'],
  'cbpo-mcp': ['CBPO', 'An MCP server for AI agents'],
  'cbpo-cicd': ['CBPO', 'One deploy pipeline'],
  'cbpo-shipping': ['CBPO', 'Carriers and label printing'],
  avotree: ['TheAvoTree', null],
  singlekey: ['SingleKey', null],
  yokara: ['Yokara & iKara', null],
  suzu: ['Suzu.net', null],
}
const CBPO_PICKS = Object.values(ROUTES).map(([, pick]) => pick).filter(Boolean)

await mkdir('artifacts', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'en-US' })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  const screen = () => page.locator('[data-screen]').getAttribute('data-screen')
  const next = () => page.getByRole('button', { name: /^Next/ }).click()
  const choice = (label) => page.getByRole('button', { name: new RegExp(label.replace(/[.?]/g, '\\$&')) })

  async function openApproach(name) {
    await page.goto(url)
    await page.waitForTimeout(800)
    await page.getByRole('button', { name: 'See projects', exact: true }).click()
    await page.getByRole('button', { name: /Project archive/ }).click()
    await page.getByRole('button', { name: new RegExp(`^${name}\\b`) }).first().click()
    await page.waitForTimeout(200)
    await choice('How did you approach it?').click()
    await page.waitForTimeout(300)
  }

  async function assertCbpoPicker() {
    await choice(CBPO_PICKS[0]).first().waitFor({ timeout: 3000 }).catch(() => {})
    for (const pick of CBPO_PICKS) assert.equal(await choice(pick).count(), 1, `the CBPO picker offers "${pick}"`)
    assert.equal(await page.locator('.choices button').count(), 4, 'the CBPO picker lists 4 stories')
  }

  for (const id of CASE_IDS) {
    const [name, pick] = ROUTES[id]
    const { focus, diagram, projectId } = CASES[id]
    await openApproach(name)
    if (pick) {
      await next()
      await page.waitForTimeout(300)
      await assertCbpoPicker()
      await choice(pick).click()
      await page.waitForTimeout(300)
    }
    const blockIds = new Set(diagram.blocks.map((b) => b.id))
    for (let step = 0; step < focus.length; step++) {
      await page.waitForTimeout(300)
      assert.equal(await page.locator('.case-study').count(), 1, `${id} step ${step + 1}: the case panel is shown`)
      assert.equal(await page.locator('.case-diagram').count(), 1, `${id} step ${step + 1}: the diagram is drawn`)
      const lit = await page.locator('[data-block][data-focus]').evaluateAll((els) => els.map((e) => e.dataset.block))
      const want = focus[step].filter((f) => blockIds.has(f))
      assert.deepEqual([...lit].sort(), [...want].sort(), `${id} step ${step + 1}: the lit blocks are the step's focus`)
      const last = step === focus.length - 1
      const hasChips = (await page.locator('.case-chips').count()) > 0
      assert.equal(hasChips, last && id !== 'cbpo', `${id} step ${step + 1}: chips only on the last step`)
      assert.equal(await screen(), `project:${projectId}`, `${id} step ${step + 1}: the PC shows ${projectId}`)
      if (last) {
        // Let the chips' stagger finish before the picture.
        await page.waitForTimeout(500)
        await page.locator('.doc').screenshot({ path: `artifacts/case-${id}.png` })
      } else {
        await next()
      }
    }
    if (id === 'cbpo') {
      await assertCbpoPicker()
    } else if (id.startsWith('cbpo-')) {
      await choice('Another part of CBPO').click()
      await page.waitForTimeout(300)
      assert.equal(await page.locator('.case-study').count(), 1, `${id}: back at the CBPO intro, with its diagram`)
      // The intro's last step holds the picker.
      await next()
      await page.waitForTimeout(300)
      await assertCbpoPicker()
    }
  }

  await openApproach('CA2T')
  assert.equal(await page.locator('.case-study').count(), 0, 'CA2T tells its deep dive without a case panel')
  assert.match(await page.locator('.lines').innerText(), /CA2T is a learning management system/, 'CA2T reaches the RBAC deep dive')

  assert.deepEqual(errors, [])
  console.log(`case studies: ${CASE_IDS.length} stories, every step lit as planned, CBPO picker and CA2T deep dive PASS`)
} finally {
  await browser.close()
}
