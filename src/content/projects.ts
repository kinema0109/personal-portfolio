import type { Project, ProjectId } from './types'

/**
 * Source: Thọ's CV. The one-line context for Suzu.net, iKara Admin CMS and Yokara also uses
 * the products' public pages (suzu.net, the iKara App Store listing, inmobivn.com).
 * Do not add screenshots, quotes or demo links that are not supplied.
 */
export const projects: readonly Project[] = [
  {
    id: 'cbpo',
    name: 'CBPO',
    company: 'HDWEBSOFT',
    period: '03/2025 – present',
    featured: true,
    context:
      'An e-commerce data orchestration and logistics platform: order processing, Amazon marketplace data, brand pricing and shipping workflows.',
    role: 'Fullstack Developer',
    contributions: [
      'Scalable microservices with Django and Vue.js on GCP',
      'Hybrid data tier: PostgreSQL for order transactions, MongoDB for marketplace metrics',
      'Built a self-hosted MongoDB setup of 6 VMs on GCP',
      'Zero-downtime migration of production databases (100GB to 1.6TB) from MongoDB Atlas to those VMs',
      'AI-assisted feature delivery, reviewed to production quality',
    ],
    technologies: ['Vue.js', 'Python/Django', 'PostgreSQL', 'MongoDB', 'GCP', 'Docker'],
    relatedNode: 'how-migration',
  },
  {
    id: 'ca2t',
    name: 'CA2T',
    company: 'HDWEBSOFT',
    period: '03/2025 – present',
    featured: true,
    context: 'A learning platform for corporate training, with separate admin and learner roles.',
    role: 'Team Lead / Fullstack Developer',
    contributions: [
      'Role-based access control with a tailored dashboard for each role',
      'Led a cross-functional team of 5',
      'Fast, interactive UI with React and Tailwind',
    ],
    technologies: ['React', 'Django', 'PostgreSQL', 'Tailwind', 'BMAD AI framework'],
    relatedNode: 'how-roles',
  },
  {
    id: 'theavotree',
    name: 'TheAvoTree',
    company: 'HDWEBSOFT',
    period: '03/2025 – present',
    featured: true,
    context: 'A large e-commerce platform bridging WordPress/WooCommerce with a JavaScript management system.',
    role: 'Backend Developer',
    contributions: [
      'MongoDB schema that mirrors the WooCommerce data structure',
      'Secure webhook listener for real-time orders and inventory updates',
      'Admin dashboard with Chart.js',
      'Unit and integration tests for core business logic',
    ],
    technologies: ['NestJS', 'React', 'MongoDB', 'WooCommerce webhooks', 'Chart.js'],
    relatedNode: 'how-events',
  },
  {
    id: 'singlekey',
    name: 'SingleKey',
    company: 'HDWEBSOFT',
    period: '03/2025 – present',
    featured: false,
    context: 'A residential leasing platform that makes renting simpler for landlords and tenants.',
    role: 'Fullstack Developer',
    contributions: [
      'Landing pages and application workflows in Next.js and TypeScript',
      'A/B testing with VWO that increased sign-ups',
      'Reusable React components that cut new-feature development time by 30%',
      'Turned product requirements into technical specifications',
    ],
    technologies: ['Next.js', 'TypeScript', 'Django', 'Tailwind', 'VWO'],
  },
  {
    id: 'suzu',
    name: 'Suzu.net',
    company: 'SUZU GROUP',
    period: '03/2024 – 03/2025',
    featured: false,
    context: 'A community social network for creators, artists and their fans.',
    role: 'Fullstack Developer',
    contributions: [
      'Real-time messaging and notifications with Supabase Realtime (40% lower latency)',
      '"Smart Feed" ranking with PostgreSQL functions',
      'Lazy loading and image optimization (Core Web Vitals up to "Good")',
      'CI/CD pipelines on Vercel',
    ],
    technologies: ['Next.js', 'Supabase/PostgreSQL', 'WebSockets', 'Vercel'],
  },
  {
    id: 'ikara-admin',
    name: 'iKara Admin CMS',
    company: 'INMOBIVN',
    period: '12/2022 – 03/2024',
    featured: false,
    context: 'The admin and in-app economy system behind iKara, a karaoke app by InmobiVN.',
    role: 'Fullstack Developer',
    contributions: [
      'Management CMS built with Java Servlet and React',
      'Virtual store and item management',
      'Validation workflows for item prices, exchange rates and inventory',
      'Reports on virtual currency spending',
      'REST APIs that keep store items in sync on Android and iOS',
    ],
    technologies: ['Java', 'React', 'Jenkins'],
  },
  {
    id: 'yokara',
    name: 'Yokara',
    company: 'INMOBIVN',
    period: '12/2022 – 03/2024',
    featured: false,
    context: 'A social music and karaoke app by InmobiVN for singing, recording and sharing songs.',
    role: 'Fullstack Developer',
    contributions: [
      'REST APIs with Express and Firebase Functions',
      'Authentication with JWT and Firebase Auth',
      'Backend for virtual currency and in-app transactions',
      'Database structures for a high-frequency real-time mini-game',
      'Feature parity with the Flutter and Swift mobile apps',
    ],
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
