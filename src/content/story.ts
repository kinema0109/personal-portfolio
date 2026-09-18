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
  const anotherCbpo: Choice = { label: c.anotherCbpo, target: { kind: 'node', id: 'cbpo' } }
  const cbpoEnd: readonly Choice[] = [anotherCbpo, details('cbpo', 'CBPO'), askOther]
  /** A case study's steps: the first may cite a public source; the wording is still Thọ's to confirm. */
  const caseSteps = (lines: readonly DialogueLines[], source: string, firstSource = source) =>
    lines.map((l, i) => tho(l, i === 0 ? firstSource : source)) as [DialogueStep, ...DialogueStep[]]

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
      // The reader clicked "see the projects", so the list is there from the first line rather
      // than three lines later.
      picker: true,
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
        { label: c.migration, hint: 'CBPO', target: { kind: 'node', id: 'cbpo-migration' } },
        { label: c.events, hint: 'TheAvoTree', target: { kind: 'node', id: 'avotree' } },
        { label: c.roles, hint: 'CA2T', target: { kind: 'node', id: 'how-roles' } },
      ],
    },

    // Case studies. Each step lights part of the diagram in src/content/caseDiagrams.ts.
    {
      id: 'cbpo',
      steps: caseSteps(s.cbpo, 'Thọ · CBPO'),
      choices: [
        { label: c.cbpoMigration, target: { kind: 'node', id: 'cbpo-migration' } },
        { label: c.cbpoMcp, target: { kind: 'node', id: 'cbpo-mcp' } },
        { label: c.cbpoCicd, target: { kind: 'node', id: 'cbpo-cicd' } },
        { label: c.cbpoShipping, target: { kind: 'node', id: 'cbpo-shipping' } },
      ],
    },
    { id: 'cbpo-migration', steps: caseSteps(s['cbpo-migration'], 'Thọ · CBPO'), choices: cbpoEnd },
    { id: 'cbpo-mcp', steps: caseSteps(s['cbpo-mcp'], 'Thọ · CBPO'), choices: cbpoEnd },
    { id: 'cbpo-cicd', steps: caseSteps(s['cbpo-cicd'], 'Thọ · CBPO'), choices: cbpoEnd },
    { id: 'cbpo-shipping', steps: caseSteps(s['cbpo-shipping'], 'Thọ · CBPO'), choices: cbpoEnd },
    {
      id: 'avotree',
      steps: caseSteps(s.avotree, 'Thọ · TheAvoTree', 'Public · TheAvoTree'),
      choices: [details('theavotree', 'TheAvoTree'), askOther],
    },
    {
      id: 'singlekey',
      steps: caseSteps(s.singlekey, 'Thọ · SingleKey', 'Public · SingleKey'),
      choices: [details('singlekey', 'SingleKey'), askOther],
    },
    {
      id: 'yokara',
      steps: caseSteps(s.yokara, 'Thọ · Yokara', 'Public · Yokara'),
      choices: [details('yokara', 'Yokara'), askOther],
    },
    {
      id: 'how-roles',
      steps: s['how-roles'].map((lines) => tho(lines, 'CV · CA2T')) as [DialogueStep, ...DialogueStep[]],
      choices: [details('ca2t', 'CA2T'), askOther],
    },

    // ── Branch 3: outside work ────────────────────────────────────
    {
      id: 'outside',
      steps: [tho(s.outside[0], 'Thọ')],
      // Nothing here points at the room's things. They are found by looking, not by being told.
      choices: [],
    },
  ]

  return Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<NodeId, StoryNode>
}
