import { CASES, type Block, type CaseId } from '../content/caseDiagrams'
import { ICON_SIZE, icon } from '../art/icons'
import { PixelRects } from '../art/PixelRects'
import { useLocale } from '../i18n/LocaleProvider'

/**
 * Diagram geometry, in its own units: a 4 × 3 grid of 40-wide blocks. A block is its icon (16 tall)
 * over a label and an optional sub-label, 31 tall in all; rows leave 11 between blocks for edges.
 */
const W = 200
const H = 126
const COL = 48
const ROW = 42
const X0 = 6
const Y0 = 6
const BLOCK_W = 40
/** Icons are drawn at twice their pixel size. */
const SCALE = 2
/** Space between an edge's end and the icon it meets. */
const GAP = 2

const cellOf = (b: Block) => ({ x: X0 + b.col * COL, y: Y0 + b.row * ROW })
/** Where a block's icon is drawn, in icon pixels from the cell's corner. */
const iconOffset = (b: Block) => {
  const [iw, ih] = ICON_SIZE[b.icon]
  return { ix: Math.round((BLOCK_W / SCALE - iw) / 2), iy: Math.round((16 / SCALE - ih) / 2), iw, ih }
}
/**
 * Where an edge meets a block. Beside it: the icon's side at its vertical middle. Above or below it
 * (same column): the icon's top, or under the block's labels.
 */
const anchor = (b: Block, towards: Block) => {
  const { x, y } = cellOf(b)
  const { ix, iy, iw } = iconOffset(b)
  if (b.col === towards.col) {
    return { x: x + BLOCK_W / 2, y: b.row < towards.row ? y + (b.sub ? 31 : 25) : y + iy * SCALE - GAP }
  }
  return { x: b.col < towards.col ? x + (ix + iw) * SCALE + GAP : x + ix * SCALE - GAP, y: y + 8 }
}
/**
 * An edge's path and where its label goes. Blocks in one row or column join straight; otherwise the
 * edge turns in the gutter beside the target's column, so it never crosses another block.
 */
const route = (a: Block, b: Block) => {
  const p = anchor(a, b)
  const q = anchor(b, a)
  if (a.col === b.col) {
    return { d: `M${p.x} ${p.y}V${q.y}`, lx: p.x + 3, ly: Math.round((p.y + q.y) / 2) + 1.5, anchor: 'start' as const }
  }
  if (a.row === b.row) {
    return { d: `M${p.x} ${p.y}H${q.x}`, lx: Math.round((p.x + q.x) / 2), ly: p.y - 2, anchor: 'middle' as const }
  }
  const gutter = b.col > a.col ? X0 + b.col * COL - (COL - BLOCK_W) / 2 : X0 + b.col * COL + BLOCK_W + (COL - BLOCK_W) / 2
  return {
    d: `M${p.x} ${p.y}H${gutter}V${q.y}H${q.x}`,
    lx: Math.round((p.x + gutter) / 2),
    ly: p.y - 2,
    anchor: 'middle' as const,
  }
}

export function CaseStudyPanel({ caseId, step }: { caseId: CaseId; step: number }) {
  const { content } = useLocale()
  const text = content.text.cases[caseId]
  const labels = content.text.ui.case
  const { diagram, focus } = CASES[caseId]
  const lit = new Set(focus[Math.min(step, focus.length - 1)])
  const byId = new Map(diagram.blocks.map((b) => [b.id, b]))
  const edgeLit = (id: string, from: string, to: string) => lit.has(id) || (lit.has(from) && lit.has(to))
  const last = step >= focus.length - 1
  const focusNames = diagram.blocks.filter((b) => lit.has(b.id)).map((b) => b.label)

  return (
    <article className="paper case-study" aria-labelledby="case-title">
      <p className="eyebrow">{labels.eyebrow}</p>
      <h2 id="case-title" className="paper-title">{text.title}</h2>
      <svg className="case-diagram" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={diagram.description}>
        <rect width={W} height={H} fill="#1b2336" />
        {/* Lit edges are drawn last, so where two edges share a stretch the lit one shows. */}
        {[...diagram.edges]
          .sort((x, y) => Number(edgeLit(x.id, x.from, x.to)) - Number(edgeLit(y.id, y.from, y.to)))
          .map((e) => {
            const r = route(byId.get(e.from)!, byId.get(e.to)!)
            const on = edgeLit(e.id, e.from, e.to)
            return (
              <g key={e.id} className={`case-edge${on ? ' is-lit' : ''}`} data-edge={e.id} data-focus={on || undefined}>
                <path d={r.d} fill="none" stroke={on ? '#edc567' : '#56658a'} strokeWidth={1} />
                {e.label && (
                  <text x={r.lx} y={r.ly} textAnchor={r.anchor} className="case-edge-label">{e.label}</text>
                )}
              </g>
            )
          })}
        {diagram.blocks.map((b) => {
          const { x, y } = cellOf(b)
          const { ix, iy } = iconOffset(b)
          const on = lit.has(b.id)
          return (
            <g key={b.id} className={`case-block${on ? ' is-lit' : ''}`} data-block={b.id} data-focus={on || undefined}>
              <g transform={`translate(${x} ${y}) scale(${SCALE})`}>
                <PixelRects px={icon(b.icon, ix, iy, b.color)} />
              </g>
              <text x={x + BLOCK_W / 2} y={y + 22} textAnchor="middle" className="case-label">{b.label}</text>
              {b.sub && <text x={x + BLOCK_W / 2} y={y + 28} textAnchor="middle" className="case-sub">{b.sub}</text>}
            </g>
          )
        })}
      </svg>
      <p className="visually-hidden" aria-live="polite">{labels.now} {focusNames.join(', ')}</p>
      {last && text.chips.length > 0 && (
        <ul className="chips case-chips">{text.chips.map((c) => <li key={c}>{c}</li>)}</ul>
      )}
    </article>
  )
}
