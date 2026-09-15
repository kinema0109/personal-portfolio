import { useEffect, useRef, useState } from 'react'

const root = `${import.meta.env.BASE_URL}references/locked/`
const items = [
  { name: 'Gran Centurio', series: 'Yggdra Union', file: 'gran-centurio-concept.png', extra: 'gran-centurio-color.png', note: 'Concept gốc và reference màu vàng, xanh teal.' },
  { name: 'Alhazard', series: 'Langrisser series', file: 'alhazard-reference.png', note: 'Lưỡi tối, chuôi đen và vàng, viên đá đỏ ở tâm hộ thủ.' },
  { name: 'Langrisser', series: 'Langrisser series', file: 'approved-room-screenshot.png', note: 'Thanh kiếm sáng trong khung treo tường. Chưa có file reference riêng.' },
  { name: 'Ambicion', series: 'Tactics Ogre · Ogre Battle Saga', file: 'ambicion-character-reference.png', extra: 'ambicion-sprite.png', note: 'Reference nhân vật và sprite gốc của thanh kiếm nhỏ nằm ngang bên phải.' },
  { name: 'Skaven Grey Seer', series: 'Warhammer', file: 'approved-room-screenshot.png', note: 'Figure trên bàn với sừng và trượng đá xanh. Chưa có ảnh cận cảnh riêng.' },
  { name: 'Alpha Legion', series: 'Warhammer 40,000', file: 'approved-room-screenshot.png', note: 'Figure giáp xanh teal cạnh tai nghe. Chưa có ảnh cận cảnh riêng.' },
] as const

export type CollectionItemName = (typeof items)[number]['name']

interface CollectionProps {
  /** Item to show when the dialog opens; null keeps it closed. Opened from objects in the room. */
  openAt: CollectionItemName | null
  onClose: () => void
}

export function Collection({ openAt, onClose }: CollectionProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [index, setIndex] = useState(0)
  const item = items[index]

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    if (openAt !== null) {
      setIndex(Math.max(0, items.findIndex((entry) => entry.name === openAt)))
      if (!el.open) el.showModal()
    } else if (el.open) {
      el.close()
    }
  }, [openAt])

  return (
    <dialog ref={dialog} className="collection" aria-labelledby="collection-title" onClose={onClose} onKeyDown={e => e.stopPropagation()}>
      <header className="collection-head"><div><p className="eyebrow">Những thế giới mình yêu thích</p><h2 id="collection-title">Bộ sưu tập của Thọ</h2></div><button className="btn" onClick={onClose}>Đóng</button></header>
      <div className="collection-layout">
        <nav className="collection-list" aria-label="Chọn reference">{items.map((entry, i) => <button key={entry.name} className="collection-item" aria-pressed={i === index} onClick={() => setIndex(i)}><span>{String(i + 1).padStart(2, '0')}</span><span><strong>{entry.name}</strong><small>{entry.series}</small></span></button>)}</nav>
        <section className="collection-detail" aria-live="polite">
          <div className="collection-images"><img src={root + item.file} alt={`${item.name} — reference gốc`} />{'extra' in item && <img src={root + item.extra} alt={`${item.name} — reference bổ sung`} />}</div>
          <h3>{item.name}</h3><p className="collection-series">{item.series}</p><p>{item.note}</p><a href={root + item.file} target="_blank" rel="noreferrer">Xem ảnh nguyên bản ↗</a>
        </section>
      </div>
    </dialog>
  )
}
