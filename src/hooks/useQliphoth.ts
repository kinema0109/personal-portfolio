import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * The Sunflower's Qliphoth counter, after Lobotomy Corporation: the flower is a contained
 * Abnormality, and clicking it too eagerly lowers the counter until it breaches.
 *
 * All of the rules live here so Scene.tsx only has to ask one question per click — does this click
 * drop a sun? — and hand over the drop the breach should repeat. Nothing is persisted; a reload is a
 * fresh containment.
 */

/** A full counter. The pips only show while it is lower than this, or during a breach. */
export const QLIPHOTH_MAX = 3
/** A click this soon after the previous one counts as eager and lowers the counter. */
export const QLIPHOTH_RAPID_MS = 800
/** How long the flower must be left alone before the counter starts to refill. */
export const QLIPHOTH_IDLE_MS = 3000
/** Once refilling, one point comes back this often. */
export const QLIPHOTH_REFILL_MS = 1500
/** During a breach the flower tosses a sun this often. */
export const QLIPHOTH_TOSS_MS = 400
/** Clicks that end a breach. */
export const QLIPHOTH_SUPPRESS = 5

export interface Qliphoth {
  /** Points left, 0–3. Zero only during a breach. */
  counter: number
  breach: boolean
  /** Suppression clicks landed so far in this breach, 0–4. */
  suppressed: number
}

const CALM: Qliphoth = { counter: QLIPHOTH_MAX, breach: false, suppressed: 0 }

/**
 * `toss` is the normal Sunflower drop. It is read through a ref, so a new function every render
 * neither restarts the breach nor drops a stale one.
 */
export function useQliphoth(toss: () => void) {
  const [state, setState] = useState<Qliphoth>(CALM)
  // The click handler decides synchronously whether to drop a sun, so it reads and writes this
  // mirror rather than waiting for React to hand back the new state.
  const current = useRef(state)
  const commit = (next: Qliphoth) => {
    current.current = next
    setState(next)
  }
  const tossRef = useRef(toss)
  tossRef.current = toss

  const lastClick = useRef(-Infinity)
  // Bumped on every click, so the idle wait restarts even when the counter does not move.
  const [clicks, setClicks] = useState(0)
  // Whether a point has come back since the last click: the first waits out the idle time, the
  // rest follow at the refill pace.
  const refilling = useRef(false)

  /** Returns whether this click drops a sun. Suppression clicks do not. */
  const click = useCallback((): boolean => {
    const now = performance.now()
    const eager = now - lastClick.current < QLIPHOTH_RAPID_MS
    lastClick.current = now
    refilling.current = false
    setClicks((n) => n + 1)
    const s = current.current
    if (s.breach) {
      const suppressed = s.suppressed + 1
      commit(suppressed >= QLIPHOTH_SUPPRESS ? CALM : { ...s, suppressed })
      return false
    }
    if (eager) {
      const counter = s.counter - 1
      commit(counter <= 0 ? { counter: 0, breach: true, suppressed: 0 } : { ...s, counter })
    }
    return true
  }, [])

  // Refill: nothing while breached or full; otherwise the first point after the idle time, then
  // one per step.
  useEffect(() => {
    if (state.breach || state.counter >= QLIPHOTH_MAX) return
    const wait = refilling.current
      ? QLIPHOTH_REFILL_MS
      : Math.max(0, QLIPHOTH_IDLE_MS - (performance.now() - lastClick.current))
    const t = window.setTimeout(() => {
      refilling.current = true
      const s = current.current
      commit({ ...s, counter: Math.min(QLIPHOTH_MAX, s.counter + 1) })
    }, wait)
    return () => window.clearTimeout(t)
  }, [state.breach, state.counter, clicks])

  // The breach itself: a real sun every step, through the normal drop, so they land on the free
  // spots and stop when the floor is full. The breaching click already dropped one, so the first
  // toss waits a step.
  useEffect(() => {
    if (!state.breach) return
    const id = window.setInterval(() => tossRef.current(), QLIPHOTH_TOSS_MS)
    return () => window.clearInterval(id)
  }, [state.breach])

  return { qliphoth: state, click }
}
