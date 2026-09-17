import { useEffect, useState } from 'react'

/** When something walks past the window: the delay before the first, the gap between walks, and one walk's length, in ms. */
export interface WalkerTiming {
  first: readonly [number, number]
  every: readonly [number, number]
  walkMs: number
}

const between = ([low, high]: readonly [number, number]) => low + Math.random() * (high - low)

/**
 * Schedules walks past the window while `active`: the first soon, because a visitor may not stay
 * long, then one every little while. Returns the id of the walk in progress, or null. A new id
 * remounts the walker, which replays its CSS walk. Reduced motion means no walks at all.
 */
export function useWalker(active: boolean, timing: WalkerTiming): number | null {
  const [walk, setWalk] = useState<number | null>(null)

  useEffect(() => {
    if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setWalk(null)
      return
    }
    let id = 0
    const handles = new Set<number>()
    // Each handle forgets itself once it fires, so a long visit does not pile them up.
    const later = (ms: number, run: () => void) => {
      const handle = window.setTimeout(() => {
        handles.delete(handle)
        run()
      }, ms)
      handles.add(handle)
    }
    const spawn = () => {
      const current = ++id
      setWalk(current)
      later(timing.walkMs, () => setWalk((shown) => (shown === current ? null : shown)))
      later(between(timing.every), spawn)
    }
    later(between(timing.first), spawn)
    return () => {
      handles.forEach(clearTimeout)
      setWalk(null)
    }
    // The timing's numbers, not the object: a caller passing a fresh literal must not reschedule.
  }, [active, timing.first[0], timing.first[1], timing.every[0], timing.every[1], timing.walkMs])

  return walk
}
