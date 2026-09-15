/**
 * Where each personal reference lives in the owner's approved room screenshot, and the silhouette that
 * isolates it from the photo backdrop. Shared by the runtime component (ReferenceDisplay.tsx) and the
 * export script (scripts/export-derived-references.mjs) that pre-renders the derived PNGs.
 */

export type ReferenceKind = 'swords' | 'gran' | 'seer' | 'alpha' | 'ambicion'

export interface ReferenceCrop {
  /** Source rectangle in approved-room-screenshot.png pixels. */
  x: number
  y: number
  w: number
  h: number
  /** Union of polygons (source pixels) kept opaque; everything else is transparent. */
  silhouette: readonly string[]
  /**
   * Also hide blue-dominant pixels: alpha = 1 − 4·(B − (R + G) / 2). Used for the Grey Seer, photographed on a
   * bright blue backdrop that a polygon cannot fully remove; grey robes, base, staff and warpstone stay opaque.
   */
  keyBlue?: boolean
  /** Derived file under public/art/derived/, named by the design-contract asset id. */
  file: string
}

export const REFERENCES: Record<ReferenceKind, ReferenceCrop> = {
  swords: {
    x: 745, y: 84, w: 90, h: 104,
    file: 'wall-sword-set.png',
    // Only Alhazard and Langrisser: the source painting's bronze border, corner studs and backing are left out,
    // so the blades hang directly in the room's own frame instead of reading as a picture in a picture.
    silhouette: [
      // Alhazard: stepped dark blade, black and gold guard with the red core, grip and pommel.
      '747,86 756,86 769,93 778,103 779,113 787,123 791,130 790,137 800,140 812,137 823,134 827,140 822,147 818,158 816,166 826,172 834,178 834,186 822,186 812,173 800,172 788,177 784,162 784,150 777,139 768,127 762,118 755,108 749,99 746,91',
      // Langrisser blade, following its centre line from the tip (829,86) to the guard (761,156).
      '824,85 834,85 821,100 799,123 781,142 766,156 756,156 771,142 790,123 811,100',
      // Langrisser golden guard, grip and pommel.
      '743,150 757,152 766,155 772,162 781,168 781,176 772,178 764,172 759,176 755,184 744,184 743,176 749,169 747,161 743,156',
    ],
  },
  gran: {
    x: 896, y: 82, w: 75, h: 143,
    file: 'shelf-gran-centurio.png',
    silhouette: ['930,83 934,91 942,94 940,100 935,100 935,110 950,116 961,123 962,135 951,139 942,135 943,163 938,191 930,222 924,214 916,184 914,141 901,139 897,132 900,122 911,117 923,111 925,101 918,101 917,95 926,91'],
  },
  seer: {
    x: 802, y: 270, w: 52, h: 52,
    file: 'figure-grey-seer.png',
    keyBlue: true,
    // Traced tight on the blue photo backdrop: horns, head, robe and base; staff with the green warpstone; the thin staff/tail on the left.
    silhouette: [
      '817,277 821,281 829,281 830,277 833,281 833,285 837,288 837,291 841,293 842,297 837,299 835,305 835,312 845,314 846,318 844,321 806,321 805,316 812,313 811,305 809,300 810,295 814,290 817,286 818,281',
      '846,270 851,273 853,278 850,284 846,286 846,294 845,300 843,310 842,316 838,316 839,305 841,294 841,286 839,282 839,275',
      '812,299 814,301 803,313 801,311',
    ],
  },
  alpha: {
    x: 957, y: 235, w: 46, h: 59,
    file: 'figure-alpha-legion.png',
    // Crest, shoulder pads, arms, legs and the painted base, without the wooden shelf beside the base; plus the weapon on the left.
    silhouette: [
      '980,237 985,239 991,240 996,244 999,253 999,266 996,271 996,280 1001,284 1001,289 993,293 968,293 962,289 962,284 966,282 969,273 970,266 966,264 965,257 966,251 967,246 971,240 975,239',
      '964,261 967,263 961,271 958,269',
    ],
  },
  ambicion: {
    x: 970, y: 309, w: 77, h: 34,
    file: 'desk-ambicion.png',
    silhouette: ['1022,312 1028,312 1029,324 1043,324 1045,328 1029,331 1028,340 1023,339 1022,330 980,331 972,327 980,323 1022,323'],
  },
}

/** The owner's untouched screenshot; kept out of git and only needed to (re)export the derived files. */
export const SOURCE_SCREENSHOT = 'references/locked/approved-room-screenshot.png'
export const SOURCE_SIZE = { w: 1081, h: 598 } as const
