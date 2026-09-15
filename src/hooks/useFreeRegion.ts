import { useLayoutEffect, useState, type DependencyList, type RefObject } from 'react'
import type { Region } from '../art/camera'

interface Refs {
  app: RefObject<HTMLElement | null>
  top: RefObject<HTMLElement | null>
  dialogue: RefObject<HTMLElement | null>
  doc: RefObject<HTMLElement | null>
  /** Choice menu above the textbox. It overlays the room and never moves the camera. */
  menu: RefObject<HTMLElement | null>
}

/** Screen area in app CSS px. */
export interface Box {
  left: number
  top: number
  right: number
  bottom: number
}

export interface FreeRegion extends Region {
  /** Choice menu drawn over the room, when shown; hotspots underneath it are not offered. */
  menu: Box | null
}

const GAP = 8

/**
 * Measures the part of the screen that the top bar, textbox and detail panel leave uncovered,
 * so the scene camera can keep the important art visible. The choice menu is reported separately:
 * like a visual-novel menu it overlays the room instead of reframing it.
 */
export function useFreeRegion(refs: Refs, deps: DependencyList): FreeRegion | null {
  const [region, setRegion] = useState<FreeRegion | null>(null)

  useLayoutEffect(() => {
    const app = refs.app.current
    if (!app) return

    const measure = () => {
      const a = app.getBoundingClientRect()
      const top = (refs.top.current?.getBoundingClientRect().bottom ?? a.top) - a.top
      let bottom = a.height
      let right = a.width

      const dialogue = refs.dialogue.current?.getBoundingClientRect()
      if (dialogue) bottom = Math.min(bottom, dialogue.top - a.top - GAP)

      const doc = refs.doc.current?.getBoundingClientRect()
      if (doc) {
        const isSidePanel = doc.left - a.left > a.width * 0.35
        if (isSidePanel) right = doc.left - a.left - GAP
        else bottom = Math.min(bottom, doc.top - a.top - GAP)
      }

      const m = refs.menu.current?.getBoundingClientRect()
      const menu =
        m && m.height > 0
          ? { left: m.left - a.left, top: m.top - a.top, right: m.right - a.left, bottom: m.bottom - a.top }
          : null

      const next: FreeRegion = {
        left: 0,
        top,
        width: Math.max(right, 1),
        height: Math.max(bottom - top, 1),
        menu,
      }
      setRegion((prev) =>
        prev &&
        prev.top === next.top &&
        prev.width === next.width &&
        prev.height === next.height &&
        sameBox(prev.menu, next.menu)
          ? prev
          : next,
      )
    }

    measure()
    const ro = new ResizeObserver(measure)
    for (const el of [app, refs.top.current, refs.dialogue.current, refs.doc.current, refs.menu.current]) {
      if (el) ro.observe(el)
    }
    return () => ro.disconnect()
  }, deps)

  return region
}

function sameBox(a: Box | null, b: Box | null): boolean {
  if (!a || !b) return a === b
  return a.left === b.left && a.top === b.top && a.right === b.right && a.bottom === b.bottom
}
