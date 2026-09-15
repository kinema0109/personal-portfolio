import type { ReactNode } from 'react'
import { site } from '../content/site'
import type { ContentStatus } from '../content/types'

const LABELS: Record<Exclude<ContentStatus, 'ready'>, string> = {
  draft: 'Draft · needs Thọ to confirm',
  placeholder: 'Waiting for real content',
}

export function StatusTag({ status, source }: { status: ContentStatus; source?: string }) {
  if (!site.review.showContentStatus) return null
  return (
    <>
      {status !== 'ready' && <span className={`tag tag-${status}`}>{LABELS[status]}</span>}
      {source && status === 'ready' && <span className="tag tag-source">Source: {source}</span>}
    </>
  )
}

export function Missing({ children }: { children: ReactNode }) {
  return <span className="missing">{children}</span>
}
