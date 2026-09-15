import { site } from '../content/site'
import type { Project } from '../content/types'
import { useLocale } from '../i18n/LocaleProvider'
import { Missing, StatusTag } from './StatusTag'

export function ProjectDetail({ project }: { project: Project }) {
  const labels = useLocale().content.text.ui.project

  return (
    <article className="paper" aria-labelledby="project-title">
      <p className="eyebrow">
        {project.company} · {project.period} <StatusTag status="ready" />
      </p>
      <h2 id="project-title" className="paper-title">
        {project.name}
      </h2>

      <dl className="detail-list">
        <div>
          <dt>{labels.context}</dt>
          <dd>{project.context ?? <Missing>{labels.noContext}</Missing>}</dd>
        </div>
        <div>
          <dt>{labels.role}</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt>{labels.contributions}</dt>
          <dd>
            <ul className="bullets">
              {project.contributions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>{labels.technologies}</dt>
          <dd>
            <ul className="chips" aria-label={labels.technologies}>
              {project.technologies.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      {site.review.showContentStatus && <p className="review-note">{labels.reviewNote}</p>}
    </article>
  )
}
