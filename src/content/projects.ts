import type { LocaleContent, Project, ProjectInfo } from './types'

/**
 * Source: Thọ's CV (Full-Stack Developer edition, 2026). CBPO was rewritten from Thọ's 2026-09 project brief (Node/Hapi, MongoDB + Redis, Atlas migration, MCP).
 * The one-line context for Suzu.net and Yokara & iKara also uses
 * the products' public pages (suzu.net, the iKara App Store listing, inmobivn.com).
 * Do not add screenshots, quotes or demo links that are not supplied.
 * Context, role and contributions for each language live in src/content/i18n/*.ts.
 */
export const PROJECTS: readonly ProjectInfo[] = [
  {
    id: 'cbpo',
    name: 'CBPO',
    company: 'HDWEBSOFT',
    start: '03/2025',
    end: null,
    featured: true,
    technologies: ['Node.js', 'Express', 'TypeScript', 'Hapi', 'Vue.js', 'Vuex', 'MongoDB', 'Redis', 'GCP', 'GitLab CI', 'Helm', 'Jest', 'MCP'],
    relatedNode: 'cbpo',
  },
  {
    id: 'ca2t',
    name: 'CA2T',
    company: 'HDWEBSOFT',
    start: '03/2025',
    end: null,
    featured: true,
    technologies: ['RBAC', 'TypeScript', 'JavaScript', 'React', 'Python', 'Django', 'PostgreSQL', 'Tailwind', 'Claude Code', 'BMAD AI framework'],
    relatedNode: 'how-roles',
  },
  {
    id: 'theavotree',
    name: 'TheAvoTree',
    company: 'HDWEBSOFT',
    start: '03/2025',
    end: null,
    featured: true,
    technologies: ['Schema design', 'Testing', 'TypeScript', 'JavaScript', 'NestJS', 'React', 'MongoDB', 'WooCommerce webhooks', 'Chart.js'],
    relatedNode: 'avotree',
  },
  {
    id: 'singlekey',
    name: 'SingleKey',
    company: 'HDWEBSOFT',
    start: '03/2025',
    end: null,
    featured: false,
    technologies: ['JavaScript', 'Next.js', 'TypeScript', 'React', 'Django', 'Tailwind', 'VWO'],
    relatedNode: 'singlekey',
  },
  {
    id: 'suzu',
    name: 'Suzu.net',
    company: 'SUZU GROUP',
    start: '03/2024',
    end: '03/2025',
    featured: false,
    technologies: ['JavaScript', 'Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'WebSockets', 'Vercel'],
    relatedNode: 'suzu',
  },
  {
    id: 'yokara',
    name: 'Yokara & iKara',
    company: 'INMOBIVN',
    start: '12/2022',
    end: '03/2024',
    featured: false,
    technologies: ['TypeScript', 'JavaScript', 'Java', 'React', 'Firebase', 'Jenkins', 'Flutter', 'Swift'],
    relatedNode: 'yokara',
  },
]

export function formatPeriod(start: string, end: string | null, present: string): string {
  return `${start} – ${end ?? present}`
}

/** All projects with their text in one language, newest first. */
export function localizeProjects(text: LocaleContent): readonly Project[] {
  return PROJECTS.map((info) => ({
    ...info,
    ...text.projects[info.id],
    period: formatPeriod(info.start, info.end, text.present),
  }))
}
