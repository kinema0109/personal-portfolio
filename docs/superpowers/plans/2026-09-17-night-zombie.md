# Night Zombie Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** At night a small Plants vs. Zombies zombie shambles past the window from right to left: first 3–5 s after night begins, then every 15–25 s.

**Architecture:**
- **`src/art/Zombie.tsx`:** the code-drawn sprite (two walk frames) and the timing constants.
- **`src/hooks/useZombie.ts`:** schedules walks while the phase is night and reduced motion is off. It returns the id of the walk in progress, or null.
- **`ApartmentScene.tsx`:** draws the zombie inside the night window view, clipped to the glass. CSS moves it in whole-pixel steps and swaps its two frames.

**Tech Stack:** React 19, TypeScript, SVG pixel rects, CSS animations. Browser check: Playwright with Edge.

**Spec:** `docs/superpowers/specs/2026-09-17-sun-energy-zombie-project-screens-design.md`, section 2.

**Branch:** `prototype/visual-novel`. Never commit to `main`. Do not push. Never `git add` the untracked `public/references/locked/` or `references/`.

**Dev server for browser checks:** `npx vite --host 127.0.0.1 --port 5181 --strictPort`. Reuse it if `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5181` returns 200.

---

### Task 1: Zombie sprite and walk

**Files:**
- Create: `src/art/Zombie.tsx`
- Create: `src/hooks/useZombie.ts`
- Modify: `src/art/ApartmentScene.tsx`
- Modify: `src/components/Scene.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Create the sprite, `src/art/Zombie.tsx`**

```tsx
import { PixelRects } from './PixelRects'
import type { Px } from './palette'

/**
 * A Plants vs. Zombies basic zombie shambling past the window at night: brown coat, white shirt,
 * red tie, grey-green skin, arms held out in front. It faces left, the way zombies cross the lawn.
 *
 * It starts just outside the right edge of the glass with its feet at the foot of the skyline
 * (y 91), and CSS walks it off the left edge. The window clip hides it outside the glass.
 */

/** Delay before the first zombie once night begins, and between zombies after that, in ms. */
export const ZOMBIE_FIRST_MS: readonly [number, number] = [3000, 5000]
export const ZOMBIE_EVERY_MS: readonly [number, number] = [15000, 25000]
/** How long one walk across the window takes; keep in step with `.f-zombie-walk` in styles.css. */
export const ZOMBIE_WALK_MS = 8000

/** Clip id for the window glass; defined in ApartmentScene's defs. */
export const WINDOW_GLASS_CLIP = 'apt-window-glass'

const HAIR = '#3a3a3a'
const SKIN = '#8fa68a'
const SKIN_DARK = '#6f8a6b'
const EYE = '#eeeeee'
const PUPIL = '#2a2a2a'
const MOUTH = '#3a2a2a'
const COAT = '#6b4a33'
const COAT_DARK = '#4f3524'
const SHIRT = '#d9d2c0'
const TIE = '#b8322c'
const PANTS = '#4a4e5c'

/** Top-left of the sprite's head block, before it starts walking. */
const X = 103
const Y = 78

const at = (px: readonly Px[]): Px[] => px.map(([x, y, w, h, fill]) => [X + x, Y + y, w, h, fill] as Px)

const body = at([
  // Head: messy hair, one staring eye, a slack mouth.
  [2, 0, 4, 1, HAIR], [1, 1, 5, 4, SKIN], [1, 4, 5, 1, SKIN_DARK],
  [1, 2, 2, 1, EYE], [1, 2, 1, 1, PUPIL], [1, 4, 2, 1, MOUTH],
  // Coat over a white shirt and red tie; the back is in shadow.
  [2, 5, 4, 5, COAT], [2, 5, 2, 3, SHIRT], [2, 6, 1, 3, TIE], [5, 5, 1, 5, COAT_DARK],
])

/** Two shuffling steps: legs apart with the arms level, then legs together with the arms sagging. */
const stepA = at([
  [-2, 6, 4, 1, COAT], [-3, 6, 1, 1, SKIN],
  [2, 10, 1, 3, PANTS], [4, 10, 1, 2, PANTS], [5, 12, 1, 1, PANTS],
  [1, 12, 2, 1, COAT_DARK], [4, 12, 2, 1, COAT_DARK],
])
const stepB = at([
  [-2, 7, 4, 1, COAT], [-3, 7, 1, 1, SKIN],
  [3, 10, 1, 3, PANTS], [4, 10, 1, 3, PANTS],
  [2, 12, 2, 1, COAT_DARK], [4, 12, 2, 1, COAT_DARK],
])

export function Zombie() {
  return (
    <g clipPath={`url(#${WINDOW_GLASS_CLIP})`}>
      <g className="f-zombie-walk" data-zombie>
        <PixelRects px={body} />
        <PixelRects px={stepA} className="f-zombie-a" />
        <PixelRects px={stepB} className="f-zombie-b" />
      </g>
    </g>
  )
}
```

- [ ] **Step 2: Create the schedule, `src/hooks/useZombie.ts`**

```ts
import { useEffect, useState } from 'react'
import type { Phase } from '../daylight/phase'
import { ZOMBIE_EVERY_MS, ZOMBIE_FIRST_MS, ZOMBIE_WALK_MS } from '../art/Zombie'

const between = ([low, high]: readonly [number, number]) => low + Math.random() * (high - low)

/**
 * Zombies pass the window only at night: the first soon after night begins, because a visitor may
 * not stay long, then one every little while. Returns the id of the walk in progress, or null.
 * Reduced motion means no zombies at all.
 */
export function useZombie(phase: Phase): number | null {
  const [walk, setWalk] = useState<number | null>(null)

  useEffect(() => {
    if (phase !== 'night' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setWalk(null)
      return
    }
    let id = 0
    const handles: number[] = []
    const spawn = () => {
      const current = ++id
      setWalk(current)
      handles.push(window.setTimeout(() => setWalk((shown) => (shown === current ? null : shown)), ZOMBIE_WALK_MS))
      handles.push(window.setTimeout(spawn, between(ZOMBIE_EVERY_MS)))
    }
    handles.push(window.setTimeout(spawn, between(ZOMBIE_FIRST_MS)))
    return () => {
      handles.forEach(clearTimeout)
      setWalk(null)
    }
  }, [phase])

  return walk
}
```

- [ ] **Step 3: Walk and frame animations in `src/styles.css`**

Directly after the line `.f-sun-a { animation: show-first-half 0.7s linear infinite; }`, add:

```css

/* Night zombie: steps from just past the right edge of the glass to just past the left, in whole
   pixels, over the same 8 s as ZOMBIE_WALK_MS, shuffling between two frames as it goes. */
@keyframes zombie-walk {
  from { transform: translateX(0); }
  to { transform: translateX(-88px); }
}
.f-zombie-walk { animation: zombie-walk 8s steps(88, end) both; }
.f-zombie-a { animation: show-first-half 0.6s linear infinite; }
.f-zombie-b { opacity: 0; animation: show-second-half 0.6s linear infinite; }
```

- [ ] **Step 4: Draw it in `ApartmentScene.tsx`**

Add the import after the `SunShroom` import:

```tsx
import { WINDOW_GLASS_CLIP, Zombie } from './Zombie'
```

In `interface ApartmentSceneProps`, directly after the `phase` prop, add:

```tsx
  /** Id of the zombie walk past the window in progress, or null. Only ever set at night. */
  zombie: number | null
```

Add `zombie` to the destructured parameters, directly after `phase,`.

Inside `<defs>`, directly before `</defs>`, add:

```tsx
        {/* The window glass, so a zombie walking past never shows outside the window. */}
        <clipPath id={WINDOW_GLASS_CLIP} clipPathUnits="userSpaceOnUse">
          <rect x={26} y={22} width={74} height={70} />
        </clipPath>
```

In the night window view, replace

```tsx
            <PixelRects px={cityLightsB} className="f-city" />
          </>
```

with

```tsx
            <PixelRects px={cityLightsB} className="f-city" />
            {zombie !== null && <Zombie key={zombie} />}
          </>
```

The zombie is drawn before the glazing bars, so the bars pass in front of it.

- [ ] **Step 5: Schedule it in `Scene.tsx`**

Add the import after `import { usePhase } from '../daylight/PhaseProvider'`:

```tsx
import { useZombie } from '../hooks/useZombie'
```

Directly after `const { phase } = usePhase()`, add:

```tsx
  const zombie = useZombie(phase)
```

In the `<ApartmentScene` element, directly after `phase={phase}`, add:

```tsx
            zombie={zombie}
```

- [ ] **Step 6: Build and look**

Run: `npm run build`
Expected: `✓ built`.

Take a throwaway Playwright screenshot inside `scripts/` and delete the script afterwards. Use a context with `timezoneId: 'Asia/Ho_Chi_Minh'` and a fixed time of `2026-06-15T22:00:00+07:00`, open the page, wait 7 s real time, and crop the scene around x 0–130, y 0–110 at 1440×900. Look at it. Expected: a small zombie with a grey-green face, brown coat and red tie, arms out to the left, inside the window, behind the glazing bars. If the sprite does not read as a PvZ zombie, adjust only its pixel rectangles in `Zombie.tsx`, keeping its size and its feet at y 91, and report what you changed.

- [ ] **Step 7: Commit**

```bash
git add src/art/Zombie.tsx src/hooks/useZombie.ts src/art/ApartmentScene.tsx src/components/Scene.tsx src/styles.css
git commit -m "Send a zombie past the window at night

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Browser check for the zombie

**Files:**
- Create: `scripts/verify-zombie.mjs`

- [ ] **Step 1: Write the check**

Create `scripts/verify-zombie.mjs`:

```js
/**
 * Checks the night zombie in a real browser: one appears within 6 s of night, walks right to left,
 * stays clipped to the window glass, and never appears by day. Switching to day removes it.
 *
 * The page clock drives the schedule; the walk itself is a CSS animation on real time.
 *
 * Run the dev server, then: node scripts/verify-zombie.mjs [url]
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
await mkdir('artifacts', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const errors = []

async function openAt(time) {
  const context = await browser.newContext({ timezoneId: 'Asia/Ho_Chi_Minh', viewport: { width: 1440, height: 900 }, locale: 'en-US' })
  const page = await context.newPage()
  page.on('pageerror', (e) => errors.push(e.message))
  await page.clock.install({ time: new Date(time) })
  await page.goto(url)
  return { context, page }
}

try {
  // Night: a zombie within 6 s, walking left, clipped to the glass.
  {
    const { context, page } = await openAt('2026-06-15T22:00:00+07:00')
    const zombie = page.locator('[data-zombie]')
    await page.clock.runFor(2500)
    assert.equal(await zombie.count(), 0, 'not before 3 s')
    await page.clock.runFor(3500)
    assert.equal(await zombie.count(), 1, 'a zombie within 6 s of night')

    const clip = await zombie.evaluate((g) => g.parentElement.getAttribute('clip-path'))
    assert.equal(clip, 'url(#apt-window-glass)', 'the zombie is clipped to the window glass')

    const x = () => zombie.evaluate((g) => g.getBoundingClientRect().left)
    const start = await x()
    await page.waitForTimeout(2000)
    const later = await x()
    assert.ok(later < start - 5, `it walks right to left (${start} -> ${later})`)
    await page.screenshot({ path: 'artifacts/zombie-night.png' })

    // Switching to day removes it at once.
    await page.getByRole('button', { name: 'Night mode' }).click()
    assert.equal(await zombie.count(), 0, 'no zombie once it is day')
    await context.close()
  }

  // Day: never a zombie.
  {
    const { context, page } = await openAt('2026-06-15T12:00:00+07:00')
    await page.clock.runFor(30000)
    assert.equal(await page.locator('[data-zombie]').count(), 0, 'no zombie by day')
    await context.close()
  }

  assert.deepEqual(errors, [])
  console.log('zombie: appears at night within 6 s, walks left, clipped to the glass, never by day PASS')
} finally {
  await browser.close()
}
```

- [ ] **Step 2: Run it**

With the dev server running on 5181:
Run: `node scripts/verify-zombie.mjs`
Expected: `zombie: appears at night within 6 s, walks left, clipped to the glass, never by day PASS`.

- [ ] **Step 3: Look at the screenshot**

Open `artifacts/zombie-night.png` and look at it. The zombie sits inside the window, partway across, and nothing shows outside the glass.

- [ ] **Step 4: Run the existing checks**

Run each of these and expect PASS: `npm test`, `npm run build`, `node scripts/verify-daylight.mjs`, `node scripts/verify-hover.mjs`, `node scripts/verify-interactions.mjs`, and `node scripts/verify-energy.mjs` if it exists.

- [ ] **Step 5: Commit**

```bash
git add scripts/verify-zombie.mjs
git commit -m "Check the night zombie in a real browser

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```
