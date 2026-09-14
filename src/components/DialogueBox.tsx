import { forwardRef, type ReactNode } from 'react'
import type { Choice } from '../content/types'
import type { View } from '../state/view'
import { StatusTag } from './StatusTag'

interface DialogueBoxProps {
  view: View
  panel: ReactNode
  canGoBack: boolean
  onChoice: (choice: Choice) => void
  onNext: () => void
  onBack: () => void
  onHome: () => void
  onProjects: () => void
}

export const DialogueBox = forwardRef<HTMLDivElement, DialogueBoxProps>(function DialogueBox(
  { view, panel, canGoBack, onChoice, onNext, onBack, onHome, onProjects },
  linesRef,
) {
  const { step, stepIndex, stepCount, choices } = view
  const hasNext = stepIndex < stepCount - 1

  return (
    <section className="dialogue" id="dialogue" aria-label="Hội thoại">
      <div className="speaker-row">
        <span className="speaker">{step.speaker}</span>
        <StatusTag status={step.status} source={step.source} />
        {stepCount > 1 && (
          <span className="step-count" aria-label={`Câu ${stepIndex + 1} trên ${stepCount}`}>
            {stepIndex + 1}/{stepCount}
          </span>
        )}
      </div>

      <div
        ref={linesRef}
        className={`lines status-${step.status}`}
        tabIndex={-1}
        aria-live="polite"
        key={`${step.speaker}-${step.lines[0]}`}
      >
        {step.lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      {hasNext && (
        <div className="next-row">
          <button type="button" className="btn btn-next" onClick={onNext}>
            Tiếp <span aria-hidden="true">▸</span>
          </button>
        </div>
      )}

      {panel && <div className="doc">{panel}</div>}

      {choices.length > 0 && (
        <ol className="choices" aria-label="Lựa chọn">
          {choices.map((choice, i) => (
            <li key={`${choice.label}-${i}`}>
              <button type="button" className="choice" onClick={() => onChoice(choice)}>
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

      <div className="controls" role="group" aria-label="Điều hướng hội thoại">
        <button type="button" className="btn" onClick={onBack} disabled={!canGoBack}>
          <span aria-hidden="true">←</span> Quay lại
        </button>
        <button type="button" className="btn" onClick={onHome} disabled={view.section === 'home' && !canGoBack}>
          <span aria-hidden="true">⌂</span> Về đầu
        </button>
        <button type="button" className="btn" onClick={onProjects}>
          Dự án
        </button>
        <span className="kbd-hint" aria-hidden="true">
          {choices.length > 1 ? `Phím 1–${Math.min(choices.length, 9)} để chọn · ` : choices.length === 1 ? 'Phím 1 để chọn · ' : ''}
          Esc để quay lại
        </span>
      </div>
    </section>
  )
})
