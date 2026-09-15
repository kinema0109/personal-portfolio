import type { Locale } from '../content/types'

/** Order of the buttons in the top bar. */
export const LOCALES: readonly { id: Locale; short: string; name: string }[] = [
  { id: 'vi', short: 'VI', name: 'Tiếng Việt' },
  { id: 'en', short: 'EN', name: 'English' },
  { id: 'ja', short: 'JA', name: '日本語' },
]

const STORAGE_KEY = 'tho-vn:locale'

const isLocale = (value: unknown): value is Locale => value === 'vi' || value === 'en' || value === 'ja'

/** A saved choice wins; otherwise the first supported browser language; otherwise English. */
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
