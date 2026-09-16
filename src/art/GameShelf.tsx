import { PixelRects } from './PixelRects'
import type { Px } from './palette'

type Platform = 'fc' | 'sfc' | 'gba' | 'gc' | 'wii' | 'ds' | '3ds' | 'switch'

/**
 * Spine size (scene units) and colours per platform, so the row reads as a history of consoles.
 * Widths also make the twenty-two spines and their gaps measure exactly 74 units, which fills the
 * cabinet's bottom bay (interior 307–383) with one unit of backing showing at each end. The chunky
 * formats are the wide ones, which is both true of the real boxes and what makes the sum work:
 * tall cardboard boxes for Famicom/Super Famicom, short handheld cases, taller disc and Switch cases.
 * Generic colour coding only; no logos or cover art.
 */
const PLATFORM: Record<Platform, { name: string; w: number; h: number; body: string; band: string }> = {
  fc: { name: 'Famicom', w: 4, h: 15, body: '#d9ccb0', band: '#b33a32' },
  sfc: { name: 'Super Famicom', w: 3, h: 19, body: '#b9b6b1', band: '#5a4f8a' },
  gba: { name: 'Game Boy Advance', w: 2, h: 13, body: '#2e3352', band: '#9aa3c4' },
  gc: { name: 'GameCube', w: 3, h: 20, body: '#26242e', band: '#6a55a0' },
  wii: { name: 'Wii', w: 3, h: 20, body: '#e6e6e6', band: '#9aa0a8' },
  ds: { name: 'Nintendo DS', w: 2, h: 14, body: '#e0e0e0', band: '#4a4a52' },
  '3ds': { name: 'Nintendo 3DS', w: 2, h: 14, body: '#e8e8e8', band: '#c0392b' },
  switch: { name: 'Nintendo Switch', w: 2, h: 18, body: '#c7302f', band: '#e8e0d8' },
}

/** Boxed Fire Emblem games in release order. `accent` hints at each cover's dominant colour. */
export const FIRE_EMBLEM_GAMES: readonly { title: string; year: number; platform: Platform; accent: string }[] = [
  { title: 'Fire Emblem: Shadow Dragon and the Blade of Light', year: 1990, platform: 'fc', accent: '#2f5aa8' },
  { title: 'Fire Emblem Gaiden', year: 1992, platform: 'fc', accent: '#b8862f' },
  { title: 'Fire Emblem: Mystery of the Emblem', year: 1994, platform: 'sfc', accent: '#3f7d4a' },
  { title: 'Fire Emblem: Genealogy of the Holy War', year: 1996, platform: 'sfc', accent: '#7a3fa0' },
  { title: 'Fire Emblem: Thracia 776', year: 1999, platform: 'sfc', accent: '#a83232' },
  { title: 'Fire Emblem: The Binding Blade', year: 2002, platform: 'gba', accent: '#c9432f' },
  { title: 'Fire Emblem: The Blazing Blade', year: 2003, platform: 'gba', accent: '#d98a2b' },
  { title: 'Fire Emblem: The Sacred Stones', year: 2004, platform: 'gba', accent: '#3b8f86' },
  { title: 'Fire Emblem: Path of Radiance', year: 2005, platform: 'gc', accent: '#4b6fb3' },
  { title: 'Fire Emblem: Radiant Dawn', year: 2007, platform: 'wii', accent: '#c4a24a' },
  { title: 'Fire Emblem: Shadow Dragon', year: 2008, platform: 'ds', accent: '#355c9e' },
  { title: 'Fire Emblem: New Mystery of the Emblem', year: 2010, platform: 'ds', accent: '#5b8f4a' },
  { title: 'Fire Emblem Awakening', year: 2012, platform: '3ds', accent: '#3a58a8' },
  { title: 'Fire Emblem Fates: Birthright', year: 2015, platform: '3ds', accent: '#e0c45a' },
  { title: 'Fire Emblem Fates: Conquest', year: 2015, platform: '3ds', accent: '#5a3a7a' },
  { title: 'Fire Emblem Fates: Revelation', year: 2015, platform: '3ds', accent: '#3f78b8' },
  { title: 'Fire Emblem Echoes: Shadows of Valentia', year: 2017, platform: '3ds', accent: '#b5463a' },
  { title: 'Fire Emblem Warriors', year: 2017, platform: 'switch', accent: '#c0a040' },
  { title: 'Fire Emblem: Three Houses', year: 2019, platform: 'switch', accent: '#3a5fa0' },
  { title: 'Tokyo Mirage Sessions #FE Encore', year: 2020, platform: 'switch', accent: '#d94a8a' },
  { title: 'Fire Emblem Warriors: Three Hopes', year: 2022, platform: 'switch', accent: '#a83a3a' },
  { title: 'Fire Emblem Engage', year: 2023, platform: 'switch', accent: '#7fb0d8' },
]

/** One spine in scene units, with the label shown when the visitor points at it. */
export interface ShelfSpine {
  title: string
  label: string
  accent: string
  platform: Platform
  x: number
  y: number
  w: number
  h: number
}

/** Positions every spine left to right from `x`, standing on `floor`. Shared by the drawing and the name labels. */
export function layoutFireEmblemShelf(x: number, floor: number, gap = 1): readonly ShelfSpine[] {
  let cursor = x
  return FIRE_EMBLEM_GAMES.map((game) => {
    const { name, w, h } = PLATFORM[game.platform]
    const spine = {
      title: game.title,
      label: `${game.title} · ${name} · ${game.year}`,
      accent: game.accent,
      platform: game.platform,
      x: cursor,
      y: floor - h,
      w,
      h,
    }
    cursor += w + gap
    return spine
  })
}

/** One row of game spines standing on a shelf floor. */
export function FireEmblemShelf({ x, floor }: { x: number; floor: number }) {
  const px: Px[] = layoutFireEmblemShelf(x, floor).flatMap(({ x: sx, y, w, h, platform, accent }) => {
    const { body, band } = PLATFORM[platform]
    return [
      [sx, y, w, h, body],
      [sx, y + 1, w, 1, band],
      [sx, y + 4, w, 3, accent],
    ] as Px[]
  })
  return (
    <g data-shelf="fire-emblem">
      <PixelRects px={px} />
    </g>
  )
}
