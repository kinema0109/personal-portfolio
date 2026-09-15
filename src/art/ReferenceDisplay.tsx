import { useId } from 'react'

/** Source artwork clipped to its silhouette; no rectangular room backgrounds. */
export function ReferenceDisplay({ kind, x, y, width, height }: {
  kind: 'swords' | 'gran' | 'seer' | 'alpha' | 'ambicion'
  x: number; y: number; width: number; height: number
}) {
  const id = useId()
  const crops = { swords: '741 78 99 114', gran: '896 82 75 143', seer: '805 269 47 55', alpha: '960 236 47 55', ambicion: '970 309 77 34' }
  const silhouettes = {
    swords: '741,78 840,78 840,192 741,192',
    gran: '930,83 934,91 942,94 940,100 935,100 935,110 950,116 961,123 962,135 951,139 942,135 943,163 938,191 930,222 924,214 916,184 914,141 901,139 897,132 900,122 911,117 923,111 925,101 918,101 917,95 926,91',
    seer: '844,270 850,274 851,283 846,288 844,303 847,310 849,317 845,322 806,322 807,316 812,313 815,302 820,294 817,291 820,287 825,288 829,281 834,282 836,289 833,297 838,306 841,303 842,288 839,282 840,274',
    alpha: '979,237 989,237 993,241 999,243 1001,252 997,258 1002,269 1000,279 1006,285 1003,290 962,290 962,285 970,280 971,270 968,263 965,258 966,248 972,244 976,244',
    ambicion: '1022,312 1028,312 1029,324 1043,324 1045,328 1029,331 1028,340 1023,339 1022,330 980,331 972,327 980,323 1022,323',
  }
  return <svg x={x} y={y} width={width} height={height} viewBox={crops[kind]} preserveAspectRatio="xMidYMid meet" overflow="hidden" data-reference={kind}>
    <defs><clipPath id={id}><polygon points={silhouettes[kind]} /></clipPath></defs>
    <image clipPath={`url(#${id})`} href={`${import.meta.env.BASE_URL}references/locked/approved-room-screenshot.png`} width="1080" height="598" />
  </svg>
}
