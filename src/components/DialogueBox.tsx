import type { CSSProperties, Ref } from 'react'
import { hasPortrait, Portrait } from '../art/Portrait'
import type { Choice } from '../content/types'
import type { View } from '../state/view'
import { StatusTag } from './StatusTag'

interface DialogueBoxProps {
  view: View
  /** Changes on every dialogue step; lines re-enter when it changes. */
  revealKey: string
  /** Changes on every new place; choices re-enter when it changes. */
  choicesKey: string
  canGoBack: boolean
  boxRef: Ref<HTMLElement>
  linesRef: Ref<HTMLDivElement>
  onChoice: (choice: Choice) => void
  onNext: () => void
  onBack: () => void
  onHome: () => void
  onProjects: () => void
}

export function DialogueBox({
  view,
  revealKey,
  choicesKey,
  canGoBack,
  boxRef,
  linesRef,
  onChoice,
  onNext,
  onBack,
  onHome,
  onProjects,
}: DialogueBoxProps) {
  const { step, stepIndex, stepCount, choices } = view
  const hasNext = stepIndex < stepCount - 1
  const withPortrait = hasPortrait(step.speaker)

  return (
    <section
      ref={boxRef}
      className={`dialogue${withPortrait ? '' : ' no-portrait'}`}
      id="dialogue"
      aria-label="Dialogue"
    >
      <div className="dlg-head">
        <span className="speaker">{step.speaker}</span>
        <StatusTag status={step.status} source={step.source} />
        {stepCount > 1 && (
          <span className="step-count" aria-label={`Line ${stepIndex + 1} of ${stepCount}`}>
            {stepIndex + 1}/{stepCount}
          </span>
        )}
      </div>

      {withPortrait && <Portrait speaker={step.speaker} talkKey={revealKey} talkFlaps={step.lines.length * 2} />}

      <div className="dlg-main">
        <div className="lines-row">
          <div ref={linesRef} className={`lines status-${step.status}`} tabIndex={-1} aria-live="polite">
            {step.lines.map((line, i) => (
              <p key={`${revealKey}:${i}`} style={{ '--i': i } as CSSProperties}>
                {line}
              </p>
            ))}
          </div>
          {hasNext && (
            <button type="button" className="btn btn-next" onClick={onNext}>
              Next <span className="next-arrow" aria-hidden="true">▸</span>
            </button>
          )}
        </div>

        {choices.length > 0 && (
          <ol
            key={choicesKey}
            className="choices"
            aria-label="Choices"
            style={{ '--delay': `${step.lines.length * 40}ms` } as CSSProperties}
          >
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
        )}
      </div>

      <div className="controls" role="group" aria-label="Dialogue navigation">
        <button type="button" className="btn" onClick={onBack} disabled={!canGoBack} aria-keyshortcuts="Escape">
          <span aria-hidden="true">←</span> Back
        </button>
        <button type="button" className="btn" onClick={onHome} disabled={!canGoBack && view.section === 'home'}>
          <span aria-hidden="true">⌂</span> Home
        </button>
        <button type="button" className="btn" onClick={onProjects}>
          Projects
        </button>
      </div>
    </section>
  )
}
