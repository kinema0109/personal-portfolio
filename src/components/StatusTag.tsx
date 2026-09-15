import type { ReactNode } from 'react'
import { site } from '../content/site'
import type { ContentStatus } from '../content/types'
import { useLocale } from '../i18n/LocaleProvider'

/** Review-mode tags: content status, draft translation and source. */
export function StatusTag({ status, source }: { status: ContentStatus; source?: string }) {
  const { text } = useLocale().content
  if (!site.review.showContentStatus) return null
  const labels = text.ui.status
  const translationDraft = status === 'ready' && text.translationStatus === 'draft'
  return (
    <>
      {status !== 'ready' && <span className={`tag tag-${status}`}>{labels[status]}</span>}
      {translationDraft && <span className="tag tag-draft">{labels.translationDraft}</span>}
      {source && status === 'ready' && <span className="tag tag-source">{labels.source(source)}</span>}
    </>
  )
}

export function Missing({ children }: { children: ReactNode }) {
  return <span className="missing">{children}</span>
}
