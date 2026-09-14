import { site } from '../content/site'
import type { MemorySlot } from '../content/types'
import { Missing } from './StatusTag'

export function MemoryPanel({ slot }: { slot: MemorySlot }) {
  return (
    <section className="paper" aria-labelledby="memory-title">
      <p className="eyebrow">Ô ký ức</p>
      <h2 id="memory-title" className="paper-title">
        {slot.label}
      </h2>

      {slot.entries.length > 0 ? (
        <ul className="memory-list">
          {slot.entries.map((entry) => (
            <li key={entry.title} className="memory-card">
              <h3>{entry.title}</h3>
              {entry.platform && <p className="meta">{entry.platform}</p>}
              {entry.note && <p>{entry.note}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <div className="memory-card memory-empty">
          <dl className="detail-list">
            <div>
              <dt>Tên game</dt>
              <dd><Missing>Chưa có</Missing></dd>
            </div>
            <div>
              <dt>Nền tảng / thời điểm</dt>
              <dd><Missing>Chưa có</Missing></dd>
            </div>
            <div>
              <dt>Điều còn nhớ</dt>
              <dd><Missing>Chưa có</Missing></dd>
            </div>
          </dl>
          {site.review.showContentStatus && (
            <p className="review-note">Placeholder: Thọ sẽ bổ sung tên game và kỷ niệm thật.</p>
          )}
        </div>
      )}
    </section>
  )
}
