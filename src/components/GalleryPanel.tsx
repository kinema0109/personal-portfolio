import { useEffect, useRef, useState } from 'react'
import { EMPTY_FRAME_COUNT, galleryItems, galleryUrl } from '../content/gallery'
import { site } from '../content/site'
import { useLocale } from '../i18n/LocaleProvider'
import { Missing } from './StatusTag'

export function GalleryPanel() {
  const labels = useLocale().content.text.ui.gallery
  const count = galleryItems.length
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // While the lightbox is open, its keys must not reach the dialogue shortcuts (1–9, Esc = back).
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % count)
      else if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + count) % count)
      else if (e.key !== 'Escape' && !/^[1-9]$/.test(e.key)) return
      e.stopPropagation()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open, count])

  const item = galleryItems[index]

  return (
    <section className="paper" aria-labelledby="gallery-title">
      <p className="eyebrow">{labels.eyebrow}</p>
      <h2 id="gallery-title" className="paper-title">
        {labels.title}
      </h2>

      {count > 0 ? (
        <ul className="gallery-grid">
          {galleryItems.map((it, i) => (
            <li key={it.file}>
              <button
                type="button"
                className="gallery-thumb"
                aria-label={labels.open(it.title)}
                onClick={() => {
                  setIndex(i)
                  setOpen(true)
                }}
              >
                <img src={galleryUrl(it)} alt="" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <ul className="gallery-grid" aria-hidden="true">
            {Array.from({ length: EMPTY_FRAME_COUNT }, (_, i) => (
              <li key={i} className="gallery-empty" />
            ))}
          </ul>
          <p className="gallery-status">
            <Missing>{labels.noPictures}</Missing>
          </p>
          {site.review.showContentStatus && <p className="review-note">{labels.placeholderNote}</p>}
        </>
      )}

      {item && (
        <dialog
          ref={dialogRef}
          className="lightbox"
          aria-labelledby="lightbox-title"
          onClose={() => setOpen(false)}
          onClick={(e) => {
            // A click on the dialog element itself is a click on the backdrop.
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <figure>
            <img className="lightbox-img" src={galleryUrl(item)} alt={item.alt} />
            <figcaption className="lightbox-bar">
              <span className="lightbox-title">
                <strong id="lightbox-title">{item.title}</strong>
                {item.credit && <span className="meta">{item.credit}</span>}
              </span>
              <span className="lightbox-count">
                {index + 1} / {count}
              </span>
              <span className="lightbox-controls">
                {count > 1 && (
                  <>
                    <button type="button" className="btn" onClick={() => setIndex((index - 1 + count) % count)}>
                      <span aria-hidden="true">←</span> {labels.prev}
                    </button>
                    <button type="button" className="btn" onClick={() => setIndex((index + 1) % count)}>
                      {labels.next} <span aria-hidden="true">→</span>
                    </button>
                  </>
                )}
                <button type="button" className="btn" onClick={() => setOpen(false)}>
                  {labels.close}
                </button>
              </span>
            </figcaption>
          </figure>
        </dialog>
      )}
    </section>
  )
}
