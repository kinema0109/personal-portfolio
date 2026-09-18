import type { CSSProperties } from 'react'
import type { ProjectId } from '../content/types'
import { PixelRects } from './PixelRects'
import { C, type Px } from './palette'
import { FIREBASE, ICON_BG as BG, MONGO, PG, REDIS, icon, type Icon } from './icons'

/**
 * The desk PC's screen while a project is on screen: a tiny architecture diagram built only from
 * what the CV says about that project (src/content/i18n/en.ts, src/content/projects.ts).
 *
 * The screen is 40 × 26 scene units at (198, 74). Diagrams use local coordinates 0–39 × 0–24, which is
 * y 74–98; y 99 stays free for the energy build bar.
 */

const SCREEN = { x: 198, y: 74 } as const
const LINE = C.slateLight
const DOT = C.goldLight

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
  // Vue web → Express/Hapi API → Redis and MongoDB → MongoDB replica sets on 6 GCP VMs.
  cbpo: {
    parts: [['web', 1, 8], ['server', 12, 7], ['db', 20, 5, REDIS], ['db', 20, 12, MONGO], ['cloud', 27, 4],
      ['vm', 28, 11], ['vm', 31, 11], ['vm', 34, 11], ['vm', 28, 14], ['vm', 31, 14], ['vm', 34, 14]],
    links: [h(9, 10, 3), h(17, 8, 3), h(17, 13, 3), h(25, 14, 3)],
  },
  // Admin and learner → role-based access → React → Django → PostgreSQL.
  ca2t: {
    parts: [['person', 1, 4, C.red], ['person', 1, 14, C.tealLight], ['lock', 8, 9], ['web', 16, 9],
      ['server', 26, 9], ['db', 33, 10, PG]],
    links: [h(4, 6, 3), v(6, 6, 6), h(4, 16, 3), v(6, 12, 4), h(6, 12, 2), h(13, 12, 3), h(24, 12, 2), h(31, 12, 2)],
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
  // React CMS → Java → virtual store, synced to both Android and iOS; built by Jenkins.
  'ikara-admin': {
    parts: [['web', 1, 5], ['server', 11, 4], ['coin', 19, 6], ['phone', 27, 2], ['phone', 27, 11], ['gear', 11, 15]],
    links: [h(9, 7, 2), h(16, 7, 3), h(23, 7, 2), v(25, 5, 10), h(26, 5, 1), h(26, 14, 1), v(13, 11, 4)],
  },
  // Flutter/Swift apps → Firebase Cloud Functions, signed in with Firebase Auth → Firebase's database.
  yokara: {
    parts: [['phone', 8, 8], ['server', 17, 8], ['lock', 17, 16], ['db', 26, 9, FIREBASE]],
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
      {/* A dot visits each pixel of a line in turn, one step per pixel; a one-pixel link has no room to move. */}
      {diagram.links.map((l, i) => l.len < 2 ? null : (
        <rect
          key={i}
          className="f-data"
          x={SCREEN.x + l.x}
          y={SCREEN.y + l.y}
          width={1}
          height={1}
          fill={DOT}
          style={{
            '--data-dx': `${l.dir === 'h' ? l.len : 0}px`,
            '--data-dy': `${l.dir === 'v' ? l.len : 0}px`,
            animationTimingFunction: `steps(${l.len}, end)`,
            animationDelay: `${(i % 3) * 0.3}s`,
          } as CSSProperties}
        />
      ))}
    </g>
  )
}
