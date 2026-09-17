import { useEffect, useRef, useState } from 'react'
import { galleryItems, galleryUrl } from '../content/gallery'
import { useLocale } from '../i18n/LocaleProvider'
import './album.css'

/** A horizontal drag longer than this, in CSS px, turns the page. */
const SWIPE_PX = 40
/** A press that moves less than this, in CSS px, is a tap on whichever half it landed. */
const TAP_PX = 10

/** One full composition at a time; navigation stops at the final picture. */
export function GalleryPanel({ onClose }: { onClose: () => void }) {
  const labels = useLocale().content.text.ui.gallery
  const [index, setIndex] = useState(0)
  const [failed, setFailed] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  const item = galleryItems[index]
  const last = index === galleryItems.length - 1
  const go = (step: number) => setIndex(i => Math.max(0, Math.min(galleryItems.length - 1, i + step)))
  const pressStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    dialog.showModal()
    return () => dialog.close()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopImmediatePropagation()
        closeRef.current()
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault()
        e.stopImmediatePropagation()
        go(e.key === 'ArrowRight' ? 1 : -1)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [])

  useEffect(() => {
    setFailed(false)
    const next = galleryItems[index + 1]
    if (next) { const image = new Image(); image.src = galleryUrl(next) }
  }, [index])

  return (
    <dialog ref={dialogRef} className="album-viewer" aria-labelledby="album-title"
      onCancel={e => { e.preventDefault(); onClose() }}>
      <header className="album-header">
        <div><p className="eyebrow">{labels.eyebrow}</p><h2 id="album-title">{labels.title}</h2></div>
        <button type="button" className="btn album-close" onClick={onClose} autoFocus>{labels.close} <kbd>Esc</kbd></button>
      </header>
      {/* Picture only: no visible title or description (alt text stays for screen readers). */}
      <div className="album-art"
        // Taps and swipes are both read here, on release, rather than from click events: after a
        // swipe, touch browsers can swallow the click of the next tap.
        onPointerDown={e => {
          if (e.button !== 0) return
          // A mouse press would otherwise move focus out of the dialog's controls.
          if (e.pointerType === 'mouse') e.preventDefault()
          pressStart.current = { x: e.clientX, y: e.clientY }
        }}
        onPointerCancel={() => { pressStart.current = null }}
        onPointerUp={e => {
          const start = pressStart.current
          pressStart.current = null
          if (!start) return
          const dx = e.clientX - start.x
          const dy = e.clientY - start.y
          if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
          else if (Math.abs(dx) < TAP_PX && Math.abs(dy) < TAP_PX) {
            const box = e.currentTarget.getBoundingClientRect()
            go(e.clientX < box.left + box.width / 2 ? -1 : 1)
          }
        }}>
        {item && !failed ? <img key={item.file} src={galleryUrl(item)} alt={item.alt} draggable={false} onError={() => setFailed(true)} />
          : <p role="status">{failed ? labels.loadError : labels.noPictures}</p>}
        {/* Facebook-style: the left half of the picture goes back, the right half goes on, and neither
            passes an end. These halves only show the arrow; the press is handled above. The footer
            buttons and the arrow keys stay the accessible controls. */}
        <span className="album-zone album-zone-prev" aria-hidden="true" data-end={index === 0}>
          <span className="album-zone-arrow">‹</span>
        </span>
        <span className="album-zone album-zone-next" aria-hidden="true" data-end={last}>
          <span className="album-zone-arrow">›</span>
        </span>
      </div>
      <footer className="album-footer">
        <button type="button" className="btn" disabled={index === 0} onClick={() => setIndex(i => i - 1)}>← {labels.prev}</button>
        <span className="album-hint">
          <span className="album-number" aria-live="polite" aria-atomic="true">
            {String(index + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}
          </span>
          <span className="album-hint-text">{last ? labels.lastPage : labels.keyHint}</span>
        </span>
        <button type="button" className="btn album-next" onClick={() => last ? onClose() : setIndex(i => i + 1)}>
          {last ? labels.finish : labels.next} {last ? '✓' : '→'}
        </button>
      </footer>
    </dialog>
  )
}
