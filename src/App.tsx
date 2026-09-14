import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { ArchiveList } from './components/ArchiveList'
import { CvPanel } from './components/CvPanel'
import { DialogueBox } from './components/DialogueBox'
import { MemoryPanel } from './components/MemoryPanel'
import { ProjectDetail } from './components/ProjectDetail'
import { Scene } from './components/Scene'
import { getMemorySlot } from './content/memories'
import { getProject } from './content/projects'
import { site } from './content/site'
import { story } from './content/story'
import type { Choice, ProjectId, Target } from './content/types'
import { useBlip } from './hooks/useBlip'
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
  const linesRef = useRef<HTMLDivElement>(null)

  const here = current(nav)
  const view = buildView(here)
  const key = locationKey(here)
  const backAllowed = canGoBack(nav)

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
    linesRef.current?.focus()
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
    <div className="app">
      <a className="skip-link" href="#dialogue">
        Bỏ qua tới hội thoại
      </a>

      <header className="topbar">
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
            onClick={() => setSoundOn((on) => !on)}
          >
            <span className="sound-long">Âm thanh: </span>
            <span className="sound-short" aria-hidden="true">♪ </span>
            {soundOn ? 'Bật' : 'Tắt'}
          </button>
        </nav>
      </header>

      <main className="stage">
        <Scene
          scene={view.scene}
          posterEnabled={view.posterEnabled}
          onPoster={() => go({ kind: 'node', id: 'rat' })}
        />
        <div className="hud">
          <DialogueBox
            ref={linesRef}
            view={view}
            panel={view.panel && <Panel panel={view.panel} onOpenProject={openProject} />}
            canGoBack={backAllowed}
            onChoice={(choice: Choice) => go(choice.target)}
            onNext={() => act({ type: 'next' })}
            onBack={() => act({ type: 'back' })}
            onHome={() => act({ type: 'home' })}
            onProjects={() => go({ kind: 'node', id: 'work' })}
          />
        </div>
      </main>
    </div>
  )
}

function Panel({ panel, onOpenProject }: { panel: PanelView; onOpenProject: (id: ProjectId) => void }) {
  switch (panel.kind) {
    case 'project':
      return <ProjectDetail project={getProject(panel.projectId)} />
    case 'archive':
      return <ArchiveList onOpen={onOpenProject} />
    case 'memory':
      return <MemoryPanel slot={getMemorySlot(panel.slotId)} />
    case 'cv':
      return <CvPanel onOpenProject={onOpenProject} />
  }
}
