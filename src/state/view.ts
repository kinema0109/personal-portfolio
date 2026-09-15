import type { ScreenMode } from '../art/ApartmentScene'
import type { Content } from '../content'
import { galleryItems } from '../content/gallery'
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
  step: DialogueStep
  stepIndex: number
  stepCount: number
  choices: readonly Choice[]
  panel: PanelView | null
  /** Active top-level section. */
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

export function buildView(loc: Location, content: Content): View {
  const base = buildBase(loc, content)
  return { ...base, screen: SCREEN_BY_SECTION[base.section] }
}

function buildBase(loc: Location, content: Content): Omit<View, 'screen'> {
  const { text } = content
  switch (loc.kind) {
    case 'node': {
      const node = content.story[loc.id]
      const stepIndex = Math.min(loc.step, node.steps.length - 1)
      return {
        step: node.steps[stepIndex],
        stepIndex,
        stepCount: node.steps.length,
        // Visual-novel convention: the choice menu only appears once the last line has been read.
        choices: stepIndex === node.steps.length - 1 ? node.choices : [],
        panel: null,
        section: SECTION_BY_NODE[node.id],
      }
    }

    case 'project': {
      const p = content.getProject(loc.id)
      const choices: Choice[] = []
      if (p.relatedNode) {
        choices.push({ label: text.choices.approach, target: { kind: 'node', id: p.relatedNode } })
      }
      choices.push({ label: text.choices.archive, hint: text.choices.archiveAll, target: { kind: 'archive' } })
      return {
        ...single({ speaker: 'tho', lines: text.views.project(p, Boolean(p.relatedNode)), status: 'ready', source: 'CV' }),
        choices,
        panel: { kind: 'project', projectId: p.id },
        section: 'projects',
      }
    }

    case 'archive':
      return {
        ...single({ speaker: 'tho', lines: text.views.archive, status: 'ready' }),
        choices: content.projects.map((p) => ({
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
            ? { speaker: 'note', lines: text.views.galleryEmpty, status: 'placeholder' }
            : { speaker: 'tho', lines: text.views.gallery, status: 'ready' },
        ),
        choices: [{ label: text.choices.outside, target: { kind: 'node', id: 'outside' } }],
        panel: { kind: 'gallery' },
        section: 'gallery',
      }

    case 'cv':
      return {
        ...single({ speaker: 'tho', lines: text.views.cv, status: 'ready' }),
        choices: [{ label: text.choices.seeFeatured, target: { kind: 'node', id: 'work' } }],
        panel: { kind: 'cv' },
        section: 'cv',
      }
  }
}

function single(step: DialogueStep) {
  return { step, stepIndex: 0, stepCount: 1 }
}
