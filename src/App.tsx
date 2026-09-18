import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { ChoiceMenu } from './components/ChoiceMenu'
import { CaseStudyPanel } from './components/CaseStudyPanel'
import { CvPanel } from './components/CvPanel'
import { DialogueBox } from './components/DialogueBox'
import { GalleryPanel } from './components/GalleryPanel'
import { ProjectDetail } from './components/ProjectDetail'
import { Scene } from './components/Scene'
import { WARP_MS, type Power } from './art/Pylon'
import { CONTENT } from './content'
import { galleryItems } from './content/gallery'
import { site } from './content/site'
import type { HotspotId, ProjectId, Target } from './content/types'
import { useBlip } from './hooks/useBlip'
import { useFreeRegion } from './hooks/useFreeRegion'
import { usePhase } from './daylight/PhaseProvider'
import { LOCALES } from './i18n/locale'
import { useLocale } from './i18n/LocaleProvider'
import {
  canGoBack,
  current,
  initialNav,
  locationKey,
  navReducer,
  type NavAction,
  type NavState,
} from './state/navigation'
import { buildView, type PanelView } from './state/view'

// Step counts are identical in every language (LocaleContent uses fixed-length tuples), so English drives navigation.
const reducer = (state: NavState, action: NavAction) =>
  navReducer(state, action, (id) => CONTENT.en.story[id].steps.length)

/** Per browser: which version of the album (its picture count) the visitor has opened. */
const GALLERY_SEEN_KEY = 'tho-vn:gallery-seen'
const galleryVersion = String(galleryItems.length)

function readGallerySeen(): boolean {
  try {
    return localStorage.getItem(GALLERY_SEEN_KEY) === galleryVersion
  } catch {
    return false
  }
}

/** Projects, CV and the album are found by clicking objects in the room. */
const HOTSPOT_TARGETS: Record<HotspotId, Target> = {
  pc: { kind: 'node', id: 'work' },
  album: { kind: 'gallery' },
  drawer: { kind: 'cv' },
}

export default function App() {
  const { locale, setLocale, content } = useLocale()
  const ui = content.text.ui
  const [nav, dispatch] = useReducer(reducer, initialNav)
  const [soundOn, setSoundOn] = useState(false)
  const blip = useBlip(soundOn)
  const { phase, toggle: togglePhase } = usePhase()
  const [gallerySeen, setGallerySeen] = useState(readGallerySeen)
  // The pylon under the desk is the room's power. Only the PC needs it: while it is off the story stays
  // on screen but cannot be used, and the album and the drawer still open. Warping it back in takes a
  // moment before power returns.
  const [power, setPower] = useState<Power>('on')
  const powered = power === 'on'
  const togglePower = useCallback(() => {
    if (power === 'warping') return
    if (power === 'on') {
      setPower('off')
      return
    }
    setPower(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'on' : 'warping')
  }, [power])
  useEffect(() => {
    if (power !== 'warping') return
    const t = window.setTimeout(() => setPower('on'), WARP_MS)
    return () => window.clearTimeout(t)
  }, [power])

  const appRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLElement>(null)
  const dialogueRef = useRef<HTMLElement>(null)
  const docRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLElement>(null)
  const linesRef = useRef<HTMLDivElement>(null)

  const here = current(nav)
  const view = buildView(here, content)
  const key = locationKey(here)
  const backAllowed = canGoBack(nav)
  const hasNext = view.stepIndex < view.stepCount - 1

  // Text length changes with the language, so the free region is re-measured on a switch too. The power
  // is not a dependency: the HUD stays put when the pylon goes off, so the room holds still.
  const region = useFreeRegion(
    { app: appRef, top: topRef, dialogue: dialogueRef, doc: docRef, menu: menuRef },
    [key, locale],
  )

  const act = useCallback(
    (action: NavAction) => {
      blip()
      dispatch(action)
    },
    [blip],
  )
  const go = useCallback((target: Target) => act({ type: 'go', target }), [act])
  const openProject = useCallback((id: ProjectId) => go({ kind: 'project', id }), [go])
  const onHotspot = useCallback((id: HotspotId) => go(HOTSPOT_TARGETS[id]), [go])

  // The album on the desk glints until the visitor opens it; new pictures bring the glint back.
  useEffect(() => {
    if (here.kind !== 'gallery' || gallerySeen) return
    setGallerySeen(true)
    try {
      localStorage.setItem(GALLERY_SEEN_KEY, galleryVersion)
    } catch {
      // Storage unavailable: the glint simply returns on the next visit.
    }
  }, [here.kind, gallerySeen])

  // Move focus to the new dialogue so keyboard and screen-reader users follow along.
  // Keyed on what is open rather than on `view.panel`, which is a new object on every render and would
  // pull focus back into an open panel whenever App re-renders.
  // A case study only illustrates the dialogue, so focus stays on its lines.
  const panelKey = view.panel && view.panel.kind !== 'case'
    ? view.panel.kind === 'project'
      ? `project:${view.panel.projectId}`
      : view.panel.kind
    : null
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (here.kind === 'gallery') return
    // A panel is the top of the screen stack now, so focus goes into it; otherwise the reader is
    // left in the dialogue and has to tab across the room to reach what just opened.
    const target = panelKey ? docRef.current : linesRef.current
    target?.focus({ preventScroll: true })
  }, [key, panelKey])

  // Shortcuts: Enter/Space advance the dialogue, 1–9 pick a choice, Esc goes back. While the power is
  // off only Esc works, and only to close an open panel: the story itself cannot be moved.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (document.querySelector('dialog[open]')) return
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
      if (e.key === 'Escape') {
        if (powered || panelKey !== null) act({ type: 'back' })
        return
      }
      if (!powered) return
      if (e.key === 'Enter' || e.key === ' ') {
        // A focused control keeps its own Enter/Space behaviour.
        if (!hasNext || (e.target instanceof Element && e.target.closest('button, a, [role="button"]'))) return
        e.preventDefault()
        act({ type: 'next' })
        return
      }
      const n = Number(e.key)
      if (Number.isInteger(n) && n >= 1 && n <= view.choices.length) {
        e.preventDefault()
        go(view.choices[n - 1].target)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [act, go, view.choices, hasNext, powered, panelKey])

  return (
    <div className="app" ref={appRef}>
      <a className="skip-link" href="#dialogue">
        {ui.skipToDialogue}
      </a>

      <Scene
        screen={view.screen}
        speaker={view.step.speaker}
        onHotspot={onHotspot}
        region={region}
        panelOpen={view.panel !== null && view.panel.kind !== 'gallery'}
        sparkle={!gallerySeen}
        onAdvance={hasNext ? () => act({ type: 'next' }) : null}
        power={power}
        onPower={togglePower}
      />

      <header className="topbar" ref={topRef}>
        <button type="button" className="brand" onClick={() => act({ type: 'home' })}>
          <span className="brand-name">{site.name}</span>
          <span className="brand-role">{content.text.role}</span>
        </button>
        <div className="topnav">
          {LOCALES.length > 1 && (
            <div className="lang-switch" role="group" aria-label={ui.language}>
              {LOCALES.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  className="nav-btn lang-btn"
                  lang={l.id}
                  aria-label={l.name}
                  aria-pressed={locale === l.id}
                  title={l.name}
                  onClick={() => setLocale(l.id)}
                >
                  {l.short}
                </button>
              ))}
            </div>
          )}
          {/* The name stays "Night mode" and only the pressed state flips, so a screen reader hears one
              control changing state rather than a label that swaps under it. */}
          <button
            type="button"
            className="nav-btn nav-phase"
            aria-pressed={phase === 'night'}
            aria-label={ui.phase}
            onClick={togglePhase}
          >
            <span aria-hidden="true">{phase === 'night' ? '☾ ' : '☀ '}</span>
            <span className="nav-phase-text">{phase === 'night' ? ui.phaseNight : ui.phaseDay}</span>
          </button>
          <button
            type="button"
            className="nav-btn nav-sound"
            aria-pressed={soundOn}
            aria-label={ui.sound}
            onClick={() => setSoundOn((on) => !on)}
          >
            <span aria-hidden="true">♪ </span>
            <span className="nav-sound-text">{soundOn ? ui.soundOn : ui.soundOff}</span>
          </button>
        </div>
      </header>

      {here.kind === 'gallery' && <GalleryPanel onClose={() => act({ type: 'back' })} />}
      <div className={`hud${view.panel && view.panel.kind !== 'gallery' ? ' has-panel' : ''}${view.panel?.kind === 'case' ? ' has-case' : ''}`}>
        {/* Whatever is on top — a picker or a panel — owns the screen while it is up, so clicking
            anywhere off it closes it rather than falling through to the room behind. A picker is part
            of the story, so with the power off it stops closing this way; a panel still does. A case
            study's diagram only illustrates the dialogue, so it is not on top and the room stays usable. */}
        {((view.picker && powered) || (view.panel !== null && view.panel.kind !== 'case')) && backAllowed && (
          <button
            type="button"
            className="dismiss-backdrop"
            aria-label={ui.back}
            onClick={() => act({ type: 'back' })}
          />
        )}
        {view.panel && view.panel.kind !== 'gallery' && (
          // A case study's diagram stays mounted across its steps, so only the lit parts change.
          <aside
            className="doc"
            ref={docRef}
            key={view.panel.kind === 'case' ? `case:${view.panel.caseId}` : key}
            tabIndex={-1}
            aria-label={ui.details}
          >
            <Panel panel={view.panel} onOpenProject={openProject} />
          </aside>
        )}
        {/* Own key namespace: sharing the panel's key made React keep a stale panel on screen. */}
        <ChoiceMenu
          key={`choices:${key}`}
          menuRef={menuRef}
          choices={view.choices}
          onChoice={(choice) => go(choice.target)}
          disabled={!powered}
        />
        <DialogueBox
          view={view}
          revealKey={key}
          canGoBack={backAllowed}
          boxRef={dialogueRef}
          linesRef={linesRef}
          onNext={() => act({ type: 'next' })}
          onBack={() => act({ type: 'back' })}
          onHome={() => act({ type: 'home' })}
          disabled={!powered}
        />
      </div>
    </div>
  )
}

function Panel({ panel, onOpenProject }: { panel: PanelView; onOpenProject: (id: ProjectId) => void }) {
  const { content } = useLocale()
  switch (panel.kind) {
    case 'project':
      return <ProjectDetail project={content.getProject(panel.projectId)} />
    case 'cv':
      return <CvPanel onOpenProject={onOpenProject} />
    case 'gallery':
      return null
    case 'case':
      return <CaseStudyPanel caseId={panel.caseId} step={panel.step} />
  }
}
