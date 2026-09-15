import { useEffect, useRef, useState } from 'react'
import { galleryItems, galleryUrl } from '../content/gallery'
import { useLocale } from '../i18n/LocaleProvider'
import './album.css'

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
        setIndex(i => Math.max(0, Math.min(galleryItems.length - 1, i + (e.key === 'ArrowRight' ? 1 : -1))))
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
      <div className="album-art">
        {item && !failed ? <img key={item.file} src={galleryUrl(item)} alt={item.alt} onError={() => setFailed(true)} />
          : <p role="status">{failed ? labels.loadError : labels.noPictures}</p>}
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
