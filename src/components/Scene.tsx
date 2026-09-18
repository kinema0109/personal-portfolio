import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import {
  ALBUM_BOX,
  APARTMENT_FOCUS,
  ApartmentScene,
  DRAWER_BOX,
  FIRE_EMBLEM_SHELF,
  PC_BOX,
  FAN_BOX,
  FAN_SPEEDS,
  SPEAKER_BOX,
  LIMBUS_SHELF,
  type DroppedSun,
  type ScreenMode,
} from '../art/ApartmentScene'
import { layoutBookShelf } from '../art/BookShelf'
import { FIGURES } from '../art/Figures'
import { SUNFLOWER_BOX, SUNFLOWER_TOSS, SUN_FADE_MS, SUN_LIFE_MS, SUN_SIZE, SUN_SPOTS, SUN_TAKE_MS } from '../art/Sunflower'
import { GROW_AFTER, SUNSHROOM_BOX, shroomToss } from '../art/SunShroom'
import { EMPTY_ENERGY, addSun, tick, type Energy } from '../state/energy'
import { layoutFireEmblemShelf } from '../art/GameShelf'
import { frameCamera, type Camera, type Rect } from '../art/camera'
import { site } from '../content/site'
import type { HotspotId, SpeakerId } from '../content/types'
import type { FreeRegion } from '../hooks/useFreeRegion'
import { useLocale } from '../i18n/LocaleProvider'
import { usePhase } from '../daylight/PhaseProvider'
import { useZombie } from '../hooks/useZombie'
import { useWalker } from '../hooks/useWalker'
import { useQliphoth } from '../hooks/useQliphoth'
import { SLIME_TIMING } from '../art/Slime'
import { PYLON_BOX, PYLON_LINE_MS, type Power } from '../art/Pylon'
import './shelf.css'

/**
 * Destinations live in the room itself; there are no shortcut buttons to find them.
 * The sword frame and display cabinet are personal references only and stay non-interactive.
 */
const HOTSPOTS: readonly { id: HotspotId; box: Rect }[] = [
  { id: 'pc', box: PC_BOX },
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
  /** Advancing the story by clicking Thọ; null when the current step is the last one. */
  onAdvance: (() => void) | null
  /** The room's power, from the pylon under the desk. */
  power: Power
  /** Powers the pylon down, or warps it back in. */
  onPower: () => void
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
/** Timer bucket for the Sun-shroom's flash-then-toss; sun ids start at 0, so this never collides. */
const SHROOM_TIMER = -1
/** The flash peaks here, and that is when the sun comes out. */
const SHROOM_FLASH_MS = 180
/** How often energy drains and the build advances while either is active. */
const ENERGY_TICK_MS = 500
/** The free region is re-measured right after a panel opens or closes; moves within this window glide. */
const PANEL_GLIDE_WINDOW_MS = 400
/** Thọ's pylon caption keeps this far, in CSS px, from the edges of the screen. */
const LINE_MARGIN = 8

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Scene({ screen, speaker, onHotspot, region, panelOpen, sparkle, onAdvance, power, onPower }: SceneProps) {
  const ui = useLocale().content.text.ui
  const { phase } = usePhase()
  const zombie = useZombie(phase)
  const slime = useWalker(true, SLIME_TIMING)
  const powered = power === 'on'
  // Thọ asks for pylons for a moment each time the power goes.
  const [pylonLine, setPylonLine] = useState(false)
  useEffect(() => {
    if (power !== 'off') {
      setPylonLine(false)
      return
    }
    setPylonLine(true)
    const t = window.setTimeout(() => setPylonLine(false), PYLON_LINE_MS)
    return () => window.clearTimeout(t)
  }, [power])
  const lineRef = useRef<HTMLParagraphElement>(null)
  const [lineBox, setLineBox] = useState({ w: 0, h: 0 })
  const layerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  const [suns, setSuns] = useState<readonly DroppedSun[]>([])
  const [charge, setCharge] = useState(0)
  const [energy, setEnergy] = useState<Energy>(EMPTY_ENERGY)
  const energyActive = energy.seconds > 0 || energy.okFor > 0
  // Read from the interval below without restarting it, so toggling the power does not lose a tick.
  const poweredRef = useRef(powered)
  poweredRef.current = powered

  // Energy drains and the build advances only while there is something to show, so an idle room
  // does not re-render twice a second. Elapsed time comes from the clock, not the tick count, because
  // background tabs throttle intervals. With the power off energy still drains, but the build on the
  // dark PC holds where it is.
  useEffect(() => {
    if (!energyActive) return
    let last = performance.now()
    const id = window.setInterval(() => {
      const now = performance.now()
      const dt = (now - last) / 1000
      last = now
      setEnergy((e) => tick(e, dt, poweredRef.current))
    }, ENERGY_TICK_MS)
    return () => window.clearInterval(id)
  }, [energyActive])
  const [fanStep, setFanStep] = useState(0)
  // What the pointer is over, so the object itself can be outlined instead of its click box.
  const [highlight, setHighlight] = useState<string | null>(null)
  const points = (id: string) => ({
    onPointerEnter: () => setHighlight(id),
    onPointerLeave: () => setHighlight((current) => (current === id ? null : current)),
    onFocus: () => setHighlight(id),
    onBlur: () => setHighlight((current) => (current === id ? null : current)),
  })
  const fanSpeed = FAN_SPEEDS[fanStep]
  const nextSunId = useRef(0)
  const timers = useRef(new Map<number, number[]>())
  const [shroomTaken, setShroomTaken] = useState(0)
  const shroomGrown = shroomTaken >= GROW_AFTER
  const [shroomFlash, setShroomFlash] = useState(0)
  const [shroomNudge, setShroomNudge] = useState(0)

  const clearTimers = (id: number) => {
    timers.current.get(id)?.forEach(clearTimeout)
    timers.current.delete(id)
  }
  const after = (id: number, ms: number, run: () => void) => {
    // A handle forgets itself once it has fired, so a bucket that is never cleared does not grow.
    const handle = window.setTimeout(() => {
      const left = (timers.current.get(id) ?? []).filter((h) => h !== handle)
      if (left.length > 0) timers.current.set(id, left)
      else timers.current.delete(id)
      run()
    }, ms)
    timers.current.set(id, [...(timers.current.get(id) ?? []), handle])
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

  // Plants vs. Zombies: a plant spits out a sun, a sun left alone goes out on its own, and a sun that
  // is taken flies into Thọ. There is no counter and no score, so the only state is the suns.
  const dropSun = (plant: DroppedSun['plant'], size: DroppedSun['size'], origin: DroppedSun['origin']) =>
    setSuns((current) => {
      const taken = new Set(current.map((sun) => `${sun.x},${sun.y}`))
      const spot = SUN_SPOTS.find((s) => !taken.has(`${s.x},${s.y}`))
      if (!spot) return current
      const id = nextSunId.current++
      after(id, SUN_LIFE_MS, () => {
        setState(id, 'fading')
        after(id, SUN_FADE_MS, () => drop(id))
      })
      return [...current, { id, x: spot.x, y: spot.y, state: 'idle', plant, size, origin }]
    })

  // The Sunflower is a contained Abnormality: eager clicks lower its Qliphoth counter, and at zero it
  // breaches and keeps tossing suns until it is suppressed. It needs no power, so it ignores the pylon.
  const { qliphoth, click: poke } = useQliphoth(() => dropSun('sunflower', 'normal', SUNFLOWER_TOSS))
  const shakeFlower = () => {
    if (poke()) dropSun('sunflower', 'normal', SUNFLOWER_TOSS)
  }

  // A sleepy shake plays once per click. Forget the count when the phase changes, or going back to
  // day would replay the last shake with nobody clicking.
  useLayoutEffect(() => setShroomNudge(0), [phase])

  // The Sun-shroom, as in the game: asleep by day, so a click only stirs it; awake at night, it
  // lights up and spits out a sun, a small one until it has grown.
  const shakeShroom = () => {
    if (phase === 'day') {
      setShroomNudge((n) => n + 1)
      return
    }
    const grown = shroomGrown
    setShroomFlash((n) => n + 1)
    after(SHROOM_TIMER, SHROOM_FLASH_MS, () => dropSun('shroom', grown ? 'normal' : 'small', shroomToss(grown)))
  }

  const takeSun = (sun: DroppedSun) => {
    clearTimers(sun.id)
    setState(sun.id, 'taken')
    setCharge((n) => n + 1)
    setEnergy(addSun)
    after(sun.id, SUN_TAKE_MS, () => drop(sun.id))
    // Growth counts small suns collected while it is awake; one left to go out does not count.
    if (sun.plant === 'shroom' && sun.size === 'small' && phase === 'night') {
      setShroomTaken((n) => n + 1)
    }
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
  const isInside = (style: ReturnType<typeof toScreen>) =>
    style.left >= free.left &&
    style.top >= free.top &&
    style.left + style.width <= free.left + free.width &&
    style.top + style.height <= free.top + free.height
  const isOffered = (style: ReturnType<typeof toScreen>) => {
    const right = style.left + style.width
    const bottom = style.top + style.height
    const underMenu =
      menu !== null && style.left < menu.right && right > menu.left && style.top < menu.bottom && bottom > menu.top
    return isInside(style) && !underMenu
  }
  const hotspots = HOTSPOTS.flatMap(({ id, box }) => {
    const style = toScreen(box)
    return isOffered(style) ? [{ id, style }] : []
  })
  const shelfLabels = SHELF_SPINES.flatMap((spine) => {
    const style = toScreen(spine)
    // Labels open towards the middle of the screen so long titles are not cut off at the edge.
    const alignEnd = style.left + style.width / 2 > size.w / 2
    // The three collectibles are irregular shapes, so they outline themselves; the book and game
    // spines are rectangles their button already matches exactly, so they keep the thin outline.
    const figure = spine.title in FIGURES
    return isOffered(style) ? [{ key: spine.title, label: spine.label, style, alignEnd, figure }] : []
  })

  // Thọ's caption: centred over his head, then clamped so all of it stays 8 px inside the screen and
  // below the top bar. It may wrap on narrow phones, so its size is measured after every layout.
  useLayoutEffect(() => {
    const el = lineRef.current
    if (!el || !pylonLine) return
    const next = { w: el.offsetWidth, h: el.offsetHeight }
    setLineBox((prev) => (prev.w === next.w && prev.h === next.h ? prev : next))
  })
  const head = toScreen(SPEAKER_BOX)
  const lineStyle: CSSProperties = {
    left: Math.max(LINE_MARGIN, Math.min(head.left + head.width / 2 - lineBox.w / 2, size.w - LINE_MARGIN - lineBox.w)),
    top: Math.max(free.top + LINE_MARGIN, head.top - lineBox.h - 4),
  }

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
            phase={phase}
            zombie={zombie}
            slime={slime}
            power={power}
            screen={screen}
            speaking={powered && speaker === 'tho'}
            sparkle={sparkle}
            suns={suns}
            shroom={{ grown: shroomGrown, flash: shroomFlash, nudge: shroomNudge }}
            charge={charge}
            energy={energy}
            fanSpeed={fanSpeed}
            highlight={highlight}
            qliphoth={qliphoth}
          />
        </div>
      </figure>

      {site.review.showArtworkNotice && (
        <p className="art-notice">
          {ui.artNotice}
          <span className="art-notice-detail">{ui.artNoticeDetail}</span>
        </p>
      )}

      {shelfLabels.map(({ key, label, style, alignEnd, figure }) => (
        <button key={key} type="button" tabIndex={-1} className={`shelf-spine${figure ? ' shelf-spine-figure' : ''}`} style={style} aria-label={label} {...(figure ? points(key) : {})}>
          <span className={`hotspot-label shelf-label${alignEnd ? ' align-end' : ''}`} aria-hidden="true">
            {label}
          </span>
        </button>
      ))}

      {powered && onAdvance && isOffered(toScreen(SPEAKER_BOX)) && (
        <button
          type="button"
          className="hotspot"
          style={toScreen(SPEAKER_BOX)}
          onClick={onAdvance}
          {...points('speaker')}
          aria-label={ui.advance}
        />
      )}

      {isOffered(toScreen(FAN_BOX)) && (
        <button
          type="button"
          className="hotspot"
          style={toScreen(FAN_BOX)}
          // Unpowered, the fan cannot be switched; it keeps its setting for when power returns.
          onClick={powered ? () => setFanStep((step) => (step + 1) % FAN_SPEEDS.length) : undefined}
          {...points('fan')}
          aria-label={`${ui.fan}: ${powered ? fanSpeed : 'off'}`}
        />
      )}

      {isOffered(toScreen(SUNFLOWER_BOX)) && (
        <button
          type="button"
          className="hotspot"
          style={toScreen(SUNFLOWER_BOX)}
          onClick={shakeFlower}
          {...points('flower')}
          aria-label={qliphoth.breach ? ui.sunflowerSuppress : ui.sunflower}
        />
      )}

      {isOffered(toScreen(SUNSHROOM_BOX)) && (
        <button
          type="button"
          className="hotspot"
          style={toScreen(SUNSHROOM_BOX)}
          onClick={shakeShroom}
          {...points('shroom')}
          aria-label={phase === 'night' ? ui.sunshroom : ui.sunshroomAsleep}
        />
      )}

      {suns.filter((sun) => sun.state === 'idle').map((sun) => (
        <button
          key={sun.id}
          type="button"
          className="hotspot"
          style={toScreen({ x: sun.x, y: sun.y, w: SUN_SIZE, h: SUN_SIZE })}
          onClick={() => takeSun(sun)}
          aria-label={ui.sun}
        />
      ))}

      {/* Power must always be within reach, so the pylon ignores the choice menu: on desktop the menu's
          top edge sits on the floor line and overlaps the pylon's foot, and the rest of it stays
          clickable above the menu. With the power off the menu is inert and lets clicks through. */}
      {isInside(toScreen(PYLON_BOX)) && (
        <button
          type="button"
          className="hotspot"
          style={toScreen(PYLON_BOX)}
          onClick={onPower}
          aria-disabled={power === 'warping'}
          {...points('pylon')}
          aria-label={power === 'on' ? ui.pylonOff : ui.pylonOn}
        />
      )}

      {/* One live region, always mounted, so screen readers announce the line when its text appears.
          Placed over Thọ's head, but held 8 px inside the screen on either side. */}
      <p
        ref={lineRef}
        className={`pylon-line${pylonLine ? '' : ' is-quiet'}`}
        role="status"
        style={pylonLine ? lineStyle : undefined}
      >
        {pylonLine ? ui.pylonLine : ''}
      </p>

      {/* Only the PC needs power; the album and the drawer still open with it off. */}
      {hotspots.filter(({ id }) => powered || id !== 'pc').map(({ id, style }) => (
        <button key={id} type="button" className="hotspot" style={style} onClick={() => onHotspot(id)} {...points(id)}>
          <span className="hotspot-label">{ui.hotspots[id]}</span>
        </button>
      ))}
    </div>
  )
}
