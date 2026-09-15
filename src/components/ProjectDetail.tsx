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
          <dt>Context</dt>
          <dd>{project.context ?? <Missing>The CV has no context description for this project.</Missing>}</dd>
        </div>
        <div>
          <dt>My role</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt>Contributions</dt>
          <dd>
            <ul className="bullets">
              {project.contributions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>Technologies</dt>
          <dd>
            <ul className="chips" aria-label="Technologies">
              {project.technologies.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      {site.review.showContentStatus && (
        <p className="review-note">Source: CV, plus the product’s public page for context where the CV has none.</p>
      )}
    </article>
  )
}
