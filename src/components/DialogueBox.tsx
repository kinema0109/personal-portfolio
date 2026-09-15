import type { CSSProperties, RefObject } from 'react'
import { hasPortrait, Portrait } from '../art/Portrait'
import { useStableTextHeight } from '../hooks/useStableTextHeight'
import { useLocale } from '../i18n/LocaleProvider'
import type { View } from '../state/view'
import { StatusTag } from './StatusTag'

interface DialogueBoxProps {
  view: View
  /** Changes on every dialogue step; lines re-enter when it changes. */
  revealKey: string
  canGoBack: boolean
  boxRef: RefObject<HTMLElement | null>
  linesRef: RefObject<HTMLDivElement | null>
  onNext: () => void
  onBack: () => void
  onHome: () => void
}

/**
 * Fixed-size textbox: name row, portrait slot, text area sized to the longest step, and a reserved
 * advance slot. Nothing inside changes size between steps; choices live in ChoiceMenu.
 */
export function DialogueBox({ view, revealKey, canGoBack, boxRef, linesRef, onNext, onBack, onHome }: DialogueBoxProps) {
  const { text, allLines } = useLocale().content
  const ui = text.ui
  const { step, stepIndex, stepCount } = view
  const hasNext = stepIndex < stepCount - 1
  useStableTextHeight(linesRef, allLines)

  return (
    <section ref={boxRef} className="dialogue" id="dialogue" aria-label={ui.dialogue}>
      <div className="dlg-head">
        <span className="speaker">{text.speakers[step.speaker]}</span>
        {stepCount > 1 && (
          <span className="step-count" aria-label={ui.lineOf(stepIndex + 1, stepCount)}>
            {stepIndex + 1}/{stepCount}
          </span>
        )}
        <StatusTag status={step.status} source={step.source} />
      </div>

      {hasPortrait(step.speaker) ? (
        <Portrait speaker={step.speaker} talkKey={revealKey} talkFlaps={step.lines.length * 2} />
      ) : (
        <div className="portrait portrait-empty" aria-hidden="true" />
      )}

      <div className="dlg-main">
        <div className="lines-row">
          <div
            ref={linesRef}
            className={`lines status-${step.status}${hasNext ? ' can-advance' : ''}`}
            tabIndex={-1}
            aria-live="polite"
            onClick={hasNext ? onNext : undefined}
          >
            {step.lines.map((line, i) => (
              <p key={`${revealKey}:${i}`} style={{ '--i': i } as CSSProperties}>
                {line}
              </p>
            ))}
          </div>
          <div className="next-slot">
            {hasNext && (
              <button type="button" className="btn btn-next" onClick={onNext}>
                {ui.next} <span className="next-arrow" aria-hidden="true">▼</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="controls" role="group" aria-label={ui.dialogueNav}>
        <button
          type="button"
          className="btn"
          onClick={onBack}
          disabled={!canGoBack}
          aria-label={ui.back}
          aria-keyshortcuts="Escape"
        >
          <span aria-hidden="true">←</span>
          <span className="btn-label"> {ui.back}</span>
        </button>
        <button
          type="button"
          className="btn"
          onClick={onHome}
          disabled={!canGoBack && view.section === 'home'}
          aria-label={ui.home}
        >
          <span aria-hidden="true">⌂</span>
          <span className="btn-label"> {ui.home}</span>
        </button>
      </div>
    </section>
  )
}
