import { useState } from 'react'
import { cvSummary } from '../content/cv'
import { getProject } from '../content/projects'
import { site } from '../content/site'
import type { ProjectId } from '../content/types'
import { useCvFile } from '../hooks/useCvFile'
import { Missing } from './StatusTag'

type Tab = 'experience' | 'education' | 'contact'

const TABS: { id: Tab; label: string }[] = [
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

export function CvPanel({ onOpenProject }: { onOpenProject: (id: ProjectId) => void }) {
  const cv = useCvFile()
  const [tab, setTab] = useState<Tab>('experience')

  return (
    <section className="paper" aria-labelledby="cv-title">
      <div className="paper-head">
        <div>
          <p className="eyebrow">{site.role}</p>
          <h2 id="cv-title" className="paper-title">
            {site.name}
          </h2>
        </div>
        <div className="cv-file">
          {cv.state === 'available' && (
            <a className="btn-paper" href={cv.url} target="_blank" rel="noopener">
              Open CV (PDF)
            </a>
          )}
          {cv.state === 'missing' && <Missing>CV not added yet</Missing>}
          {cv.state === 'checking' && <span className="meta">Checking…</span>}
        </div>
      </div>

      <div className="tabs" role="group" aria-label="CV sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className="tab"
            aria-pressed={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'experience' && (
        <ul className="cv-jobs">
          {cvSummary.experience.map((job) => (
            <li key={job.company}>
              <p className="cv-job-head">
                <strong>{job.company}</strong> <span className="meta">{job.period}</span>
              </p>
              <ul className="cv-projects">
                {job.projectIds.map((id) => {
                  const p = getProject(id)
                  return (
                    <li key={id}>
                      <button type="button" className="link-btn" onClick={() => onOpenProject(id)}>
                        {p.name}
                      </button>{' '}
                      <span className="meta">{p.role}</span>
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ul>
      )}

      {tab === 'education' && (
        <dl className="detail-list">
          <div>
            <dt>Education</dt>
            <dd>
              {cvSummary.education.school}: {cvSummary.education.major}
              <br />
              <span className="meta">
                {cvSummary.education.period} · GPA {cvSummary.education.gpa}
              </span>
            </dd>
          </div>
          <div>
            <dt>Languages</dt>
            <dd>
              <ul className="bullets">
                {cvSummary.languages.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      )}

      {tab === 'contact' && (
        <dl className="detail-list contact-list">
          {site.contact.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>
                {item.value === null ? (
                  <Missing>Not provided yet</Missing>
                ) : (
                  <a href={item.kind === 'email' ? `mailto:${item.value}` : item.value} rel="noopener">
                    {item.value}
                  </a>
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}
