import { useLayoutEffect, type RefObject } from 'react'
import type { DialogueLines } from '../content/types'

/**
 * Keeps the textbox the same height for every dialogue step, like a visual-novel text window.
 * Lays out every step offscreen at the current text width and stores the tallest height in `--text-h`
 * on the lines element. Re-measures when the width, the language (texts) or the web fonts change.
 */
export function useStableTextHeight(linesRef: RefObject<HTMLElement | null>, texts: readonly DialogueLines[]) {
  useLayoutEffect(() => {
    const lines = linesRef.current
    const row = lines?.parentElement
    if (!lines || !row) return

    let measuredWidth = -1
    const measure = () => {
      const width = lines.getBoundingClientRect().width
      if (width === 0 || width === measuredWidth) return
      measuredWidth = width

      // Same class and parent as the real lines, so every responsive font rule applies.
      const probe = document.createElement('div')
      probe.className = 'lines'
      probe.setAttribute('aria-hidden', 'true')
      probe.style.cssText = `position:absolute;left:0;top:0;visibility:hidden;pointer-events:none;height:auto;overflow:visible;width:${width}px`
      row.appendChild(probe)
      let tallest = 0
      for (const text of texts) {
        probe.replaceChildren(
          ...text.map((line) => {
            const p = document.createElement('p')
            p.textContent = line
            return p
          }),
        )
        tallest = Math.max(tallest, probe.scrollHeight)
      }
      probe.remove()
      lines.style.setProperty('--text-h', `${Math.ceil(tallest)}px`)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(row)
    let active = true
    document.fonts?.ready.then(() => {
      if (!active) return
      measuredWidth = -1
      measure()
    })
    return () => {
      active = false
      ro.disconnect()
    }
  }, [linesRef, texts])
}
