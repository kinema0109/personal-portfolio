import { useState } from 'react'
import { cvSummary } from '../content/cv'
import { formatPeriod } from '../content/projects'
import { site } from '../content/site'
import type { ProjectId } from '../content/types'
import { useCvFile } from '../hooks/useCvFile'
import { useLocale } from '../i18n/LocaleProvider'
import { Missing, StatusTag } from './StatusTag'

type Tab = 'experience' | 'education' | 'contact'

const TABS: readonly Tab[] = ['experience', 'education', 'contact']

export function CvPanel({ onOpenProject }: { onOpenProject: (id: ProjectId) => void }) {
  const { content } = useLocale()
  const { text } = content
  const labels = text.ui.cv
  const cv = useCvFile()
  const [tab, setTab] = useState<Tab>('experience')

  return (
    <section className="paper" aria-labelledby="cv-title">
      <div className="paper-head">
        <div>
          <p className="eyebrow">
            {text.role} <StatusTag status="ready" />
          </p>
          <h2 id="cv-title" className="paper-title">
            {site.name}
          </h2>
        </div>
        <div className="cv-file">
          {cv.state === 'available' && (
            <a className="btn-paper" href={cv.url} target="_blank" rel="noopener">
              {labels.openPdf}
            </a>
          )}
          {cv.state === 'missing' && <Missing>{labels.notAdded}</Missing>}
          {cv.state === 'checking' && <span className="meta">{labels.checking}</span>}
        </div>
      </div>

      <div className="tabs" role="group" aria-label={labels.sections}>
        {TABS.map((id) => (
          <button key={id} type="button" className="tab" aria-pressed={tab === id} onClick={() => setTab(id)}>
            {labels[id]}
          </button>
        ))}
      </div>

      {tab === 'experience' && (
        <ul className="cv-jobs">
          {cvSummary.experience.map((job) => (
            <li key={job.company}>
              <p className="cv-job-head">
                <strong>{job.company}</strong>{' '}
                <span className="meta">{formatPeriod(job.start, job.end, text.present)}</span>
              </p>
              <ul className="cv-projects">
                {job.projectIds.map((id) => {
                  const p = content.getProject(id)
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
            <dt>{labels.education}</dt>
            <dd>
              {text.cv.school}: {text.cv.major}
              <br />
              <span className="meta">
                {formatPeriod(cvSummary.education.start, cvSummary.education.end, text.present)} ·{' '}
                {labels.gpa(cvSummary.education.gpa)}
              </span>
            </dd>
          </div>
          <div>
            <dt>{labels.languages}</dt>
            <dd>
              <ul className="bullets">
                {text.cv.languages.map((l) => (
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
            <div key={item.id}>
              <dt>{labels.contactLabels[item.id]}</dt>
              <dd>
                {item.value === null ? (
                  <Missing>{labels.notProvided}</Missing>
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
