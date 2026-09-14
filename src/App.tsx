import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { CvPanel } from './components/CvPanel'
import { DialogueBox } from './components/DialogueBox'
import { MemoryPanel } from './components/MemoryPanel'
import { ProjectDetail } from './components/ProjectDetail'
import { Scene } from './components/Scene'
import { getMemorySlot } from './content/memories'
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

export default function App() {
  const [nav, dispatch] = useReducer(reducer, initialNav)
  const [soundOn, setSoundOn] = useState(false)
  const blip = useBlip(soundOn)

  const appRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLElement>(null)
  const dialogueRef = useRef<HTMLElement>(null)
  const docRef = useRef<HTMLElement>(null)
  const linesRef = useRef<HTMLDivElement>(null)

  const here = current(nav)
  const view = buildView(here)
  const key = locationKey(here)
  const backAllowed = canGoBack(nav)

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
        Bỏ qua tới hội thoại
      </a>

      <Scene
        scene={view.scene}
        screen={view.screen}
        speaker={view.step.speaker}
        posterEnabled={view.posterEnabled}
        onPoster={() => go({ kind: 'node', id: 'rat' })}
        region={region}
      />

      <header className="topbar" ref={topRef}>
        <button type="button" className="brand" onClick={() => act({ type: 'home' })}>
          <span className="brand-name">{site.name}</span>
          <span className="brand-role">{site.role}</span>
        </button>
        <nav className="topnav" aria-label="Điều hướng chính">
          <button
            type="button"
            className="nav-btn"
            aria-current={view.section === 'projects' ? 'page' : undefined}
            onClick={() => go({ kind: 'node', id: 'work' })}
          >
            Dự án
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
            aria-label="Âm thanh"
            onClick={() => setSoundOn((on) => !on)}
          >
            <span aria-hidden="true">♪ </span>
            {soundOn ? 'Bật' : 'Tắt'}
          </button>
        </nav>
      </header>

      <div className={`hud${view.panel ? ' has-panel' : ''}`}>
        {view.panel && (
          <aside className="doc" ref={docRef} key={key} aria-label="Chi tiết">
            <Panel panel={view.panel} onOpenProject={openProject} />
          </aside>
        )}
        <DialogueBox
          view={view}
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
    case 'memory':
      return <MemoryPanel slot={getMemorySlot(panel.slotId)} />
    case 'cv':
      return <CvPanel onOpenProject={onOpenProject} />
  }
}
