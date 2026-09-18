import { C, type Px } from './palette'

/** Pixel icons shared by the PC screen's small diagrams and the case study diagrams. */
export const ICON_BG = '#1b2336'
export const PG = '#5b8dd6'
export const MONGO = '#5fb760'
export const REDIS = '#d6524a'
export const FIREBASE = '#f2a33a'
const GOOD = '#7fc97f'

export type Icon =
  | 'web' | 'server' | 'db' | 'cloud' | 'vm' | 'phone' | 'person' | 'lock' | 'chart' | 'gear' | 'coin'
  | 'cart' | 'wave' | 'triangle' | 'blocks'
  | 'robot' | 'branch' | 'check' | 'doc' | 'queue' | 'clock' | 'box' | 'dice' | 'vms' | 'label'

/** Width × height of each icon in pixels, so a diagram can centre it. */
export const ICON_SIZE: Record<Icon, readonly [number, number]> = {
  web: [8, 6], server: [5, 7], db: [5, 6], cloud: [11, 5], vm: [2, 2], phone: [4, 7], person: [3, 6],
  lock: [5, 6], chart: [7, 6], gear: [5, 5], coin: [4, 4], cart: [7, 5], wave: [7, 3], triangle: [5, 3],
  blocks: [6, 6], robot: [8, 8], branch: [7, 8], check: [8, 5], doc: [6, 8], queue: [8, 7], clock: [8, 8],
  box: [8, 7], dice: [7, 7], vms: [11, 7], label: [8, 6],
}

/** Each icon drawn at (x, y). `color` tints the icons that come in more than one colour. */
export function icon(kind: Icon, x: number, y: number, color: string = C.cream): Px[] {
  switch (kind) {
    case 'web': // 8 × 6 browser window
      return [[x, y, 8, 6, C.cream], [x, y, 8, 1, C.ochre], [x + 1, y + 2, 6, 1, C.slate], [x + 1, y + 4, 4, 1, C.slate]]
    case 'server': // 5 × 7
      return [[x, y, 5, 7, C.mist], [x + 1, y + 1, 3, 1, C.slate], [x + 1, y + 3, 3, 1, C.slate], [x + 1, y + 5, 1, 1, MONGO]]
    case 'db': // 5 × 6 cylinder
      return [[x, y + 1, 5, 4, color], [x + 1, y, 3, 1, color], [x + 1, y + 5, 3, 1, color], [x + 1, y + 1, 3, 1, C.cream]]
    case 'cloud': // 11 × 5
      return [[x + 2, y, 4, 1, C.mist], [x + 1, y + 1, 8, 1, C.mist], [x, y + 2, 11, 3, C.mist]]
    case 'vm': // 2 × 2
      return [[x, y, 2, 2, C.ochre]]
    case 'phone': // 4 × 7
      return [[x, y, 4, 7, C.slateLight], [x + 1, y + 1, 2, 4, C.screen], [x + 1, y + 6, 2, 1, C.cream]]
    case 'person': // 3 × 6
      return [[x, y, 3, 2, C.skin], [x, y + 2, 3, 4, color]]
    case 'lock': // 5 × 6
      return [[x + 1, y, 3, 1, C.ochre], [x + 1, y + 1, 1, 1, C.ochre], [x + 3, y + 1, 1, 1, C.ochre],
        [x, y + 2, 5, 4, C.ochre], [x + 2, y + 3, 1, 2, ICON_BG]]
    case 'chart': // 7 × 6
      return [[x, y, 1, 6, C.cream], [x, y + 5, 7, 1, C.cream],
        [x + 2, y + 3, 1, 2, MONGO], [x + 4, y + 1, 1, 4, C.ochre], [x + 6, y + 2, 1, 3, PG]]
    case 'gear': // 5 × 5
      return [[x + 1, y, 3, 5, C.mist], [x, y + 1, 5, 3, C.mist], [x + 2, y + 2, 1, 1, ICON_BG]]
    case 'coin': // 4 × 4
      return [[x + 1, y, 2, 4, C.gold], [x, y + 1, 4, 2, C.gold], [x + 1, y + 1, 1, 1, C.goldLight]]
    case 'cart': // 7 × 5: handle, tapering basket, two wheels
      return [[x, y, 2, 1, C.cream], [x + 1, y + 1, 6, 1, C.cream], [x + 2, y + 2, 5, 1, C.cream],
        [x + 2, y + 3, 4, 1, C.cream], [x + 2, y + 4, 1, 1, C.mist], [x + 5, y + 4, 1, 1, C.mist]]
    case 'wave': // 7 × 3
      return [[x, y + 1, 1, 1, C.tealLight], [x + 1, y, 1, 1, C.tealLight], [x + 2, y + 1, 1, 1, C.tealLight],
        [x + 3, y + 2, 1, 1, C.tealLight], [x + 4, y + 1, 1, 1, C.tealLight], [x + 5, y, 1, 1, C.tealLight],
        [x + 6, y + 1, 1, 1, C.tealLight]]
    case 'triangle': // 5 × 3
      return [[x + 2, y, 1, 1, C.cream], [x + 1, y + 1, 3, 1, C.cream], [x, y + 2, 5, 1, C.cream]]
    case 'blocks': // 6 × 6 stacked components
      return [[x, y, 6, 2, C.tealLight], [x, y + 2, 6, 2, C.ochre], [x, y + 4, 6, 2, C.mist]]
    case 'robot':
      return [[x + 3, y, 2, 1, C.ochre], [x + 1, y + 1, 6, 5, C.mist], [x + 2, y + 3, 1, 1, ICON_BG],
        [x + 5, y + 3, 1, 1, ICON_BG], [x + 2, y + 6, 4, 2, C.mist]]
    case 'branch':
      return [[x + 1, y, 1, 8, C.tealLight], [x + 2, y + 5, 1, 1, C.tealLight], [x + 3, y + 4, 1, 1, C.tealLight],
        [x + 4, y + 3, 1, 1, C.tealLight], [x + 5, y + 1, 2, 2, C.tealLight], [x, y + 7, 3, 1, C.tealLight]]
    case 'check':
      return [[x, y + 2, 1, 2, GOOD], [x + 1, y + 3, 1, 2, GOOD], [x + 2, y + 3, 1, 2, GOOD], [x + 3, y + 2, 1, 2, GOOD],
        [x + 4, y + 1, 1, 2, GOOD], [x + 5, y, 1, 2, GOOD], [x + 6, y, 2, 1, GOOD]]
    case 'doc':
      return [[x, y, 6, 8, C.cream], [x + 1, y + 2, 4, 1, C.slate], [x + 1, y + 4, 4, 1, C.slate], [x + 1, y + 6, 3, 1, C.slate]]
    case 'queue':
      return [[x, y, 8, 2, C.ochre], [x, y + 3, 8, 2, C.mist], [x, y + 6, 8, 1, C.mist]]
    case 'clock':
      return [[x + 1, y, 6, 8, C.cream], [x, y + 1, 8, 6, C.cream], [x + 3, y + 2, 1, 3, ICON_BG], [x + 4, y + 4, 2, 1, ICON_BG]]
    case 'box':
      return [[x, y + 1, 8, 6, '#a8763e'], [x, y + 1, 8, 1, '#c9955a'], [x + 3, y + 1, 2, 6, '#7a522a']]
    case 'dice':
      return [[x, y, 7, 7, C.cream], [x + 1, y + 1, 1, 1, C.red], [x + 5, y + 1, 1, 1, C.red], [x + 3, y + 3, 1, 1, C.red],
        [x + 1, y + 5, 1, 1, C.red], [x + 5, y + 5, 1, 1, C.red]]
    case 'vms':
      return [[x, y, 3, 3, C.ochre], [x + 4, y, 3, 3, C.ochre], [x + 8, y, 3, 3, C.ochre],
        [x, y + 4, 3, 3, C.ochre], [x + 4, y + 4, 3, 3, C.ochre], [x + 8, y + 4, 3, 3, C.ochre]]
    case 'label':
      return [[x, y, 8, 6, C.cream], [x + 1, y + 1, 1, 4, ICON_BG], [x + 3, y + 1, 1, 4, ICON_BG],
        [x + 4, y + 1, 1, 4, ICON_BG], [x + 6, y + 1, 1, 4, ICON_BG]]
  }
}
