import type { Phase } from '../daylight/phase'
import { ZOMBIE_EVERY_MS, ZOMBIE_FIRST_MS, ZOMBIE_WALK_MS } from '../art/Zombie'
import { useWalker, type WalkerTiming } from './useWalker'

const ZOMBIE_TIMING: WalkerTiming = { first: ZOMBIE_FIRST_MS, every: ZOMBIE_EVERY_MS, walkMs: ZOMBIE_WALK_MS }

/** Zombies pass the window only at night. Returns the id of the walk in progress, or null. */
export function useZombie(phase: Phase): number | null {
  return useWalker(phase === 'night', ZOMBIE_TIMING)
}
