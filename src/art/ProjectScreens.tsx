import type { CSSProperties } from 'react'
import type { ProjectId } from '../content/types'
import { PixelRects } from './PixelRects'
import { C, type Px } from './palette'

/**
 * The desk PC's screen while a project is on screen: a tiny architecture diagram built only from
 * what the CV says about that project (src/content/i18n/en.ts, src/content/projects.ts).
 *
 * The screen is 40 × 26 scene units at (198, 74). Diagrams use local coordinates 0–39 × 0–24; the
 * bottom row (24 → y 98 is the last used, y 99) stays free for the energy build bar.
 */

const SCREEN = { x: 198, y: 74 } as const
const BG = '#1b2336'
const LINE = C.slateLight
const DOT = C.goldLight
const PG = '#5b8dd6'
const MONGO = '#5fb760'

type Icon =
  | 'web' | 'server' | 'db' | 'cloud' | 'vm' | 'phone' | 'person' | 'lock' | 'chart' | 'gear' | 'coin'
  | 'cart' | 'wave' | 'triangle' | 'blocks'

/** Each icon drawn at local (x, y). `color` tints the icons that come in more than one colour. */
function icon(kind: Icon, x: number, y: number, color: string = C.cream): Px[] {
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
        [x, y + 2, 5, 4, C.ochre], [x + 2, y + 3, 1, 2, BG]]
    case 'chart': // 7 × 6
      return [[x, y, 1, 6, C.cream], [x, y + 5, 7, 1, C.cream],
        [x + 2, y + 3, 1, 2, MONGO], [x + 4, y + 1, 1, 4, C.ochre], [x + 6, y + 2, 1, 3, PG]]
    case 'gear': // 5 × 5
      return [[x + 1, y, 3, 5, C.mist], [x, y + 1, 5, 3, C.mist], [x + 2, y + 2, 1, 1, BG]]
    case 'coin': // 4 × 4
      return [[x + 1, y, 2, 4, C.gold], [x, y + 1, 4, 2, C.gold], [x + 1, y + 1, 1, 1, C.goldLight]]
    case 'cart': // 7 × 5
      return [[x, y, 1, 1, C.cream], [x + 1, y + 1, 6, 2, C.cream], [x + 1, y + 3, 5, 1, C.cream],
        [x + 2, y + 4, 1, 1, C.mist], [x + 5, y + 4, 1, 1, C.mist]]
    case 'wave': // 7 × 3
      return [[x, y + 1, 1, 1, C.tealLight], [x + 1, y, 1, 1, C.tealLight], [x + 2, y + 1, 1, 1, C.tealLight],
        [x + 3, y + 2, 1, 1, C.tealLight], [x + 4, y + 1, 1, 1, C.tealLight], [x + 5, y, 1, 1, C.tealLight],
        [x + 6, y + 1, 1, 1, C.tealLight]]
    case 'triangle': // 5 × 3
      return [[x + 2, y, 1, 1, C.cream], [x + 1, y + 1, 3, 1, C.cream], [x, y + 2, 5, 1, C.cream]]
    case 'blocks': // 6 × 6 stacked components
      return [[x, y, 6, 2, C.tealLight], [x, y + 2, 6, 2, C.ochre], [x, y + 4, 6, 2, C.mist]]
  }
}

/** A straight connection; a data dot travels from its start to its end. */
interface Link { x: number; y: number; len: number; dir: 'h' | 'v' }

interface Diagram {
  parts: readonly [Icon, number, number, string?][]
  links: readonly Link[]
}

const h = (x: number, y: number, len: number): Link => ({ x, y, len, dir: 'h' })
const v = (x: number, y: number, len: number): Link => ({ x, y, len, dir: 'v' })

/** One diagram per project. Every element is in that project's CV entry. */
export const DIAGRAMS: Record<ProjectId, Diagram> = {
  // Vue web → Django API → PostgreSQL (orders) and MongoDB (marketplace metrics) → 6 VMs on GCP.
  cbpo: {
    parts: [['web', 1, 8], ['server', 12, 7], ['db', 20, 5, PG], ['db', 20, 12, MONGO], ['cloud', 27, 4],
      ['vm', 28, 11], ['vm', 31, 11], ['vm', 34, 11], ['vm', 28, 14], ['vm', 31, 14], ['vm', 34, 14]],
    links: [h(9, 10, 3), h(17, 8, 3), h(17, 13, 3), h(25, 14, 3)],
  },
  // Admin and learner → role-based access → React → Django → PostgreSQL.
  ca2t: {
    parts: [['person', 1, 4, C.red], ['person', 1, 14, C.tealLight], ['lock', 8, 9], ['web', 16, 9],
      ['server', 26, 9], ['db', 33, 10, PG]],
    links: [h(4, 6, 3), v(6, 6, 5), h(4, 16, 3), v(6, 12, 4), h(6, 12, 2), h(13, 12, 3), h(24, 12, 2), h(31, 12, 2)],
  },
  // WooCommerce → webhooks → NestJS → MongoDB → React dashboard.
  theavotree: {
    parts: [['cart', 1, 9], ['wave', 9, 10], ['server', 18, 8], ['db', 25, 9, MONGO], ['chart', 32, 9]],
    links: [h(16, 11, 2), h(23, 11, 2), h(30, 11, 2)],
  },
  // Next.js landing → reusable components → VWO A/B tests → Django.
  singlekey: {
    parts: [['web', 2, 9], ['blocks', 13, 9], ['chart', 22, 9], ['server', 32, 9]],
    links: [h(10, 12, 3), h(19, 12, 3), h(29, 12, 3)],
  },
  // Next.js ⇄ Supabase Realtime over WebSockets → PostgreSQL, deployed on Vercel.
  suzu: {
    parts: [['web', 3, 9], ['wave', 12, 10], ['db', 23, 9, PG], ['triangle', 32, 11]],
    links: [h(11, 11, 1), h(19, 11, 4)],
  },
  // React CMS → Java → virtual store → Android and iOS; built by Jenkins.
  'ikara-admin': {
    parts: [['web', 1, 5], ['server', 11, 4], ['coin', 19, 6], ['phone', 26, 4], ['phone', 33, 4], ['gear', 11, 15]],
    links: [h(9, 7, 2), h(16, 7, 3), h(23, 7, 3), h(30, 7, 3), v(13, 11, 4)],
  },
  // Flutter/Swift apps → Express and Firebase with JWT → MongoDB.
  yokara: {
    parts: [['phone', 8, 8], ['server', 17, 8], ['lock', 17, 16], ['db', 26, 9, MONGO]],
    links: [h(12, 11, 5), v(19, 15, 1), h(22, 11, 4)],
  },
}

const toScreen = ([x, y, w, hh, fill]: Px): Px => [SCREEN.x + x, SCREEN.y + y, w, hh, fill]

export function ProjectScreen({ id }: { id: ProjectId }) {
  const diagram = DIAGRAMS[id]
  const lines: Px[] = diagram.links.map((l) => (l.dir === 'h' ? [l.x, l.y, l.len, 1, LINE] : [l.x, l.y, 1, l.len, LINE]))
  return (
    <g data-project-screen={id}>
      <PixelRects px={[[SCREEN.x, SCREEN.y, 40, 26, BG]]} />
      <PixelRects px={lines.map(toScreen)} />
      <PixelRects px={diagram.parts.flatMap(([kind, x, y, color]) => icon(kind, x, y, color)).map(toScreen)} />
      {diagram.links.map((l, i) => (
        <rect
          key={i}
          className="f-data"
          x={SCREEN.x + l.x}
          y={SCREEN.y + l.y}
          width={1}
          height={1}
          fill={DOT}
          style={{
            '--data-dx': `${l.dir === 'h' ? l.len - 1 : 0}px`,
            '--data-dy': `${l.dir === 'v' ? l.len - 1 : 0}px`,
            animationDelay: `${(i % 3) * 0.3}s`,
          } as CSSProperties}
        />
      ))}
    </g>
  )
}
