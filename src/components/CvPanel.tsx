import { cvSummary } from '../content/cv'
import { getProject } from '../content/projects'
import { site } from '../content/site'
import type { ProjectId } from '../content/types'
import { useCvFile } from '../hooks/useCvFile'
import { Missing } from './StatusTag'

export function CvPanel({ onOpenProject }: { onOpenProject: (id: ProjectId) => void }) {
  const cv = useCvFile()

  return (
    <section className="paper" aria-labelledby="cv-title">
      <p className="eyebrow">{site.role}</p>
      <h2 id="cv-title" className="paper-title">
        {site.name}
      </h2>

      <div className="cv-file">
        {cv.state === 'available' && (
          <a className="btn btn-paper" href={cv.url} target="_blank" rel="noopener">
            Mở CV (PDF)
          </a>
        )}
        {cv.state === 'missing' && <Missing>CV chưa được thêm</Missing>}
        {cv.state === 'checking' && <span className="archive-meta">Đang kiểm tra file CV…</span>}
      </div>

      <h3 className="paper-h3">Kinh nghiệm</h3>
      <ul className="cv-jobs">
        {cvSummary.experience.map((job) => (
          <li key={job.company}>
            <p className="cv-job-head">
              <strong>{job.company}</strong> <span className="archive-meta">{job.period}</span>
            </p>
            <ul className="cv-projects">
              {job.projectIds.map((id) => {
                const p = getProject(id)
                return (
                  <li key={id}>
                    <button type="button" className="link-btn" onClick={() => onOpenProject(id)}>
                      {p.name}
                    </button>{' '}
                    <span className="archive-meta">{p.role}</span>
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ul>

      <h3 className="paper-h3">Học vấn</h3>
      <p>
        {cvSummary.education.school}: {cvSummary.education.major}
        <br />
        <span className="archive-meta">
          {cvSummary.education.period} · GPA {cvSummary.education.gpa}
        </span>
      </p>

      <h3 className="paper-h3">Ngôn ngữ</h3>
      <ul className="bullets">
        {cvSummary.languages.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>

      <h3 className="paper-h3">Liên hệ</h3>
      <dl className="detail-list contact-list">
        {site.contact.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>
              {item.value === null ? (
                <Missing>Chưa bổ sung</Missing>
              ) : (
                <a href={item.kind === 'email' ? `mailto:${item.value}` : item.value} rel="noopener">
                  {item.value}
                </a>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
