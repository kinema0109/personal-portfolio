import type { ScreenMode } from '../art/ApartmentScene'
import type { Content } from '../content'
import { CASES, CASE_IDS, type CaseId } from '../content/caseDiagrams'
import { galleryItems } from '../content/gallery'
import { PROJECTS } from '../content/projects'
import type { Choice, DialogueStep, NodeId, ProjectId } from '../content/types'
import type { Location } from './navigation'

export type PanelView =
  | { kind: 'project'; projectId: ProjectId }
  | { kind: 'cv' }
  | { kind: 'gallery' }
  | { kind: 'case'; caseId: CaseId; step: number }

type Section = 'home' | 'projects' | 'how' | 'outside' | 'cv' | 'gallery'

/** Everything the screen needs for one location. */
export interface View {
  /** What the PC screen in the scene shows. */
  screen: ScreenMode
  step: DialogueStep
  stepIndex: number
  stepCount: number
  choices: readonly Choice[]
  /** The choice list is this screen's purpose; clicking away from it goes back. */
  picker: boolean
  panel: PanelView | null
  /** Active top-level section. */
  section: Section
}

const SECTION_BY_NODE: Record<NodeId, Section> = {
  intro: 'home',
  work: 'projects',
  how: 'how',
  cbpo: 'how',
  'cbpo-migration': 'how',
  'cbpo-mcp': 'how',
  'cbpo-cicd': 'how',
  'cbpo-shipping': 'how',
  avotree: 'how',
  singlekey: 'how',
  yokara: 'how',
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

/** The story node that tells how a project was built, back to the project, so it keeps its screen. */
const PROJECT_BY_NODE: ReadonlyMap<NodeId, ProjectId> = new Map(
  PROJECTS.flatMap((p) => (p.relatedNode ? [[p.relatedNode, p.id] as const] : [])),
)

export function buildView(loc: Location, content: Content): View {
  const base = buildBase(loc, content)
  return { ...base, screen: screenFor(loc, base) }
}

/** A project on screen shows its own diagram; everywhere else the section decides. */
function screenFor(loc: Location, base: Omit<View, 'screen'>): ScreenMode {
  if (base.panel?.kind === 'project') return `project:${base.panel.projectId}`
  if (base.panel?.kind === 'case') return `project:${CASES[base.panel.caseId].projectId}`
  if (loc.kind === 'node') {
    const project = PROJECT_BY_NODE.get(loc.id)
    if (project) return `project:${project}`
  }
  return SCREEN_BY_SECTION[base.section]
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
        // Visual-novel convention: the choice menu waits for the last line — unless the list is
        // what the reader came for, in which case making them read first is just an obstacle.
        choices: node.picker || stepIndex === node.steps.length - 1 ? node.choices : [],
        picker: node.picker === true,
        panel: (CASE_IDS as readonly string[]).includes(node.id)
          ? { kind: 'case', caseId: node.id as CaseId, step: stepIndex }
          : null,
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
        picker: false,
        panel: { kind: 'project', projectId: p.id },
        section: 'projects',
      }
    }

    case 'archive':
      return {
        ...single({ speaker: 'tho', lines: text.views.archive, status: 'ready' }),
        picker: true,
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
        picker: false,
        choices: [{ label: text.choices.outside, target: { kind: 'node', id: 'outside' } }],
        panel: { kind: 'gallery' },
        section: 'gallery',
      }

    case 'cv':
      return {
        ...single({ speaker: 'tho', lines: text.views.cv, status: 'ready' }),
        picker: false,
        choices: [{ label: text.choices.seeFeatured, target: { kind: 'node', id: 'work' } }],
        panel: { kind: 'cv' },
        section: 'cv',
      }
  }
}

function single(step: DialogueStep) {
  return { step, stepIndex: 0, stepCount: 1 }
}
