import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CONTENT, type Content } from '../content'
import type { Locale } from '../content/types'
import { initialLocale, saveLocale } from './locale'

interface LocaleValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  content: Content
}

const LocaleContext = createContext<LocaleValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState(initialLocale)
  const content = CONTENT[locale]

  // Only an explicit choice is remembered; otherwise the browser language keeps deciding.
  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    saveLocale(next)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = content.text.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', content.text.meta.description)
  }, [locale, content])

  const value = useMemo(() => ({ locale, setLocale, content }), [locale, setLocale, content])
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleValue {
  const value = useContext(LocaleContext)
  if (!value) throw new Error('useLocale must be used inside <LocaleProvider>')
  return value
}
