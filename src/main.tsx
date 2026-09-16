import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/600.css'
import '@fontsource/be-vietnam-pro/700.css'
import './styles.css'
import App from './App'
import { PhaseProvider } from './daylight/PhaseProvider'
import { applyPhase, initialPhase } from './daylight/phase'
import { LocaleProvider } from './i18n/LocaleProvider'

// Before the first render, so the first frame is already the right time of day.
applyPhase(initialPhase().phase)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider>
      <PhaseProvider>
        <App />
      </PhaseProvider>
    </LocaleProvider>
  </StrictMode>,
)
