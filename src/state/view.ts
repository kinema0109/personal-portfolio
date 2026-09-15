import type { ScreenMode } from '../art/ApartmentScene'
import { galleryItems } from '../content/gallery'
import { getProject, projects } from '../content/projects'
import { story } from '../content/story'
import type { Choice, DialogueStep, NodeId, ProjectId } from '../content/types'
import type { Location } from './navigation'

export type PanelView =
  | { kind: 'project'; projectId: ProjectId }
  | { kind: 'cv' }
  | { kind: 'gallery' }

type Section = 'home' | 'projects' | 'how' | 'outside' | 'cv' | 'gallery'

/** Everything the screen needs for one location. */
export interface View {
  /** What the laptop in the scene shows. */
  screen: ScreenMode
  /** Whether the album on the desk is clickable. */
  albumEnabled: boolean
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
}

const SCREEN_BY_SECTION: Record<Section, ScreenMode> = {
  home: 'code',
  projects: 'docs',
  how: 'diagram',
  outside: 'game',
  cv: 'docs',
  gallery: 'docs',
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
        albumEnabled: Boolean(node.albumEnabled),
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
        choices.push({ label: 'How did you approach it?', target: { kind: 'node', id: p.relatedNode } })
      }
      choices.push({ label: 'Project archive', hint: 'Every project in the CV', target: { kind: 'archive' } })
      return {
        ...single({
          speaker: 'THỌ',
          lines: [
            `${p.name} is a project at ${p.company} (${p.period}), where I worked as ${p.role}.`,
            p.relatedNode
              ? 'The panel shows what I built and the stack. Ask me how I approached the hardest part.'
              : 'The panel shows what I built and the stack I used.',
          ],
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
          lines: [
            'These are all the projects in my CV, newest first.',
            'Pick one to see its context, my role, what I contributed and the stack.',
          ],
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

    case 'gallery':
      return {
        ...single(
          galleryItems.length === 0
            ? {
                speaker: 'NOTE',
                lines: ['The album is empty for now.', 'Thọ will add the pixel-art pictures soon.'],
                status: 'placeholder',
              }
            : {
                speaker: 'THỌ',
                lines: [
                  'This album collects pixel-art pictures.',
                  'Pick one to see it full size, and use the arrow keys to flip through.',
                ],
                status: 'ready',
              },
        ),
        choices: [{ label: 'What about outside work?', target: { kind: 'node', id: 'outside' } }],
        panel: { kind: 'gallery' },
        section: 'gallery',
      }

    case 'cv':
      return {
        ...single({
          speaker: 'THỌ',
          lines: [
            'Here is a summary of my CV: experience, education and contact details.',
            'Click a project name to open its details.',
          ],
          status: 'ready',
        }),
        choices: [{ label: 'See featured projects', target: { kind: 'node', id: 'work' } }],
        panel: { kind: 'cv' },
        section: 'cv',
      }
  }
}

function single(step: DialogueStep) {
  return { albumEnabled: false, step, stepIndex: 0, stepCount: 1 }
}
