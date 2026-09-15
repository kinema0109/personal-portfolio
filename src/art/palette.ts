/** Shared pixel palette: muted navy, slate blue, cream, ochre, dusty red. */
export const C = {
  night: '#161a2b',
  navy: '#1f2640',
  wallDark: '#262e49',
  wall: '#2d3653',
  slate: '#3d4968',
  slateLight: '#56658a',
  mist: '#7f8fb0',
  screen: '#6d82a6',
  water: '#5f7aa3',
  cream: '#eadfc3',
  creamDim: '#c9bb98',
  ochre: '#c28b3c',
  ochreDark: '#8a6130',
  wood: '#6e4d2c',
  woodDark: '#4a3421',
  red: '#a3524a',
  redDark: '#723a36',
  skin: '#c99473',
  skinShade: '#a8765c',
  hair: '#241f24',
  fur: '#7c6f6a',
  furDark: '#5a4f4d',
  pink: '#b98580',
  teal: '#2f6f72',
  tealLight: '#5e9a8b',
  tealDark: '#204e5b',
  gold: '#d49a3a',
  goldLight: '#edc567',
  ink: '#1b1b29',
} as const

/** [x, y, width, height, fill] on the 320×180 pixel grid. */
export type Px = readonly [number, number, number, number, string]

export const W = 320
export const H = 180
