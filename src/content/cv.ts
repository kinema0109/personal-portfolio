import type { ProjectId } from './types'

/** Structure of the CV summary; school, major and languages are translated in src/content/i18n/*.ts. Keep in sync with the PDF. */
export const cvSummary = {
  experience: [
    { company: 'HDWEBSOFT', start: '03/2025', end: null, projectIds: ['cbpo', 'ca2t', 'theavotree', 'singlekey'] },
    { company: 'SUZU GROUP', start: '03/2024', end: '03/2025', projectIds: ['suzu'] },
    { company: 'INMOBIVN', start: '12/2022', end: '03/2024', projectIds: ['ikara-admin', 'yokara'] },
  ] satisfies ReadonlyArray<{ company: string; start: string; end: string | null; projectIds: ProjectId[] }>,
  education: {
    start: '08/2018',
    end: '03/2023',
    gpa: '3.4/4',
  },
} as const
