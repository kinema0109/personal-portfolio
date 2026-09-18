# Case Studies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** CBPO, TheAvoTree, SingleKey and Yokara each get a case study told as dialogue, with a large pixel architecture diagram in the side panel that lights up the part each step is about.

**Architecture:**
- **Nodes:** eight new story nodes (`cbpo` with four sub-stories, `avotree`, `singlekey`, `yokara`) replace `how-migration` and `how-events`.
- **Data:** `src/content/caseDiagrams.ts` holds language-independent diagram data (blocks, edges, per-step focus). `en.ts` holds the words: step lines, story titles, result chips.
- **Panel:** `view.ts` turns a case node into a `{ kind: 'case' }` panel. `CaseStudyPanel` draws the diagram with an icon set shared with the PC screen.

**Tech Stack:** React 19, TypeScript, SVG pixel rects, `node --test` for data integrity, Playwright (Edge) for the browser check.

**Spec:** `docs/superpowers/specs/2026-09-18-case-studies-design.md`. The step lines are in its "Draft lines" section; copy them verbatim.

**Branch:** `prototype/visual-novel`. Never commit to `main`, never push. Never `git add` the untracked `public/references/locked/` or `references/`.

**Dev server:** `npx vite --host 127.0.0.1 --port 5181 --strictPort`. Reuse it if `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5181` returns 200.

---

### Task 0: Commit the owner's pending CBPO rewrite

The working tree holds the owner's uncommitted CBPO rewrite in `README.md`, `src/art/ProjectScreens.tsx`, `src/content/i18n/en.ts` and `src/content/projects.ts`. The spec says to commit it as it stands.

- [ ] **Step 1:** Run `git diff --stat`. Confirm only those four files are modified, then run `npm run build`. Expected: `✓ built`.
- [ ] **Step 2: Commit**

```bash
git add README.md src/art/ProjectScreens.tsx src/content/i18n/en.ts src/content/projects.ts
git commit -m "Rewrite CBPO from the owner's project brief

Node/Express and TypeScript/Hapi over MongoDB and Redis on GCP; the Atlas
migration of 5 clusters onto 6 VMs; the MCP server; one GitLab CI and
Helm pipeline; carrier integrations and label printing.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 1: Shared pixel icons

**Files:**
- Create: `src/art/icons.ts`
- Modify: `src/art/ProjectScreens.tsx`

- [ ] **Step 1: Move the icon set into `src/art/icons.ts` and add the icons the case diagrams need**

Cut the `Icon` type, the `icon()` function and the colour constants it uses (`BG`, `PG`, `MONGO`, `REDIS`) out of `ProjectScreens.tsx`. Paste them into the new file, exported, and add the new icons below:

```ts
import { C, type Px } from './palette'

/** Pixel icons shared by the PC screen's small diagrams and the case study diagrams. */
export const ICON_BG = '#1b2336'
export const PG = '#5b8dd6'
export const MONGO = '#5fb760'
export const REDIS = '#d6524a'
export const FIREBASE = '#f2a33a'
const GOOD = '#7fc97f'

export type Icon =
  | 'web' | 'server' | 'db' | 'cloud' | 'vm' | 'phone' | 'person' | 'lock' | 'chart' | 'gear' | 'coin'
  | 'cart' | 'wave' | 'triangle' | 'blocks'
  | 'robot' | 'branch' | 'check' | 'doc' | 'queue' | 'clock' | 'box' | 'dice' | 'vms' | 'label'

/** Width × height of each icon in pixels, so a diagram can centre it. */
export const ICON_SIZE: Record<Icon, readonly [number, number]> = {
  web: [8, 6], server: [5, 7], db: [5, 6], cloud: [11, 5], vm: [2, 2], phone: [4, 7], person: [3, 6],
  lock: [5, 6], chart: [7, 6], gear: [5, 5], coin: [4, 4], cart: [7, 5], wave: [7, 3], triangle: [5, 3],
  blocks: [6, 6], robot: [8, 8], branch: [7, 8], check: [8, 5], doc: [6, 8], queue: [8, 7], clock: [8, 8],
  box: [8, 7], dice: [7, 7], vms: [11, 7], label: [8, 6],
}

/** Each icon drawn at (x, y). `color` tints the icons that come in more than one colour. */
export function icon(kind: Icon, x: number, y: number, color: string = C.cream): Px[] {
  switch (kind) {
    // ── existing icons: paste the cases from ProjectScreens.tsx unchanged, with BG renamed ICON_BG ──
    case 'robot':
      return [[x + 3, y, 2, 1, C.ochre], [x + 1, y + 1, 6, 5, C.mist], [x + 2, y + 3, 1, 1, ICON_BG],
        [x + 5, y + 3, 1, 1, ICON_BG], [x + 2, y + 6, 4, 2, C.mist]]
    case 'branch':
      return [[x + 1, y, 1, 8, C.tealLight], [x + 2, y + 5, 1, 1, C.tealLight], [x + 3, y + 4, 1, 1, C.tealLight],
        [x + 4, y + 3, 1, 1, C.tealLight], [x + 5, y + 1, 2, 2, C.tealLight], [x, y + 7, 3, 1, C.tealLight]]
    case 'check':
      return [[x, y + 2, 1, 2, GOOD], [x + 1, y + 3, 1, 2, GOOD], [x + 2, y + 3, 1, 2, GOOD], [x + 3, y + 2, 1, 2, GOOD],
        [x + 4, y + 1, 1, 2, GOOD], [x + 5, y, 1, 2, GOOD], [x + 6, y, 2, 1, GOOD]]
    case 'doc':
      return [[x, y, 6, 8, C.cream], [x + 1, y + 2, 4, 1, C.slate], [x + 1, y + 4, 4, 1, C.slate], [x + 1, y + 6, 3, 1, C.slate]]
    case 'queue':
      return [[x, y, 8, 2, C.ochre], [x, y + 3, 8, 2, C.mist], [x, y + 6, 8, 1, C.mist]]
    case 'clock':
      return [[x + 1, y, 6, 8, C.cream], [x, y + 1, 8, 6, C.cream], [x + 3, y + 2, 1, 3, ICON_BG], [x + 4, y + 4, 2, 1, ICON_BG]]
    case 'box':
      return [[x, y + 1, 8, 6, '#a8763e'], [x, y + 1, 8, 1, '#c9955a'], [x + 3, y + 1, 2, 6, '#7a522a']]
    case 'dice':
      return [[x, y, 7, 7, C.cream], [x + 1, y + 1, 1, 1, C.red], [x + 5, y + 1, 1, 1, C.red], [x + 3, y + 3, 1, 1, C.red],
        [x + 1, y + 5, 1, 1, C.red], [x + 5, y + 5, 1, 1, C.red]]
    case 'vms':
      return [[x, y, 3, 3, C.ochre], [x + 4, y, 3, 3, C.ochre], [x + 8, y, 3, 3, C.ochre],
        [x, y + 4, 3, 3, C.ochre], [x + 4, y + 4, 3, 3, C.ochre], [x + 8, y + 4, 3, 3, C.ochre]]
    case 'label':
      return [[x, y, 8, 6, C.cream], [x + 1, y + 1, 1, 4, ICON_BG], [x + 3, y + 1, 1, 4, ICON_BG],
        [x + 4, y + 1, 1, 4, ICON_BG], [x + 6, y + 1, 1, 4, ICON_BG]]
  }
}
```

Paste the fifteen existing `case` branches from `ProjectScreens.tsx` verbatim, keeping their exact pixels, where the comment says to. Rename `BG` to `ICON_BG` inside them.

- [ ] **Step 2: Point `ProjectScreens.tsx` at the new module**

In `ProjectScreens.tsx`, delete the moved code and import it instead:

```ts
import { ICON_BG as BG, MONGO, PG, REDIS, icon, type Icon } from './icons'
```

Keep `LINE`, `DOT` and `SCREEN` where they are.

- [ ] **Step 3:** Run `npm run build` (expect `✓ built`) and `node scripts/verify-project-screens.mjs` (expect PASS). The PC screens must look exactly as before.
- [ ] **Step 4: Commit**

```bash
git add src/art/icons.ts src/art/ProjectScreens.tsx
git commit -m "Share the PC screen's pixel icons, and add those the case studies need

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Case diagram data, with an integrity test

**Files:**
- Create: `src/content/caseDiagrams.ts`
- Create: `tests/caseDiagrams.test.ts`

- [ ] **Step 1: Write the failing test** `tests/caseDiagrams.test.ts`

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CASES, CASE_IDS } from '../src/content/caseDiagrams.ts'

const STEPS = { cbpo: 2, 'cbpo-migration': 5, 'cbpo-mcp': 4, 'cbpo-cicd': 4, 'cbpo-shipping': 4, avotree: 5, singlekey: 4, yokara: 4 }

test('every case has a diagram and one focus list per step', () => {
  assert.deepEqual([...CASE_IDS].sort(), Object.keys(STEPS).sort())
  for (const id of CASE_IDS) assert.equal(CASES[id].focus.length, STEPS[id], id)
})

test('every focus id and every edge end names a block or edge in the same diagram', () => {
  for (const id of CASE_IDS) {
    const { blocks, edges } = CASES[id].diagram
    const blockIds = new Set(blocks.map((b) => b.id))
    const ids = new Set([...blockIds, ...edges.map((e) => e.id)])
    assert.equal(ids.size, blocks.length + edges.length, `${id}: ids are unique`)
    for (const e of edges) {
      assert.ok(blockIds.has(e.from) && blockIds.has(e.to), `${id}: edge ${e.id} joins two blocks`)
    }
    for (const step of CASES[id].focus) {
      for (const f of step) assert.ok(ids.has(f), `${id}: focus ${f} exists`)
    }
  }
})

test('blocks sit on the 4 × 3 grid and never share a cell', () => {
  for (const id of CASE_IDS) {
    const cells = CASES[id].diagram.blocks.map((b) => `${b.col},${b.row}`)
    assert.equal(new Set(cells).size, cells.length, `${id}: no two blocks share a cell`)
    for (const b of CASES[id].diagram.blocks) {
      assert.ok(b.col >= 0 && b.col <= 3 && b.row >= 0 && b.row <= 2, `${id}: ${b.id} on the grid`)
      assert.ok(b.label.length <= 16 && (b.sub ?? '').length <= 18, `${id}: ${b.id} labels fit`)
    }
  }
})
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL with `Cannot find module` for `caseDiagrams.ts`. The other 18 tests pass.

- [ ] **Step 3: Write `src/content/caseDiagrams.ts`**

It must have no imports other than `import type`, so `node --test` can load it.

```ts
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

const PG = '#5b8dd6'
const MONGO = '#5fb760'
const REDIS = '#d6524a'
const FIREBASE = '#f2a33a'

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
        { id: 'user', icon: 'person', color: C_TEAL, label: 'Landlord / tenant', col: 0, row: 1 },
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
```

Define `const C_TEAL = '#5e9a8b'` next to the other colour constants (it is `C.tealLight`; `palette.ts` is not imported, so the file stays loadable by `node --test`). The `REDIS` and `PG` constants may go unused. If TypeScript complains about unused locals, delete the unused ones.

- [ ] **Step 4:** Run `npm test`. Expected: PASS, 21 tests.
- [ ] **Step 5: Commit**

```bash
git add src/content/caseDiagrams.ts tests/caseDiagrams.test.ts
git commit -m "Describe the case study diagrams and what each step lights up

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Story nodes, words and content corrections

**Files:**
- Modify: `src/content/types.ts`, `src/content/story.ts`, `src/content/i18n/en.ts`, `src/content/projects.ts`, `src/state/view.ts`

- [ ] **Step 1: Types** (`src/content/types.ts`)
  - In `NodeId`, delete `'how-migration'` and `'how-events'`, and add `'cbpo' | 'cbpo-migration' | 'cbpo-mcp' | 'cbpo-cicd' | 'cbpo-shipping' | 'avotree' | 'singlekey' | 'yokara'`.
  - In `LocaleContent.story`, delete `'how-migration'` and `'how-events'`, and add:

```ts
    cbpo: readonly [Lines, Lines]
    'cbpo-migration': readonly [Lines, Lines, Lines, Lines, Lines]
    'cbpo-mcp': readonly [Lines, Lines, Lines, Lines]
    'cbpo-cicd': readonly [Lines, Lines, Lines, Lines]
    'cbpo-shipping': readonly [Lines, Lines, Lines, Lines]
    avotree: readonly [Lines, Lines, Lines, Lines, Lines]
    singlekey: readonly [Lines, Lines, Lines, Lines]
    yokara: readonly [Lines, Lines, Lines, Lines]
```

  - In `choices`, add `cbpoMigration: string`, `cbpoMcp: string`, `cbpoCicd: string`, `cbpoShipping: string` and `anotherCbpo: string`.
  - After `projects: Record<ProjectId, ProjectText>`, add:

```ts
  /** Case studies: a title per story and the result chips shown on its last step. */
  cases: Record<import('./caseDiagrams').CaseId, { title: string; chips: readonly string[] }>
```

  - In `ui`, add `case: { eyebrow: string; now: string }`.

- [ ] **Step 2: Words** (`src/content/i18n/en.ts`)
  - Delete the `'how-migration'` and `'how-events'` story entries.
  - Add the eight story entries. Copy the lines **verbatim** from the spec's "Draft lines". Each step is one `[line]` or `[line, line]` tuple, where the spec's ` / ` separates the two lines.
  - `choices`:
    - `events: 'Orders without a slow WordPress'`
    - `cbpoMigration: 'Moving MongoDB off Atlas'`
    - `cbpoMcp: 'An MCP server for AI agents'`
    - `cbpoCicd: 'One deploy pipeline'`
    - `cbpoShipping: 'Carriers and label printing'`
    - `anotherCbpo: 'Another part of CBPO'`
  - `cases`: use the spec's chips.
    - `cbpo`: `{ title: 'CBPO at a glance', chips: [] }`
    - `'cbpo-migration'`: `{ title: 'Moving MongoDB off Atlas', chips: ['5 clusters', '100GB–1.6TB each', 'vCPU 24 → 78', 'near-zero downtime'] }`
    - The other six follow the same pattern: title = the choice label (for `avotree`, `singlekey` and `yokara`: "TheAvoTree: orders without a slow WordPress", "SingleKey: the Rent Guarantee flow", "Yokara: money that can't be wrong"), and chips from the spec.
  - `ui.case`: `{ eyebrow: 'Case study', now: 'Now showing:' }`
  - Content corrections from the spec:
    - `theavotree.contributions`: replace the webhook line with `'Orders pulled by a scheduled job through a queue with retries, cross-checked against the dashboard; webhooks for statuses and users'`.
    - `singlekey.contributions`: replace the 30% line with `'A reusable React and Tailwind component library for the application flow'`.
    - `yokara.contributions`:
      - replace the Express/JWT line with `'Backend on Firebase Cloud Functions, with Firebase Auth'`;
      - replace the MongoDB mini-game line with `'Sicbo settlement: a round-end job collects every bet, batches them and settles balances in transactions'`.

- [ ] **Step 3: Nodes** (`src/content/story.ts`)
  - Replace the `how-migration` and `how-events` nodes with the eight case nodes.
  - Source strings:
    - CBPO steps use `'Thọ · CBPO'`.
    - The first step of `avotree`, `singlekey` and `yokara` uses `'Public · TheAvoTree'`, `'Public · SingleKey'` and `'Public · Yokara'`.
    - Their other steps use `'Thọ · <Project>'`.
  - Choices:

```ts
    const anotherCbpo: Choice = { label: c.anotherCbpo, target: { kind: 'node', id: 'cbpo' } }
    // cbpo
    choices: [
      { label: c.cbpoMigration, target: { kind: 'node', id: 'cbpo-migration' } },
      { label: c.cbpoMcp, target: { kind: 'node', id: 'cbpo-mcp' } },
      { label: c.cbpoCicd, target: { kind: 'node', id: 'cbpo-cicd' } },
      { label: c.cbpoShipping, target: { kind: 'node', id: 'cbpo-shipping' } },
    ],
    // each cbpo-* sub-story
    choices: [anotherCbpo, details('cbpo', 'CBPO'), askOther],
    // avotree / singlekey / yokara
    choices: [details('theavotree', 'TheAvoTree'), askOther]   // and SingleKey, Yokara likewise
```

  - In the `how` node, the migration choice targets `'cbpo-migration'` and the events choice targets `'avotree'`.
  - Build steps with `s['<id>'].map((lines, i) => tho(lines, i === 0 ? publicSource : thoSource)) as [DialogueStep, ...DialogueStep[]]`, the same pattern as `how-roles`.

- [ ] **Step 4: Projects** (`src/content/projects.ts`)
  - `relatedNode`: CBPO `'cbpo'`, TheAvoTree `'avotree'`, SingleKey `'singlekey'` (new), Yokara `'yokara'` (new). CA2T stays `'how-roles'`.
  - Yokara `technologies`: `['TypeScript', 'JavaScript', 'Java', 'Firebase', 'Flutter', 'Swift']`.

- [ ] **Step 5: Sections** (`src/state/view.ts`)
  - In `SECTION_BY_NODE`, replace the two removed keys with the eight new ids, all mapped to `'how'`.

- [ ] **Step 6:** Run `npm run build`. Expected: `✓ built`, with no tuple-length errors. Run `npm test`. Expected: 21 pass.
- [ ] **Step 7: Commit**

```bash
git add src/content/types.ts src/content/story.ts src/content/i18n/en.ts src/content/projects.ts src/state/view.ts
git commit -m "Tell CBPO, TheAvoTree, SingleKey and Yokara as case studies

Adds the eight case story nodes and their words, and corrects what the
owner's answers showed was wrong: TheAvoTree pulls orders on a schedule
rather than trusting webhooks, Yokara runs on Firebase rather than
Express and MongoDB, and SingleKey's unmeasured 30% goes.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Case panel

**Files:**
- Modify: `src/state/view.ts`, `src/App.tsx`, `src/styles.css`
- Create: `src/components/CaseStudyPanel.tsx`

- [ ] **Step 1: View** (`src/state/view.ts`)
  - Import `CASES, CASE_IDS, type CaseId` from `'../content/caseDiagrams'`.
  - Extend `PanelView` with `| { kind: 'case'; caseId: CaseId; step: number }`.
  - In `buildBase`'s `node` case, replace `panel: null` with the case panel when the node is a case:

```ts
        panel: (CASE_IDS as readonly string[]).includes(node.id)
          ? { kind: 'case', caseId: node.id as CaseId, step: stepIndex }
          : null,
```

  - In `screenFor`, before the `PROJECT_BY_NODE` lookup, add:

```ts
  if (base.panel?.kind === 'case') return `project:${CASES[base.panel.caseId].projectId}`
```

- [ ] **Step 2: Component** `src/components/CaseStudyPanel.tsx`

```tsx
import { CASES, type Block, type CaseId } from '../content/caseDiagrams'
import { ICON_SIZE, icon } from '../art/icons'
import { PixelRects } from '../art/PixelRects'
import { useLocale } from '../i18n/LocaleProvider'

/** Diagram geometry, in its own units: a 4 × 3 grid of 40-wide blocks. */
const W = 200
const H = 110
const COL = 48
const ROW = 34
const X0 = 6
const Y0 = 6
const BLOCK_W = 40
/** Icons are drawn at twice their pixel size. */
const SCALE = 2

const cellOf = (b: Block) => ({ x: X0 + b.col * COL, y: Y0 + b.row * ROW })
/** Where edges meet a block: its icon's vertical middle, on the side facing the other block. */
const anchor = (b: Block, towards: Block) => {
  const { x, y } = cellOf(b)
  const mid = y + 8
  if (b.col === towards.col) return { x: x + BLOCK_W / 2, y: b.row < towards.row ? y + 30 : y - 1 }
  return { x: b.col < towards.col ? x + BLOCK_W : x, y: mid }
}

export function CaseStudyPanel({ caseId, step }: { caseId: CaseId; step: number }) {
  const { content } = useLocale()
  const text = content.text.cases[caseId]
  const labels = content.text.ui.case
  const { diagram, focus } = CASES[caseId]
  const lit = new Set(focus[Math.min(step, focus.length - 1)])
  const byId = new Map(diagram.blocks.map((b) => [b.id, b]))
  const edgeLit = (id: string, from: string, to: string) => lit.has(id) || (lit.has(from) && lit.has(to))
  const last = step >= focus.length - 1
  const focusNames = diagram.blocks.filter((b) => lit.has(b.id)).map((b) => b.label)

  return (
    <article className="paper case-study" aria-labelledby="case-title">
      <p className="eyebrow">{labels.eyebrow}</p>
      <h2 id="case-title" className="paper-title">{text.title}</h2>
      <svg className="case-diagram" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={diagram.description}>
        <rect width={W} height={H} fill="#1b2336" />
        {diagram.edges.map((e) => {
          const a = byId.get(e.from)!, b = byId.get(e.to)!
          const p = anchor(a, b), q = anchor(b, a)
          const midX = Math.round((p.x + q.x) / 2)
          const d = p.y === q.y || p.x === q.x ? `M${p.x} ${p.y}L${q.x} ${q.y}` : `M${p.x} ${p.y}H${midX}V${q.y}H${q.x}`
          const on = edgeLit(e.id, e.from, e.to)
          return (
            <g key={e.id} className={`case-edge${on ? ' is-lit' : ''}`} data-focus={on || undefined}>
              <path d={d} fill="none" stroke={on ? '#edc567' : '#56658a'} strokeWidth={1} />
              {e.label && (
                <text x={midX} y={Math.min(p.y, q.y) - 2} textAnchor="middle" className="case-edge-label">{e.label}</text>
              )}
            </g>
          )
        })}
        {diagram.blocks.map((b) => {
          const { x, y } = cellOf(b)
          const [iw, ih] = ICON_SIZE[b.icon]
          const ix = Math.round((BLOCK_W / SCALE - iw) / 2)
          const iy = Math.round((16 / SCALE - ih) / 2)
          const on = lit.has(b.id)
          return (
            <g key={b.id} className={`case-block${on ? ' is-lit' : ''}`} data-block={b.id} data-focus={on || undefined}>
              <g transform={`translate(${x} ${y}) scale(${SCALE})`}>
                <PixelRects px={icon(b.icon, ix, iy, b.color)} />
              </g>
              <text x={x + BLOCK_W / 2} y={y + 22} textAnchor="middle" className="case-label">{b.label}</text>
              {b.sub && <text x={x + BLOCK_W / 2} y={y + 27} textAnchor="middle" className="case-sub">{b.sub}</text>}
            </g>
          )
        })}
      </svg>
      <p className="visually-hidden" aria-live="polite">{labels.now} {focusNames.join(', ')}</p>
      {last && text.chips.length > 0 && (
        <ul className="chips case-chips">{text.chips.map((c) => <li key={c}>{c}</li>)}</ul>
      )}
    </article>
  )
}
```

- [ ] **Step 3: Render it** (`src/App.tsx`)
  - Import `CaseStudyPanel`.
  - In `Panel`'s switch, add `case 'case': return <CaseStudyPanel caseId={panel.caseId} step={panel.step} />`.
  - In the `panelKey` expression, return `null` when `view.panel.kind === 'case'`. Focus should stay on the dialogue lines while a case is being told; the panel only illustrates them.

- [ ] **Step 4: Styles** (`src/styles.css`, next to the `.paper` rules)

```css
/* Case studies: a dark pixel diagram on the paper panel. Focus is carried by opacity, stepped. */
.case-diagram { display: block; width: 100%; height: auto; margin-block: 8px; shape-rendering: crispEdges; border: 2px solid var(--night); }
.case-block, .case-edge { opacity: 0.35; transition: opacity 200ms steps(3, end); }
.case-block.is-lit, .case-edge.is-lit { opacity: 1; }
.case-label { font: 700 4.2px var(--font-label); fill: var(--cream); }
.case-sub { font: 3.6px var(--font-label); fill: var(--mist); }
.case-edge-label { font: 3.4px var(--font-label); fill: var(--gold, #edc567); }
.case-chips { margin-top: 4px; }
```

If `.visually-hidden` does not already exist in `styles.css`, add it:

```css
.visually-hidden { position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
```

  The global reduced-motion rule already removes the transition.

- [ ] **Step 5: Build and look**
  - Run `npm run build`. Expected: `✓ built`.
  - With the dev server running, write a throwaway script (`scripts/_tmp-*.mjs`, deleted afterwards). It opens the room at 1440×900, clicks the PC ("See projects"), opens CBPO, clicks "How did you approach it?", advances through the intro, picks each sub-story, and screenshots the `.doc` panel at each story's first and last step. Do the same for TheAvoTree, SingleKey and Yokara, reached from "Project archive".
  - Look at every image. Check that:
    - blocks do not overlap;
    - labels are readable and do not collide with edges or each other;
    - lit versus dim reads clearly;
    - edges join the right blocks.
  - If something collides, adjust only `col`, `row` or label text in `caseDiagrams.ts` (keep the test passing), or the anchor offsets in `CaseStudyPanel.tsx`. Report what you moved.
  - Also check 390×844. There the panel sits above the dialogue, so the diagram must still be legible.

- [ ] **Step 6: Commit**

```bash
git add src/state/view.ts src/App.tsx src/components/CaseStudyPanel.tsx src/styles.css src/content/caseDiagrams.ts
git commit -m "Draw each case study's architecture beside the dialogue

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Browser check, and updating the old checks

**Files:**
- Create: `scripts/verify-case-studies.mjs`
- Modify: `scripts/verify-project-screens.mjs`, `README.md`

- [ ] **Step 1: Write `scripts/verify-case-studies.mjs`**

It imports `CASES` from `../src/content/caseDiagrams.ts`. Node 25 strips the types, so the script can read the expected focus. For each story it navigates as in Task 4 Step 5 and asserts, at every step:
- `.case-study` is present;
- `[data-block][data-focus]` ids equal the step's focus blocks;
- `.case-chips` appears only on the last step, when the story has chips;
- `[data-screen]` is `project:<projectId>`.

It also asserts:
- the CBPO intro ends with 4 choices, and "Another part of CBPO" at the end of a sub-story returns to them;
- "How did you approach it?" on CA2T still reaches the RBAC deep dive, and that step shows no `.case-study`;
- no page errors.

It saves `artifacts/case-<id>.png` of the last step of each story. Use `page.keyboard.press('Enter')` or the Next button to advance, and match choices by `getByRole('button', { name: /<label>/ })`.

- [ ] **Step 2: Update the old checks**
  - In `scripts/verify-project-screens.mjs`, set `DEEP_DIVE` to `{ cbpo: true, ca2t: true, theavotree: true, singlekey: true, yokara: true }`.
  - In `README.md`, update the "Branch 2: How I work" row: it now reads *Case studies for CBPO (four stories), TheAvoTree, SingleKey and Yokara, each with a lit architecture diagram; CA2T's role-based access control deep dive*.

- [ ] **Step 3: Run everything**

Expect PASS on each:
- `npm test` (21)
- `npm run build`
- `node scripts/verify-case-studies.mjs`
- `node scripts/verify-project-screens.mjs`
- `node scripts/verify-interactions.mjs`
- `node scripts/verify-hover.mjs`
- `node scripts/verify-album.mjs`
- `node scripts/verify-pylon.mjs`

Look at every `artifacts/case-*.png`.

- [ ] **Step 4: Commit**

```bash
git add scripts/verify-case-studies.mjs scripts/verify-project-screens.mjs README.md
git commit -m "Check every case study step in a real browser

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```
