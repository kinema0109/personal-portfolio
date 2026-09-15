import type {
  Choice,
  ContentStatus,
  DialogueLines,
  DialogueStep,
  LocaleContent,
  NodeId,
  Project,
  ProjectId,
  StoryNode,
} from './types'

/**
 * Conversation graph. Structure only: targets, status and sources live here, the words in src/content/i18n/*.ts.
 * - Facts come from Thọ's CV. status 'draft' = wording Thọ has not confirmed yet.
 * - Back and Home are always available, so they are not listed as choices.
 */

const tho = (lines: DialogueLines, source?: string, status: ContentStatus = 'ready'): DialogueStep => ({
  speaker: 'tho',
  lines,
  status,
  source,
})

export function buildStory(
  text: LocaleContent,
  featured: readonly Project[],
  archivedCount: number,
): Readonly<Record<NodeId, StoryNode>> {
  const s = text.story
  const c = text.choices

  const projectChoices: Choice[] = featured.map((p) => ({
    label: p.name,
    hint: p.role,
    target: { kind: 'project', id: p.id },
  }))
  const details = (id: ProjectId, name: string): Choice => ({ label: c.seeDetails(name), target: { kind: 'project', id } })
  const askOther: Choice = { label: c.askOther, target: { kind: 'node', id: 'how' } }

  const nodes: readonly StoryNode[] = [
    {
      id: 'intro',
      steps: [tho(s.intro[0], 'CV'), tho(s.intro[1], 'CV')],
      choices: [
        { label: c.work, target: { kind: 'node', id: 'work' } },
        { label: c.how, target: { kind: 'node', id: 'how' } },
        { label: c.outside, target: { kind: 'node', id: 'outside' } },
      ],
    },

    // ── Branch 1: work ────────────────────────────────────────────
    {
      id: 'work',
      steps: [tho(s.work[0], 'CV'), tho(s.work[1], 'CV'), tho(s.workOverview(archivedCount))],
      choices: [
        ...projectChoices,
        { label: c.archive, hint: c.archiveMore(archivedCount), target: { kind: 'archive' } },
      ],
    },

    // ── Branch 2: how I work ──────────────────────────────────────
    {
      id: 'how',
      steps: [tho(s.how[0], 'CV'), tho(s.how[1])],
      choices: [
        { label: c.migration, hint: 'CBPO', target: { kind: 'node', id: 'how-migration' } },
        { label: c.events, hint: 'TheAvoTree', target: { kind: 'node', id: 'how-events' } },
        { label: c.roles, hint: 'CA2T', target: { kind: 'node', id: 'how-roles' } },
      ],
    },
    {
      id: 'how-migration',
      steps: [
        tho(s['how-migration'][0], 'CV · CBPO'),
        tho(s['how-migration'][1], 'CV · CBPO'),
        tho(s['how-migration'][2], 'Thọ · CBPO'),
        tho(s['how-migration'][3], 'CV · CBPO'),
      ],
      choices: [details('cbpo', 'CBPO'), askOther],
    },
    {
      id: 'how-events',
      steps: s['how-events'].map((lines) => tho(lines, 'CV · TheAvoTree')) as [DialogueStep, ...DialogueStep[]],
      choices: [details('theavotree', 'TheAvoTree'), askOther],
    },
    {
      id: 'how-roles',
      steps: s['how-roles'].map((lines) => tho(lines, 'CV · CA2T')) as [DialogueStep, ...DialogueStep[]],
      choices: [details('ca2t', 'CA2T'), askOther],
    },

    // ── Branch 3: outside work ────────────────────────────────────
    {
      id: 'outside',
      steps: [tho(s.outside[0], 'Thọ'), tho(s.outside[1])],
      choices: [{ label: c.album, hint: c.albumHint, target: { kind: 'gallery' } }],
    },
  ]

  return Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<NodeId, StoryNode>
}
