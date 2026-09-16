import { createContext, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { applyPhase, autoPhase, initialPhase, nextAutoChange, saveOverride, type Phase } from './phase.ts'

interface PhaseValue {
  phase: Phase
  /** True while the visitor's own choice overrides the clock. */
  isOverride: boolean
  /** Swaps to the other phase. */
  toggle: () => void
}

const PhaseContext = createContext<PhaseValue | null>(null)

/** How often to look again when there is no sunrise or sunset coming (polar day or night). */
const RECHECK_MS = 3600_000

export function PhaseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialPhase)
  const { phase, override } = state

  useLayoutEffect(() => applyPhase(phase), [phase])

  // On the clock: flip at the next sunrise or sunset, and look again whenever the tab comes back,
  // since a sleeping laptop or a background tab can hold a timer well past its time. Every sync makes
  // a new state object, so this effect re-arms itself even when the phase did not change.
  useEffect(() => {
    if (override) return
    const sync = () => setState({ phase: autoPhase(), override: null })
    const next = nextAutoChange()
    const wait = next ? next.getTime() - Date.now() + 1000 : RECHECK_MS
    const timer = window.setTimeout(sync, Math.min(Math.max(wait, 1000), 24 * RECHECK_MS))
    const onVisible = () => {
      if (document.visibilityState === 'visible') sync()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [state, override])

  const toggle = () => {
    const next: Phase = phase === 'day' ? 'night' : 'day'
    setState({ phase: next, override: saveOverride(next) })
  }

  return (
    <PhaseContext.Provider value={{ phase, isOverride: override !== null, toggle }}>{children}</PhaseContext.Provider>
  )
}

export function usePhase(): PhaseValue {
  const value = useContext(PhaseContext)
  if (!value) throw Error('usePhase must be used inside PhaseProvider')
  return value
}
