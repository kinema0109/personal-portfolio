/**
 * Flattens the collectible sprites onto a small palette so they sit in the room's tone.
 *
 * The sprites in public/art/derived/*-px.png each carry 252-254 distinct colours, while the whole
 * room is drawn from about 113 and a code-drawn prop like the fumo plushes uses 14. That gap, not
 * the resolution, is what makes the figures read as photographs propped up inside pixel art:
 * every surface is a soft gradient where everything around it is a flat block.
 *
 * sharp's own `png({ palette: true, colours: n })` needs libimagequant and silently does nothing
 * without it — which is why the sprites came out at 254 colours despite asking for 20. So the
 * quantiser is here: k-means over the opaque pixels, then every pixel snapped to its cluster. No
 * dithering, because dithering is exactly the speckle we are trying to remove.
 *
 * RESULT: this did not work, and it is kept as the record of why. Flattening the three sprites from
 * 254 colours to 14 changed almost nothing to look at. The palette size was a symptom; the real
 * problem is spatial — these sprites carry a different material on nearly every single pixel, where
 * the room is built from large flat blocks. Re-colouring speckle leaves speckle. Matching the room
 * means redrawing the shapes, not requantising them.
 *
 * Run: npm install --no-save sharp && node scripts/flatten-figures.mjs
 */
import sharp from 'sharp'
import { statSync } from 'node:fs'

/** Colours kept per sprite. Around a dozen is what the room's own props use. */
const COLOURS = Number(process.env.COLOURS || 14)
const SOURCES = ['seer-px', 'alpha-px', 'master-ball-px']

/** Squared distance, weighted the way the eye weighs the channels. */
function distance(a, b) {
  const dr = a[0] - b[0], dg = a[1] - b[1], db = a[2] - b[2]
  return 2 * dr * dr + 4 * dg * dg + 3 * db * db
}

/** k-means over the pixels, seeded by picking the points furthest from what is already chosen. */
function cluster(pixels, k) {
  const centres = [pixels[0]]
  while (centres.length < k) {
    let best = pixels[0]
    let bestDistance = -1
    for (const pixel of pixels) {
      const nearest = Math.min(...centres.map((c) => distance(pixel, c)))
      if (nearest > bestDistance) {
        bestDistance = nearest
        best = pixel
      }
    }
    centres.push(best)
  }

  for (let pass = 0; pass < 12; pass++) {
    const sums = centres.map(() => [0, 0, 0, 0])
    for (const pixel of pixels) {
      let index = 0
      let best = Infinity
      for (let i = 0; i < centres.length; i++) {
        const d = distance(pixel, centres[i])
        if (d < best) {
          best = d
          index = i
        }
      }
      const sum = sums[index]
      sum[0] += pixel[0]
      sum[1] += pixel[1]
      sum[2] += pixel[2]
      sum[3]++
    }
    for (let i = 0; i < centres.length; i++) {
      if (sums[i][3] === 0) continue
      centres[i] = [
        Math.round(sums[i][0] / sums[i][3]),
        Math.round(sums[i][1] / sums[i][3]),
        Math.round(sums[i][2] / sums[i][3]),
      ]
    }
  }
  return centres
}

for (const name of SOURCES) {
  const source = `public/art/derived/${name}.png`
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true })

  const pixels = []
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 128) pixels.push([data[i], data[i + 1], data[i + 2]])
  }
  const before = new Set(pixels.map(([r, g, b]) => (r << 16) | (g << 8) | b)).size
  const centres = cluster(pixels, COLOURS)

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] <= 128) {
      data.fill(0, i, i + 4)
      continue
    }
    const pixel = [data[i], data[i + 1], data[i + 2]]
    let best = centres[0]
    let bestDistance = Infinity
    for (const centre of centres) {
      const d = distance(pixel, centre)
      if (d < bestDistance) {
        bestDistance = d
        best = centre
      }
    }
    data[i] = best[0]
    data[i + 1] = best[1]
    data[i + 2] = best[2]
    data[i + 3] = 255
  }

  const out = `public/art/derived/${name.replace('-px', '-flat')}.png`
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(out)
  const after = new Set()
  for (let i = 0; i < data.length; i += 4) if (data[i + 3] > 128) after.add((data[i] << 16) | (data[i + 1] << 8) | data[i + 2])
  console.log(`${name.padEnd(16)} ${info.width}x${info.height}  ${before} -> ${after.size} colours  ${(statSync(out).size / 1024).toFixed(1)} kB`)
}
