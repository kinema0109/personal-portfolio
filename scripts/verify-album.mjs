// Requires local Playwright and Edge; start Vite on 127.0.0.1:5181.
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import assert from 'node:assert/strict'
const browser = await chromium.launch({channel:'msedge', headless:true})
const errors = []
const approvedFiles = ['01-storm-castle.png', '03-golden-field.png', '04-fractured-world.png', '05-starlit-rest-v2.png', '06-rain-confrontation.png', '07-white-haired-portrait.png', '08-cradle.png', '09-garden-reunion.png', '10-group-portrait.png', '11-artanis.png', '12-frozen-duel-selected.png', '13-bedside.png', '14-resting-blades.png', '15-golden-warrior.png', '16-crimson-knight.png', '17-held-hand.png', '18-red-core.png', '19-nagash.png', '20-sunset-archer.png']
const counter = index => `${String(index + 1).padStart(2, '0')} / ${String(approvedFiles.length).padStart(2, '0')}`
await mkdir('artifacts', {recursive:true})
try {
  for (const locale of ['en']) {
    for (const [size,width,height] of [['desktop',1440,900], ['phone',390,844], ['landscape',844,390]]) {
      const page = await browser.newPage({viewport:{width,height}, reducedMotion:'reduce'})
      page.on('pageerror', e => errors.push(e.message))
      await page.addInitScript(l => localStorage.setItem('tho-vn:locale',l), locale)
      await page.goto('http://127.0.0.1:5181')
      const opener = page.getByRole('button', {name:{vi:'Mở album',en:'Open album',ja:'アルバムを開く'}[locale],exact:true})
      const open = async () => {
        await opener.click()
        await page.locator('.album-viewer[open]').waitFor()
        assert.equal(await page.locator('.album-number').innerText(), counter(0))
      }
      await open()
      const source = await page.locator('.album-art img').getAttribute('src')
      await page.keyboard.press('ArrowLeft')
      assert.equal(await page.locator('.album-art img').getAttribute('src'),source)
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
