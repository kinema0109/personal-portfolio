import type { Locale } from '../content/types'

/** Enabled languages, in top-bar order. The language switch is hidden while only one is enabled. */
export const LOCALES: readonly { id: Locale; short: string; name: string }[] = [{ id: 'en', short: 'EN', name: 'English' }]

const STORAGE_KEY = 'tho-vn:locale'

const isLocale = (value: unknown): value is Locale => LOCALES.some((l) => l.id === value)

/** A saved choice wins; otherwise the first enabled browser language; otherwise English. */
export function initialLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isLocale(saved)) return saved
  } catch {
    // Storage unavailable: fall back to the browser language.
  }
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.toLowerCase().split('-')[0]
    if (isLocale(base)) return base
  }
  return 'en'
}

export function saveLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // Storage unavailable: the browser language is used again on the next visit.
  }
}
