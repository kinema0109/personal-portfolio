import type { ReactNode } from 'react'
import { site } from '../content/site'
import type { ContentStatus } from '../content/types'
import { useLocale } from '../i18n/LocaleProvider'

/** Review-mode tags for content that is not final: draft wording, placeholders, draft translations. */
export function StatusTag({ status }: { status: ContentStatus }) {
  const { text } = useLocale().content
  if (!site.review.showContentStatus) return null
  const labels = text.ui.status
  const translationDraft = status === 'ready' && text.translationStatus === 'draft'
  return (
    <>
      {status !== 'ready' && <span className={`tag tag-${status}`}>{labels[status]}</span>}
      {translationDraft && <span className="tag tag-draft">{labels.translationDraft}</span>}
    </>
  )
}

export function Missing({ children }: { children: ReactNode }) {
  return <span className="missing">{children}</span>
}
