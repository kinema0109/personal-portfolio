import { PROJECTS } from './projects'
import type { ProjectId } from './types'

/**
 * What Thọ works with, grouped, with the evidence attached.
 *
 * The rule this follows: **no self-assessment.** No bars, no percentages, no stars, no "90%
 * TypeScript". A reader learns nothing from a three-quarters-full bar, and an applicant tracking
 * system drops the skill entirely because it cannot read a picture. What a reader can use is where
 * a thing was used and for how long, so every entry below is derived from the project list rather
 * than typed by hand: a skill cannot claim more than the work on this site actually shows.
 *
 * The one exception is `ALSO_USES`, which the owner names himself and which no project here
 * evidences. It is kept in its own group and labelled as such rather than mixed in, so the
 * difference between "here is where I used it" and "I have used this" stays visible.
 */

export type SkillGroupId =
  | 'languages' | 'frontend' | 'backend' | 'data' | 'delivery' | 'craft' | 'practice'

/**
 * Each entry names a technology exactly as the projects list it, so the match is by name and never
 * by substring. Keep this in step with the `technologies` arrays in projects.ts.
 */
export const SKILL_GROUPS: readonly { id: SkillGroupId; items: readonly string[] }[] = [
  { id: 'languages', items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Swift'] },
  { id: 'frontend', items: ['React', 'Next.js', 'Vue.js', 'Tailwind', 'Chart.js', 'Flutter'] },
  { id: 'backend', items: ['NestJS', 'Django', 'Express', 'WebSockets', 'JWT'] },
  { id: 'data', items: ['PostgreSQL', 'MongoDB', 'Supabase', 'Firebase'] },
  { id: 'delivery', items: ['Docker', 'GCP', 'Jenkins', 'Vercel'] },
  { id: 'craft', items: ['Microservices', 'RBAC', 'Schema design', 'Query optimization', 'Testing', 'WooCommerce webhooks'] },
  { id: 'practice', items: ['Claude Code', 'BMAD AI framework', 'VWO'] },
]

/**
 * The CV's competency list, minus everything a project here already evidences. These are real and
 * on the CV, but no work shown on this site demonstrates them, so they are kept apart rather than
 * mixed in where they would read as equally backed.
 */
export const FROM_CV: readonly string[] = [
  'Redux',
  'MySQL',
  'HTML/CSS',
  'REST API design',
  'OAuth',
  'OOP, design patterns, data structures',
  'Git (Gitflow), Bitbucket, Jira',
  'Agile',
]

/** Named by the owner, and not on the CV either. The weakest tier, and labelled as such. */
export const ALSO_USES: readonly string[] = [
  'Kubernetes',
  'Redis',
  'Message queues',
  'Monitoring and logging',
]

export interface SkillEvidence {
  name: string
  /** Projects that used it, newest first. */
  projectIds: readonly ProjectId[]
  /** Year of the earliest project that used it. */
  since: number
  /** True while one of those projects is still running. */
  current: boolean
}

const year = (date: string) => Number(date.slice(3))

/** Everything the project list says about one technology. Returns null if nothing does. */
export function evidenceFor(name: string): SkillEvidence | null {
  const used = PROJECTS.filter((p) => p.technologies.includes(name))
  if (used.length === 0) return null
  return {
    name,
    projectIds: used.map((p) => p.id),
    since: Math.min(...used.map((p) => year(p.start))),
    current: used.some((p) => p.end === null),
  }
}

/** A group with its evidence resolved, and anything that has none dropped rather than shown empty. */
export function skillsInGroup(id: SkillGroupId): readonly SkillEvidence[] {
  const group = SKILL_GROUPS.find((g) => g.id === id)
  if (!group) return []
  return group.items
    .map(evidenceFor)
    .filter((entry): entry is SkillEvidence => entry !== null)
    .sort((a, b) => b.projectIds.length - a.projectIds.length || a.since - b.since)
}
