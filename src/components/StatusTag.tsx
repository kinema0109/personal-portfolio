import type { ReactNode } from 'react'
import { site } from '../content/site'
import type { ContentStatus } from '../content/types'

const LABELS: Record<Exclude<ContentStatus, 'ready'>, string> = {
  draft: 'Bản nháp · cần Thọ xác nhận',
  placeholder: 'Chờ nội dung thật',
}

export function StatusTag({ status, source }: { status: ContentStatus; source?: string }) {
  if (!site.review.showContentStatus) return null
  return (
    <>
      {status !== 'ready' && <span className={`tag tag-${status}`}>{LABELS[status]}</span>}
      {source && status === 'ready' && <span className="tag tag-source">Nguồn: {source}</span>}
    </>
  )
}

export function Missing({ children }: { children: ReactNode }) {
  return <span className="missing">{children}</span>
}
