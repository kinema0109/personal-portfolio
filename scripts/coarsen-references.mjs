/**
 * Redraws the generated reference sprites on the room's own pixel grid.
 *
 * The room is drawn from integer scene units (1 unit = 3 screen px at 1440 wide), but the
 * generated sprites are ~1400 px tall illustrations squeezed into a 20-50 unit slot, so they
 * carry roughly ten times the room's detail and read as HD pictures pasted into pixel art.
 *
 * This downsamples each sprite to the size it is actually drawn at, so one sprite pixel covers
 * 1 / PIXELS_PER_UNIT scene units, hardens the alpha edge and flattens the palette. The app then
 * upscales the small file with image-rendering: pixelated, which gives real square pixels.
 * The two framed swords hang at an angle, so the rotation is baked in here, at full resolution,
 * before the downsample. Rotating the finished pixel sprite in SVG instead would shear its grid.
 *
 * Sources in public/art/derived/*-coarse.png are never modified.
 * Run: npm install --no-save sharp && node scripts/coarsen-references.mjs
 */
import sharp from 'sharp'
import { statSync, writeFileSync } from 'node:fs'

/** Sprite pixels per scene unit. 1 matches the room grid exactly; 1.5 keeps the miniatures readable. */
const PIXELS_PER_UNIT = Number(process.env.PIXELS_PER_UNIT || 1.5)
/** Colours kept per sprite after flattening. */
const COLOURS = Number(process.env.COLOURS || 20)
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 }

/**
 * Slot width/height in scene units, as given to each sprite in src/art/ApartmentScene.tsx,
 * measured before any rotation. `rotate` is the angle the sprite hangs at, clockwise as in SVG.
 */
const SLOTS = {
  alhazard: { source: 'alhazard-coarse', w: 18, h: 48, rotate: -33 },
  langrisser: { source: 'langrisser-coarse', w: 13, h: 48, rotate: 33 },
  gran: { source: 'gran-coarse', w: 24, h: 49 },
  armageddon: { source: 'armageddon-coarse', w: 44, h: 9 },
  seer: { source: 'seer-coarse', w: 21, h: 34 },
  alpha: { source: 'alpha-coarse', w: 24, h: 31 },
  'master-ball': { source: 'master-ball', w: 20, h: 20 },
}

/** Tight bounds of everything the image actually paints, so no transparent padding is kept. */
function alphaBounds(data, width, height) {
  let x0 = width, y0 = height, x1 = -1, y1 = -1
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++)
    if (data[(y * width + x) * 4 + 3] > 16) {
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
    }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }
}

async function boundsOf(image) {
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return alphaBounds(data, info.width, info.height)
}

const sizes = {}
for (const [kind, slot] of Object.entries(SLOTS)) {
  const source = `public/art/derived/${slot.source}.png`
  const upright = await boundsOf(sharp(source))
  // The SVG scales the sprite to fit its slot (preserveAspectRatio="meet"), so this is the size it is really drawn at.
  const unitsPerSourcePixel = Math.min(slot.w / upright.width, slot.h / upright.height)

  // Rotating first keeps the sprite's pixels square on the wall; the scale is unchanged by it.
  let canvas = await sharp(source).extract(upright).png().toBuffer()
  if (slot.rotate) canvas = await sharp(canvas).rotate(slot.rotate, { background: TRANSPARENT }).png().toBuffer()
  const { width: canvasW, height: canvasH } = await sharp(canvas).metadata()
  const drawn = await boundsOf(sharp(canvas))
  // A rotated silhouette no longer sits centred on the pivot it was turned around, so record how far
  // its middle moved. The room adds this back, which keeps the crossed pair in exactly its old position.
  const pivot = {
    dx: +((drawn.left + drawn.width / 2 - canvasW / 2) * unitsPerSourcePixel).toFixed(2),
    dy: +((drawn.top + drawn.height / 2 - canvasH / 2) * unitsPerSourcePixel).toFixed(2),
  }
  const width = Math.max(4, Math.round(drawn.width * unitsPerSourcePixel * PIXELS_PER_UNIT))
  const height = Math.max(4, Math.round(drawn.height * unitsPerSourcePixel * PIXELS_PER_UNIT))

  const { data, info } = await sharp(canvas).extract(drawn)
    .resize(width, height, { kernel: 'lanczos3', fit: 'fill' })
    // Averaging a thousand pixels into fifty greys the colours out, so put the bite back before flattening.
    .modulate({ saturation: 1.25 }).linear(1.12, -10)
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  // Square pixels need a hard edge: drop the feathered rim instead of leaving half-transparent pixels,
  // and clear the colour underneath so nothing bleeds outside the silhouette.
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 110) data.fill(0, i, i + 4)
    else data[i + 3] = 255
  }
  const out = `public/art/derived/${kind}-px.png`
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ palette: true, colours: COLOURS, dither: 0, compressionLevel: 9 })
    .toFile(out)
  sizes[kind] = { width, height, pivot }
  console.log(`${kind.padEnd(12)} ${String(upright.width).padStart(4)}x${String(upright.height).padEnd(5)}`
    + `-> ${String(width).padStart(3)}x${String(height).padEnd(3)} px`
    + ` = ${(width / PIXELS_PER_UNIT).toFixed(1)}x${(height / PIXELS_PER_UNIT).toFixed(1)} units`
    + `  ${(statSync(out).size / 1024).toFixed(1)} kB`)
}

// The viewBox and the room slot both have to match the exported file, so this table is generated, not hand-kept.
const entries = Object.entries(sizes)
  .map(([kind, { width, height, pivot }]) => `  '${kind}': { file: '${kind}-px.png', w: ${width}, h: ${height},`
    + ` units: { w: ${+(width / PIXELS_PER_UNIT).toFixed(2)}, h: ${+(height / PIXELS_PER_UNIT).toFixed(2)} },`
    + ` pivot: { dx: ${pivot.dx}, dy: ${pivot.dy} } },`)
  .join('\n')
writeFileSync('src/art/refreshedSprites.ts', `// Generated by scripts/coarsen-references.mjs. Do not edit by hand.
// Each sprite is stored at the size it is drawn at, ${PIXELS_PER_UNIT} sprite pixel(s) per scene unit, so it
// shares the room's pixel grid; the app upscales it with image-rendering: pixelated. \`units\` is that
// size in scene units, and pivot is how far the sprite's middle sits from the point it was
// rotated around, for the framed pair the room places by their shared centre.
export const REFRESHED_SPRITES = {
${entries}
} as const

export type RefreshedKind = keyof typeof REFRESHED_SPRITES
`)
console.log('wrote src/art/refreshedSprites.ts')
