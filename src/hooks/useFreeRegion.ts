import { useLayoutEffect, useState, type DependencyList, type RefObject } from 'react'
import type { Region } from '../art/camera'

interface Refs {
  app: RefObject<HTMLElement | null>
  top: RefObject<HTMLElement | null>
  dialogue: RefObject<HTMLElement | null>
  doc: RefObject<HTMLElement | null>
}

const GAP = 8

/**
 * Measures the part of the screen that the top bar, dialogue box and detail panel
 * leave uncovered, so the scene camera can keep the important art visible.
 */
export function useFreeRegion(refs: Refs, deps: DependencyList): Region | null {
  const [region, setRegion] = useState<Region | null>(null)

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

      const next: Region = {
        left: 0,
        top,
        width: Math.max(right, 1),
        height: Math.max(bottom - top, 1),
      }
      setRegion((prev) =>
        prev &&
        prev.top === next.top &&
        prev.width === next.width &&
        prev.height === next.height
          ? prev
          : next,
      )
    }

    measure()
    const ro = new ResizeObserver(measure)
    for (const el of [app, refs.top.current, refs.dialogue.current, refs.doc.current]) {
      if (el) ro.observe(el)
    }
    return () => ro.disconnect()
  }, deps)

  return region
}
