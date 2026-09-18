import { useLocale } from '../i18n/LocaleProvider'

interface NavControlsProps {
  canGoBack: boolean
  /** Home has nowhere to go from the first line of the intro. */
  homeDisabled: boolean
  onBack: () => void
  onHome: () => void
  className?: string
}

/**
 * Back and Home as icon buttons. They sit on whatever is on top: the open panel's corner while one is
 * up, otherwise the dialogue box. Icons only, so they never take room from the text beside them; the
 * name is in the accessible label and the tooltip.
 */
export function NavControls({ canGoBack, homeDisabled, onBack, onHome, className = '' }: NavControlsProps) {
  const ui = useLocale().content.text.ui
  return (
    <div className={`controls ${className}`} role="group" aria-label={ui.dialogueNav}>
      <button
        type="button"
        className="btn btn-icon"
        onClick={onBack}
        disabled={!canGoBack}
        aria-label={ui.back}
        title={ui.back}
        aria-keyshortcuts="Escape"
      >
        <span aria-hidden="true">←</span>
      </button>
      <button type="button" className="btn btn-icon" onClick={onHome} disabled={homeDisabled} aria-label={ui.home} title={ui.home}>
        <span aria-hidden="true">⌂</span>
      </button>
    </div>
  )
}
