import type { Icon } from '../art/icons'
import type { ProjectId } from './types'

/**
 * Case study diagrams: which blocks and connections each story draws, and which of them light up at
 * each step. Language-independent: the labels are product and technology names. The step lines, story
 * titles and result chips live in src/content/i18n/*.ts under `story` and `cases`.
 *
 * Blocks sit on a 4 × 3 grid (col 0–3, row 0–2). An edge is lit when its id is in the step's focus,
 * or when both of its blocks are.
 */

export const CASE_IDS = ['cbpo', 'cbpo-migration', 'cbpo-mcp', 'cbpo-cicd', 'cbpo-shipping', 'avotree', 'singlekey', 'yokara'] as const
export type CaseId = (typeof CASE_IDS)[number]

export interface Block { id: string; icon: Icon; color?: string; label: string; sub?: string; col: number; row: number }
export interface Edge { id: string; from: string; to: string; label?: string }
export interface CaseStudy {
  projectId: ProjectId
  diagram: { description: string; blocks: readonly Block[]; edges: readonly Edge[] }
  /** One list per dialogue step: the block and edge ids that step is about. */
  focus: readonly (readonly string[])[]
}

const MONGO = '#5fb760'
const REDIS = '#d6524a'
const FIREBASE = '#f2a33a'
/** C.tealLight; palette.ts is not imported, so node --test can load this file. */
const C_TEAL = '#5e9a8b'

export const CASES: Record<CaseId, CaseStudy> = {
  cbpo: {
    projectId: 'cbpo',
    diagram: {
      description: 'Amazon SP-API and Shopify feed the CBPO API, built with Express and Hapi, which keeps its data in MongoDB and Redis, serves a Vue portal and talks to shipping carriers.',
      blocks: [
        { id: 'amazon', icon: 'cart', label: 'Amazon SP-API', col: 0, row: 0 },
        { id: 'shopify', icon: 'cart', label: 'Shopify', col: 0, row: 2 },
        { id: 'api', icon: 'server', label: 'API', sub: 'Express · Hapi', col: 1, row: 1 },
        { id: 'mongo', icon: 'db', color: MONGO, label: 'MongoDB', sub: '5 clusters', col: 2, row: 0 },
        { id: 'redis', icon: 'db', color: REDIS, label: 'Redis', col: 2, row: 2 },
        { id: 'portal', icon: 'web', label: 'Vue portal', sub: 'micro-frontends', col: 3, row: 1 },
        { id: 'carriers', icon: 'box', label: 'Carriers', sub: 'UPS · EasyPost', col: 1, row: 2 },
      ],
      edges: [
        { id: 'e-amazon', from: 'amazon', to: 'api' },
        { id: 'e-shopify', from: 'shopify', to: 'api' },
        { id: 'e-mongo', from: 'api', to: 'mongo' },
        { id: 'e-redis', from: 'api', to: 'redis' },
        { id: 'e-portal', from: 'api', to: 'portal' },
        { id: 'e-carriers', from: 'api', to: 'carriers' },
      ],
    },
    focus: [['amazon', 'shopify', 'api', 'portal'], ['mongo', 'redis', 'api']],
  },
  'cbpo-migration': {
    projectId: 'cbpo',
    diagram: {
      description: 'Five MongoDB clusters move from MongoDB Atlas to six self-hosted Compute Engine VMs running replica sets, replicated by mongosync, with the CBPO services cut over to them.',
      blocks: [
        { id: 'atlas', icon: 'cloud', label: 'MongoDB Atlas', sub: 'M50 / M60 tiers', col: 0, row: 0 },
        { id: 'api', icon: 'server', label: 'CBPO services', sub: 'Express · Hapi', col: 0, row: 2 },
        { id: 'vms', icon: 'vms', label: '6 × GCP VMs', sub: 'replica sets', col: 2, row: 1 },
        { id: 'quota', icon: 'gear', label: 'vCPU quota', sub: '24 → 78 cores', col: 3, row: 1 },
      ],
      edges: [
        { id: 'e-mongosync', from: 'atlas', to: 'vms', label: 'mongosync' },
        { id: 'e-cutover', from: 'api', to: 'vms', label: 'cutover' },
        { id: 'e-quota', from: 'quota', to: 'vms' },
      ],
    },
    focus: [['atlas'], ['quota', 'vms'], ['vms'], ['atlas', 'e-mongosync', 'vms'], ['api', 'e-cutover', 'vms']],
  },
  'cbpo-mcp': {
    projectId: 'cbpo',
    diagram: {
      description: 'An AI agent calls an MCP server hosted inside the TypeScript API; the server checks authentication and exposes six query tools over the marketplace data in MongoDB.',
      blocks: [
        { id: 'agent', icon: 'robot', label: 'AI agent', col: 0, row: 1 },
        { id: 'auth', icon: 'lock', label: 'Auth', sub: 'every call', col: 1, row: 0 },
        { id: 'mcp', icon: 'server', label: 'MCP server', sub: '~1,400 LOC', col: 1, row: 1 },
        { id: 'api', icon: 'server', label: 'TypeScript API', sub: 'Hapi', col: 1, row: 2 },
        { id: 'tools', icon: 'blocks', label: '6 tools', sub: 'orders · sales…', col: 2, row: 1 },
        { id: 'mongo', icon: 'db', color: MONGO, label: 'MongoDB', sub: 'marketplace data', col: 3, row: 1 },
      ],
      edges: [
        { id: 'e-agent-mcp', from: 'agent', to: 'mcp', label: 'MCP' },
        { id: 'e-auth', from: 'auth', to: 'mcp' },
        { id: 'e-host', from: 'api', to: 'mcp', label: 'hosts' },
        { id: 'e-tools', from: 'mcp', to: 'tools' },
        { id: 'e-data', from: 'tools', to: 'mongo' },
      ],
    },
    focus: [['agent'], ['mcp', 'api'], ['tools', 'auth', 'mcp'], ['agent', 'mcp', 'tools', 'mongo']],
  },
  'cbpo-cicd': {
    projectId: 'cbpo',
    diagram: {
      description: 'Several production branches merge into one GitLab CI pipeline that deploys three services with Helm, gated by automated deploy checks, with AI code review on merge requests.',
      blocks: [
        { id: 'branches', icon: 'branch', label: 'Prod branches', sub: 'several', col: 0, row: 1 },
        { id: 'gitlab', icon: 'gear', label: 'GitLab CI', sub: 'one pipeline', col: 1, row: 1 },
        { id: 'review', icon: 'doc', label: 'AI code review', sub: 'AGENTS.md · MRs', col: 1, row: 2 },
        { id: 'helm', icon: 'gear', label: 'Helm', sub: 'values per env', col: 2, row: 1 },
        { id: 'checks', icon: 'check', label: 'Deploy checks', sub: 'automated', col: 2, row: 0 },
        { id: 'services', icon: 'server', label: '3 services', col: 3, row: 1 },
      ],
      edges: [
        { id: 'e-merge', from: 'branches', to: 'gitlab', label: 'merged' },
        { id: 'e-review', from: 'review', to: 'gitlab' },
        { id: 'e-helm', from: 'gitlab', to: 'helm' },
        { id: 'e-checks', from: 'checks', to: 'helm' },
        { id: 'e-deploy', from: 'helm', to: 'services' },
      ],
    },
    focus: [['branches'], ['gitlab', 'helm'], ['checks', 'services', 'helm'], ['review', 'gitlab']],
  },
  'cbpo-shipping': {
    projectId: 'cbpo',
    diagram: {
      description: 'The Vue portal calls the Express API, which compares carrier rates across UPS and EasyPost, the latter behind a version mediator that maps errors, and prints 2D-barcode and FNSKU labels.',
      blocks: [
        { id: 'portal', icon: 'web', label: 'Vue portal', col: 0, row: 1 },
        { id: 'api', icon: 'server', label: 'Express API', col: 1, row: 1 },
        { id: 'labels', icon: 'label', label: 'Labels', sub: '2D barcode · FNSKU', col: 1, row: 0 },
        { id: 'rates', icon: 'chart', label: 'Rate compare', col: 2, row: 1 },
        { id: 'mediator', icon: 'blocks', label: 'Mediator', sub: 'error mapping', col: 2, row: 2 },
        { id: 'ups', icon: 'box', label: 'UPS', sub: 'added', col: 3, row: 0 },
        { id: 'easypost', icon: 'box', label: 'EasyPost v2', col: 3, row: 2 },
      ],
      edges: [
        { id: 'e-portal', from: 'portal', to: 'api' },
        { id: 'e-labels', from: 'api', to: 'labels' },
        { id: 'e-rates', from: 'api', to: 'rates' },
        { id: 'e-ups', from: 'rates', to: 'ups' },
        { id: 'e-mediator', from: 'rates', to: 'mediator' },
        { id: 'e-easypost', from: 'mediator', to: 'easypost' },
      ],
    },
    focus: [['rates', 'api'], ['ups', 'rates'], ['easypost', 'mediator'], ['labels', 'portal', 'api']],
  },
  avotree: {
    projectId: 'theavotree',
    diagram: {
      description: 'A scheduled job pulls orders from the WooCommerce shop through a queue with retries into a NestJS API over MongoDB, which mirrors WooCommerce, and a React dashboard for staff; webhooks carry statuses and users.',
      blocks: [
        { id: 'woo', icon: 'cart', label: 'WooCommerce', sub: 'slow WP dashboard', col: 0, row: 1 },
        { id: 'job', icon: 'clock', label: 'Scheduled job', sub: 'pulls orders', col: 1, row: 0 },
        { id: 'queue', icon: 'queue', label: 'Queue', sub: '+ retries', col: 2, row: 0 },
        { id: 'webhooks', icon: 'wave', label: 'Webhooks', sub: 'statuses · users', col: 1, row: 2 },
        { id: 'api', icon: 'server', label: 'NestJS API', col: 2, row: 1 },
        { id: 'mongo', icon: 'db', color: MONGO, label: 'MongoDB', sub: 'mirrors Woo', col: 3, row: 1 },
        { id: 'dashboard', icon: 'chart', label: 'React dashboard', sub: 'for staff', col: 3, row: 2 },
      ],
      edges: [
        { id: 'e-pull', from: 'woo', to: 'job' },
        { id: 'e-queue', from: 'job', to: 'queue' },
        { id: 'e-orders', from: 'queue', to: 'api' },
        { id: 'e-webhooks', from: 'woo', to: 'webhooks' },
        { id: 'e-hooks-api', from: 'webhooks', to: 'api' },
        { id: 'e-store', from: 'api', to: 'mongo' },
        { id: 'e-dash', from: 'mongo', to: 'dashboard' },
      ],
    },
    focus: [['woo'], ['api', 'mongo', 'dashboard'], ['mongo'], ['woo', 'job', 'queue', 'api', 'e-webhooks', 'webhooks'], ['dashboard']],
  },
  singlekey: {
    projectId: 'singlekey',
    diagram: {
      description: 'Landlords and tenants use static Next.js pages for the Rent Guarantee application, which uploads documents and runs a credit check, talks to a Django backend over REST, and is A/B tested with VWO.',
      blocks: [
        { id: 'user', icon: 'person', color: C_TEAL, label: 'Landlord', sub: 'or tenant', col: 0, row: 1 },
        { id: 'vwo', icon: 'chart', label: 'VWO', sub: 'A/B tests', col: 1, row: 0 },
        { id: 'next', icon: 'web', label: 'Next.js', sub: 'static pages', col: 1, row: 1 },
        { id: 'upload', icon: 'doc', label: 'Documents', sub: 'upload', col: 2, row: 0 },
        { id: 'flow', icon: 'blocks', label: 'Rent Guarantee', sub: 'application', col: 2, row: 1 },
        { id: 'credit', icon: 'check', label: 'Credit check', col: 2, row: 2 },
        { id: 'django', icon: 'server', label: 'Django', sub: 'REST API', col: 3, row: 1 },
      ],
      edges: [
        { id: 'e-visit', from: 'user', to: 'next' },
        { id: 'e-vwo', from: 'vwo', to: 'next' },
        { id: 'e-flow', from: 'next', to: 'flow' },
        { id: 'e-upload', from: 'upload', to: 'flow' },
        { id: 'e-credit', from: 'credit', to: 'flow' },
        { id: 'e-rest', from: 'flow', to: 'django', label: 'REST' },
      ],
    },
    focus: [['user'], ['flow', 'upload', 'credit'], ['next', 'flow', 'e-rest', 'django'], ['vwo', 'next', 'flow']],
  },
  yokara: {
    projectId: 'yokara',
    diagram: {
      description: 'The Yokara app signs in with Firebase Auth and calls Cloud Functions, which keep balances in the Firebase database with a reconciled ledger; a round-end job settles each Sicbo room in batched transactions.',
      blocks: [
        { id: 'app', icon: 'phone', label: 'Yokara app', sub: 'iOS · Android', col: 0, row: 1 },
        { id: 'auth', icon: 'lock', label: 'Firebase Auth', col: 1, row: 0 },
        { id: 'functions', icon: 'server', label: 'Cloud Functions', col: 1, row: 1 },
        { id: 'db', icon: 'db', color: FIREBASE, label: 'Firebase DB', sub: 'balances', col: 2, row: 1 },
        { id: 'ledger', icon: 'doc', label: 'Ledger', sub: 'reconciled', col: 3, row: 1 },
        { id: 'sicbo', icon: 'dice', label: 'Sicbo room', sub: '~50 players', col: 0, row: 2 },
        { id: 'job', icon: 'clock', label: 'Round-end job', col: 1, row: 2 },
        { id: 'batches', icon: 'queue', label: 'Batches', sub: 'transactions', col: 2, row: 2 },
      ],
      edges: [
        { id: 'e-auth', from: 'app', to: 'auth' },
        { id: 'e-call', from: 'app', to: 'functions' },
        { id: 'e-write', from: 'functions', to: 'db' },
        { id: 'e-ledger', from: 'db', to: 'ledger' },
        { id: 'e-round', from: 'sicbo', to: 'job' },
        { id: 'e-batch', from: 'job', to: 'batches' },
        { id: 'e-settle', from: 'batches', to: 'db' },
      ],
    },
    focus: [['app'], ['functions', 'db', 'ledger'], ['sicbo', 'job', 'batches', 'db'], ['auth', 'functions', 'db', 'app']],
  },
}
