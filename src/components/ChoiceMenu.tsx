import type { CSSProperties, Ref } from 'react'
import type { Choice } from '../content/types'
import { useLocale } from '../i18n/LocaleProvider'

interface ChoiceMenuProps {
  choices: readonly Choice[]
  onChoice: (choice: Choice) => void
  menuRef: Ref<HTMLElement>
}

/**
 * Choice menu shown above the textbox after the last line, as in visual novels.
 * It sits in its own HUD row, so the textbox never changes size when choices appear.
 */
export function ChoiceMenu({ choices, onChoice, menuRef }: ChoiceMenuProps) {
  const ui = useLocale().content.text.ui
  if (choices.length === 0) return null

  return (
    <nav ref={menuRef} className="choice-menu" aria-label={ui.choices}>
      <ol className="choices">
        {choices.map((choice, i) => (
          <li key={`${choice.label}-${i}`} style={{ '--i': i } as CSSProperties}>
            <button
              type="button"
              className="choice"
              onClick={() => onChoice(choice)}
              aria-keyshortcuts={i < 9 ? String(i + 1) : undefined}
            >
              {i < 9 && (
                <span className="choice-key" aria-hidden="true">
                  {i === 0 ? '▶' : i + 1}
                </span>
              )}
              <span className="choice-text">
                <span className="choice-label">{choice.label}</span>
                {choice.hint && <span className="choice-hint">{choice.hint}</span>}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
