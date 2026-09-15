// Exports the five personal references as transparent PNGs in public/art/derived/, cropped and silhouette-clipped
// exactly as the room used to do at runtime, so production does not need the owner's untouched screenshot.
//
//   npm install --no-save --package-lock=false playwright   (Edge is used as the renderer)
//   node scripts/export-derived-references.mjs
//
// Reads src/art/referenceData.ts (via a tiny TS strip) and public/references/locked/approved-room-screenshot.png,
// which stays out of git. Never modifies anything in public/references/locked/.
import { chromium } from 'playwright'
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const dataSource = await readFile(new URL('../src/art/referenceData.ts', import.meta.url), 'utf8')
// The data module is plain object literals plus type annotations; strip the types and evaluate it as JS.
const js = dataSource
  .replace(/^export type[\s\S]*?\n\n/m, '')
  .replace(/^export interface[\s\S]*?\n}\n/m, '')
  .replace('export const REFERENCES: Record<ReferenceKind, ReferenceCrop> =', 'export const REFERENCES =')
  .replace(/ as const/g, '')
const { REFERENCES, SOURCE_SCREENSHOT, SOURCE_SIZE } = await import(
  `data:text/javascript;base64,${Buffer.from(js).toString('base64')}`
)

const sourceFile = new URL(`../public/${SOURCE_SCREENSHOT}`, import.meta.url)
const source = await readFile(sourceFile)
const outDir = new URL('../public/art/derived/', import.meta.url)
await mkdir(outDir, { recursive: true })

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage()
await page.setContent('<!doctype html><title>export</title>')

const results = []
for (const [kind, ref] of Object.entries(REFERENCES)) {
  const dataUrl = await page.evaluate(
    async ({ png, ref, size }) => {
      const img = new Image()
      img.src = `data:image/png;base64,${png}`
      await img.decode()
      if (img.naturalWidth !== size.w || img.naturalHeight !== size.h) throw new Error(`source is ${img.naturalWidth}×${img.naturalHeight}, expected ${size.w}×${size.h}`)
      const c = document.createElement('canvas')
      c.width = ref.w
      c.height = ref.h
      const g = c.getContext('2d')
      g.imageSmoothingEnabled = false
      // Clip to the union of silhouette polygons (translated into crop space), then draw the crop.
      g.beginPath()
      for (const poly of ref.silhouette) {
        const pts = poly.split(' ').map((p) => p.split(',').map(Number))
        pts.forEach(([x, y], i) => (i ? g.lineTo(x - ref.x, y - ref.y) : g.moveTo(x - ref.x, y - ref.y)))
        g.closePath()
      }
      g.clip()
      g.drawImage(img, ref.x, ref.y, ref.w, ref.h, 0, 0, ref.w, ref.h)
      if (ref.keyBlue) {
        // Same key as the old runtime feColorMatrix: alpha = 1 − 4·(B − (R + G)/2), in sRGB, clamped.
        const im = g.getImageData(0, 0, c.width, c.height)
        const d = im.data
        for (let i = 0; i < d.length; i += 4) {
          const k = 1 - 4 * ((d[i + 2] - (d[i] + d[i + 1]) / 2) / 255)
          d[i + 3] = Math.round(d[i + 3] * Math.min(1, Math.max(0, k)))
        }
        g.putImageData(im, 0, 0)
      }
      return c.toDataURL('image/png')
    },
    { png: source.toString('base64'), ref, size: SOURCE_SIZE },
  )
  const bytes = Buffer.from(dataUrl.split(',')[1], 'base64')
  await writeFile(new URL(ref.file, outDir), bytes)
  results.push({ kind, file: ref.file, size: `${ref.w}×${ref.h}`, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex').toUpperCase() })
}
await browser.close()
console.table(results)
