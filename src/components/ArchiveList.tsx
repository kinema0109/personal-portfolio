import { projects } from '../content/projects'
import type { ProjectId } from '../content/types'

export function ArchiveList({ onOpen }: { onOpen: (id: ProjectId) => void }) {
  return (
    <section className="paper" aria-labelledby="archive-title">
      <h2 id="archive-title" className="paper-title">
        Tất cả dự án trong CV
      </h2>
      <ul className="archive">
        {projects.map((p) => (
          <li key={p.id}>
            <button type="button" className="archive-item" onClick={() => onOpen(p.id)}>
              <span className="archive-name">
                {p.name}
                {p.featured && <span className="tag tag-featured">Nổi bật</span>}
              </span>
              <span className="archive-meta">
                {p.company} · {p.period} · {p.role}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
