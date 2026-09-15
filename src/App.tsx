import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { CvPanel } from './components/CvPanel'
import { DialogueBox } from './components/DialogueBox'
import { GalleryPanel } from './components/GalleryPanel'
import { ProjectDetail } from './components/ProjectDetail'
import { Scene } from './components/Scene'
import { galleryItems } from './content/gallery'
import { getProject } from './content/projects'
import { site } from './content/site'
import { story } from './content/story'
import type { ProjectId, Target } from './content/types'
import { useBlip } from './hooks/useBlip'
import { useFreeRegion } from './hooks/useFreeRegion'
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

const reducer = (state: NavState, action: NavAction) =>
  navReducer(state, action, (id) => story[id].steps.length)

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

export default function App() {
  const [nav, dispatch] = useReducer(reducer, initialNav)
  const [soundOn, setSoundOn] = useState(false)
  const blip = useBlip(soundOn)
  const [gallerySeen, setGallerySeen] = useState(readGallerySeen)

  const appRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLElement>(null)
  const dialogueRef = useRef<HTMLElement>(null)
  const docRef = useRef<HTMLElement>(null)
  const linesRef = useRef<HTMLDivElement>(null)

  const here = current(nav)
  const view = buildView(here)
  const key = locationKey(here)
  const backAllowed = canGoBack(nav)
  // Choices stay put while stepping through one node, so they only re-enter on a new place.
  const choicesKey = here.kind === 'node' ? `node:${here.id}` : key

  const region = useFreeRegion({ app: appRef, top: topRef, dialogue: dialogueRef, doc: docRef }, [key])

  const act = useCallback(
    (action: NavAction) => {
      blip()
      dispatch(action)
    },
    [blip],
  )
  const go = useCallback((target: Target) => act({ type: 'go', target }), [act])
  const openProject = useCallback((id: ProjectId) => go({ kind: 'project', id }), [go])

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
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    linesRef.current?.focus({ preventScroll: true })
  }, [key])

  // Shortcuts: 1–9 pick a choice, Esc goes back.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
      if (e.key === 'Escape') {
        act({ type: 'back' })
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
  }, [act, go, view.choices])

  return (
    <div className="app" ref={appRef}>
      <a className="skip-link" href="#dialogue">
        Skip to dialogue
      </a>

      <Scene
        screen={view.screen}
        speaker={view.step.speaker}
        albumEnabled={view.albumEnabled}
        onAlbum={() => go({ kind: 'gallery' })}
        region={region}
        panelOpen={view.panel !== null}
        sparkle={!gallerySeen}
      />

      <header className="topbar" ref={topRef}>
        <button type="button" className="brand" onClick={() => act({ type: 'home' })}>
          <span className="brand-name">{site.name}</span>
          <span className="brand-role">{site.role}</span>
        </button>
        <nav className="topnav" aria-label="Main navigation">
          <button
            type="button"
            className="nav-btn"
            aria-current={view.section === 'projects' ? 'page' : undefined}
            onClick={() => go({ kind: 'node', id: 'work' })}
          >
            Projects
          </button>
          <button
            type="button"
            className="nav-btn"
            aria-current={view.section === 'gallery' ? 'page' : undefined}
            onClick={() => go({ kind: 'gallery' })}
          >
            Gallery
          </button>
          <button
            type="button"
            className="nav-btn"
            aria-current={view.section === 'cv' ? 'page' : undefined}
            onClick={() => go({ kind: 'cv' })}
          >
            CV
          </button>
          <button
            type="button"
            className="nav-btn nav-sound"
            aria-pressed={soundOn}
            aria-label="Sound"
            onClick={() => setSoundOn((on) => !on)}
          >
            <span aria-hidden="true">♪ </span>
            <span className="nav-sound-text">{soundOn ? 'On' : 'Off'}</span>
          </button>
        </nav>
      </header>

      <div className={`hud${view.panel ? ' has-panel' : ''}`}>
        {view.panel && (
          <aside className="doc" ref={docRef} key={key} aria-label="Details">
            <Panel panel={view.panel} onOpenProject={openProject} />
          </aside>
        )}
        <DialogueBox
          view={view}
          revealKey={key}
          choicesKey={choicesKey}
          canGoBack={backAllowed}
          boxRef={dialogueRef}
          linesRef={linesRef}
          onChoice={(choice) => go(choice.target)}
          onNext={() => act({ type: 'next' })}
          onBack={() => act({ type: 'back' })}
          onHome={() => act({ type: 'home' })}
          onProjects={() => go({ kind: 'node', id: 'work' })}
        />
      </div>
    </div>
  )
}

function Panel({ panel, onOpenProject }: { panel: PanelView; onOpenProject: (id: ProjectId) => void }) {
  switch (panel.kind) {
    case 'project':
      return <ProjectDetail project={getProject(panel.projectId)} />
    case 'cv':
      return <CvPanel onOpenProject={onOpenProject} />
    case 'gallery':
      return <GalleryPanel />
  }
}
