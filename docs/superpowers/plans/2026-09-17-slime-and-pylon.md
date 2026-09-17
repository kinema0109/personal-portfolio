# Slime and Pylon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:**
- A Terraria slime hops past the window by day and by night.
- A Protoss pylon under the desk powers the room. Clicking it powers the room down: electric things stop, the visual novel UI hides, and Thọ's caption asks for more pylons. Clicking again warps it back in.

**Architecture:**
- **Walker hook.** `useZombie`'s scheduling becomes a generic `useWalker(active, timing)`, used by both the zombie and the new `Slime`.
- **Power state.** It lives in `App.tsx` as `'on' | 'off' | 'warping'`, because App owns the HUD and the keyboard shortcuts. `Scene` gets `power` and `onPower`.
- **Pylon sprite.** `src/art/Pylon.tsx` draws the pylon and its warp.
- **Room effects.** `ApartmentScene` switches the screen, tower glow, fan, bulb and typing off unless `power === 'on'`.

**Tech Stack:** React 19, TypeScript, SVG pixel rects, CSS animations. Checks use Playwright with Edge.

**Spec:** `docs/superpowers/specs/2026-09-17-slime-and-pylon-design.md`

**Branch:** `prototype/visual-novel`. Never commit to `main`. Do not push. Never `git add` the untracked `public/references/locked/` or `references/`.

**Dev server:** `npx vite --host 127.0.0.1 --port 5181 --strictPort`. Reuse it if `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5181` returns 200.

---

### Task 1: Generic walker, and the slime

**Files:**
- Create: `src/hooks/useWalker.ts`
- Modify: `src/hooks/useZombie.ts`
- Create: `src/art/Slime.tsx`
- Modify: `src/art/ApartmentScene.tsx`, `src/components/Scene.tsx`, `src/styles.css`

- [ ] **Step 1: Create `src/hooks/useWalker.ts`**

```ts
import { useEffect, useState } from 'react'

/** When something walks past the window: the delay before the first, the gap between walks, and one walk's length, in ms. */
export interface WalkerTiming {
  first: readonly [number, number]
  every: readonly [number, number]
  walkMs: number
}

const between = ([low, high]: readonly [number, number]) => low + Math.random() * (high - low)

/**
 * Schedules walks past the window while `active`: the first soon, because a visitor may not stay
 * long, then one every little while. Returns the id of the walk in progress, or null. A new id
 * remounts the walker, which replays its CSS walk. Reduced motion means no walks at all.
 */
export function useWalker(active: boolean, timing: WalkerTiming): number | null {
  const [walk, setWalk] = useState<number | null>(null)

  useEffect(() => {
    if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setWalk(null)
      return
    }
    let id = 0
    const handles = new Set<number>()
    // Each handle forgets itself once it fires, so a long visit does not pile them up.
    const later = (ms: number, run: () => void) => {
      const handle = window.setTimeout(() => {
        handles.delete(handle)
        run()
      }, ms)
      handles.add(handle)
    }
    const spawn = () => {
      const current = ++id
      setWalk(current)
      later(timing.walkMs, () => setWalk((shown) => (shown === current ? null : shown)))
      later(between(timing.every), spawn)
    }
    later(between(timing.first), spawn)
    return () => {
      handles.forEach(clearTimeout)
      setWalk(null)
    }
  }, [active, timing])

  return walk
}
```

- [ ] **Step 2: Make `useZombie` use it**

Replace the whole of `src/hooks/useZombie.ts` with:

```ts
import type { Phase } from '../daylight/phase'
import { ZOMBIE_EVERY_MS, ZOMBIE_FIRST_MS, ZOMBIE_WALK_MS } from '../art/Zombie'
import { useWalker, type WalkerTiming } from './useWalker'

const ZOMBIE_TIMING: WalkerTiming = { first: ZOMBIE_FIRST_MS, every: ZOMBIE_EVERY_MS, walkMs: ZOMBIE_WALK_MS }

/** Zombies pass the window only at night. Returns the id of the walk in progress, or null. */
export function useZombie(phase: Phase): number | null {
  return useWalker(phase === 'night', ZOMBIE_TIMING)
}
```

- [ ] **Step 3: Create `src/art/Slime.tsx`**

```tsx
import type { WalkerTiming } from '../hooks/useWalker'
import { PixelRects } from './PixelRects'
import type { Px } from './palette'
import { WINDOW_GLASS_CLIP } from './Zombie'

/**
 * A blue slime from Terraria, hopping past the window by day and by night. It enters from the left,
 * the opposite way to the zombie, squashing flat each time it lands. It starts just outside the
 * glass's left edge with its base at the foot of the skyline, and CSS carries it off the right edge.
 */

export const SLIME_TIMING: WalkerTiming = { first: [3000, 5000], every: [15000, 25000], walkMs: 7000 }

const SLIME = '#4f8fe0'
const LIGHT = '#8fc0ff'
const DARK = '#2a5aa8'
const EYE = '#0e1826'

/** Top-left of the 8 × 6 body, before it starts hopping. */
const X = 14
const Y = 86

const at = (px: readonly Px[]): Px[] => px.map(([x, y, w, h, fill]) => [X + x, Y + y, w, h, fill] as Px)

/** In the air: a rounded dome with a highlight and two eyes. */
const air = at([
  [2, 0, 4, 1, DARK], [1, 1, 6, 1, SLIME], [0, 2, 8, 3, SLIME], [0, 5, 8, 1, DARK],
  [0, 2, 1, 3, DARK], [7, 2, 1, 3, DARK], [2, 1, 2, 1, LIGHT], [1, 2, 1, 1, LIGHT],
  [2, 3, 1, 1, EYE], [5, 3, 1, 1, EYE],
])
/** Landing: squashed wider and lower. */
const land = at([
  [1, 1, 6, 1, DARK], [0, 2, 8, 1, SLIME], [-1, 3, 10, 2, SLIME], [-1, 5, 10, 1, DARK],
  [-1, 3, 1, 2, DARK], [8, 3, 1, 2, DARK], [1, 2, 2, 1, LIGHT],
  [2, 3, 1, 1, EYE], [5, 3, 1, 1, EYE],
])

export function Slime() {
  return (
    <g clipPath={`url(#${WINDOW_GLASS_CLIP})`}>
      <g className="f-slime-walk" data-slime style={{ animationDuration: `${SLIME_TIMING.walkMs}ms` }}>
        <g className="f-slime-hop">
          <PixelRects px={air} className="f-slime-air" />
          <PixelRects px={land} className="f-slime-land" />
        </g>
      </g>
    </g>
  )
}
```

- [ ] **Step 4: CSS for the slime in `src/styles.css`**

Directly after the line `.f-zombie-b { opacity: 0; animation: show-second-half 0.6s linear infinite; }`, add:

```css

/* Terraria slime: carried left to right across the glass in whole pixels, hopping in a stepped arc
   and squashing flat whenever it lands. The walk's duration is set inline from SLIME_TIMING. */
@keyframes slime-walk {
  from { transform: translateX(0); }
  to { transform: translateX(90px); }
}
@keyframes slime-hop {
  0%, 14.99% { transform: translateY(0); }
  15%, 29.99% { transform: translateY(-3px); }
  30%, 69.99% { transform: translateY(-6px); }
  70%, 84.99% { transform: translateY(-3px); }
  85%, 100% { transform: translateY(0); }
}
@keyframes slime-land { 0%, 14.99% { opacity: 1; } 15%, 84.99% { opacity: 0; } 85%, 100% { opacity: 1; } }
@keyframes slime-air { 0%, 14.99% { opacity: 0; } 15%, 84.99% { opacity: 1; } 85%, 100% { opacity: 0; } }
.f-slime-walk { animation: slime-walk 7s steps(90, end) both; }
.f-slime-hop { animation: slime-hop 0.7s linear infinite; }
.f-slime-land { animation: slime-land 0.7s linear infinite; }
.f-slime-air { opacity: 0; animation: slime-air 0.7s linear infinite; }
```

- [ ] **Step 5: Draw it in `ApartmentScene.tsx`**

Add the import after `import { WINDOW_GLASS_CLIP, Zombie } from './Zombie'`:

```tsx
import { Slime } from './Slime'
```

In `interface ApartmentSceneProps`, directly after the `zombie` prop, add:

```tsx
  /** Id of the slime hopping past the window in progress, or null. Day or night. */
  slime: number | null
```

Add `slime` to the destructured parameters, directly after `zombie,`.

Replace

```tsx
        <PixelRects px={night ? nightMullions : dayMullions} />
```

with

```tsx
        {slime !== null && <Slime key={slime} />}
        <PixelRects px={night ? nightMullions : dayMullions} />
```

- [ ] **Step 6: Schedule it in `Scene.tsx`**

Add these imports after `import { useZombie } from '../hooks/useZombie'`:

```tsx
import { useWalker } from '../hooks/useWalker'
import { SLIME_TIMING } from '../art/Slime'
```

Directly after `const zombie = useZombie(phase)`, add:

```tsx
  const slime = useWalker(true, SLIME_TIMING)
```

In the `<ApartmentScene` element, directly after `zombie={zombie}`, add:

```tsx
            slime={slime}
```

- [ ] **Step 7: Build, re-check the zombie, look at the slime**

Run: `npm run build`
Expected: `✓ built`.

Run: `node scripts/verify-zombie.mjs`
Expected: PASS.

Look at the slime. Write a throwaway script under `scripts/_tmp-*.mjs` and delete it afterwards:
- Use a context with `timezoneId: 'Asia/Ho_Chi_Minh'`, `deviceScaleFactor: 4`, and a fixed noon time.
- Wait 6.5 s of real time.
- Screenshot a clip around scene x 20–110, y 15–100. Convert those scene coordinates to screen pixels with `svg.getScreenCTM()`.

Expected: a blue slime with a highlight and two eyes, inside the glass, at the foot of the skyline. Repeat at 22:00. If it reads poorly, adjust only its pixel rects and keep its base at y 91.

- [ ] **Step 8: Commit**

```bash
git add src/hooks/useWalker.ts src/hooks/useZombie.ts src/art/Slime.tsx src/art/ApartmentScene.tsx src/components/Scene.tsx src/styles.css
git commit -m "Send a Terraria slime hopping past the window, day and night

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Browser check for the slime

**Files:**
- Create: `scripts/verify-slime.mjs`

- [ ] **Step 1: Write the check**

```js
/**
 * Checks the Terraria slime: by day and by night one appears within 6 s, hops left to right, and
 * stays clipped to the window glass. The page clock drives the schedule; the hop itself runs on
 * real time.
 *
 * Run the dev server, then: node scripts/verify-slime.mjs [url]
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
await mkdir('artifacts', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const errors = []

try {
  for (const [phase, time] of [['day', '2026-06-15T12:00:00+07:00'], ['night', '2026-06-15T22:00:00+07:00']]) {
    const context = await browser.newContext({ timezoneId: 'Asia/Ho_Chi_Minh', viewport: { width: 1440, height: 900 }, locale: 'en-US' })
    const page = await context.newPage()
    page.on('pageerror', (e) => errors.push(e.message))
    await page.clock.install({ time: new Date(time) })
    await page.clock.pauseAt(new Date(time))
    await page.goto(url)

    const slime = page.locator('[data-slime]')
    await page.clock.runFor(2500)
    assert.equal(await slime.count(), 0, `${phase}: not before 3 s`)
    await page.clock.runFor(3500)
    assert.equal(await slime.count(), 1, `${phase}: a slime within 6 s`)
    assert.equal(await slime.evaluate((g) => g.parentElement.getAttribute('clip-path')), 'url(#apt-window-glass)')

    const x = () => slime.evaluate((g) => g.getBoundingClientRect().left)
    const start = await x()
    await page.waitForTimeout(2000)
    const later = await x()
    assert.ok(later > start + 5, `${phase}: it hops left to right (${start} -> ${later})`)
    await page.screenshot({ path: `artifacts/slime-${phase}.png` })
    await context.close()
  }

  assert.deepEqual(errors, [])
  console.log('slime: appears by day and by night within 6 s, hops left to right, clipped to the glass PASS')
} finally {
  await browser.close()
}
```

- [ ] **Step 2: Run it, and the zombie check**

Run: `node scripts/verify-slime.mjs`
Expected: PASS.

Run: `node scripts/verify-zombie.mjs`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add scripts/verify-slime.mjs
git commit -m "Check the slime in a real browser

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Pylon and room power

**Files:**
- Create: `src/art/Pylon.tsx`
- Modify: `src/App.tsx`, `src/components/Scene.tsx`, `src/art/ApartmentScene.tsx`, `src/styles.css`, `src/content/types.ts`, `src/content/i18n/en.ts`

- [ ] **Step 1: Create `src/art/Pylon.tsx`**

```tsx
import { PixelRects } from './PixelRects'
import { outlineOf } from './outline'
import type { Px } from './palette'

/**
 * A StarCraft Protoss pylon under the desk, standing where the power strip was: the room's own power.
 * On, its crystal glows and bobs. Off, it is dark and nothing electric in the room works. Warping in
 * plays a floor ring and the crystal's wireframe, top half then bottom half, before it lights up.
 */

export type Power = 'on' | 'off' | 'warping'

/** How long a warp-in takes before power returns. Keep in step with the `.f-warp-*` delays. */
export const WARP_MS = 1500
/** How long Thọ's caption asking for pylons stays up. */
export const PYLON_LINE_MS = 3000

/** Click target over the pylon, in scene units. Scene.tsx places the button here. */
export const PYLON_BOX = { x: 101, y: 121, w: 19, h: 26 } as const

const GLOW = '#3fa7ff'
const WIRE = '#7fd4ff'

const base = (lit: boolean): Px[] => [
  [103, 142, 15, 4, '#6b5220'],
  [104, 141, 13, 1, '#c9a45c'],
  [105, 143, 11, 1, '#a8843a'],
  [107, 144, 2, 1, lit ? GLOW : '#1b2230'],
  [112, 144, 2, 1, lit ? GLOW : '#1b2230'],
]

const crystalShape = (core: string, light: string, shade: string): Px[] => [
  [110, 123, 1, 1, core], [109, 124, 3, 2, core], [108, 126, 5, 3, core],
  [107, 129, 7, 4, core], [108, 133, 5, 3, core], [109, 136, 3, 1, core], [110, 137, 1, 1, core],
  [109, 126, 1, 6, light], [112, 127, 1, 6, shade],
]
const crystalLit = crystalShape(GLOW, '#b8e4ff', '#2a6fc0')
const crystalDark = crystalShape('#3d4a5e', '#566378', '#2b3444')

/** A soft halo behind the lit crystal. */
const halo: Px[] = [[106, 124, 9, 13, GLOW]]

/** The crystal's edges only, split so the warp can draw the top first and the bottom second. */
const wireTop: Px[] = [
  [110, 123, 1, 1, WIRE], [109, 124, 1, 2, WIRE], [111, 124, 1, 2, WIRE], [108, 126, 1, 3, WIRE],
  [112, 126, 1, 3, WIRE], [107, 129, 1, 2, WIRE], [113, 129, 1, 2, WIRE],
]
const wireBottom: Px[] = [
  [107, 131, 1, 2, WIRE], [113, 131, 1, 2, WIRE], [108, 133, 1, 3, WIRE], [112, 133, 1, 3, WIRE],
  [109, 136, 1, 1, WIRE], [111, 136, 1, 1, WIRE], [110, 137, 1, 1, WIRE],
]
const warpRing: Px[] = [[99, 145, 23, 1, WIRE], [102, 144, 17, 1, GLOW]]

const silhouette = outlineOf([...base(true), ...crystalLit])

export function Pylon({ power, highlight }: { power: Power; highlight: boolean }) {
  const lit = power === 'on'
  return (
    <g data-pylon={power}>
      {highlight && <PixelRects px={silhouette} />}
      <PixelRects px={base(lit)} />
      {power === 'warping' ? (
        <g className="f-warp">
          <PixelRects px={warpRing} className="f-warp-ring" />
          <PixelRects px={wireTop} className="f-warp-top" />
          <PixelRects px={wireBottom} className="f-warp-bottom" />
        </g>
      ) : (
        <g className={lit ? 'f-pylon-bob' : undefined}>
          {lit && <PixelRects px={halo} className="f-pylon-glow" />}
          <PixelRects px={lit ? crystalLit : crystalDark} />
        </g>
      )}
    </g>
  )
}
```

- [ ] **Step 2: Strings**

In `src/content/types.ts`, directly after `sunshroomAsleep: string`, add:

```ts
    /** The pylon under the desk: its button while on and while off, and Thọ's caption when power goes. */
    pylonOff: string
    pylonOn: string
    pylonLine: string
```

In `src/content/i18n/en.ts`, directly after `sunshroomAsleep: 'The Sun-shroom is asleep',`, add:

```ts
    pylonOff: 'Power down the pylon',
    pylonOn: 'Warp in the pylon',
    pylonLine: 'You must construct additional pylons.',
```

In the same file's `sceneDescription`, replace "a desktop tower plugged in underneath it" with "a desktop tower underneath it powered by a Protoss pylon that can be switched off".

- [ ] **Step 3: Power state in `src/App.tsx`**

Add the import after `import { Scene } from './components/Scene'`:

```tsx
import { WARP_MS, type Power } from './art/Pylon'
```

Directly after `const [gallerySeen, setGallerySeen] = useState(readGallerySeen)`, add:

```tsx
  // The pylon under the desk is the room's power. Off, the visual novel steps aside and only the room
  // is left; warping it back in takes a moment before power, and the story, return.
  const [power, setPower] = useState<Power>('on')
  const powered = power === 'on'
  const warpTimer = useRef(0)
  useEffect(() => () => window.clearTimeout(warpTimer.current), [])
  const togglePower = useCallback(() => {
    if (power === 'warping') return
    if (power === 'on') {
      setPower('off')
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPower('on')
      return
    }
    setPower('warping')
    window.clearTimeout(warpTimer.current)
    warpTimer.current = window.setTimeout(() => setPower('on'), WARP_MS)
  }, [power])
```

Change the `useFreeRegion` dependencies from `[key, locale],` to:

```tsx
    [key, locale, powered],
```

In the keyboard effect, directly after `if (document.querySelector('dialog[open]')) return`, add:

```tsx
      if (!powered) return
```

and change its dependency list `}, [act, go, view.choices, hasNext])` to:

```tsx
  }, [act, go, view.choices, hasNext, powered])
```

In the `<Scene` element, directly after `onAdvance={hasNext ? () => act({ type: 'next' }) : null}`, add:

```tsx
        power={power}
        onPower={togglePower}
```

Replace

```tsx
      {here.kind === 'gallery' && <GalleryPanel onClose={() => act({ type: 'back' })} />}
      <div className={`hud${view.panel && view.panel.kind !== 'gallery' ? ' has-panel' : ''}`}>
```

with

```tsx
      {powered && here.kind === 'gallery' && <GalleryPanel onClose={() => act({ type: 'back' })} />}
      {powered && (
      <div className={`hud${view.panel && view.panel.kind !== 'gallery' ? ' has-panel' : ''}`}>
```

and replace the HUD's closing lines

```tsx
          onHome={() => act({ type: 'home' })}
        />
      </div>
```

with

```tsx
          onHome={() => act({ type: 'home' })}
        />
      </div>
      )}
```

- [ ] **Step 4: Pylon button, caption and power in `src/components/Scene.tsx`**

Add the import after `import { SLIME_TIMING } from '../art/Slime'`:

```tsx
import { PYLON_BOX, PYLON_LINE_MS, type Power } from '../art/Pylon'
```

In `interface SceneProps`, directly after the `onAdvance` prop, add:

```tsx
  /** The room's power, from the pylon under the desk. */
  power: Power
  /** Powers the pylon down, or warps it back in. */
  onPower: () => void
```

Add `power, onPower` to the destructured props:

```tsx
export function Scene({ screen, speaker, onHotspot, region, panelOpen, sparkle, onAdvance, power, onPower }: SceneProps) {
```

Directly after `const slime = useWalker(true, SLIME_TIMING)`, add:

```tsx
  const powered = power === 'on'
  // Thọ asks for pylons for a moment each time the power goes.
  const [pylonLine, setPylonLine] = useState(false)
  useEffect(() => {
    if (power !== 'off') {
      setPylonLine(false)
      return
    }
    setPylonLine(true)
    const t = window.setTimeout(() => setPylonLine(false), PYLON_LINE_MS)
    return () => window.clearTimeout(t)
  }, [power])
```

In the `<ApartmentScene` element, directly after `slime={slime}`, add:

```tsx
            power={power}
```

Replace

```tsx
      {onAdvance && isOffered(toScreen(SPEAKER_BOX)) && (
```

with

```tsx
      {powered && onAdvance && isOffered(toScreen(SPEAKER_BOX)) && (
```

Replace

```tsx
      {hotspots.map(({ id, style }) => (
```

with

```tsx
      {isOffered(toScreen(PYLON_BOX)) && (
        <button
          type="button"
          className="hotspot"
          style={toScreen(PYLON_BOX)}
          onClick={onPower}
          aria-disabled={power === 'warping'}
          {...points('pylon')}
          aria-label={power === 'on' ? ui.pylonOff : ui.pylonOn}
        />
      )}

      {pylonLine && (
        <p
          className="pylon-line"
          role="status"
          style={{ left: toScreen(SPEAKER_BOX).left + toScreen(SPEAKER_BOX).width / 2, top: toScreen(SPEAKER_BOX).top }}
        >
          {ui.pylonLine}
        </p>
      )}

      {powered && hotspots.map(({ id, style }) => (
```

- [ ] **Step 5: Power effects in `src/art/ApartmentScene.tsx`**

Add the import after `import { Slime } from './Slime'`:

```tsx
import { Pylon, type Power } from './Pylon'
```

In `interface ApartmentSceneProps`, directly after the `slime` prop, add:

```tsx
  /** The room's power. Unless it is on, the PC, its lights, the fan and the ceiling bulb are off. */
  power: Power
```

Add `power` to the destructured parameters directly after `slime,`. After `const night = phase === 'night'`, add:

```tsx
  const powered = power === 'on'
```

Make these replacements in the render:

1. Replace `      <path d="M154 -8H215L283 104H107Z" fill="#e7b568" opacity={0.055} />` with:

```tsx
      {powered && <path d="M154 -8H215L283 104H107Z" fill="#e7b568" opacity={0.055} />}
```

2. Replace `      <rect x={176} y={2} width={16} height={1} fill="#f2d29a" />` with:

```tsx
      <rect x={176} y={2} width={16} height={1} fill={powered ? '#f2d29a' : '#3a3a44'} />
```

3. Replace `      <PixelRects px={cables} />` with:

```tsx
      <PixelRects px={cables} />
      <Pylon power={power} highlight={highlight === 'pylon'} />
```

4. Replace

```tsx
      <PixelRects px={towerGlowA} className="f-rgb-a" />
      <PixelRects px={towerGlowB} className="f-rgb-b" />
```

with

```tsx
      {powered && (
        <>
          <PixelRects px={towerGlowA} className="f-rgb-a" />
          <PixelRects px={towerGlowB} className="f-rgb-b" />
        </>
      )}
```

5. Replace `      <g data-screen={screen}>` with:

```tsx
      <g data-screen={powered ? screen : 'off'}>
```

and replace the `<Screen mode={screen} />` inside it with:

```tsx
        {powered ? <Screen mode={screen} /> : <PixelRects px={[[198, 74, 40, 26, '#0b0e16']]} />}
```

6. Replace `      {(energy.build > 0 || energy.okFor > 0) && (` with:

```tsx
      {powered && (energy.build > 0 || energy.okFor > 0) && (
```

7. Replace

```tsx
      <PixelRects px={handA} className={speaking ? undefined : 'f-type-a'} />
      {!speaking && <PixelRects px={handB} className="f-type-b" />}
```

with

```tsx
      {/* Hands rest while Thọ speaks, and when the power is off there is nothing to type on. */}
      <PixelRects px={handA} className={speaking || !powered ? undefined : 'f-type-a'} />
      {!speaking && powered && <PixelRects px={handB} className="f-type-b" />}
```

8. Replace

```tsx
      <g transform="translate(-174 2)" className={`fan fan-${fanSpeed}`} data-fan={fanSpeed}>
```

with

```tsx
      <g transform="translate(-174 2)" className={`fan fan-${powered ? fanSpeed : 'off'}`} data-fan={powered ? fanSpeed : 'off'}>
```

9. The power strip is replaced by the pylon. In `const cables: Px[] = [`, replace

```tsx
  // Down the wall from the socket to the strip.
  [112, 122, 1, 21, '#15171d'],
  // The strip itself, with its own pilot light.
  [106, 143, 16, 3, '#2b2f38'], [106, 143, 16, 1, '#3c414d'],
  [108, 144, 1, 1, '#6fb3a6'],
  // The tower's lead, crossing the floor and dipping on the way.
  [122, 144, 40, 1, '#15171d'],
```

with

```tsx
  // The tower's lead, from the pylon across the floor, dipping on the way.
  [118, 144, 44, 1, '#15171d'],
```

Update the doc comment above `cables` to say the pylon under the socket powers the tower, and do the same in the comment above `tower` that mentions the power strip.

- [ ] **Step 6: Styles in `src/styles.css`**

Directly after the slime rules from Task 1, add:

```css

/* Pylon: the lit crystal bobs a pixel and glows; warping in pulses a floor ring, then draws the
   crystal's wireframe top half first and bottom half second, over WARP_MS. */
@keyframes pylon-bob { 0%, 49.99% { transform: translateY(0); } 50%, 100% { transform: translateY(-1px); } }
@keyframes warp-appear { from { opacity: 0; } to { opacity: 1; } }
@keyframes warp-ring { 0%, 49.99% { opacity: 1; } 50%, 100% { opacity: 0.35; } }
.f-pylon-bob { animation: pylon-bob 1.8s linear infinite; }
.f-pylon-glow { opacity: 0.18; }
.f-warp-ring { animation: warp-ring 0.3s linear infinite; }
.f-warp-top { opacity: 0; animation: warp-appear 1ms linear 0.4s both; }
.f-warp-bottom { opacity: 0; animation: warp-appear 1ms linear 0.9s both; }

/* Thọ's caption when the power goes, above his head in the room. */
.pylon-line {
  position: absolute;
  z-index: 1;
  margin: 0;
  transform: translate(-50%, -110%);
  padding: 2px 8px;
  white-space: nowrap;
  font-family: var(--font-label);
  font-size: 0.8rem;
  color: var(--cream);
  background: var(--night);
  border: 2px solid #3fa7ff;
  pointer-events: none;
}
```

- [ ] **Step 7: Build and look**

Run: `npm run build`
Expected: `✓ built`.

With the dev server running on a 1440×900 page:
- Click **Power down the pylon**. The dialogue box and choices vanish. The PC screen goes black, the tower lights go out, the fan stops, and the ceiling bulb goes dark. The caption appears above Thọ.
- Click **Warp in the pylon**. The blue floor ring pulses, the wireframe appears top then bottom, and after about 1.5 s everything returns.

Take screenshots of the under-desk area (scene x 90–240, y 105–150) and of the full page in each state, and look at them. The pylon must read as a Protoss pylon: gold base and floating blue crystal. If it does not, adjust its pixels only, and keep it on the floor line and clear of the desk leg (x 94–98) and the paint pots (x 121+).

- [ ] **Step 8: Commit**

```bash
git add src/art/Pylon.tsx src/App.tsx src/components/Scene.tsx src/art/ApartmentScene.tsx src/styles.css src/content/types.ts src/content/i18n/en.ts
git commit -m "Power the room from a Protoss pylon that can be switched off

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Browser check for the pylon

**Files:**
- Create: `scripts/verify-pylon.mjs`

- [ ] **Step 1: Write the check**

```js
/**
 * Checks the pylon under the desk: powering it down stops everything electric, hides the visual
 * novel and shows Thọ's caption; warping it in plays the warp and brings everything back. Under
 * reduced motion power returns at once.
 *
 * Run the dev server, then: node scripts/verify-pylon.mjs [url]
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
await mkdir('artifacts', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const errors = []

try {
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-US' })
    page.on('pageerror', (e) => errors.push(e.message))
    await page.addInitScript(() => localStorage.setItem('tho-vn:phase', 'day'))
    await page.goto(url)
    await page.waitForTimeout(1200)

    const pylon = page.locator('[data-pylon]')
    assert.equal(await pylon.getAttribute('data-pylon'), 'on')
    assert.equal(await page.locator('.hud').count(), 1, 'the visual novel is up with power on')

    await page.getByRole('button', { name: 'Power down the pylon' }).click()
    assert.equal(await pylon.getAttribute('data-pylon'), 'off')
    assert.equal(await page.locator('.hud').count(), 0, 'the visual novel steps aside with power off')
    assert.equal(await page.getByRole('button', { name: 'See projects' }).count(), 0, 'room destinations are unavailable')
    assert.equal(await page.locator('[data-screen]').getAttribute('data-screen'), 'off', 'the PC screen is off')
    assert.equal(await page.locator('.f-rgb-a').count(), 0, 'the tower lights are off')
    assert.equal(await page.locator('[data-fan]').getAttribute('data-fan'), 'off', 'the fan stops')
    await assert.doesNotReject(page.locator('.pylon-line', { hasText: 'You must construct additional pylons.' }).waitFor())
    await page.screenshot({ path: 'artifacts/pylon-off.png' })

    // Story shortcuts do nothing while the power is off. (Not Enter: focus is on the pylon button, and
    // Enter would press it.)
    await page.keyboard.press('Escape')
    assert.equal(await page.locator('.hud').count(), 0)
    assert.equal(await pylon.getAttribute('data-pylon'), 'off')

    await page.getByRole('button', { name: 'Warp in the pylon' }).click()
    assert.equal(await pylon.getAttribute('data-pylon'), 'warping')
    assert.equal(await page.locator('.f-warp').count(), 1, 'the warp plays')
    await page.waitForTimeout(700)
    await page.screenshot({ path: 'artifacts/pylon-warping.png' })
    await page.waitForTimeout(1100)

    assert.equal(await pylon.getAttribute('data-pylon'), 'on', 'power returns after the warp')
    assert.equal(await page.locator('.hud').count(), 1, 'the visual novel returns')
    assert.equal(await page.getByRole('button', { name: 'See projects' }).count(), 1)
    assert.notEqual(await page.locator('[data-screen]').getAttribute('data-screen'), 'off')
    await page.screenshot({ path: 'artifacts/pylon-on.png' })
    await page.close()
  }

  // Reduced motion: no warp, power at once.
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, locale: 'en-US', reducedMotion: 'reduce' })
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto(url)
    await page.waitForTimeout(800)
    await page.getByRole('button', { name: 'Power down the pylon' }).click()
    await page.getByRole('button', { name: 'Warp in the pylon' }).click()
    assert.equal(await page.locator('[data-pylon]').getAttribute('data-pylon'), 'on')
    await page.close()
  }

  assert.deepEqual(errors, [])
  console.log('pylon: power down hides the story and stops the electrics, warp-in restores them, reduced motion skips the warp PASS')
} finally {
  await browser.close()
}
```

- [ ] **Step 2: Run it**

Run: `node scripts/verify-pylon.mjs`
Expected: PASS.

- [ ] **Step 3: Look at the screenshots**

Open `artifacts/pylon-off.png`, `artifacts/pylon-warping.png` and `artifacts/pylon-on.png` and look at each.

- [ ] **Step 4: Run the existing checks**

Expect PASS on each of these:
- `npm test`
- `npm run build`
- `node scripts/verify-slime.mjs`
- `node scripts/verify-zombie.mjs`
- `node scripts/verify-energy.mjs`
- `node scripts/verify-fan.mjs`
- `node scripts/verify-hover.mjs`
- `node scripts/verify-interactions.mjs`
- `node scripts/verify-project-screens.mjs`
- `node scripts/verify-daylight.mjs`

`verify-hover` now also points at the pylon. Its rim should appear, like the other hotspots'.

- [ ] **Step 5: Commit**

```bash
git add scripts/verify-pylon.mjs
git commit -m "Check the pylon in a real browser

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```
