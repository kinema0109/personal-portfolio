# PC Screen Per Project Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** While a project is on screen, the desk PC shows a small pixel diagram of that project's architecture, taken from the CV, with data dots flowing along its lines. The code stops calling the PC a laptop.

**Architecture:**
- `ScreenMode` gains `project:<ProjectId>`. `view.ts` picks it while a project panel is open, or in the story node a project names as its `relatedNode`.
- `src/art/ProjectScreens.tsx` holds a shared pixel icon library and one diagram per project, laid out in screen-local coordinates.
- `Screen` delegates `project:*` modes to that file. `ApartmentScene` wraps the screen in `data-screen` so checks can read it.

**Tech Stack:** React 19, TypeScript, SVG pixel rects, CSS. Browser check: Playwright with Edge.

**Spec:** `docs/superpowers/specs/2026-09-17-sun-energy-zombie-project-screens-design.md`, section 3.

**Branch:** `prototype/visual-novel`. Never commit to `main`. Do not push. Never `git add` the untracked `public/references/locked/` or `references/`.

**Dev server for browser checks:** `npx vite --host 127.0.0.1 --port 5181 --strictPort`. Reuse it if `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5181` returns 200.

---

### Task 1: Rename the laptop to the PC

It is a desktop PC: the tower under the desk drives this screen. This is a code-only rename. No visitor-facing label changes except the scene description.

**Files:**
- Modify: `src/art/ApartmentScene.tsx`, `src/components/Scene.tsx`, `src/App.tsx`, `src/content/types.ts`, `src/content/i18n/en.ts`, `src/state/view.ts`, `src/daylight/PhaseProvider.tsx`

- [ ] **Step 1: Rename the identifiers**

Make exactly these replacements:
- `src/art/ApartmentScene.tsx`:
  - `export const LAPTOP_BOX` → `export const PC_BOX`
  - every `laptopFrame` → `pcFrame`
  - the `OUTLINES` key `laptop: outlineOf(pcFrame)` → `pc: outlineOf(pcFrame)`
  - `{highlight === 'laptop' && <PixelRects px={OUTLINES.laptop} />}` → `{highlight === 'pc' && <PixelRects px={OUTLINES.pc} />}`
  - in comments, "the laptop" → "the PC" (the tower comment says "the laptop sits at x 192–244"; the water glass and fan comments also mention it)
- `src/components/Scene.tsx`: the import `LAPTOP_BOX,` → `PC_BOX,`, and `{ id: 'laptop', box: LAPTOP_BOX }` → `{ id: 'pc', box: PC_BOX }`
- `src/App.tsx`: `laptop: { kind: 'node', id: 'work' },` → `pc: { kind: 'node', id: 'work' },`
- `src/content/types.ts`: `export type HotspotId = 'laptop' | 'album' | 'drawer'` → `export type HotspotId = 'pc' | 'album' | 'drawer'`
- `src/content/i18n/en.ts`:
  - `hotspots: { laptop: 'See projects',` → `hotspots: { pc: 'See projects',`
  - in `sceneDescription`, "a desk with a laptop" → "a desk with a PC", and "Click the laptop" → "Click the PC"
- `src/state/view.ts`: the comment `/** What the laptop in the scene shows. */` → `/** What the PC screen in the scene shows. */`
- `src/daylight/PhaseProvider.tsx`: leave "a sleeping laptop" alone. It means the visitor's computer.

- [ ] **Step 2: Check that nothing else says laptop**

Run: `grep -rn "laptop\|LAPTOP" src scripts --include=*.ts --include=*.tsx --include=*.mjs`
Expected: only the `PhaseProvider.tsx` comment about a sleeping laptop.

Run: `npm run build`
Expected: `✓ built`.

Run: `node scripts/verify-hover.mjs` and `node scripts/verify-interactions.mjs`
Expected: both PASS. The hotspot label "See projects" is unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/art/ApartmentScene.tsx src/components/Scene.tsx src/App.tsx src/content/types.ts src/content/i18n/en.ts src/state/view.ts
git commit -m "Call the desk computer a PC, which it is

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Project screen mode in the view

**Files:**
- Modify: `src/art/ApartmentScene.tsx` (the `ScreenMode` type)
- Modify: `src/state/view.ts`

- [ ] **Step 1: Widen `ScreenMode`**

In `src/art/ApartmentScene.tsx`, add `ProjectId` to the imports (after the other type imports):

```tsx
import type { ProjectId } from '../content/types'
```

Replace

```tsx
export type ScreenMode = 'code' | 'diagram' | 'game' | 'docs'
```

with

```tsx
/** A section's screen, or the architecture diagram of one project while it is on screen. */
export type ScreenMode = 'code' | 'diagram' | 'game' | 'docs' | `project:${ProjectId}`
```

- [ ] **Step 2: Choose the project screen in `src/state/view.ts`**

Add the import after `import { galleryItems } from '../content/gallery'`:

```ts
import { PROJECTS } from '../content/projects'
```

Directly after the `SCREEN_BY_SECTION` constant, add:

```ts
/** The story node that tells how a project was built, back to the project, so it keeps its screen. */
const PROJECT_BY_NODE: ReadonlyMap<NodeId, ProjectId> = new Map(
  PROJECTS.flatMap((p) => (p.relatedNode ? [[p.relatedNode, p.id] as const] : [])),
)
```

Replace

```ts
  return { ...base, screen: SCREEN_BY_SECTION[base.section] }
```

with

```ts
  return { ...base, screen: screenFor(loc, base) }
```

and directly after `buildView`, add:

```ts
/** A project on screen shows its own diagram; everywhere else the section decides. */
function screenFor(loc: Location, base: Omit<View, 'screen'>): ScreenMode {
  if (base.panel?.kind === 'project') return `project:${base.panel.projectId}`
  if (loc.kind === 'node') {
    const project = PROJECT_BY_NODE.get(loc.id)
    if (project) return `project:${project}`
  }
  return SCREEN_BY_SECTION[base.section]
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: an error in `ApartmentScene.tsx`'s `Screen` switch is acceptable only if TypeScript reports the new modes as unhandled. Task 3 handles them. If it compiles cleanly, continue.

Do not commit yet. Task 3 completes the change.

---

### Task 3: Icon library, diagrams and rendering

**Files:**
- Create: `src/art/ProjectScreens.tsx`
- Modify: `src/art/ApartmentScene.tsx` (`Screen`, and the `data-screen` wrapper)
- Modify: `src/styles.css`

- [ ] **Step 1: Create `src/art/ProjectScreens.tsx`**

```tsx
import type { CSSProperties } from 'react'
import type { ProjectId } from '../content/types'
import { PixelRects } from './PixelRects'
import { C, type Px } from './palette'

/**
 * The desk PC's screen while a project is on screen: a tiny architecture diagram built only from
 * what the CV says about that project (src/content/i18n/en.ts, src/content/projects.ts).
 *
 * The screen is 40 × 26 scene units at (198, 74). Diagrams use local coordinates 0–39 × 0–24; the
 * bottom row (24 → y 98 is the last used, y 99) stays free for the energy build bar.
 */

const SCREEN = { x: 198, y: 74 } as const
const BG = '#1b2336'
const LINE = C.slateLight
const DOT = C.goldLight
const PG = '#5b8dd6'
const MONGO = '#5fb760'

type Icon =
  | 'web' | 'server' | 'db' | 'cloud' | 'vm' | 'phone' | 'person' | 'lock' | 'chart' | 'gear' | 'coin'
  | 'cart' | 'wave' | 'triangle' | 'blocks'

/** Each icon drawn at local (x, y). `color` tints the icons that come in more than one colour. */
function icon(kind: Icon, x: number, y: number, color: string = C.cream): Px[] {
  switch (kind) {
    case 'web': // 8 × 6 browser window
      return [[x, y, 8, 6, C.cream], [x, y, 8, 1, C.ochre], [x + 1, y + 2, 6, 1, C.slate], [x + 1, y + 4, 4, 1, C.slate]]
    case 'server': // 5 × 7
      return [[x, y, 5, 7, C.mist], [x + 1, y + 1, 3, 1, C.slate], [x + 1, y + 3, 3, 1, C.slate], [x + 1, y + 5, 1, 1, MONGO]]
    case 'db': // 5 × 6 cylinder
      return [[x, y + 1, 5, 4, color], [x + 1, y, 3, 1, color], [x + 1, y + 5, 3, 1, color], [x + 1, y + 1, 3, 1, C.cream]]
    case 'cloud': // 11 × 5
      return [[x + 2, y, 4, 1, C.mist], [x + 1, y + 1, 8, 1, C.mist], [x, y + 2, 11, 3, C.mist]]
    case 'vm': // 2 × 2
      return [[x, y, 2, 2, C.ochre]]
    case 'phone': // 4 × 7
      return [[x, y, 4, 7, C.slateLight], [x + 1, y + 1, 2, 4, C.screen], [x + 1, y + 6, 2, 1, C.cream]]
    case 'person': // 3 × 6
      return [[x, y, 3, 2, C.skin], [x, y + 2, 3, 4, color]]
    case 'lock': // 5 × 6
      return [[x + 1, y, 3, 1, C.ochre], [x + 1, y + 1, 1, 1, C.ochre], [x + 3, y + 1, 1, 1, C.ochre],
        [x, y + 2, 5, 4, C.ochre], [x + 2, y + 3, 1, 2, BG]]
    case 'chart': // 7 × 6
      return [[x, y, 1, 6, C.cream], [x, y + 5, 7, 1, C.cream],
        [x + 2, y + 3, 1, 2, MONGO], [x + 4, y + 1, 1, 4, C.ochre], [x + 6, y + 2, 1, 3, PG]]
    case 'gear': // 5 × 5
      return [[x + 1, y, 3, 5, C.mist], [x, y + 1, 5, 3, C.mist], [x + 2, y + 2, 1, 1, BG]]
    case 'coin': // 4 × 4
      return [[x + 1, y, 2, 4, C.gold], [x, y + 1, 4, 2, C.gold], [x + 1, y + 1, 1, 1, C.goldLight]]
    case 'cart': // 7 × 5
      return [[x, y, 1, 1, C.cream], [x + 1, y + 1, 6, 2, C.cream], [x + 1, y + 3, 5, 1, C.cream],
        [x + 2, y + 4, 1, 1, C.mist], [x + 5, y + 4, 1, 1, C.mist]]
    case 'wave': // 7 × 3
      return [[x, y + 1, 1, 1, C.tealLight], [x + 1, y, 1, 1, C.tealLight], [x + 2, y + 1, 1, 1, C.tealLight],
        [x + 3, y + 2, 1, 1, C.tealLight], [x + 4, y + 1, 1, 1, C.tealLight], [x + 5, y, 1, 1, C.tealLight],
        [x + 6, y + 1, 1, 1, C.tealLight]]
    case 'triangle': // 5 × 3
      return [[x + 2, y, 1, 1, C.cream], [x + 1, y + 1, 3, 1, C.cream], [x, y + 2, 5, 1, C.cream]]
    case 'blocks': // 6 × 6 stacked components
      return [[x, y, 6, 2, C.tealLight], [x, y + 2, 6, 2, C.ochre], [x, y + 4, 6, 2, C.mist]]
  }
}

/** A straight connection; a data dot travels from its start to its end. */
interface Link { x: number; y: number; len: number; dir: 'h' | 'v' }

interface Diagram {
  parts: readonly [Icon, number, number, string?][]
  links: readonly Link[]
}

const h = (x: number, y: number, len: number): Link => ({ x, y, len, dir: 'h' })
const v = (x: number, y: number, len: number): Link => ({ x, y, len, dir: 'v' })

/** One diagram per project. Every element is in that project's CV entry. */
export const DIAGRAMS: Record<ProjectId, Diagram> = {
  // Vue web → Django API → PostgreSQL (orders) and MongoDB (marketplace metrics) → 6 VMs on GCP.
  cbpo: {
    parts: [['web', 1, 8], ['server', 12, 7], ['db', 20, 5, PG], ['db', 20, 12, MONGO], ['cloud', 27, 4],
      ['vm', 28, 11], ['vm', 31, 11], ['vm', 34, 11], ['vm', 28, 14], ['vm', 31, 14], ['vm', 34, 14]],
    links: [h(9, 10, 3), h(17, 8, 3), h(17, 13, 3), h(25, 14, 3)],
  },
  // Admin and learner → role-based access → React → Django → PostgreSQL.
  ca2t: {
    parts: [['person', 1, 4, C.red], ['person', 1, 14, C.tealLight], ['lock', 8, 9], ['web', 16, 9],
      ['server', 26, 9], ['db', 33, 10, PG]],
    links: [h(4, 6, 3), v(6, 6, 5), h(4, 16, 3), v(6, 12, 4), h(6, 12, 2), h(13, 12, 3), h(24, 12, 2), h(31, 12, 2)],
  },
  // WooCommerce → webhooks → NestJS → MongoDB → React dashboard.
  theavotree: {
    parts: [['cart', 1, 9], ['wave', 9, 10], ['server', 18, 8], ['db', 25, 9, MONGO], ['chart', 32, 9]],
    links: [h(16, 11, 2), h(23, 11, 2), h(30, 11, 2)],
  },
  // Next.js landing → reusable components → VWO A/B tests → Django.
  singlekey: {
    parts: [['web', 2, 9], ['blocks', 13, 9], ['chart', 22, 9], ['server', 32, 9]],
    links: [h(10, 12, 3), h(19, 12, 3), h(29, 12, 3)],
  },
  // Next.js ⇄ Supabase Realtime over WebSockets → PostgreSQL, deployed on Vercel.
  suzu: {
    parts: [['web', 3, 9], ['wave', 12, 10], ['db', 23, 9, PG], ['triangle', 32, 11]],
    links: [h(11, 11, 1), h(19, 11, 4)],
  },
  // React CMS → Java → virtual store → Android and iOS; built by Jenkins.
  'ikara-admin': {
    parts: [['web', 1, 5], ['server', 11, 4], ['coin', 19, 6], ['phone', 26, 4], ['phone', 33, 4], ['gear', 11, 15]],
    links: [h(9, 7, 2), h(16, 7, 3), h(23, 7, 3), h(30, 7, 3), v(13, 11, 4)],
  },
  // Flutter/Swift apps → Express and Firebase with JWT → MongoDB.
  yokara: {
    parts: [['phone', 8, 8], ['server', 17, 8], ['lock', 17, 16], ['db', 26, 9, MONGO]],
    links: [h(12, 11, 5), v(19, 15, 1), h(22, 11, 4)],
  },
}

const toScreen = ([x, y, w, hh, fill]: Px): Px => [SCREEN.x + x, SCREEN.y + y, w, hh, fill]

export function ProjectScreen({ id }: { id: ProjectId }) {
  const diagram = DIAGRAMS[id]
  const lines: Px[] = diagram.links.map((l) => (l.dir === 'h' ? [l.x, l.y, l.len, 1, LINE] : [l.x, l.y, 1, l.len, LINE]))
  return (
    <g data-project-screen={id}>
      <PixelRects px={[[SCREEN.x, SCREEN.y, 40, 26, BG]]} />
      <PixelRects px={lines.map(toScreen)} />
      <PixelRects px={diagram.parts.flatMap(([kind, x, y, color]) => icon(kind, x, y, color)).map(toScreen)} />
      {diagram.links.map((l, i) => (
        <rect
          key={i}
          className="f-data"
          x={SCREEN.x + l.x}
          y={SCREEN.y + l.y}
          width={1}
          height={1}
          fill={DOT}
          style={{
            '--data-dx': `${l.dir === 'h' ? l.len - 1 : 0}px`,
            '--data-dy': `${l.dir === 'v' ? l.len - 1 : 0}px`,
            animationDelay: `${(i % 3) * 0.3}s`,
          } as CSSProperties}
        />
      ))}
    </g>
  )
}
```

- [ ] **Step 2: Render project screens in `ApartmentScene.tsx`**

Add the import after the `Zombie` import (or after the `SunShroom` import if the zombie plan has not landed yet):

```tsx
import { ProjectScreen } from './ProjectScreens'
```

At the very top of `function Screen({ mode }: { mode: ScreenMode }) {`, before `switch (mode) {`, add:

```tsx
  if (mode.startsWith('project:')) return <ProjectScreen id={mode.slice('project:'.length) as ProjectId} />
```

Replace

```tsx
      <Screen mode={screen} />
```

with

```tsx
      <g data-screen={screen}>
        <Screen mode={screen} />
      </g>
```

If the energy plan has landed, its build bar comes directly after this line; leave it where it is.

- [ ] **Step 3: Data dots in `src/styles.css`**

Directly after the line `.f-dot-3 { animation: dot 1.2s linear 0.6s infinite; }`, add:

```css
/* Project screens: a dot of data runs along each line of the diagram, in whole-pixel steps. */
@keyframes data-flow {
  from { transform: translate(0, 0); }
  to { transform: translate(var(--data-dx, 0), var(--data-dy, 0)); }
}
.f-data { animation: data-flow 1.2s steps(4, end) infinite; }
```

- [ ] **Step 4: Build and look at all seven**

Run: `npm run build`
Expected: `✓ built`.

Write a throwaway Playwright script inside `scripts/` and delete it afterwards. It should open the room at 1440×900 with a device scale factor of 4 and click **See projects**, then **Project archive**, then each project name in turn, reloading between projects. For each one, screenshot the PC screen with a clip computed from `document.querySelector('[data-screen]').getBoundingClientRect()`.

Look at every image. Check that:
- the icons are separate and readable;
- the lines join the icons they connect;
- nothing crosses the screen edge;
- the bottom row stays free.

If a layout collides, adjust only that project's coordinates in `DIAGRAMS`, keeping the same icons and connections, and note what you moved.

- [ ] **Step 5: Commit**

```bash
git add src/art/ProjectScreens.tsx src/art/ApartmentScene.tsx src/state/view.ts src/styles.css
git commit -m "Show each project's architecture on the PC screen

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Browser check for project screens

**Files:**
- Create: `scripts/verify-project-screens.mjs`

- [ ] **Step 1: Write the check**

```js
/**
 * Checks the PC screen per project: each project's panel shows its own diagram, the story node about
 * a project keeps that project's diagram, and elsewhere the section's screen is unchanged.
 *
 * Run the dev server, then: node scripts/verify-project-screens.mjs [url]
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
const PROJECTS = [
  ['cbpo', 'CBPO'], ['ca2t', 'CA2T'], ['theavotree', 'TheAvoTree'], ['singlekey', 'SingleKey'],
  ['suzu', 'Suzu.net'], ['ikara-admin', 'iKara Admin CMS'], ['yokara', 'Yokara'],
]
const DEEP_DIVE = { cbpo: true, ca2t: true, theavotree: true }

await mkdir('artifacts', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'en-US' })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  const screen = () => page.locator('[data-screen]').getAttribute('data-screen')

  await page.goto(url)
  await page.waitForTimeout(1000)
  assert.equal(await screen(), 'code', 'the room opens on the code screen')

  for (const [id, name] of PROJECTS) {
    await page.goto(url)
    await page.waitForTimeout(800)
    await page.getByRole('button', { name: 'See projects', exact: true }).click()
    await page.getByRole('button', { name: /Project archive/ }).click()
    await page.getByRole('button', { name: new RegExp(`^${name.replace('.', '\\.')}\\b`) }).first().click()
    await page.waitForTimeout(300)
    assert.equal(await screen(), `project:${id}`, `${name}'s panel shows its diagram`)
    const box = await page.locator('[data-screen]').boundingBox()
    await page.screenshot({ path: `artifacts/project-screen-${id}.png`, clip: box })

    if (DEEP_DIVE[id]) {
      await page.getByRole('button', { name: /How did you approach it\?/ }).click()
      await page.waitForTimeout(300)
      assert.equal(await screen(), `project:${id}`, `the story about ${name} keeps its diagram`)
    }
  }

  assert.deepEqual(errors, [])
  console.log('project screens: 7 diagrams, deep dives keep theirs, other screens unchanged PASS')
} finally {
  await browser.close()
}
```

- [ ] **Step 2: Run it**

Run: `node scripts/verify-project-screens.mjs`
Expected: `project screens: 7 diagrams, deep dives keep theirs, other screens unchanged PASS`.

If a project-name click matches the wrong button (choice buttons contain a hint after the name), inspect the choice markup and narrow the locator, for example to `.choice` elements whose `.choice-label` has exact text. Keep the assertions unchanged.

- [ ] **Step 3: Look at the screenshots**

Open all seven `artifacts/project-screen-*.png` and look at each one. Each should show a distinct, readable diagram.

- [ ] **Step 4: Run the existing checks**

Expect PASS on each: `npm test`, `npm run build`, `node scripts/verify-hover.mjs`, `node scripts/verify-interactions.mjs`, `node scripts/verify-album.mjs`, and `node scripts/verify-energy.mjs` if it exists.

- [ ] **Step 5: Commit**

```bash
git add scripts/verify-project-screens.mjs
git commit -m "Check the PC screen per project in a real browser

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```
