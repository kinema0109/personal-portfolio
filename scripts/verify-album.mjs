// Requires local Playwright and Edge; start Vite on 127.0.0.1:5181.
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import assert from 'node:assert/strict'
const browser = await chromium.launch({channel:'msedge', headless:true})
const errors = []
const approvedFiles = ['01-storm-castle.webp', '03-golden-field.webp', '04-fractured-world.webp', '05-starlit-rest-v2.webp', '06-rain-confrontation.webp', '07-white-haired-portrait.webp', '08-cradle.webp', '09-garden-reunion.webp', '10-group-portrait.webp', '11-artanis.webp', '12-frozen-duel-selected.webp', '13-bedside.webp', '14-resting-blades.webp', '15-golden-warrior.webp', '16-crimson-knight.webp', '17-held-hand.webp', '18-red-core.webp', '19-nagash.webp', '20-battlefield-duel.webp']
approvedFiles.push('21-vs-hector.webp', '22-moon-lord.webp', '23-monika.webp', '24-radiance.webp', '25-dante-vergil.webp', '26-reaching-sky.webp')
const counter = index => `${String(index + 1).padStart(2, '0')} / ${String(approvedFiles.length).padStart(2, '0')}`
await mkdir('artifacts', {recursive:true})
try {
  for (const locale of ['en']) {
    for (const [size,width,height] of [['desktop',1440,900], ['phone',390,844], ['landscape',844,390]]) {
      const page = await browser.newPage({viewport:{width,height}, reducedMotion:'reduce'})
      page.on('pageerror', e => errors.push(e.message))
      await page.addInitScript(l => localStorage.setItem('tho-vn:locale',l), locale)
      await page.goto('http://127.0.0.1:5181')
      const opener = page.getByRole('button', {name:{vi:'Mở album',en:'Open Game Gallery',ja:'アルバムを開く'}[locale],exact:true})
      const open = async () => {
        await opener.click()
        await page.locator('.album-viewer[open]').waitFor()
        assert.equal(await page.locator('.album-number').innerText(), counter(0))
      }
      await open()
      assert.equal(await page.locator('#album-title').innerText(), 'Game Gallery')
      const source = await page.locator('.album-art img').getAttribute('src')
      await page.keyboard.press('ArrowLeft')
      assert.equal(await page.locator('.album-art img').getAttribute('src'),source)
      // Facebook-style halves: the right half goes on, the left half goes back, neither passes an end,
      // and a horizontal drag works like a swipe.
      const art = await page.locator('.album-art').boundingBox()
      const tap = side => page.mouse.click(art.x + art.width * (side === 'right' ? 0.8 : 0.2), art.y + art.height / 2)
      const page_ = () => page.locator('.album-number').innerText()
      await tap('left'); assert.equal(await page_(), counter(0))
      await tap('right'); assert.equal(await page_(), counter(1))
      await tap('left'); assert.equal(await page_(), counter(0))
      await page.mouse.move(art.x + art.width * 0.6, art.y + art.height / 2)
      await page.mouse.down()
      await page.mouse.move(art.x + art.width * 0.3, art.y + art.height / 2, {steps:5})
      await page.mouse.up()
      assert.equal(await page_(), counter(1), 'a leftward drag goes to the next picture')
      await page.keyboard.press('ArrowLeft')
      assert.equal(await page_(), counter(0))
      for(let i=0;i<approvedFiles.length;i++) {
        await page.locator('.album-art img').evaluate(img => img.decode())
        assert.equal(await page.locator('.album-number').innerText(), counter(i))
        assert((await page.locator('.album-art img').getAttribute('src')).endsWith('/' + approvedFiles[i]))
        const geometry = await page.locator('.album-viewer').evaluate(d => {
          const img=d.querySelector('img').getBoundingClientRect()
          const next=d.querySelector('.album-next').getBoundingClientRect()
          return {imgHeight:img.height, nextBottom:next.bottom, viewport:innerHeight, overflow:d.scrollHeight>d.clientHeight+1, focused:d.contains(document.activeElement)}
        })
        assert(geometry.imgHeight>60 && geometry.nextBottom<=height && !geometry.overflow && geometry.focused,JSON.stringify(geometry))
        assert.equal(await page.locator('.album-art img').evaluate(img => getComputedStyle(img).objectFit), 'contain')
        await page.screenshot({path:`artifacts/album-${size}-${i+1}.png`})
        if(i<approvedFiles.length-1) await page.locator('.album-next').click()
      }
      await page.keyboard.press('ArrowRight')
      assert.equal(await page.locator('.album-number').innerText(), counter(approvedFiles.length - 1))
      await tap('right')
      assert.equal(await page_(), counter(approvedFiles.length - 1), 'the right half does nothing on the last picture')
      assert.equal(await page.locator('dialog[open]').count(), 1)
      await page.locator('.album-next').click()
      assert.equal(await page.locator('dialog[open]').count(),0)
      // Escape is available at every point, and reopening restarts at page one.
      for(let i=0;i<approvedFiles.length;i++) {
        await open()
        for(let j=0;j<i;j++) await page.keyboard.press('ArrowRight')
        await page.keyboard.press('Escape')
        assert.equal(await page.locator('dialog[open]').count(),0)
      }
      await open()
      await page.locator('.album-close').click()
      assert.equal(await page.locator('dialog[open]').count(),0)
      await page.close()
      console.log(`PASS ${locale} ${size}: ${approvedFiles.length} images in exact order, finish, boundaries, Escape on every page, close, focus, fit`)
    }
  }
  assert.deepEqual(errors,[])
} finally { await browser.close() }
