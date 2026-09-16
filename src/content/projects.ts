import type { LocaleContent, Project, ProjectInfo } from './types'

/**
 * Source: Thọ's CV (Full-Stack Developer edition, 2026). The six-VM detail for CBPO comes from Thọ directly.
 * The one-line context for Suzu.net, iKara Admin CMS and Yokara also uses
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
    technologies: ['Vue.js', 'Python', 'Django', 'PostgreSQL', 'MongoDB', 'GCP', 'Docker'],
    relatedNode: 'how-migration',
  },
  {
    id: 'ca2t',
    name: 'CA2T',
    company: 'HDWEBSOFT',
    start: '03/2025',
    end: null,
    featured: true,
    technologies: ['React', 'Python', 'Django', 'PostgreSQL', 'Tailwind', 'Claude Code', 'BMAD AI framework'],
    relatedNode: 'how-roles',
  },
  {
    id: 'theavotree',
    name: 'TheAvoTree',
    company: 'HDWEBSOFT',
    start: '03/2025',
    end: null,
    featured: true,
    technologies: ['NestJS', 'React', 'MongoDB', 'WooCommerce webhooks', 'Chart.js'],
    relatedNode: 'how-events',
  },
  {
    id: 'singlekey',
    name: 'SingleKey',
    company: 'HDWEBSOFT',
    start: '03/2025',
    end: null,
    featured: false,
    technologies: ['Next.js', 'TypeScript', 'React', 'Django', 'Tailwind', 'VWO'],
  },
  {
    id: 'suzu',
    name: 'Suzu.net',
    company: 'SUZU GROUP',
    start: '03/2024',
    end: '03/2025',
    featured: false,
    technologies: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'WebSockets', 'Vercel'],
  },
  {
    id: 'ikara-admin',
    name: 'iKara Admin CMS',
    company: 'INMOBIVN',
    start: '12/2022',
    end: '03/2024',
    featured: false,
    technologies: ['Java', 'React', 'Jenkins'],
  },
  {
    id: 'yokara',
    name: 'Yokara',
    company: 'INMOBIVN',
    start: '12/2022',
    end: '03/2024',
    featured: false,
    technologies: ['Express', 'Firebase', 'MongoDB', 'JWT', 'Flutter', 'Swift'],
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
