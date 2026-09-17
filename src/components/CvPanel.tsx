import { useState } from 'react'
import { cvSummary } from '../content/cv'
import { ALSO_USES, FROM_CV, SKILL_GROUPS, skillsInGroup } from '../content/skills'
import { formatPeriod } from '../content/projects'
import { site } from '../content/site'
import type { ProjectId } from '../content/types'
import { useLocale } from '../i18n/LocaleProvider'
import { ContactIcon } from './ContactIcon'
import { Missing, StatusTag } from './StatusTag'

type Tab = 'experience' | 'skills' | 'education' | 'contact'

/** Skills sit second: it is what a reader scanning for a match looks for first after the job list. */
const TABS: readonly Tab[] = ['experience', 'skills', 'education', 'contact']

export function CvPanel({ onOpenProject }: { onOpenProject: (id: ProjectId) => void }) {
  const { content } = useLocale()
  const { text } = content
  const labels = text.ui.cv
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

      {/* No bars, no percentages, no stars. Each skill carries where it was used and since when, all
          of it read out of the project list, so nothing here can claim more than the work shows. */}
      {tab === 'skills' && (
        <div className="skills">
          {SKILL_GROUPS.map((group) => {
            const entries = skillsInGroup(group.id)
            if (entries.length === 0) return null
            return (
              <section key={group.id} className="skill-group">
                <h3>{labels.skillGroups[group.id]}</h3>
                <ul>
                  {entries.map((skill) => (
                    <li key={skill.name}>
                      <strong>{skill.name}</strong>
                      <span className="meta">
                        {labels.usedIn(
                          skill.projectIds.map((id) => content.getProject(id).name).join(' · '),
                        )}
                        {' · '}
                        {labels.since(skill.since)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
          {/* Two weaker tiers, kept apart and labelled, so a reader can tell what is backed by the
              work above and what is only stated. */}
          <section className="skill-group skill-group-also">
            <h3>{labels.fromCv}</h3>
            <p className="skill-also">{FROM_CV.join(' · ')}</p>
            <p className="meta">{labels.fromCvNote}</p>
          </section>
          <section className="skill-group skill-group-also">
            <h3>{labels.alsoUses}</h3>
            <p className="skill-also">{ALSO_USES.join(' · ')}</p>
            <p className="meta">{labels.alsoUsesNote}</p>
          </section>
        </div>
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
        // Full addresses are too long for the panel, so each contact is an icon and a short name; the
        // address itself is in the link's title and accessible name.
        <ul className="contact-links">
          {site.contact.map((item) => (
            <li key={item.id}>
              {item.value === null ? (
                <Missing>
                  {labels.contactLabels[item.id]}: {labels.notProvided}
                </Missing>
              ) : (
                <a
                  className="contact-link"
                  href={item.kind === 'email' ? `mailto:${item.value}` : item.value}
                  target={item.kind === 'url' ? '_blank' : undefined}
                  rel="noopener"
                  title={decodeURI(item.value)}
                  aria-label={`${labels.contactLabels[item.id]}: ${decodeURI(item.value)}`}
                >
                  <ContactIcon id={item.id} />
                  <span>{labels.contactLabels[item.id]}</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
