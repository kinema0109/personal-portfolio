import { PixelRects } from './PixelRects'
import type { Px } from './palette'

/**
 * The cabinet's top bay: the book each Limbus Company sinner is drawn from.
 * Twelve sinners plus Dante, in the game's own order, with Dante at the left like a bookend.
 *
 * `pages` is the length of the work, and it sets how thick the spine is drawn, so the row reads
 * like a real shelf: Hong Lu's Dream of the Red Chamber towers over Gregor's Metamorphosis.
 * Colours are binding colours chosen to nod at each sinner; they carry no logo or cover art.
 */
export const LIMBUS_BOOKS: readonly {
  sinner: string
  title: string
  author: string
  pages: number
  /** Spine height in scene units; an uneven row looks like books, a level one looks like a fence. */
  height: number
  body: string
  band: string
}[] = [
  { sinner: 'Dante', title: 'The Divine Comedy', author: 'Dante Alighieri', pages: 800, height: 23, body: '#1e2230', band: '#c9a45c' },
  { sinner: 'Yi Sang', title: 'The Wings', author: 'Yi Sang', pages: 40, height: 16, body: '#c3cfdd', band: '#b33a32' },
  { sinner: 'Faust', title: 'Faust', author: 'Johann Wolfgang von Goethe', pages: 500, height: 21, body: '#23283f', band: '#c9a45c' },
  { sinner: 'Don Quixote', title: 'Don Quixote', author: 'Miguel de Cervantes', pages: 1000, height: 21, body: '#b8474f', band: '#e8d6b0' },
  { sinner: 'Ryōshū', title: 'Hell Screen', author: 'Ryūnosuke Akutagawa', pages: 50, height: 15, body: '#7a1f22', band: '#1a1a1a' },
  { sinner: 'Meursault', title: 'The Stranger', author: 'Albert Camus', pages: 120, height: 18, body: '#8a8574', band: '#d8cfae' },
  { sinner: 'Hong Lu', title: 'Dream of the Red Chamber', author: 'Cao Xueqin', pages: 2500, height: 23, body: '#2f6b52', band: '#c9a45c' },
  { sinner: 'Heathcliff', title: 'Wuthering Heights', author: 'Emily Brontë', pages: 350, height: 19, body: '#4a3a2a', band: '#6b7a4a' },
  { sinner: 'Ishmael', title: 'Moby-Dick', author: 'Herman Melville', pages: 600, height: 21, body: '#1f4a6b', band: '#d8e4ea' },
  { sinner: 'Rodion', title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', pages: 550, height: 19, body: '#5a2a3a', band: '#a8483a' },
  { sinner: 'Sinclair', title: 'Demian', author: 'Hermann Hesse', pages: 150, height: 16, body: '#9a7a2a', band: '#e0c060' },
  { sinner: 'Outis', title: 'The Odyssey', author: 'Homer', pages: 500, height: 21, body: '#4a4f3a', band: '#8a8f6a' },
  { sinner: 'Gregor', title: 'The Metamorphosis', author: 'Franz Kafka', pages: 70, height: 15, body: '#6b4a24', band: '#c08040' },
]

/** Thicker book, longer work, rounded to the half unit the pixel grid can draw. Thirteen spines
 *  plus their gaps have to fit the 36-unit compartment, so the range is 1.5 to 4. */
function spineWidth(pages: number) {
  return Math.min(4, Math.max(1.5, Math.round((1.2 + pages / 900) * 2) / 2))
}

/** One spine in scene units, with the label shown when the visitor points at it. */
export interface BookSpine {
  title: string
  label: string
  x: number
  y: number
  w: number
  h: number
}

/** Positions every spine left to right from `x`, standing on `floor`. Shared by the drawing and the labels. */
export function layoutBookShelf(x: number, floor: number, gap = 0.6): readonly BookSpine[] {
  let cursor = x
  return LIMBUS_BOOKS.map((book) => {
    const w = spineWidth(book.pages)
    const spine = {
      title: book.title,
      // Some sinners carry the name of their own book or its author, so naming them again would stutter.
      label: book.sinner === book.title || book.sinner === book.author
        ? `${book.title} · ${book.author}`
        : `${book.title} · ${book.author} · ${book.sinner}`,
      x: cursor,
      y: floor - book.height,
      w,
      h: book.height,
    }
    cursor += w + gap
    return spine
  })
}

/** Total width of the row, so it can be checked against the compartment it stands in. */
export function bookShelfWidth(gap = 0.6) {
  return LIMBUS_BOOKS.reduce((total, book) => total + spineWidth(book.pages) + gap, 0) - gap
}

/** One row of book spines standing on the bay floor. */
export function LimbusBookShelf({ x, floor }: { x: number; floor: number }) {
  const spines = layoutBookShelf(x, floor)
  const px: Px[] = spines.flatMap(({ x: sx, y, w, h }, i) => {
    const { body, band } = LIMBUS_BOOKS[i]
    return [
      [sx, y, w, h, body],
      // Head and tail bands, the way a bound book shows lighter cloth at the ends of the spine.
      [sx, y + 1.5, w, 0.8, band],
      [sx, y + h - 3, w, 0.8, band],
    ] as Px[]
  })
  return (
    <g data-shelf="limbus-books">
      <PixelRects px={px} />
    </g>
  )
}
