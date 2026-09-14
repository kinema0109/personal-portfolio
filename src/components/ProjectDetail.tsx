import { site } from '../content/site'
import type { Project } from '../content/types'
import { Missing } from './StatusTag'

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <article className="paper" aria-labelledby="project-title">
      <p className="eyebrow">
        {project.company} · {project.period}
      </p>
      <h2 id="project-title" className="paper-title">
        {project.name}
      </h2>

      <dl className="detail-list">
        <div>
          <dt>Bối cảnh</dt>
          <dd>{project.context ?? <Missing>CV chưa có mô tả bối cảnh cho dự án này.</Missing>}</dd>
        </div>
        <div>
          <dt>Vai trò của mình</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt>Đóng góp</dt>
          <dd>
            <ul className="bullets">
              {project.contributions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>Công nghệ</dt>
          <dd>
            <ul className="chips" aria-label="Công nghệ">
              {project.technologies.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      {site.review.showContentStatus && (
        <p className="review-note">Nguồn: CV. Chưa có ảnh chụp, link demo hay số liệu kết quả.</p>
      )}
    </article>
  )
}
