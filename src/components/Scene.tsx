import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import {
  ALBUM_BOX,
  APARTMENT_FOCUS,
  ApartmentScene,
  DRAWER_BOX,
  FIRE_EMBLEM_SHELF,
  LAPTOP_BOX,
  FAN_BOX,
  FAN_SPEEDS,
  LIMBUS_SHELF,
  type DroppedSun,
  type ScreenMode,
} from '../art/ApartmentScene'
import { layoutBookShelf } from '../art/BookShelf'
import { FIGURES } from '../art/Figures'
import { SUNFLOWER_BOX, SUN_FADE_MS, SUN_LIFE_MS, SUN_SIZE, SUN_SPOTS, SUN_TAKE_MS } from '../art/Sunflower'
import { layoutFireEmblemShelf } from '../art/GameShelf'
import { frameCamera, type Camera, type Rect } from '../art/camera'
import { site } from '../content/site'
import type { HotspotId, SpeakerId } from '../content/types'
import type { FreeRegion } from '../hooks/useFreeRegion'
import { useLocale } from '../i18n/LocaleProvider'
import './shelf.css'

/**
 * Destinations live in the room itself; there are no shortcut buttons to find them.
 * The sword frame and display cabinet are personal references only and stay non-interactive.
 */
const HOTSPOTS: readonly { id: HotspotId; box: Rect }[] = [
  { id: 'laptop', box: LAPTOP_BOX },
  { id: 'album', box: ALBUM_BOX },
  { id: 'drawer', box: DRAWER_BOX },
]

interface SceneProps {
  screen: ScreenMode
  speaker: SpeakerId
  onHotspot: (id: HotspotId) => void
  /** Screen area not covered by the UI; the camera keeps the focus inside it. */
  region: FreeRegion | null
  /** Whether a detail panel is open. The camera glides only when this changes. */
  panelOpen: boolean
  /** Glint on the album until the visitor has opened the gallery. */
  sparkle: boolean
}

/** Spines that name themselves on hover, focus or tap: the games in the cabinet and the books over the desk. */
const SHELF_SPINES = [
  ...layoutFireEmblemShelf(FIRE_EMBLEM_SHELF.x, FIRE_EMBLEM_SHELF.floor),
  ...layoutBookShelf(LIMBUS_SHELF.x, LIMBUS_SHELF.floor),
  // The collectibles say a line of their own rather than naming themselves.
  ...Object.entries(FIGURES).map(([kind, f]) => ({ title: kind, label: f.label, x: f.x, y: f.y, w: f.w, h: f.h })),
]

/** Camera glides play as a few whole frames, like the rest of the pixel art. */
const PAN_FRAMES = 5
const PAN_FRAME_MS = 50
/** The free region is re-measured right after a panel opens or closes; moves within this window glide. */
const PANEL_GLIDE_WINDOW_MS = 400

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Scene({ screen, speaker, onHotspot, region, panelOpen, sparkle }: SceneProps) {
  const ui = useLocale().content.text.ui
  const layerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  const [suns, setSuns] = useState<readonly DroppedSun[]>([])
  const [charge, setCharge] = useState(0)
  const [fanStep, setFanStep] = useState(0)
  const fanSpeed = FAN_SPEEDS[fanStep]
  const nextSunId = useRef(0)
  const timers = useRef(new Map<number, number[]>())

  const clearTimers = (id: number) => {
    timers.current.get(id)?.forEach(clearTimeout)
    timers.current.delete(id)
  }
  const after = (id: number, ms: number, run: () => void) => {
    const handles = timers.current.get(id) ?? []
    handles.push(window.setTimeout(run, ms))
    timers.current.set(id, handles)
  }
  const drop = (id: number) => {
    setSuns((current) => current.filter((sun) => sun.id !== id))
    clearTimers(id)
  }
  const setState = (id: number, state: DroppedSun['state']) =>
    setSuns((current) => current.map((sun) => (sun.id === id ? { ...sun, state } : sun)))

  useEffect(() => {
    const all = timers.current
    return () => all.forEach((handles) => handles.forEach(clearTimeout))
  }, [])

  // Plants vs. Zombies: the flower spits out a sun, a sun left alone goes out on its own, and a sun
  // that is taken flies into Thọ. There is no counter and no score, so the only state is the suns.
  const dropSun = () =>
    setSuns((current) => {
      const taken = new Set(current.map((sun) => `${sun.x},${sun.y}`))
      const spot = SUN_SPOTS.find((s) => !taken.has(`${s.x},${s.y}`))
      if (!spot) return current
      const id = nextSunId.current++
      after(id, SUN_LIFE_MS, () => {
        setState(id, 'fading')
        after(id, SUN_FADE_MS, () => drop(id))
      })
      return [...current, { id, x: spot.x, y: spot.y, state: 'idle' }]
    })

  const takeSun = (id: number) => {
    clearTimers(id)
    setState(id, 'taken')
    setCharge((n) => n + 1)
    after(id, SUN_TAKE_MS, () => drop(id))
  }

  useLayoutEffect(() => {
    const el = layerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const free = region ?? { left: 0, top: 0, width: size.w, height: size.h, menu: null }
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
  // Zoom changes, resizes and the first measurement still snap. Dialogue steps and the choice menu never move the room.
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

  // Scene boxes in CSS px; each is only offered when no UI hides it, including the choice menu drawn over the room.
  const menu = free.menu
  const toScreen = (box: Rect) => ({
    left: (box.x - cam.x) * cam.scale,
    top: (box.y - cam.y) * cam.scale,
    width: box.w * cam.scale,
    height: box.h * cam.scale,
  })
  const isOffered = (style: ReturnType<typeof toScreen>) => {
    const right = style.left + style.width
    const bottom = style.top + style.height
    const inside =
      style.left >= free.left && style.top >= free.top && right <= free.left + free.width && bottom <= free.top + free.height
    const underMenu =
      menu !== null && style.left < menu.right && right > menu.left && style.top < menu.bottom && bottom > menu.top
    return inside && !underMenu
  }
  const hotspots = HOTSPOTS.flatMap(({ id, box }) => {
    const style = toScreen(box)
    return isOffered(style) ? [{ id, style }] : []
  })
  const shelfLabels = SHELF_SPINES.flatMap((spine) => {
    const style = toScreen(spine)
    // Labels open towards the middle of the screen so long titles are not cut off at the edge.
    const alignEnd = style.left + style.width / 2 > size.w / 2
    return isOffered(style) ? [{ key: spine.title, label: spine.label, style, alignEnd }] : []
  })

  // The scene opens with a pixel iris centred on the uncovered part of the screen.
  const irisOrigin = {
    '--iris-x': `${free.left + free.width / 2}px`,
    '--iris-y': `${free.top + free.height / 2}px`,
  } as CSSProperties

  return (
    <div className="scene-layer" ref={layerRef}>
      <figure className="scene" role="img" aria-label={ui.sceneDescription}>
        <div className="scene-art" style={irisOrigin}>
          <ApartmentScene
            viewBox={viewBox}
            screen={screen}
            speaking={speaker === 'tho'}
            sparkle={sparkle}
            suns={suns}
            charge={charge}
            fanSpeed={fanSpeed}
          />
        </div>
      </figure>

      {site.review.showArtworkNotice && (
        <p className="art-notice">
          {ui.artNotice}
          <span className="art-notice-detail">{ui.artNoticeDetail}</span>
        </p>
      )}

      {shelfLabels.map(({ key, label, style, alignEnd }) => (
        <button key={key} type="button" tabIndex={-1} className="shelf-spine" style={style} aria-label={label}>
          <span className={`hotspot-label shelf-label${alignEnd ? ' align-end' : ''}`} aria-hidden="true">
            {label}
          </span>
        </button>
      ))}

      {isOffered(toScreen(FAN_BOX)) && (
        <button
          type="button"
          className="hotspot hotspot-plain"
          style={toScreen(FAN_BOX)}
          onClick={() => setFanStep((step) => (step + 1) % FAN_SPEEDS.length)}
          aria-label={`${ui.fan}: ${fanSpeed}`}
        />
      )}

      {isOffered(toScreen(SUNFLOWER_BOX)) && (
        <button
          type="button"
          className="hotspot hotspot-plain"
          style={toScreen(SUNFLOWER_BOX)}
          onClick={dropSun}
          aria-label={ui.sunflower}
        />
      )}

      {suns.filter((sun) => sun.state === 'idle').map((sun) => (
        <button
          key={sun.id}
          type="button"
          className="hotspot hotspot-plain"
          style={toScreen({ x: sun.x, y: sun.y, w: SUN_SIZE, h: SUN_SIZE })}
          onClick={() => takeSun(sun.id)}
          aria-label={ui.sun}
        />
      ))}

      {hotspots.map(({ id, style }) => (
        <button key={id} type="button" className="hotspot" style={style} onClick={() => onHotspot(id)}>
          <span className="hotspot-label">{ui.hotspots[id]}</span>
        </button>
      ))}
    </div>
  )
}
