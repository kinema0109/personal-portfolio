import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { applyPhase, autoPhase, initialPhase, nextAutoChange, saveOverride, type Phase } from './phase'

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

  // On the clock: flip at the next sunrise or sunset, and look again whenever the tab or window comes
  // back, since a sleeping laptop or a background tab can hold a timer well past its time. A check
  // that finds nothing changed keeps the same state, so the room does not re-render for nothing.
  useEffect(() => {
    if (override) return
    let timer = 0
    const arm = () => {
      window.clearTimeout(timer)
      const next = nextAutoChange()
      const wait = next ? next.getTime() - Date.now() + 1000 : RECHECK_MS
      timer = window.setTimeout(sync, Math.min(Math.max(wait, 1000), 24 * RECHECK_MS))
    }
    const sync = () => {
      const now = autoPhase()
      setState((current) => (current.phase === now && current.override === null ? current : { phase: now, override: null }))
      arm()
    }
    const onVisible = () => {
      if (document.visibilityState === 'visible') sync()
    }
    arm()
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', sync)
    window.addEventListener('pageshow', sync)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', sync)
      window.removeEventListener('pageshow', sync)
    }
  }, [override])

  const toggle = useCallback(() => {
    setState((current) => {
      const next: Phase = current.phase === 'day' ? 'night' : 'day'
      return { phase: next, override: saveOverride(next) }
    })
  }, [])

  const value = useMemo(() => ({ phase, isOverride: override !== null, toggle }), [phase, override, toggle])

  return <PhaseContext.Provider value={value}>{children}</PhaseContext.Provider>
}

export function usePhase(): PhaseValue {
  const value = useContext(PhaseContext)
  if (!value) throw new Error('usePhase must be used inside <PhaseProvider>')
  return value
}
