import type { NodeId, ProjectId, Target } from '../content/types'

/** A place the visitor can be. `step` only applies to story nodes. */
export type Location =
  | { kind: 'node'; id: NodeId; step: number }
  | { kind: 'project'; id: ProjectId }
  | { kind: 'archive' }
  | { kind: 'cv' }
  | { kind: 'gallery' }

export interface NavState {
  /** Never empty; the last entry is the current location. */
  history: Location[]
}

export type NavAction =
  | { type: 'go'; target: Target }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'home' }

export const HOME: Location = { kind: 'node', id: 'intro', step: 0 }

export const initialNav: NavState = { history: [HOME] }

export function toLocation(target: Target): Location {
  return target.kind === 'node' ? { kind: 'node', id: target.id, step: 0 } : target
}

function sameTarget(a: Location, b: Location): boolean {
  if (a.kind !== b.kind) return false
  return !('id' in a) || !('id' in b) || a.id === b.id
}

export function current(state: NavState): Location {
  return state.history[state.history.length - 1]
}

export function navReducer(
  state: NavState,
  action: NavAction,
  stepCount: (id: NodeId) => number,
): NavState {
  const here = current(state)
  switch (action.type) {
    case 'go': {
      const next = toLocation(action.target)
      if (sameTarget(here, next)) return state
      return { history: [...state.history, next] }
    }
    case 'next': {
      if (here.kind !== 'node' || here.step >= stepCount(here.id) - 1) return state
      return { history: [...state.history.slice(0, -1), { ...here, step: here.step + 1 }] }
    }
    case 'back': {
      // Step back through dialogue first, then through visited places.
      if (here.kind === 'node' && here.step > 0) {
        return { history: [...state.history.slice(0, -1), { ...here, step: here.step - 1 }] }
      }
      if (state.history.length === 1) return state
      return { history: state.history.slice(0, -1) }
    }
    case 'home':
      return initialNav
  }
}

export function canGoBack(state: NavState): boolean {
  const here = current(state)
  return state.history.length > 1 || (here.kind === 'node' && here.step > 0)
}

/** Stable key for focus management and animations. */
export function locationKey(loc: Location): string {
  switch (loc.kind) {
    case 'node':
      return `node:${loc.id}:${loc.step}`
    case 'project':
      return `${loc.kind}:${loc.id}`
    default:
      return loc.kind
  }
}
