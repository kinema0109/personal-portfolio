/**
 * Renders the link-preview image (public/og-cover.png, 1200x630) from the running site.
 *
 * Social scrapers do not run JavaScript, so the card has to be a real file. This captures the
 * opening frame of the room with the intro text, minus the session chrome (sound toggle, Back /
 * Home), which is meaningless in a still image.
 *
 * Run the dev server, then: node scripts/export-og-image.mjs [url]
 */
import { chromium } from 'playwright'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, locale: 'en-US' })
  await page.goto(url)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addStyleTag({ content: '.topnav, .controls { visibility: hidden !important; }' })
  await page.locator('[data-reference="gran"]').waitFor()
  await page.waitForFunction(() => document.fonts.status === 'loaded')
  await page.waitForTimeout(1200)
  await page.screenshot({ path: 'public/og-cover.png' })
  console.log('wrote public/og-cover.png')
} finally {
  await browser.close()
}
