import { useEffect, useState } from 'react'
import { site } from '../content/site'

type CvFile =
  | { state: 'checking' }
  | { state: 'missing' }
  | { state: 'available'; url: string }

const url = `${import.meta.env.BASE_URL}${site.cv.file}`

/**
 * Checks that the configured CV PDF really exists. Dev servers and SPA hosts
 * often answer missing files with index.html, so the content type must be PDF.
 */
export function useCvFile(): CvFile {
  const [file, setFile] = useState<CvFile>({ state: 'checking' })

  useEffect(() => {
    let cancelled = false
    fetch(url, { method: 'HEAD', cache: 'no-store' })
      .then((res) => {
        const isPdf = res.ok && (res.headers.get('content-type') ?? '').includes('pdf')
        if (!cancelled) setFile(isPdf ? { state: 'available', url } : { state: 'missing' })
      })
      .catch(() => {
        if (!cancelled) setFile({ state: 'missing' })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return file
}
