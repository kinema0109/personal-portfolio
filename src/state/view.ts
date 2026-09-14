import type { ScreenMode } from '../art/ApartmentScene'
import { getMemorySlot, memorySlots } from '../content/memories'
import { getProject, projects } from '../content/projects'
import { posterChoice, story } from '../content/story'
import type { Choice, DialogueStep, MemorySlotId, NodeId, ProjectId, SceneId } from '../content/types'
import type { Location } from './navigation'

export type PanelView =
  | { kind: 'project'; projectId: ProjectId }
  | { kind: 'memory'; slotId: MemorySlotId }
  | { kind: 'cv' }

type Section = 'home' | 'projects' | 'how' | 'outside' | 'cv'

/** Everything the screen needs for one location. */
export interface View {
  scene: SceneId
  /** What the laptop in the scene shows. */
  screen: ScreenMode
  posterEnabled: boolean
  step: DialogueStep
  stepIndex: number
  stepCount: number
  choices: readonly Choice[]
  panel: PanelView | null
  /** Active top-level section, for aria-current in the nav. */
  section: Section
}

const SECTION_BY_NODE: Record<NodeId, Section> = {
  intro: 'home',
  work: 'projects',
  how: 'how',
  'how-migration': 'how',
  'how-events': 'how',
  'how-roles': 'how',
  outside: 'outside',
  rat: 'outside',
}

const SCREEN_BY_SECTION: Record<Section, ScreenMode> = {
  home: 'code',
  projects: 'docs',
  how: 'diagram',
  outside: 'game',
  cv: 'docs',
}

export function buildView(loc: Location): View {
  const base = buildBase(loc)
  return { ...base, screen: SCREEN_BY_SECTION[base.section] }
}

function buildBase(loc: Location): Omit<View, 'screen'> {
  switch (loc.kind) {
    case 'node': {
      const node = story[loc.id]
      const stepIndex = Math.min(loc.step, node.steps.length - 1)
      return {
        scene: node.scene,
        posterEnabled: Boolean(node.posterEnabled),
        step: node.steps[stepIndex],
        stepIndex,
        stepCount: node.steps.length,
        choices: node.choices,
        panel: null,
        section: SECTION_BY_NODE[node.id],
      }
    }

    case 'project': {
      const p = getProject(loc.id)
      const choices: Choice[] = []
      if (p.relatedNode) {
        choices.push({ label: 'Mình đã làm phần này thế nào?', target: { kind: 'node', id: p.relatedNode } })
      }
      choices.push({ label: 'Kho dự án', hint: 'Tất cả dự án trong CV', target: { kind: 'archive' } })
      return {
        ...single({
          speaker: 'THỌ',
          lines: [`Đây là ${p.name}, dự án ở ${p.company}.`, `Vai trò của mình: ${p.role}.`],
          status: 'ready',
          source: 'CV',
        }),
        choices,
        panel: { kind: 'project', projectId: p.id },
        section: 'projects',
      }
    }

    case 'archive':
      return {
        ...single({
          speaker: 'THỌ',
          lines: ['Đây là toàn bộ dự án có trong CV của mình.', 'Chọn một dự án để xem chi tiết.'],
          status: 'ready',
        }),
        choices: projects.map((p) => ({
          label: p.name,
          hint: `${p.company} · ${p.role}`,
          target: { kind: 'project', id: p.id },
        })),
        panel: null,
        section: 'projects',
      }

    case 'memory': {
      const slot = getMemorySlot(loc.id)
      const step: DialogueStep =
        slot.entries.length === 0 && !slot.confirmed
          ? {
              speaker: 'GHI CHÚ',
              lines: ['Ô ký ức này chưa có tên game hay kỷ niệm thật.', 'Thọ sẽ bổ sung sau.'],
              status: 'placeholder',
            }
          : (slot.confirmed ?? { speaker: 'THỌ', lines: ['Đây là vài game mình nhớ.'], status: 'ready' })
      return {
        ...single(step),
        choices: [
          ...memorySlots
            .filter((s) => s.id !== slot.id)
            .map<Choice>((s) => ({ label: s.label, target: { kind: 'memory', id: s.id } })),
          posterChoice,
        ],
        panel: { kind: 'memory', slotId: slot.id },
        section: 'outside',
      }
    }

    case 'cv':
      return {
        ...single({
          speaker: 'THỌ',
          lines: ['Đây là tóm tắt CV của mình.', 'Bấm vào tên dự án để xem chi tiết.'],
          status: 'ready',
        }),
        choices: [{ label: 'Xem dự án nổi bật', target: { kind: 'node', id: 'work' } }],
        panel: { kind: 'cv' },
        section: 'cv',
      }
  }
}

function single(step: DialogueStep) {
  return { scene: 'apartment' as const, posterEnabled: false, step, stepIndex: 0, stepCount: 1 }
}
