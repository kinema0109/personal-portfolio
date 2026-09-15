import { archivedProjects, featuredProjects } from './projects'
import type { Choice, NodeId, StoryNode } from './types'

/**
 * Conversation graph.
 * - Each step holds one to three lines; keep each line to one or two sentences.
 * - Facts come from Thọ's CV. status 'draft' = wording Thọ has not confirmed yet.
 * - Back, Home and "Projects" are always available, so they are not listed as choices.
 */

const projectChoices: Choice[] = featuredProjects.map((p) => ({
  label: p.name,
  hint: p.role,
  target: { kind: 'project', id: p.id },
}))

const galleryChoice: Choice = {
  label: 'The album on the desk',
  hint: 'Pixel art gallery',
  target: { kind: 'gallery' },
}

const nodes: readonly StoryNode[] = [
  {
    id: 'intro',
    albumEnabled: true,
    steps: [
      {
        speaker: 'THỌ',
        lines: [
          "Hi, I'm Thọ, a Middle Fullstack Developer with three years of experience building web applications.",
          'I work across the whole stack: the interface people use, the APIs behind it, and the databases underneath.',
          "I've worked on systems serving more than 100,000 active users.",
        ],
        status: 'ready',
        source: 'CV',
      },
      {
        speaker: 'THỌ',
        lines: [
          'I currently work at HDWEBSOFT in Ho Chi Minh City, on platforms for e-commerce, logistics, corporate training and property leasing.',
          "Ask me what I've built, how I work, or what I do away from the keyboard.",
        ],
        status: 'ready',
        source: 'CV',
      },
    ],
    choices: [
      { label: 'What have you worked on?', target: { kind: 'node', id: 'work' } },
      { label: 'How do you work?', target: { kind: 'node', id: 'how' } },
      { label: 'What about outside work?', target: { kind: 'node', id: 'outside' } },
    ],
  },

  // ── Branch 1: work ────────────────────────────────────────────
  {
    id: 'work',
    steps: [
      {
        speaker: 'THỌ',
        lines: [
          "I've been a Fullstack Developer at HDWEBSOFT since March 2025.",
          'Before that I built a community social network at Suzu Group (2024–2025), and worked on karaoke and social music apps at InmobiVN (2022–2024).',
        ],
        status: 'ready',
        source: 'CV',
      },
      {
        speaker: 'THỌ',
        lines: [
          'I mostly write TypeScript and JavaScript: React, Next.js and Vue.js on the frontend, NestJS, Express and Django on the backend.',
          'For data I use PostgreSQL, MongoDB, Supabase and MySQL, and I ship with Docker, GCP and Vercel.',
        ],
        status: 'ready',
        source: 'CV',
      },
      {
        speaker: 'THỌ',
        lines: [
          'Three projects show my day-to-day work best: CBPO, CA2T and TheAvoTree.',
          `The other ${archivedProjects.length} are in the project archive.`,
        ],
        status: 'ready',
      },
    ],
    choices: [
      ...projectChoices,
      { label: 'Project archive', hint: `${archivedProjects.length} more projects`, target: { kind: 'archive' } },
    ],
  },

  // ── Branch 2: how I work ──────────────────────────────────────
  {
    id: 'how',
    steps: [
      {
        speaker: 'THỌ',
        lines: [
          'One habit runs through all my work: I use AI-assisted coding tools to move faster.',
          'Then I review, debug and refine the result myself until it is production quality.',
        ],
        status: 'ready',
        source: 'CV',
      },
      {
        speaker: 'THỌ',
        lines: [
          'I can also go deeper into three pieces of work from my CV.',
          'Pick one: moving production MongoDB from Atlas to self-hosted GCP, a real-time webhook pipeline, or role-based access control.',
        ],
        status: 'ready',
      },
    ],
    choices: [
      { label: 'MongoDB: Atlas → self-hosted GCP', hint: 'CBPO', target: { kind: 'node', id: 'how-migration' } },
      { label: 'Real-time webhooks', hint: 'TheAvoTree', target: { kind: 'node', id: 'how-events' } },
      { label: 'Role-based access control', hint: 'CA2T', target: { kind: 'node', id: 'how-roles' } },
    ],
  },
  {
    id: 'how-migration',
    steps: [
      {
        speaker: 'THỌ',
        lines: [
          'CBPO is an e-commerce data orchestration and logistics platform, built as Django and Vue.js microservices on GCP.',
          'It centralizes order processing, pulls in Amazon marketplace data like BuyBox and competitor tracking, protects brand pricing and optimizes shipping.',
        ],
        status: 'ready',
        source: 'CV · CBPO',
      },
      {
        speaker: 'THỌ',
        lines: [
          'Its data tier is hybrid.',
          'PostgreSQL holds relational order transactions, and MongoDB holds high-velocity marketplace metrics and analytics logs.',
        ],
        status: 'ready',
        source: 'CV · CBPO',
      },
      {
        speaker: 'THỌ',
        lines: [
          'My biggest piece there was moving the production MongoDB databases off MongoDB Atlas.',
          'I built a self-hosted setup of six VMs on GCP, then migrated databases ranging from 100GB up to 1.6TB onto it.',
        ],
        status: 'ready',
        source: 'Thọ · CBPO',
      },
      {
        speaker: 'THỌ',
        lines: [
          'To keep the platform online, I designed a zero-downtime replication and parallel restore pipeline with Docker Compose.',
          "The move also cut the platform's dependence on third-party licensing.",
        ],
        status: 'ready',
        source: 'CV · CBPO',
      },
    ],
    choices: [
      { label: 'See CBPO details', target: { kind: 'project', id: 'cbpo' } },
      { label: 'Ask about something else', target: { kind: 'node', id: 'how' } },
    ],
  },
  {
    id: 'how-events',
    steps: [
      {
        speaker: 'THỌ',
        lines: [
          'TheAvoTree is a large e-commerce platform that bridges WordPress/WooCommerce with a modern JavaScript management system.',
          'I worked on the backend with NestJS and MongoDB.',
        ],
        status: 'ready',
        source: 'CV · TheAvoTree',
      },
      {
        speaker: 'THỌ',
        lines: [
          "I designed a MongoDB schema that mirrors WooCommerce's complex data structure.",
          'That keeps the data consistent across both platforms.',
        ],
        status: 'ready',
        source: 'CV · TheAvoTree',
      },
      {
        speaker: 'THỌ',
        lines: [
          'Orders and inventory updates arrive as WooCommerce webhooks.',
          'I built a secure webhook listener that handles thousands of real-time events without losing data.',
        ],
        status: 'ready',
        source: 'CV · TheAvoTree',
      },
      {
        speaker: 'THỌ',
        lines: [
          'On top of that data I built an admin dashboard with Chart.js for sales, user behavior and content performance.',
          'I also wrote unit and integration tests for the core business logic.',
        ],
        status: 'ready',
        source: 'CV · TheAvoTree',
      },
    ],
    choices: [
      { label: 'See TheAvoTree details', target: { kind: 'project', id: 'theavotree' } },
      { label: 'Ask about something else', target: { kind: 'node', id: 'how' } },
    ],
  },
  {
    id: 'how-roles',
    steps: [
      {
        speaker: 'THỌ',
        lines: [
          'CA2T is a learning platform for corporate training, built with React, Django, PostgreSQL and Tailwind.',
          'I was Team Lead and Fullstack Developer there.',
        ],
        status: 'ready',
        source: 'CV · CA2T',
      },
      {
        speaker: 'THỌ',
        lines: [
          'I designed its role-based access control.',
          'Admins and learners each get their own dashboard and learning interface.',
        ],
        status: 'ready',
        source: 'CV · CA2T',
      },
      {
        speaker: 'THỌ',
        lines: [
          'I also led a cross-functional team of five.',
          'I kept the timelines and technical decisions aligned.',
        ],
        status: 'ready',
        source: 'CV · CA2T',
      },
      {
        speaker: 'THỌ',
        lines: ['On the frontend I tuned React and Tailwind components so the platform stays fast and interactive for employees.'],
        status: 'ready',
        source: 'CV · CA2T',
      },
    ],
    choices: [
      { label: 'See CA2T details', target: { kind: 'project', id: 'ca2t' } },
      { label: 'Ask about something else', target: { kind: 'node', id: 'how' } },
    ],
  },

  // ── Branch 3: outside work ────────────────────────────────────
  {
    id: 'outside',
    albumEnabled: true,
    steps: [
      {
        speaker: 'THỌ',
        lines: [
          'Outside work, I play a lot of games.',
          'I started back on the Famicom/NES and still play modern games today, gacha games included.',
        ],
        status: 'ready',
        source: 'Provided by Thọ',
      },
      {
        speaker: 'THỌ',
        lines: ['See the album on my desk?', 'Open it for a small pixel-art gallery.'],
        status: 'ready',
      },
    ],
    choices: [galleryChoice],
  },
]

export const story: Readonly<Record<NodeId, StoryNode>> = Object.fromEntries(
  nodes.map((n) => [n.id, n]),
) as Record<NodeId, StoryNode>
