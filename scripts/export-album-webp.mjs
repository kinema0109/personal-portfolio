// Re-encodes the album pictures as WebP for the site. Pixel dimensions are unchanged, so the pixel-art grid
// stays intact; only the file format changes. Quality 95 was chosen after comparing 3x crops of the dithered,
// flat-white and saturated images against the PNGs: no visible difference, ~80% smaller.
//
//   npm install --no-save --package-lock=false sharp
//   node scripts/export-album-webp.mjs
//
// Source PNGs live in public/gallery/ but stay out of git (see .gitignore); the committed album is the WebP set.
import { createRequire } from 'node:module'
import { readFile, stat, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
const require = createRequire('F:/project/postfolio/personal-portfolio/package.json')
const sharp = require('sharp')

const QUALITY = 95
const listed = (await readFile(new URL('../src/content/gallery.ts', import.meta.url), 'utf8')).match(/gallery\/[\w.-]+\.webp/g)
if (!listed) throw new Error('No gallery/*.webp entries found in src/content/gallery.ts')

let png = 0
let webp = 0
const rows = []
for (const entry of listed) {
  const name = entry.replace('gallery/', '').replace('.webp', '')
  const src = fileURLToPath(new URL(`../public/gallery/${name}.png`, import.meta.url))
  const out = fileURLToPath(new URL(`../public/gallery/${name}.webp`, import.meta.url))
  const meta = await sharp(src).metadata()
  const buf = await sharp(src).webp({ quality: QUALITY, effort: 6 }).toBuffer()
  await writeFile(out, buf)
  const before = (await stat(src)).size
  png += before
  webp += buf.length
  rows.push({ file: `${name}.webp`, size: `${meta.width}×${meta.height}`, png: `${(before / 1048576).toFixed(2)} MB`, webp: `${(buf.length / 1048576).toFixed(2)} MB` })
}
console.table(rows)
console.log(`total ${(png / 1048576).toFixed(1)} MB -> ${(webp / 1048576).toFixed(1)} MB (${Math.round((1 - webp / png) * 100)}% smaller)`)
