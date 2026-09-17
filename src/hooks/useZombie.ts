import { useEffect, useState } from 'react'
import type { Phase } from '../daylight/phase'
import { ZOMBIE_EVERY_MS, ZOMBIE_FIRST_MS, ZOMBIE_WALK_MS } from '../art/Zombie'

const between = ([low, high]: readonly [number, number]) => low + Math.random() * (high - low)

/**
 * Zombies pass the window only at night: the first soon after night begins, because a visitor may
 * not stay long, then one every little while. Returns the id of the walk in progress, or null.
 * Reduced motion means no zombies at all.
 */
export function useZombie(phase: Phase): number | null {
  const [walk, setWalk] = useState<number | null>(null)

  useEffect(() => {
    if (phase !== 'night' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setWalk(null)
      return
    }
    let id = 0
    const handles: number[] = []
    const spawn = () => {
      const current = ++id
      setWalk(current)
      handles.push(window.setTimeout(() => setWalk((shown) => (shown === current ? null : shown)), ZOMBIE_WALK_MS))
      handles.push(window.setTimeout(spawn, between(ZOMBIE_EVERY_MS)))
    }
    handles.push(window.setTimeout(spawn, between(ZOMBIE_FIRST_MS)))
    return () => {
      handles.forEach(clearTimeout)
      setWalk(null)
    }
  }, [phase])

  return walk
}
