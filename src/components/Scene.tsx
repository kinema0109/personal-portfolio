import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { ALBUM_BOX, APARTMENT_FOCUS, ApartmentScene, type ScreenMode } from '../art/ApartmentScene'
import { frameCamera, type Camera, type Region } from '../art/camera'
import { site } from '../content/site'

interface SceneProps {
  screen: ScreenMode
  speaker: string
  /** Makes the album on the desk clickable. */
  albumEnabled: boolean
  onAlbum: () => void
  /** Screen area not covered by the UI; the camera keeps the focus inside it. */
  region: Region | null
  /** Whether a detail panel is open. The camera glides only when this changes. */
  panelOpen: boolean
  /** Glint on the album until the visitor has opened the gallery. */
  sparkle: boolean
}

const DESCRIPTION =
  'Pixel art: a small apartment at night. A developer sits at a desk with a laptop, an open photo album, a glass of water, a game cartridge, a desk fan and headphones. A poster hangs on the wall.'

/** Camera glides play as a few whole frames, like the rest of the pixel art. */
const PAN_FRAMES = 5
const PAN_FRAME_MS = 50
/** The free region is re-measured right after a panel opens or closes; moves within this window glide. */
const PANEL_GLIDE_WINDOW_MS = 400

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Scene({ screen, speaker, albumEnabled, onAlbum, region, panelOpen, sparkle }: SceneProps) {
  const layerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })

  useLayoutEffect(() => {
    const el = layerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const free = region ?? { left: 0, top: 0, width: size.w, height: size.h }
  const target = frameCamera(size.w, size.h, free, APARTMENT_FOCUS)
  const [pan, setPan] = useState<{ x: number; y: number } | null>(null)
  const cam: Camera = pan ? { ...target, ...pan } : target
  const viewBox = `${cam.x} ${cam.y} ${cam.w} ${cam.h}`

  const measured = region !== null
  // What is on screen right now, so an interrupted glide carries on from there.
  const shown = useRef({ measured, cam })
  const panelChangedAt = useRef(-Infinity)
  const targetKey = [measured, target.x, target.y, target.scale, target.w, target.h].join('|')

  useLayoutEffect(() => {
    panelChangedAt.current = performance.now()
  }, [panelOpen])

  // When a panel opens or closes, glide the room over instead of jumping.
  // Dialogue steps, zoom changes, resizes and the first measurement still snap.
  useLayoutEffect(() => {
    const from = shown.current
    const afterPanelChange = performance.now() - panelChangedAt.current < PANEL_GLIDE_WINDOW_MS
    const sameFraming =
      from.measured === measured &&
      from.cam.scale === target.scale &&
      from.cam.w === target.w &&
      from.cam.h === target.h
    const moved = from.cam.x !== target.x || from.cam.y !== target.y
    if (!afterPanelChange || !sameFraming || !moved || reducedMotion()) {
      setPan(null)
      return
    }

    const snap = (v: number) => Math.round(v * target.scale) / target.scale
    let frame = 0
    setPan({ x: from.cam.x, y: from.cam.y })
    const id = window.setInterval(() => {
      frame += 1
      if (frame >= PAN_FRAMES) {
        window.clearInterval(id)
        setPan(null)
        return
      }
      const t = easeInOutCubic(frame / PAN_FRAMES)
      setPan({
        x: snap(from.cam.x + (target.x - from.cam.x) * t),
        y: snap(from.cam.y + (target.y - from.cam.y) * t),
      })
    }, PAN_FRAME_MS)
    return () => window.clearInterval(id)
    // targetKey covers every input of `target`.
  }, [targetKey])

  useLayoutEffect(() => {
    shown.current = { measured, cam }
  })

  // Album hotspot in CSS px; only shown when it is not hidden behind the UI.
  const album = {
    left: (ALBUM_BOX.x - cam.x) * cam.scale,
    top: (ALBUM_BOX.y - cam.y) * cam.scale,
    width: ALBUM_BOX.w * cam.scale,
    height: ALBUM_BOX.h * cam.scale,
  }
  const albumVisible =
    album.left >= free.left &&
    album.top >= free.top &&
    album.left + album.width <= free.left + free.width &&
    album.top + album.height <= free.top + free.height

  // The scene opens with a pixel iris centred on the uncovered part of the screen.
  const irisOrigin = {
    '--iris-x': `${free.left + free.width / 2}px`,
    '--iris-y': `${free.top + free.height / 2}px`,
  } as CSSProperties

  return (
    <div className="scene-layer" ref={layerRef}>
      <figure className="scene" role="img" aria-label={DESCRIPTION}>
        <div className="scene-art" style={irisOrigin}>
          <ApartmentScene viewBox={viewBox} screen={screen} speaking={speaker === 'THỌ'} sparkle={sparkle} />
        </div>
      </figure>

      {site.review.showArtworkNotice && (
        <p className="art-notice">
          Placeholder art<span className="art-notice-detail"> · final art coming later</span>
        </p>
      )}

      {albumEnabled && albumVisible && (
        <button type="button" className="hotspot" style={album} onClick={onAlbum}>
          <span className="hotspot-label">Open album</span>
        </button>
      )}
    </div>
  )
}
