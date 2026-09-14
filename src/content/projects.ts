import type { Project, ProjectId } from './types'

/**
 * Source: the CV supplied by Thọ. Do not add screenshots, quotes, demo links,
 * results or metrics that are not in the CV.
 * `context: null` means the CV has no description, and the UI marks it as missing.
 */
export const projects: readonly Project[] = [
  {
    id: 'cbpo',
    name: 'CBPO',
    company: 'HDWEBSOFT',
    period: '03/2025 – nay',
    featured: true,
    context: 'Nền tảng điều phối dữ liệu thương mại điện tử và logistics.',
    role: 'Fullstack Developer',
    contributions: [
      'Microservices',
      'Kiến trúc cơ sở dữ liệu hybrid',
      'Migration MongoDB trên môi trường production',
    ],
    technologies: ['Vue.js', 'Python/Django', 'PostgreSQL', 'MongoDB', 'GCP'],
    relatedNode: 'how-migration',
  },
  {
    id: 'ca2t',
    name: 'CA2T',
    company: 'HDWEBSOFT',
    period: '03/2025 – nay',
    featured: true,
    context: 'Hệ thống quản lý học tập (LMS) cho doanh nghiệp.',
    role: 'Team Lead / Fullstack Developer',
    contributions: [
      'Phân quyền theo vai trò cho quản trị viên và học viên',
      'Dẫn dắt nhóm 5 người',
    ],
    technologies: ['React', 'Django', 'PostgreSQL', 'Tailwind'],
    relatedNode: 'how-roles',
  },
  {
    id: 'theavotree',
    name: 'TheAvoTree',
    company: 'HDWEBSOFT',
    period: '03/2025 – nay',
    featured: true,
    context: 'Hệ sinh thái thương mại điện tử kết nối với WooCommerce.',
    role: 'Backend Developer',
    contributions: ['Mô hình hoá dữ liệu', 'Tích hợp sự kiện', 'Báo cáo', 'Viết test'],
    technologies: ['NestJS', 'React', 'MongoDB', 'Webhooks'],
    relatedNode: 'how-events',
  },
  {
    id: 'singlekey',
    name: 'SingleKey',
    company: 'HDWEBSOFT',
    period: '03/2025 – nay',
    featured: false,
    context: 'Nền tảng quản lý bất động sản.',
    role: 'Fullstack Developer',
    contributions: [
      'Luồng xử lý hồ sơ đăng ký (application workflows)',
      'Component giao diện tái sử dụng',
      'A/B testing',
    ],
    technologies: ['Next.js', 'Django', 'Tailwind', 'VWO'],
  },
  {
    id: 'suzu',
    name: 'Suzu.net',
    company: 'SUZU GROUP',
    period: '03/2024 – 03/2025',
    featured: false,
    context: null,
    role: 'Fullstack Developer',
    contributions: ['Nhắn tin realtime', 'Thông báo', 'Logic news feed', 'Cải thiện hiệu năng'],
    technologies: ['Next.js', 'Supabase/PostgreSQL', 'WebSockets', 'Vercel'],
  },
  {
    id: 'ikara-admin',
    name: 'iKara Admin CMS',
    company: 'INMOBIVN',
    period: '12/2022 – 03/2024',
    featured: false,
    context: null,
    role: 'Fullstack Developer',
    contributions: [
      'Cửa hàng ảo (virtual store)',
      'Quản lý vật phẩm',
      'Validation dữ liệu',
      'Báo cáo tiền ảo',
    ],
    technologies: ['Java', 'React', 'Jenkins'],
  },
  {
    id: 'yokara',
    name: 'Yokara',
    company: 'INMOBIVN',
    period: '12/2022 – 03/2024',
    featured: false,
    context: null,
    role: 'Fullstack Developer',
    contributions: ['API', 'Xác thực người dùng (authentication)', 'Giao dịch tiền ảo', 'Tích hợp mobile'],
    technologies: ['Java', 'Express', 'Firebase', 'Flutter', 'Swift'],
  },
]

export const featuredProjects = projects.filter((p) => p.featured)
export const archivedProjects = projects.filter((p) => !p.featured)

export function getProject(id: ProjectId): Project {
  const project = projects.find((p) => p.id === id)
  if (!project) throw new Error(`Unknown project: ${id}`)
  return project
}
