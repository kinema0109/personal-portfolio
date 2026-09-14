import type { ProjectId } from './types'

/** HTML summary of the supplied CV. Keep in sync with the PDF. */
export const cvSummary = {
  experience: [
    { company: 'HDWEBSOFT', period: '03/2025 – nay', projectIds: ['cbpo', 'ca2t', 'theavotree', 'singlekey'] },
    { company: 'SUZU GROUP', period: '03/2024 – 03/2025', projectIds: ['suzu'] },
    { company: 'INMOBIVN', period: '12/2022 – 03/2024', projectIds: ['ikara-admin', 'yokara'] },
  ] satisfies ReadonlyArray<{ company: string; period: string; projectIds: ProjectId[] }>,
  education: {
    school: 'Đại học Duy Tân',
    major: 'Công nghệ Phần mềm (Software Technology)',
    period: '08/2018 – 03/2023',
    gpa: '3.4/4',
  },
  languages: ['Tiếng Việt: bản ngữ', 'Tiếng Anh: TOEIC 695'],
} as const
