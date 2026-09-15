import type { ProjectId } from './types'

/** HTML summary of the supplied CV. Keep in sync with the PDF. */
export const cvSummary = {
  experience: [
    { company: 'HDWEBSOFT', period: '03/2025 – present', projectIds: ['cbpo', 'ca2t', 'theavotree', 'singlekey'] },
    { company: 'SUZU GROUP', period: '03/2024 – 03/2025', projectIds: ['suzu'] },
    { company: 'INMOBIVN', period: '12/2022 – 03/2024', projectIds: ['ikara-admin', 'yokara'] },
  ] satisfies ReadonlyArray<{ company: string; period: string; projectIds: ProjectId[] }>,
  education: {
    school: 'Duy Tan University',
    major: "Bachelor's degree in Software Technology",
    period: '08/2018 – 03/2023',
    gpa: '3.4/4',
  },
  languages: ['Vietnamese: native', 'English: TOEIC 695'],
} as const
