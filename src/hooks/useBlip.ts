import { useCallback, useRef } from 'react'

/** A tiny generated click sound. Only plays when audio is switched on. */
export function useBlip(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null)

  return useCallback(() => {
    if (!enabled) return
    try {
      ctxRef.current ??= new AudioContext()
      const ctx = ctxRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.value = 660
      gain.gain.setValueAtTime(0.03, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06)
      osc.connect(gain).connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.07)
    } catch {
      // Audio is optional; ignore unsupported browsers.
    }
  }, [enabled])
}
