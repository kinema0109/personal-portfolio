# Sun Energy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collecting a sun gives Thọ energy that drains over time. It shows as a warm glow rising inside his body, speeds up his typing and the code on the PC screen, and runs a pixel build bar that flashes "OK ✓" when it fills.

**Architecture:**
- `src/state/energy.ts` holds the energy model as pure functions (tier, add a sun, tick, glow height). It has no imports, so `node --test` can load it on its own.
- `Scene.tsx` keeps the `Energy` state and ticks it every 500 ms while it is active.
- `ApartmentScene.tsx` draws the glow (Thọ's own sprites under a clip rect), the build bar and the OK badge. It puts `energy-<tier>` on the SVG, and CSS uses that class to change the typing and screen animation durations.

**Tech Stack:** React 19, TypeScript, SVG pixel rects, CSS. Tests: `node --test` (Node 25 type stripping) and Playwright with Edge (`scripts/verify-*.mjs`).

**Spec:** `docs/superpowers/specs/2026-09-17-sun-energy-zombie-project-screens-design.md`, section 1.

**Branch:** `prototype/visual-novel`. Never commit to `main`. Do not push. Never `git add` the untracked `public/references/locked/` or `references/`.

**Dev server for browser checks:** `npx vite --host 127.0.0.1 --port 5181 --strictPort`. Reuse it if `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5181` returns 200.

---

### Task 1: Energy model

**Files:**
- Create: `src/state/energy.ts`
- Create: `tests/energy.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `tests/energy.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EMPTY_ENERGY, addSun, glowTop, tick, tierOf } from '../src/state/energy.ts'

test('tiers follow the seconds left', () => {
  assert.equal(tierOf(0), 0)
  assert.equal(tierOf(0.2), 1)
  assert.equal(tierOf(20), 1)
  assert.equal(tierOf(20.5), 2)
  assert.equal(tierOf(40), 2)
  assert.equal(tierOf(41), 3)
  assert.equal(tierOf(60), 3)
})

test('each sun adds 20 seconds, up to 60', () => {
  let e = EMPTY_ENERGY
  e = addSun(e)
  assert.equal(e.seconds, 20)
  e = addSun(addSun(addSun(e)))
  assert.equal(e.seconds, 60)
})

test('energy drains one second per second and stops at zero', () => {
  const e = tick({ ...EMPTY_ENERGY, seconds: 30 }, 12)
  assert.equal(e.seconds, 18)
  assert.equal(tick(e, 100).seconds, 0)
})

test('a build fills at the pace of the tier and then shows OK for a second', () => {
  // Tier 3 fills in 4 s.
  let e = tick({ ...EMPTY_ENERGY, seconds: 60 }, 2)
  assert.equal(e.build, 0.5)
  e = tick(e, 2)
  assert.equal(e.build, 1)
  assert.equal(e.okFor, 1)
  e = tick(e, 0.5)
  assert.equal(e.okFor, 0.5)
  assert.equal(e.build, 1)
  e = tick(e, 0.5)
  assert.equal(e.okFor, 0)
  assert.equal(e.build, 0, 'a new build starts from empty')
})

test('running out of energy mid-build hides the bar', () => {
  const e = tick({ seconds: 1, build: 0.4, okFor: 0 }, 2)
  assert.equal(e.seconds, 0)
  assert.equal(e.build, 0)
})

test('the glow reaches the shoulders at full energy and is gone at none', () => {
  assert.equal(glowTop(60), 74)
  assert.equal(glowTop(30), 92)
  assert.equal(glowTop(0), 110)
})
```

- [ ] **Step 2: Run the tests to see them fail**

Run: `npm test`
Expected: FAIL, with `Cannot find module` for `src/state/energy.ts`. The other 9 tests pass.

- [ ] **Step 3: Implement**

Create `src/state/energy.ts`:

```ts
/**
 * Thọ's energy from collected suns, as pure functions so the rules can be tested without a browser.
 * No imports, so `node --test` can load this file on its own.
 *
 * Energy is seconds left, 0–60. Every sun adds 20 and it drains one per second. The tier (0–3) sets
 * how fast he works, and a build on the PC screen fills at the tier's pace, shows OK for a second
 * and starts again while energy lasts.
 */

export interface Energy {
  /** Seconds of energy left, 0–60. */
  seconds: number
  /** How full the current build is, 0–1. */
  build: number
  /** Seconds left of the "OK" flash after a build completes; 0 when none is showing. */
  okFor: number
}

export const EMPTY_ENERGY: Energy = { seconds: 0, build: 0, okFor: 0 }

export const ENERGY_PER_SUN = 20
export const ENERGY_MAX = 60
/** Seconds a build takes to fill at tiers 1, 2 and 3; index 0 is unused. */
export const BUILD_SECONDS = [0, 12, 7, 4] as const
export const OK_SECONDS = 1

/** Where the glow sits inside Thọ, in scene units: shoulders at the top, waist at the bottom. */
export const GLOW_SHOULDERS = 74
export const GLOW_WAIST = 110

export type Tier = 0 | 1 | 2 | 3

export function tierOf(seconds: number): Tier {
  if (seconds <= 0) return 0
  if (seconds <= 20) return 1
  if (seconds <= 40) return 2
  return 3
}

export const addSun = (e: Energy): Energy => ({ ...e, seconds: Math.min(ENERGY_MAX, e.seconds + ENERGY_PER_SUN) })

/** Advances energy and the build by `dt` seconds. */
export function tick(e: Energy, dt: number): Energy {
  const seconds = Math.max(0, e.seconds - dt)
  if (e.okFor > 0) {
    const okFor = Math.max(0, e.okFor - dt)
    return { seconds, build: okFor > 0 ? 1 : 0, okFor }
  }
  const tier = tierOf(e.seconds)
  if (tier === 0 || seconds === 0) return { seconds, build: 0, okFor: 0 }
  const build = e.build + dt / BUILD_SECONDS[tier]
  return build >= 1 ? { seconds, build: 1, okFor: OK_SECONDS } : { seconds, build, okFor: 0 }
}

/** The top edge of the glow in whole scene units: at the shoulders when full, at the waist when empty. */
export const glowTop = (seconds: number): number =>
  GLOW_WAIST - Math.round(((GLOW_WAIST - GLOW_SHOULDERS) * Math.min(seconds, ENERGY_MAX)) / ENERGY_MAX)
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `npm test`
Expected: PASS, 15 tests.

- [ ] **Step 5: Commit**

```bash
git add src/state/energy.ts tests/energy.test.ts
git commit -m "Model the energy Thọ gets from suns

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Energy in the room

**Files:**
- Modify: `src/components/Scene.tsx`
- Modify: `src/art/ApartmentScene.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Keep and tick the energy in `Scene.tsx`**

Add the import after the `SunShroom` import:

```tsx
import { EMPTY_ENERGY, addSun, tick, type Energy } from '../state/energy'
```

Next to the other module-level constants (`SHROOM_TIMER`, `SHROOM_FLASH_MS`), add:

```tsx
/** How often energy drains and the build advances while either is active. */
const ENERGY_TICK_MS = 500
```

Directly after `const [charge, setCharge] = useState(0)`, add:

```tsx
  const [energy, setEnergy] = useState<Energy>(EMPTY_ENERGY)
  const energyActive = energy.seconds > 0 || energy.okFor > 0

  // Energy drains and the build advances only while there is something to show, so an idle room
  // does not re-render twice a second. Elapsed time comes from the clock, not the tick count, because
  // background tabs throttle intervals.
  useEffect(() => {
    if (!energyActive) return
    let last = Date.now()
    const id = window.setInterval(() => {
      const now = Date.now()
      const dt = (now - last) / 1000
      last = now
      setEnergy((e) => tick(e, dt))
    }, ENERGY_TICK_MS)
    return () => window.clearInterval(id)
  }, [energyActive])
```

In `takeSun`, directly after `setCharge((n) => n + 1)`, add:

```tsx
    setEnergy(addSun)
```

In the `<ApartmentScene` element, directly after `charge={charge}`, add:

```tsx
            energy={energy}
```

- [ ] **Step 2: Draw the glow, the speed class and the build bar in `ApartmentScene.tsx`**

Add the import after `import type { Phase } from '../daylight/phase'`:

```tsx
import { GLOW_WAIST, glowTop, tierOf, type Energy } from '../state/energy'
```

Directly before `interface ApartmentSceneProps {`, add:

```tsx
/** Clip id for the energy glow inside Thọ. */
const ENERGY_CLIP = 'apt-energy-fill'

/** A small "OK ✓" plate in the middle of the PC screen, shown for a moment when a build completes. */
const OK_BADGE: Px[] = [
  [207, 83, 23, 9, C.night],
  // O
  [210, 85, 3, 1, C.cream], [210, 89, 3, 1, C.cream], [210, 86, 1, 3, C.cream], [212, 86, 1, 3, C.cream],
  // K
  [214, 85, 1, 5, C.cream], [215, 87, 1, 1, C.cream], [216, 86, 1, 1, C.cream], [216, 85, 1, 1, C.cream],
  [216, 88, 1, 1, C.cream], [216, 89, 1, 1, C.cream],
  // ✓
  [220, 87, 1, 1, '#7fc97f'], [221, 88, 1, 1, '#7fc97f'], [222, 87, 1, 1, '#7fc97f'],
  [223, 86, 1, 1, '#7fc97f'], [224, 85, 1, 1, '#7fc97f'],
]
```

In `interface ApartmentSceneProps`, directly after the `charge` prop, add:

```tsx
  /** Energy from collected suns: the glow inside Thọ, how fast he works, and the build on the screen. */
  energy: Energy
```

Add `energy` to the destructured parameters after `charge,`, and compute the tier and glow at the top of the function body, after `const night = phase === 'night'`:

```tsx
  const tier = tierOf(energy.seconds)
  const top = glowTop(energy.seconds)
```

Change the opening `<svg` so that its `className` and data attribute read:

```tsx
      className={`pixel-svg energy-${tier}`}
      data-energy-tier={tier}
```

Inside `<defs>`, directly before `</defs>`, add:

```tsx
        {/* The glow inside Thọ rises from the waist to the shoulders with his energy. */}
        <clipPath id={ENERGY_CLIP} clipPathUnits="userSpaceOnUse">
          <rect x={140} y={top} width={80} height={GLOW_WAIST - top} />
        </clipPath>
```

Replace

```tsx
      <PixelRects px={developerBody} className="f-breathe" />
```

with

```tsx
      <PixelRects px={developerBody} className="f-breathe" />
      {energy.seconds > 0 && (
        <g className="f-energy" clipPath={`url(#${ENERGY_CLIP})`} data-glow-top={top}>
          <PixelRects px={developerBody} className="f-breathe" />
        </g>
      )}
```

Replace the arm line that follows the charge block (the standalone one, after the `{charge > 0 && (...)}` block)

```tsx
      <PixelRects px={developerArm} />
      <PixelRects px={handA}
```

with

```tsx
      <PixelRects px={developerArm} />
      {energy.seconds > 0 && (
        <g className="f-energy" clipPath={`url(#${ENERGY_CLIP})`}>
          <PixelRects px={developerArm} />
        </g>
      )}
      <PixelRects px={handA}
```

Replace

```tsx
      <Screen mode={screen} />
```

with

```tsx
      <Screen mode={screen} />
      {/* The build Thọ is running: it fills at the pace of his energy and flashes OK when done. */}
      {(energy.build > 0 || energy.okFor > 0) && (
        <g className="f-build" data-build={Math.round(energy.build * 100)}>
          <rect x={198} y={99} width={Math.max(1, Math.round(40 * energy.build))} height={1} fill={C.ochre} />
          {energy.okFor > 0 && <PixelRects px={OK_BADGE} />}
        </g>
      )}
```

- [ ] **Step 3: Style it in `src/styles.css`**

Directly after the line `.f-charge rect { fill: #ffe27a; }`, add:

```css
/* Energy from suns: the same warm light as the collect flash, held inside Thọ at the level left. */
.f-energy { opacity: 0.45; }
.f-energy rect { fill: #ffe27a; }
/* More energy, faster work: typing and the code on the screen speed up by tier. */
.energy-1 .f-type-a, .energy-1 .f-type-b { animation-duration: 1.6s; }
.energy-2 .f-type-a, .energy-2 .f-type-b { animation-duration: 1.1s; }
.energy-3 .f-type-a, .energy-3 .f-type-b { animation-duration: 0.7s; }
.energy-1 .f-code-a, .energy-1 .f-code-b { animation-duration: 3.5s; }
.energy-2 .f-code-a, .energy-2 .f-code-b { animation-duration: 2.2s; }
.energy-3 .f-code-a, .energy-3 .f-code-b { animation-duration: 1.2s; }
```

Inside the existing `@media (prefers-reduced-motion: reduce) {` block, as its first rule, add:

```css
  /* The build is movement, so it is not shown; the glow's level still is. */
  .f-build {
    display: none;
  }
```

- [ ] **Step 4: Build and look**

Run: `npm run build`
Expected: `✓ built`.

With the dev server running, collect three suns from the Sunflower on a 1440×900 page. Take a screenshot (a throwaway Playwright script inside `scripts/`, deleted afterwards) and look at it. Expected: a warm glow inside Thọ's shirt up to the shoulders, faster typing, and an ochre bar growing along the bottom edge of the PC screen, which shows "OK ✓" when it fills.

- [ ] **Step 5: Commit**

```bash
git add src/components/Scene.tsx src/art/ApartmentScene.tsx src/styles.css
git commit -m "Let suns give Thọ energy: a rising glow, faster work and a build

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Browser check for energy

**Files:**
- Create: `scripts/verify-energy.mjs`

- [ ] **Step 1: Write the check**

Create `scripts/verify-energy.mjs`:

```js
/**
 * Checks sun energy in a real browser: collecting suns raises the tier and the glow inside Thọ, the
 * typing speeds up, a build runs on the PC screen, and energy drains as time passes.
 *
 * The page clock is installed, so time only moves when the check says so.
 *
 * Run the dev server, then: node scripts/verify-energy.mjs [url]
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
await mkdir('artifacts', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US' })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  // Day, so the Sun-shroom sleeps and only the Sunflower drops suns.
  await page.addInitScript(() => localStorage.setItem('tho-vn:phase', 'day'))
  await page.clock.install({ time: new Date('2026-06-15T12:00:00+07:00') })
  await page.goto(url)
  await page.clock.runFor(1500)

  const svg = page.locator('.pixel-svg')
  const tier = async () => Number(await svg.getAttribute('data-energy-tier'))
  const glow = page.locator('.f-energy[data-glow-top]')
  const glowTopOf = async () => Number(await glow.getAttribute('data-glow-top'))
  // The hands rest while Thọ speaks, so the screen's code swap is the speed that is always running.
  const codeDuration = () => page.locator('.f-code-a').evaluate((g) => getComputedStyle(g).animationDuration)

  assert.equal(await tier(), 0, 'no energy on load')
  assert.equal(await glow.count(), 0, 'no glow on load')
  assert.equal(await page.locator('.f-build').count(), 0, 'no build on load')

  const collectOne = async () => {
    await page.getByRole('button', { name: 'Shake the sunflower' }).click()
    await page.clock.runFor(100)
    await page.getByRole('button', { name: 'Collect the sun' }).first().click()
    await page.clock.runFor(600)
  }

  await collectOne()
  assert.equal(await tier(), 1, 'one sun gives tier 1')
  const lowGlow = await glowTopOf()
  assert.equal(await codeDuration(), '3.5s')

  await collectOne()
  await collectOne()
  assert.equal(await tier(), 3, 'three suns give tier 3')
  const highGlow = await glowTopOf()
  assert.ok(highGlow < lowGlow, `more energy glows higher (${highGlow} < ${lowGlow})`)
  assert.equal(await codeDuration(), '1.2s')
  await page.screenshot({ path: 'artifacts/energy-full.png' })

  // A build runs while energy lasts and flashes OK when it fills.
  await page.clock.runFor(2000)
  assert.equal(await page.locator('.f-build').count(), 1, 'a build runs with energy')

  // Draining: after 21 more seconds the tier has dropped and the glow is lower.
  await page.clock.runFor(21000)
  assert.ok((await tier()) < 3, 'energy drains over time')
  assert.ok((await glowTopOf()) > highGlow, 'the glow sinks as energy drains')
  await page.screenshot({ path: 'artifacts/energy-draining.png' })

  // Empty: no glow and no build.
  await page.clock.runFor(60000)
  assert.equal(await tier(), 0)
  assert.equal(await glow.count(), 0)
  assert.equal(await page.locator('.f-build').count(), 0, 'the build hides when energy runs out')

  assert.deepEqual(errors, [])
  console.log('energy: tiers, glow level, work speed, build and draining all PASS')
} finally {
  await browser.close()
}
```

- [ ] **Step 2: Run it**

With the dev server running on 5181:
Run: `node scripts/verify-energy.mjs`
Expected: `energy: tiers, glow level, work speed, build and draining all PASS`.

The first screen is the `code` screen, so `.f-code-a` exists. If the duration assertion reports the base `5s`, check that the `energy-<tier>` class is on the `<svg>` element itself.

- [ ] **Step 3: Look at the screenshots**

Open `artifacts/energy-full.png` and `artifacts/energy-draining.png` and look at them. Expected: in the full one the glow reaches Thọ's shoulders; in the draining one it sits clearly lower; the red shirt reads through the glow in both.

- [ ] **Step 4: Run the existing checks**

Run each of these and expect PASS: `npm test`, `npm run build`, `node scripts/verify-sunflower.mjs`, `node scripts/verify-sunshroom.mjs`, `node scripts/verify-hover.mjs`, `node scripts/verify-interactions.mjs`.

- [ ] **Step 5: Commit**

```bash
git add scripts/verify-energy.mjs
git commit -m "Check sun energy in a real browser

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```
