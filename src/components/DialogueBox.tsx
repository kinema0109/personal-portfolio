import type { Ref } from 'react'
import { hasPortrait, Portrait } from '../art/Portrait'
import type { Choice } from '../content/types'
import type { View } from '../state/view'
import { StatusTag } from './StatusTag'

interface DialogueBoxProps {
  view: View
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
      aria-label="Hội thoại"
    >
      <div className="dlg-head">
        <span className="speaker">{step.speaker}</span>
        <StatusTag status={step.status} source={step.source} />
        {stepCount > 1 && (
          <span className="step-count" aria-label={`Câu ${stepIndex + 1} trên ${stepCount}`}>
            {stepIndex + 1}/{stepCount}
          </span>
        )}
      </div>

      {withPortrait && <Portrait speaker={step.speaker} />}

      <div className="dlg-main">
        <div className="lines-row">
          <div ref={linesRef} className={`lines status-${step.status}`} tabIndex={-1} aria-live="polite">
            {step.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          {hasNext && (
            <button type="button" className="btn btn-next" onClick={onNext}>
              Tiếp <span className="next-arrow" aria-hidden="true">▸</span>
            </button>
          )}
        </div>

        {choices.length > 0 && (
          <ol className="choices" aria-label="Lựa chọn">
            {choices.map((choice, i) => (
              <li key={`${choice.label}-${i}`}>
                <button
                  type="button"
                  className="choice"
                  onClick={() => onChoice(choice)}
                  aria-keyshortcuts={i < 9 ? String(i + 1) : undefined}
                >
                  {i < 9 && (
                    <span className="choice-key" aria-hidden="true">
                      {i + 1}
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

      <div className="controls" role="group" aria-label="Điều hướng hội thoại">
        <button type="button" className="btn" onClick={onBack} disabled={!canGoBack} aria-keyshortcuts="Escape">
          <span aria-hidden="true">←</span> Quay lại
        </button>
        <button type="button" className="btn" onClick={onHome} disabled={!canGoBack && view.section === 'home'}>
          <span aria-hidden="true">⌂</span> Về đầu
        </button>
        <button type="button" className="btn" onClick={onProjects}>
          Dự án
        </button>
      </div>
    </section>
  )
}
