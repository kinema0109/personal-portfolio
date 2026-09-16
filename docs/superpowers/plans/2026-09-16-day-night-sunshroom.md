# Day/Night Room and Sun-shroom Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The pixel room follows the visitor's real day and night, a top-bar button swaps it by hand, and a Plants vs. Zombies Sun-shroom sleeps by day, drops small suns at night and grows after three are collected.

**Architecture:** A pure solar-position module plus a generated IANA-zone → coordinates table decides day or night from the visitor's own clock and time zone, with no network call. A `PhaseProvider` owns the phase and an optional localStorage override, and mirrors the phase onto `<html data-phase>`. CSS (`day.css`) recolours the UI for day, and `ApartmentScene` swaps the window view and dims the room at night. The Sun-shroom is a new code-drawn sprite wired into the existing sun drop/take/fade flow in `Scene.tsx`.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, plain CSS, SVG pixel rects. Unit tests use `node --test` with Node's built-in TypeScript type stripping (Node ≥ 22.18; this machine runs Node 25). Browser checks use Playwright with the Edge channel, following `scripts/verify-*.mjs`.

**Spec:** `docs/superpowers/specs/2026-09-16-day-night-sunshroom-design.md`

**Deliberate deviations from the spec** (Task 12 records them in the spec):
1. The solar position comes from a hand-written formula (USNO approximate solar coordinates, about 30 lines, unit-tested) instead of `suncalc`. That drops a dependency whose v2 API changed in 2026 and could not be verified here. Behaviour is identical: altitude above 0° means day.
2. The day UI lives in a separate `src/day.css` scoped to `:root[data-phase='day']`, instead of moving every hard-coded colour in `styles.css` onto tokens. `styles.css` layers several hard-coded overrides (for example the "Reference scene UI" block around line 1122), so a token refactor would risk changing the night UI that is meant to stay exactly as it is.

**Working branch:** `prototype/visual-novel`. Never commit to `main`: merging is the owner's call.

**Dev server for browser checks:** `npx vite --host 127.0.0.1 --port 5181 --strictPort` (the verify scripts default to port 5181).

---

## File map

| File | Status | Responsibility |
| --- | --- | --- |
| `src/daylight/solar.ts` | create | Sun altitude, `phaseAt`, `nextPhaseChange`. No imports |
| `src/daylight/zoneCoords.ts` | create (generated) | IANA zone → `[lat, lon]` table |
| `src/daylight/place.ts` | create | `placeFor(timeZone, offset)` with an offset fallback |
| `src/daylight/phase.ts` | create | Auto phase, override storage, `initialPhase`, `applyPhase` |
| `src/daylight/PhaseProvider.tsx` | create | React context, timer, visibility re-check, `toggle` |
| `scripts/build-zone-coords.mjs` | create | Generates `zoneCoords.ts` from tzdb |
| `tests/solar.test.ts`, `tests/place.test.ts` | create | Unit tests |
| `src/day.css` | create | Day recolouring of the UI chrome |
| `src/art/SunShroom.tsx` | create | Sun-shroom sprites, Zs, `SUNSHROOM_BOX`, `shroomToss`, `GROW_AFTER` |
| `scripts/verify-daylight.mjs`, `scripts/verify-sunshroom.mjs` | create | Browser checks |
| `tsconfig.json`, `package.json` | modify | `.ts` import extensions, `test` script |
| `index.html`, `src/main.tsx`, `src/App.tsx` | modify | Pre-paint script, provider, top-bar button |
| `src/content/types.ts`, `src/content/i18n/en.ts` | modify | New UI strings |
| `src/art/ApartmentScene.tsx` | modify | `phase` prop, night view, night dimming, shroom |
| `src/art/Sunflower.tsx` | modify | Small sun, per-sun toss origin, moved sun spot |
| `src/components/Scene.tsx` | modify | Shroom state, generalised `dropSun`/`takeSun` |
| `src/styles.css` | modify | Sun-shroom animations, phase-button label on small phones |
| `scripts/verify-hover.mjs` | modify | Pin the phase to day so the rim colour is measurable |
| `docs/DESIGN_CONTRACT.md`, spec | modify | Owner-approved entry; deviations |

---

### Task 1: Solar position

**Files:**
- Create: `src/daylight/solar.ts`
- Create: `tests/solar.test.ts`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Add the test script**

In `package.json`, add `test` to `"scripts"` so the block reads:

```json
  "scripts": {
    "dev": "vite",
    "typecheck": "tsc --noEmit",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "node --test \"tests/*.test.ts\""
  },
```

- [ ] **Step 2: Write the failing tests**

Create `tests/solar.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { nextPhaseChange, phaseAt, solarAltitude } from '../src/daylight/solar.ts'

const HCM_LAT = 10.75
const HCM_LON = 106.67

test('Ho Chi Minh City is day at noon and night at 22:00 local', () => {
  assert.equal(phaseAt(new Date('2026-06-15T12:00:00+07:00'), HCM_LAT, HCM_LON), 'day')
  assert.equal(phaseAt(new Date('2026-06-15T22:00:00+07:00'), HCM_LAT, HCM_LON), 'night')
})

test('the June noon sun over Ho Chi Minh City stands high', () => {
  const altitude = solarAltitude(new Date('2026-06-15T12:00:00+07:00'), HCM_LAT, HCM_LON)
  assert.ok(altitude > 70 && altitude < 90, `altitude ${altitude}`)
})

test('the next change after noon in Ho Chi Minh City is sunset, around 18:15 local', () => {
  const change = nextPhaseChange(new Date('2026-06-15T12:00:00+07:00'), HCM_LAT, HCM_LON)
  assert.ok(change, 'there must be a sunset')
  const local = new Date(change.getTime() + 7 * 3600_000)
  const minutes = local.getUTCHours() * 60 + local.getUTCMinutes()
  assert.ok(Math.abs(minutes - (18 * 60 + 15)) <= 12, `sunset at ${local.toISOString()} (local)`)
})

test('Troll station has the midnight sun on 1 January and no change within 48 hours', () => {
  const at = new Date('2027-01-01T00:00:00Z')
  assert.equal(phaseAt(at, -72.01, 2.53), 'day')
  assert.equal(nextPhaseChange(at, -72.01, 2.53), null)
})

test('Tromsø is dark at noon on the winter solstice', () => {
  assert.equal(phaseAt(new Date('2026-12-21T12:00:00+01:00'), 69.65, 18.96), 'night')
})
```

- [ ] **Step 3: Run the tests to see them fail**

Run: `npm test`
Expected: FAIL, with `Cannot find module` for `src/daylight/solar.ts`.

- [ ] **Step 4: Implement**

Create `src/daylight/solar.ts`:

```ts
/**
 * Where the sun is, from nothing but a moment and a place: the U.S. Naval Observatory's "approximate
 * solar coordinates", good to about a minute of arc, which is far more than day-or-night needs.
 * Deliberately free of imports so `node --test` can load it on its own.
 */

export type Phase = 'day' | 'night'

const RAD = Math.PI / 180

/** The sun's altitude above the horizon in degrees; negative when it is below. */
export function solarAltitude(date: Date, lat: number, lon: number): number {
  const d = date.getTime() / 86_400_000 + 2440587.5 - 2451545.0
  const g = (357.529 + 0.98560028 * d) * RAD
  const q = 280.459 + 0.98564736 * d
  const eclipticLon = (q + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * RAD
  const obliquity = (23.439 - 0.00000036 * d) * RAD
  const rightAscension = Math.atan2(Math.cos(obliquity) * Math.sin(eclipticLon), Math.cos(eclipticLon))
  const declination = Math.asin(Math.sin(obliquity) * Math.sin(eclipticLon))
  const siderealHours = 18.697374558 + 24.06570982441908 * d
  const hourAngle = (siderealHours * 15 + lon) * RAD - rightAscension
  const phi = lat * RAD
  const sinAltitude =
    Math.sin(phi) * Math.sin(declination) + Math.cos(phi) * Math.cos(declination) * Math.cos(hourAngle)
  return Math.asin(sinAltitude) / RAD
}

/** Day while any of the sun is meant to be up: its centre above the horizon. */
export const phaseAt = (date: Date, lat: number, lon: number): Phase =>
  solarAltitude(date, lat, lon) > 0 ? 'day' : 'night'

const STEP_MS = 10 * 60_000
const HORIZON_MS = 48 * 3600_000

/** The next sunrise or sunset within 48 hours, to the minute; null under polar day or polar night. */
export function nextPhaseChange(from: Date, lat: number, lon: number): Date | null {
  const start = phaseAt(from, lat, lon)
  const t0 = from.getTime()
  for (let t = t0 + STEP_MS; t <= t0 + HORIZON_MS; t += STEP_MS) {
    if (phaseAt(new Date(t), lat, lon) === start) continue
    let lo = t - STEP_MS
    let hi = t
    while (hi - lo > 60_000) {
      const mid = (lo + hi) / 2
      if (phaseAt(new Date(mid), lat, lon) === start) lo = mid
      else hi = mid
    }
    return new Date(hi)
  }
  return null
}
```

- [ ] **Step 5: Run the tests to see them pass**

Run: `npm test`
Expected: PASS, 5 tests.

- [ ] **Step 6: Commit**

```bash
git add package.json src/daylight/solar.ts tests/solar.test.ts
git commit -m "Work out day or night from the sun's position

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Time zone → coordinates

**Files:**
- Create: `scripts/build-zone-coords.mjs`
- Create (generated): `src/daylight/zoneCoords.ts`
- Create: `src/daylight/place.ts`
- Create: `tests/place.test.ts`
- Modify: `tsconfig.json`

- [ ] **Step 1: Allow `.ts` extensions in imports**

`node --test` needs explicit `.ts` extensions between the daylight modules. In `tsconfig.json`, add this line under `"noEmit": true,`:

```json
    "allowImportingTsExtensions": true,
```

- [ ] **Step 2: Write the failing tests**

Create `tests/place.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { placeFor } from '../src/daylight/place.ts'

test('Vietnam resolves to Ho Chi Minh City under both of its zone names', () => {
  const [lat, lon] = placeFor('Asia/Ho_Chi_Minh', -420)
  assert.ok(Math.abs(lat - 10.75) < 0.1 && Math.abs(lon - 106.67) < 0.1, `${lat}, ${lon}`)
  // Chrome still reports the old name.
  assert.deepEqual(placeFor('Asia/Saigon', -420), placeFor('Asia/Ho_Chi_Minh', -420))
})

test('Antarctica/Troll is in the table, deep in the south', () => {
  const [lat] = placeFor('Antarctica/Troll', 0)
  assert.ok(lat < -70, `${lat}`)
})

test('an unknown zone falls back to the equator at the offset longitude', () => {
  assert.deepEqual(placeFor('Mars/Olympus_Mons', -420), [0, 105])
  assert.deepEqual(placeFor(undefined, 300), [0, -75])
})
```

- [ ] **Step 3: Run the tests to see them fail**

Run: `npm test`
Expected: FAIL, with `Cannot find module` for `src/daylight/place.ts`. The Task 1 tests still pass.

- [ ] **Step 4: Write the generator**

Create `scripts/build-zone-coords.mjs`:

```js
/**
 * Rebuilds src/daylight/zoneCoords.ts from the IANA time zone database: the principal city of every
 * zone in zone1970.tab, plus every alias in `backward`, because browsers still report some old
 * names (Chrome says Asia/Saigon, not Asia/Ho_Chi_Minh).
 *
 * Run: node scripts/build-zone-coords.mjs
 */
import { writeFile } from 'node:fs/promises'

const BASE = 'https://data.iana.org/time-zones/tzdb/'

async function fetchText(name) {
  const res = await fetch(BASE + name)
  if (!res.ok) throw Error(`${name}: HTTP ${res.status}`)
  return res.text()
}

/** ISO 6709 as tzdb writes it: ±DDMM±DDDMM or ±DDMMSS±DDDMMSS. */
function parseIso6709(iso) {
  const m = /^([+-])(\d{2})(\d{2})(\d{2})?([+-])(\d{3})(\d{2})(\d{2})?$/.exec(iso)
  if (!m) throw Error(`unreadable coordinates: ${iso}`)
  const deg = (sign, d, mm, ss = '0') =>
    Math.round((sign === '-' ? -1 : 1) * (Number(d) + Number(mm) / 60 + Number(ss) / 3600) * 100) / 100
  return [deg(m[1], m[2], m[3], m[4]), deg(m[5], m[6], m[7], m[8])]
}

const coords = new Map()
for (const line of (await fetchText('zone1970.tab')).split('\n')) {
  if (!line.trim() || line.startsWith('#')) continue
  const [, iso, zone] = line.split('\t')
  coords.set(zone, parseIso6709(iso))
}

let aliases = 0
for (const line of (await fetchText('backward')).split('\n')) {
  const m = /^Link\s+(\S+)\s+(\S+)/.exec(line)
  if (!m || !coords.has(m[1]) || coords.has(m[2])) continue
  coords.set(m[2], coords.get(m[1]))
  aliases++
}

const body = [...coords]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([zone, [lat, lon]]) => `  '${zone}': [${lat}, ${lon}],`)
  .join('\n')

await writeFile(
  'src/daylight/zoneCoords.ts',
  `/**
 * Principal-city coordinates for every IANA time zone and its old aliases, as [latitude, longitude].
 * Generated by scripts/build-zone-coords.mjs from tzdb zone1970.tab and backward. Do not edit by hand.
 */
export const ZONE_COORDS: Readonly<Record<string, readonly [number, number]>> = {
${body}
}
`,
)
console.log(`wrote ${coords.size} zones (${aliases} of them aliases)`)
```

- [ ] **Step 5: Generate the table**

Run: `node scripts/build-zone-coords.mjs`
Expected: `wrote N zones (M of them aliases)`, with N somewhere around 450–600. Then check both Vietnam entries and Troll are there:

Run: `grep -E "'Asia/(Ho_Chi_Minh|Saigon)'|'Antarctica/Troll'" src/daylight/zoneCoords.ts`
Expected: three lines. `Asia/Ho_Chi_Minh` and `Asia/Saigon` both read `[10.75, 106.67]`, and Troll reads about `[-72.01, 2.53]` (the last digit can round either way).

- [ ] **Step 6: Implement `placeFor`**

Create `src/daylight/place.ts`:

```ts
import { ZONE_COORDS } from './zoneCoords.ts'

/**
 * Roughly where the visitor is, from their time zone alone: the zone's principal city. A zone the
 * table does not know falls back to the equator at the longitude its UTC offset implies, which
 * still puts sunrise and sunset within about an hour.
 *
 * `offsetMinutes` is `Date#getTimezoneOffset()`: positive west of Greenwich, so UTC+7 is -420.
 */
export function placeFor(timeZone: string | undefined, offsetMinutes: number): readonly [number, number] {
  const known = timeZone ? ZONE_COORDS[timeZone] : undefined
  return known ?? [0, (-offsetMinutes / 60) * 15]
}
```

- [ ] **Step 7: Run the tests and the typecheck**

Run: `npm test`
Expected: PASS, 8 tests.

Run: `npm run typecheck`
Expected: no output, exit 0.

- [ ] **Step 8: Commit**

```bash
git add tsconfig.json scripts/build-zone-coords.mjs src/daylight/zoneCoords.ts src/daylight/place.ts tests/place.test.ts
git commit -m "Place the visitor by their time zone's principal city

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Phase state and pre-paint

**Files:**
- Create: `src/daylight/phase.ts`
- Create: `src/daylight/PhaseProvider.tsx`
- Modify: `src/main.tsx`
- Modify: `index.html`

- [ ] **Step 1: Create `src/daylight/phase.ts`**

```ts
import { placeFor } from './place.ts'
import { nextPhaseChange, phaseAt, type Phase } from './solar.ts'

export type { Phase }

/** A day/night choice made by hand, kept only while it differs from what the clock says. */
export const PHASE_KEY = 'tho-vn:phase'

/** Browser chrome colour per phase: the night UI's background and the day UI's paper. */
const THEME_COLOR: Record<Phase, string> = { day: '#efe6cf', night: '#161a2b' }

const here = (now: Date) => placeFor(Intl.DateTimeFormat().resolvedOptions().timeZone, now.getTimezoneOffset())

/** Day or night where the visitor is, from their own clock and time zone. No network. */
export function autoPhase(now = new Date()): Phase {
  const [lat, lon] = here(now)
  return phaseAt(now, lat, lon)
}

/** When auto next flips, or null under polar day or night. */
export function nextAutoChange(now = new Date()): Date | null {
  const [lat, lon] = here(now)
  return nextPhaseChange(now, lat, lon)
}

function readOverride(): Phase | null {
  try {
    const saved = localStorage.getItem(PHASE_KEY)
    return saved === 'day' || saved === 'night' ? saved : null
  } catch {
    return null
  }
}

/** Remembers a choice, or forgets it when it matches the clock, which puts the visitor back on auto. */
export function saveOverride(phase: Phase, now = new Date()): Phase | null {
  const override = phase === autoPhase(now) ? null : phase
  try {
    if (override) localStorage.setItem(PHASE_KEY, override)
    else localStorage.removeItem(PHASE_KEY)
  } catch {
    // Storage unavailable: the choice lasts until the tab closes.
  }
  return override
}

/** The phase to open on. An override the clock has since caught up with is forgotten. */
export function initialPhase(now = new Date()): { phase: Phase; override: Phase | null } {
  const saved = readOverride()
  if (saved === null) return { phase: autoPhase(now), override: null }
  return { phase: saved, override: saveOverride(saved, now) }
}

/** Puts the phase on <html> for CSS and on the browser's chrome colour. */
export function applyPhase(phase: Phase): void {
  document.documentElement.dataset.phase = phase
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[phase])
}
```

- [ ] **Step 2: Create `src/daylight/PhaseProvider.tsx`**

```tsx
import { createContext, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { applyPhase, autoPhase, initialPhase, nextAutoChange, saveOverride, type Phase } from './phase.ts'

interface PhaseValue {
  phase: Phase
  /** True while the visitor's own choice overrides the clock. */
  isOverride: boolean
  /** Swaps to the other phase. */
  toggle: () => void
}

const PhaseContext = createContext<PhaseValue | null>(null)

/** How often to look again when there is no sunrise or sunset coming (polar day or night). */
const RECHECK_MS = 3600_000

export function PhaseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialPhase)
  const { phase, override } = state

  useLayoutEffect(() => applyPhase(phase), [phase])

  // On the clock: flip at the next sunrise or sunset, and look again whenever the tab comes back,
  // since a sleeping laptop or a background tab can hold a timer well past its time. Every sync makes
  // a new state object, so this effect re-arms itself even when the phase did not change.
  useEffect(() => {
    if (override) return
    const sync = () => setState({ phase: autoPhase(), override: null })
    const next = nextAutoChange()
    const wait = next ? next.getTime() - Date.now() + 1000 : RECHECK_MS
    const timer = window.setTimeout(sync, Math.min(Math.max(wait, 1000), 24 * RECHECK_MS))
    const onVisible = () => {
      if (document.visibilityState === 'visible') sync()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [state, override])

  const toggle = () => {
    const next: Phase = phase === 'day' ? 'night' : 'day'
    setState({ phase: next, override: saveOverride(next) })
  }

  return (
    <PhaseContext.Provider value={{ phase, isOverride: override !== null, toggle }}>{children}</PhaseContext.Provider>
  )
}

export function usePhase(): PhaseValue {
  const value = useContext(PhaseContext)
  if (!value) throw Error('usePhase must be used inside PhaseProvider')
  return value
}
```

- [ ] **Step 3: Wire it into `src/main.tsx`**

Replace the whole file with:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/600.css'
import '@fontsource/be-vietnam-pro/700.css'
import './styles.css'
import App from './App'
import { PhaseProvider } from './daylight/PhaseProvider'
import { applyPhase, initialPhase } from './daylight/phase'
import { LocaleProvider } from './i18n/LocaleProvider'

// Before the first render, so the first frame is already the right time of day.
applyPhase(initialPhase().phase)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider>
      <PhaseProvider>
        <App />
      </PhaseProvider>
    </LocaleProvider>
  </StrictMode>,
)
```

- [ ] **Step 4: Add the pre-paint script to `index.html`**

Directly after the line `<meta name="theme-color" content="#161a2b" />`, insert:

```html
    <!-- A saved day/night choice goes on <html> before anything paints. The sun maths run in
         src/daylight/phase.ts once the bundle loads. -->
    <script>
      try {
        var savedPhase = localStorage.getItem('tho-vn:phase')
        if (savedPhase === 'day' || savedPhase === 'night') document.documentElement.dataset.phase = savedPhase
      } catch (e) {}
    </script>
```

- [ ] **Step 5: Build, and check the attribute by hand**

Run: `npm run build`
Expected: `✓ built`, with no type errors.

Start the dev server (`npx vite --host 127.0.0.1 --port 5181 --strictPort`, in the background). Open `http://127.0.0.1:5181` and run `document.documentElement.dataset.phase` in the console.
Expected: `'day'` or `'night'`, matching whether the sun is currently up where this machine's time zone says it is.

- [ ] **Step 6: Commit**

```bash
git add src/daylight/phase.ts src/daylight/PhaseProvider.tsx src/main.tsx index.html
git commit -m "Track day and night for the visitor, with a remembered override

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Top-bar day/night button

**Files:**
- Modify: `src/content/types.ts` (`ui` block, around line 191)
- Modify: `src/content/i18n/en.ts` (`ui` block, around line 220)
- Modify: `src/App.tsx` (imports, and `.topnav` around line 160)
- Modify: `src/styles.css:939-944` (small-phone label)

- [ ] **Step 1: Add the strings to the type**

In `src/content/types.ts`, inside `ui: {`, directly after `soundOff: string`, add:

```ts
    /** Top-bar day/night switch: a fixed accessible name, and the visible text for each phase. */
    phase: string
    phaseDay: string
    phaseNight: string
```

- [ ] **Step 2: Add the English strings**

In `src/content/i18n/en.ts`, inside `ui: {`, directly after `soundOff: 'Off',`, add:

```ts
    phase: 'Night mode',
    phaseDay: 'Day',
    phaseNight: 'Night',
```

- [ ] **Step 3: Add the button in `src/App.tsx`**

Add the import after `import { useFreeRegion } from './hooks/useFreeRegion'`:

```tsx
import { usePhase } from './daylight/PhaseProvider'
```

Inside `App()`, directly after `const blip = useBlip(soundOn)`, add:

```tsx
  const { phase, toggle: togglePhase } = usePhase()
```

Inside `<div className="topnav">`, directly before the sound `<button` (the one with `className="nav-btn nav-sound"`), insert:

```tsx
          {/* The name stays "Night mode" and only the pressed state flips, so a screen reader hears one
              control changing state rather than a label that swaps under it. */}
          <button
            type="button"
            className="nav-btn nav-phase"
            aria-pressed={phase === 'night'}
            aria-label={ui.phase}
            onClick={togglePhase}
          >
            <span aria-hidden="true">{phase === 'night' ? '☾ ' : '☀ '}</span>
            <span className="nav-phase-text">{phase === 'night' ? ui.phaseNight : ui.phaseDay}</span>
          </button>
```

- [ ] **Step 4: Hide the label on small phones, like the sound label**

In `src/styles.css`, inside `@media (max-width: 599px) {`, change

```css
  .brand-role,
  .nav-sound-text,
  .art-notice-detail {
```

to

```css
  .brand-role,
  .nav-sound-text,
  .nav-phase-text,
  .art-notice-detail {
```

- [ ] **Step 5: Build and try it**

Run: `npm run build`
Expected: `✓ built`.

With the dev server running, open the page. The top bar shows `☀ Day` or `☾ Night` before `♪`. Clicking it swaps the label and `<html data-phase>`. After a reload the choice holds. Clicking back to the clock's phase removes `tho-vn:phase` from localStorage (check in DevTools → Application).

- [ ] **Step 6: Commit**

```bash
git add src/content/types.ts src/content/i18n/en.ts src/App.tsx src/styles.css
git commit -m "Add a day/night switch to the top bar

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Day UI theme

**Files:**
- Create: `src/day.css`
- Modify: `src/main.tsx` (import)

- [ ] **Step 1: Create `src/day.css`**

```css
/* Day: the same UI in a light key, on the paper colour the CV panel already uses. Night is
   styles.css exactly as it stands; this file only recolours. Every rule is scoped to
   [data-phase='day'] on <html>, which outranks the base rules without !important.
   The paper panels, the album viewer and the lightbox are already light or deliberately dark,
   so they are left alone. */
:root[data-phase='day'] {
  color-scheme: light;
  --day-surface: rgb(239 230 207 / 0.95);
  --day-surface-solid: #efe6cf;
  --day-raised: rgb(250 244 230 / 0.92);
  --day-text: #1f2640;
  --day-muted: #4a5470;
  --day-edge: #8a7a5a;
  --day-ring: #c9bb98;
  --day-accent: #8a6130;
}

:root[data-phase='day'] :focus-visible {
  outline-color: var(--day-accent);
}

/* Top bar */
:root[data-phase='day'] .topbar {
  background: linear-gradient(180deg, rgb(239 230 207 / 0.97), rgb(234 223 195 / 0.88));
  border-bottom-color: rgb(138 122 90 / 0.55);
}
:root[data-phase='day'] .brand-name {
  color: var(--day-text);
}
:root[data-phase='day'] .brand-role,
:root[data-phase='day'] .nav-sound {
  color: var(--day-muted);
}
:root[data-phase='day'] .nav-btn {
  background: var(--day-raised);
  border-color: var(--day-edge);
  color: var(--day-text);
}
:root[data-phase='day'] .nav-btn:hover {
  border-color: var(--red);
}
:root[data-phase='day'] .nav-sound[aria-pressed='true'] {
  color: var(--day-text);
  border-color: var(--day-text);
}
:root[data-phase='day'] .nav-btn[aria-current='page'],
:root[data-phase='day'] .nav-btn.lang-btn[aria-pressed='true'] {
  background: var(--day-text);
  border-color: var(--day-text);
  color: var(--cream);
}

/* Dialogue */
:root[data-phase='day'] .dialogue {
  background: var(--day-surface);
  border-color: var(--day-edge);
  box-shadow: 0 0 0 2px var(--day-ring), inset 0 0 0 1px var(--cream-dim);
}
:root[data-phase='day'] .speaker {
  color: var(--day-accent);
}
:root[data-phase='day'] .lines {
  color: var(--day-text);
}
:root[data-phase='day'] .lines > p {
  text-shadow: none;
}
:root[data-phase='day'] .lines.status-placeholder,
:root[data-phase='day'] .tag,
:root[data-phase='day'] .tag-placeholder,
:root[data-phase='day'] .tag-source,
:root[data-phase='day'] .controls .btn {
  color: var(--day-muted);
}
:root[data-phase='day'] .tag-draft {
  color: var(--red-dark);
  background: rgb(163 82 74 / 0.12);
}
:root[data-phase='day'] .controls .btn:hover:not(:disabled) {
  color: var(--day-text);
}
:root[data-phase='day'] .portrait {
  border-color: var(--day-edge);
  box-shadow: 0 0 0 2px var(--day-ring);
}
:root[data-phase='day'] .portrait-tag {
  background: var(--day-surface-solid);
  border-color: var(--day-edge);
  color: var(--day-muted);
}

/* Choices */
:root[data-phase='day'] .choice-menu {
  background: rgb(234 223 195 / 0.92);
  border-color: var(--day-edge);
  box-shadow: 0 0 0 2px var(--day-ring);
}
:root[data-phase='day'] .choice {
  background: var(--day-raised);
  border-color: var(--day-edge);
  color: var(--day-text);
}
:root[data-phase='day'] .choice-key,
:root[data-phase='day'] .choice-hint {
  color: var(--day-muted);
}
:root[data-phase='day'] .choices > li:first-child .choice {
  background: var(--day-text);
  color: var(--cream);
}
:root[data-phase='day'] .choices > li:first-child .choice-key,
:root[data-phase='day'] .choices > li:first-child .choice-hint {
  color: var(--cream-dim);
}
:root[data-phase='day'] .choices > li > .choice:is(:hover, :focus-visible) {
  background: var(--ochre-light);
  color: var(--night);
}
:root[data-phase='day'] .choices > li > .choice:is(:hover, :focus-visible) :is(.choice-key, .choice-hint) {
  color: var(--night);
}

/* Labels drawn over the room */
:root[data-phase='day'] .hotspot-label,
:root[data-phase='day'] .art-notice {
  background: var(--day-surface-solid);
  color: var(--day-text);
}

:root[data-phase='day'] :is(.doc, .dlg-main, .lines, .choice-menu) {
  scrollbar-color: var(--day-edge) transparent;
}
```

- [ ] **Step 2: Import it after `styles.css`**

In `src/main.tsx`, directly after `import './styles.css'`, add:

```tsx
import './day.css'
```

- [ ] **Step 3: Build and inspect both phases**

Run: `npm run build`
Expected: `✓ built`.

With the dev server running, use the top-bar button to view each phase at desktop width, and at 390 × 844 in DevTools device mode. In day, check that the top bar, dialogue box, choice menu and hover labels are on cream with navy text and every piece of text is readable. In night, check that everything looks exactly as it did before this task. If some text in day is still cream-on-cream (a rule inside a media query this file does not cover), add a matching `:root[data-phase='day']` rule to `day.css` in the same section, using the same `--day-*` tokens.

- [ ] **Step 4: Commit**

```bash
git add src/day.css src/main.tsx
git commit -m "Give the UI a light key for day

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Night room

**Files:**
- Modify: `src/art/ApartmentScene.tsx`
- Modify: `src/components/Scene.tsx`

- [ ] **Step 1: Split the window into a day view and a night view**

In `src/art/ApartmentScene.tsx`, add this import after `import { REFRESHED_SPRITES } from './refreshedSprites'`:

```tsx
import type { Phase } from '../daylight/phase'
```

Replace everything from `const floorDetails: Px[] = [` through the closing `]` of `const windowFront: Px[] = [...]` with:

```tsx
const floorDetails: Px[] = [
  // rug
  [132, 131, 168, 9, C.redDark], [132, 132, 168, 1, C.red], [132, 138, 168, 1, C.red],
  // wall socket
  [110, 116, 5, 6, C.creamDim], [111, 118, 1, 2, C.night], [113, 118, 1, 2, C.night],
]

/** The light the window throws on the floor: warm and strong by day, a pale slate by moonlight. */
const dayFloorLight: Px[] = [
  [48, 132, 50, 3, '#4d5a80'], [44, 135, 50, 3, '#4d5a80'], [40, 138, 50, 3, '#4d5a80'],
  [52, 133, 42, 1, '#5d6b94'], [48, 136, 42, 1, '#5d6b94'],
]
const nightFloorLight: Px[] = [
  [48, 132, 50, 3, C.slate], [44, 135, 50, 3, C.slate], [40, 138, 50, 3, C.slate],
]

const windowFrame: Px[] = [[22, 18, 82, 78, C.slate]]

const dayView: Px[] = [
  // Daylight sky, deeper overhead than at the rooftops.
  [26, 22, 74, 70, '#9cc3e2'],
  [26, 22, 74, 16, '#84b0d6'],
  [26, 60, 74, 32, '#b6d6ea'],
  // The sun, high in the corner where the moon hangs at night.
  [82, 26, 12, 12, '#ffe9a8'], [84, 24, 8, 16, '#ffe9a8'], [80, 28, 16, 8, '#ffe9a8'],
  [84, 28, 8, 8, '#fff6d2'],
  // Clouds.
  [30, 33, 15, 4, '#eef4f9'], [34, 30, 8, 3, '#eef4f9'], [33, 37, 9, 1, '#d5e3ee'],
  [55, 45, 17, 4, '#e6eef6'], [60, 42, 9, 3, '#e6eef6'], [58, 49, 11, 1, '#cfdeeb'],
  [74, 34, 11, 3, '#e6eef6'], [77, 32, 6, 2, '#e6eef6'],
  // Skyline, lit from the front instead of silhouetted.
  [26, 70, 12, 22, '#7d93ad'], [38, 62, 10, 30, '#8ea3bb'], [48, 74, 14, 18, '#7688a0'],
  [62, 58, 12, 34, '#93a8c0'], [74, 68, 10, 24, '#8398b0'], [84, 64, 16, 28, '#8ba0b8'],
  [26, 70, 12, 2, '#9db1c7'], [38, 62, 10, 2, '#a3b6ca'], [48, 74, 14, 2, '#93a5bb'],
  [62, 58, 12, 2, '#a7bacd'], [74, 68, 10, 2, '#9aaec4'], [84, 64, 16, 2, '#a2b5c9'],
  // Windows read dark in daylight, the opposite of the night view.
  [44, 72, 2, 3, '#5d7091'], [67, 62, 2, 3, '#5d7091'], [67, 80, 2, 3, '#5d7091'],
  [93, 78, 2, 3, '#5d7091'], [30, 76, 2, 3, '#5d7091'], [52, 80, 2, 3, '#5d7091'],
  [88, 70, 2, 3, '#5d7091'], [41, 68, 2, 3, '#5d7091'], [77, 74, 2, 3, '#5d7091'],
]

/** The night view the window had before daylight (commit 254f596): moon, city silhouette, lit windows. */
const nightView: Px[] = [
  [26, 22, 74, 70, C.night],
  [83, 29, 6, 8, C.cream], [82, 30, 8, 6, C.cream], [85, 32, 2, 2, C.creamDim],
  // city silhouette
  [26, 70, 12, 22, C.navy], [38, 62, 10, 30, C.navy], [48, 74, 14, 18, C.navy],
  [62, 58, 12, 34, C.navy], [74, 68, 10, 24, C.navy], [84, 64, 16, 28, C.navy],
  [44, 72, 2, 2, C.ochreDark], [67, 62, 2, 2, C.ochre], [67, 80, 2, 2, C.ochreDark],
  [93, 78, 2, 2, C.ochreDark], [30, 76, 2, 2, C.ochreDark],
]
const starsA: Px[] = [[34, 28, 1, 1, C.cream], [72, 26, 1, 1, C.cream], [94, 46, 1, 1, C.cream]]
const starsB: Px[] = [[58, 34, 1, 1, C.creamDim], [46, 44, 1, 1, C.creamDim], [40, 38, 1, 1, C.cream]]
const cityLightsA: Px[] = [[41, 66, 2, 2, C.ochre], [70, 70, 2, 2, C.ochre], [88, 70, 2, 2, C.ochre]]
const cityLightsB: Px[] = [[53, 82, 2, 2, C.ochre], [89, 84, 2, 2, C.ochre], [77, 74, 2, 2, C.ochre]]

/** The glazing bars catch the daylight; at night they sink back into the frame. */
const dayMullions: Px[] = [[62, 22, 2, 70, C.slateLight], [26, 55, 74, 2, C.slateLight]]
const nightMullions: Px[] = [[62, 22, 2, 70, C.slate], [26, 55, 74, 2, C.slate]]

const windowFront: Px[] = [
  [18, 94, 90, 4, C.slateLight], [18, 98, 90, 1, C.night],
  [8, 10, 106, 2, C.woodDark],
  [12, 12, 12, 88, C.red], [15, 12, 2, 88, C.redDark], [20, 12, 1, 88, C.redDark],
  [104, 12, 9, 84, C.red], [107, 12, 1, 84, C.redDark],
]

/** Mask id for the night dimming: white is dimmed, black stays bright. */
const NIGHT_LIGHTS = 'night-lights'
```

- [ ] **Step 2: Add the `phase` prop**

In `interface ApartmentSceneProps`, directly after `viewBox: string`, add:

```tsx
  /** Day or night where the visitor is; night swaps the window view and dims the room. */
  phase: Phase
```

Change the function signature to:

```tsx
export function ApartmentScene({ viewBox, phase, screen, speaking, sparkle, suns, charge, fanSpeed, highlight }: ApartmentSceneProps) {
  const night = phase === 'night'
  const sunLayer = suns.map((sun) => <Sun key={sun.id} x={sun.x} y={sun.y} state={sun.state} />)
  return (
```

- [ ] **Step 3: Add the night mask to `<defs>`**

Inside `<defs>`, directly after the closing `</pattern>` of `apt-floor`, add:

```tsx
        {/* Night: what gives off light is cut out of the dimming, so it still glows: the window, the
            laptop screen, the tower's glass and the lamp. The lamp's pool is only half dimmed. */}
        <mask id={NIGHT_LIGHTS} maskUnits="userSpaceOnUse" x={X0} y={-600} width={XW} height={1400}>
          <rect x={X0} y={-600} width={XW} height={1400} fill="#fff" />
          <path d="M154 -8H215L283 104H107Z" fill="#808080" />
          <rect x={26} y={22} width={74} height={70} fill="#000" />
          <rect x={198} y={74} width={40} height={26} fill="#000" />
          <rect x={210} y={119} width={11} height={20} fill="#000" />
          <rect x={172} y={-5} width={24} height={8} fill="#000" />
        </mask>
```

- [ ] **Step 4: Render the phase**

Replace

```tsx
      <PixelRects px={floorDetails} />
```

with

```tsx
      <PixelRects px={floorDetails} />
      <PixelRects px={night ? nightFloorLight : dayFloorLight} />
```

Replace

```tsx
      <PixelRects px={windowPx} />
      <PixelRects px={windowFront} />

      {/* Potted sunflower in the daylight, and any sun it has dropped. */}
      <Sunflower highlight={highlight === 'flower'} />
      {suns.map((sun) => (
        <Sun key={sun.id} x={sun.x} y={sun.y} state={sun.state} />
      ))}
```

with

```tsx
      <PixelRects px={windowFrame} />
      {night ? (
        <>
          <PixelRects px={nightView} />
          <PixelRects px={starsA} className="f-twinkle-1" />
          <PixelRects px={starsB} className="f-twinkle-2" />
          <PixelRects px={cityLightsA} />
          <PixelRects px={cityLightsB} className="f-city" />
        </>
      ) : (
        <PixelRects px={dayView} />
      )}
      <PixelRects px={night ? nightMullions : dayMullions} />
      <PixelRects px={windowFront} />

      {/* Potted sunflower by the window, and any sun it has dropped. By night the suns are drawn
          after the dimming instead, so they still shine. */}
      <Sunflower highlight={highlight === 'flower'} />
      {!night && sunLayer}
```

Replace

```tsx
      {speaking && <SpeechBubble x={186} y={40} />}
```

with

```tsx
      {night && (
        <>
          <rect data-night-dim x={X0} y={-600} width={XW} height={1400} fill={C.night} opacity={0.4} mask={`url(#${NIGHT_LIGHTS})`} />
          {sunLayer}
        </>
      )}

      {speaking && <SpeechBubble x={186} y={40} />}
```

- [ ] **Step 5: Pass the phase from `Scene.tsx`**

In `src/components/Scene.tsx`, add the import after `import { useLocale } from '../i18n/LocaleProvider'`:

```tsx
import { usePhase } from '../daylight/PhaseProvider'
```

Directly after `const ui = useLocale().content.text.ui`, add:

```tsx
  const { phase } = usePhase()
```

In the `<ApartmentScene` element, directly after `viewBox={viewBox}`, add:

```tsx
            phase={phase}
```

- [ ] **Step 6: Build and look at both phases**

Run: `npm run build`
Expected: `✓ built`.

With the dev server running, toggle to night. Expected: a dark window with the moon, twinkling stars and blinking city lights, and the whole room dimmed. The window, the laptop screen, the tower glow and the lamp stay bright, and the lamp's cone reads as a pool of light. The speech bubble is not dimmed. Drop a sun from the Sunflower: it is bright on top of the dimming. Toggle to day: the room is pixel-identical to before this task.

- [ ] **Step 7: Commit**

```bash
git add src/art/ApartmentScene.tsx src/components/Scene.tsx
git commit -m "Bring the night view back for night, and dim the room around its lights

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Browser check for day and night

**Files:**
- Create: `scripts/verify-daylight.mjs`
- Modify: `scripts/verify-hover.mjs` (pin day)

- [ ] **Step 1: Write the check**

Create `scripts/verify-daylight.mjs`:

```js
/**
 * Checks that the room follows the visitor's own day and night, and that the top-bar switch
 * overrides it and forgets the override once it matches the clock again.
 *
 * Each case gets its own browser context with a fixed time zone and a fixed clock, so the result
 * never depends on when the check is run. Screenshots land in artifacts/ for direct inspection.
 *
 * Run the dev server, then: node scripts/verify-daylight.mjs [url]
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir } from 'node:fs/promises'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
const KEY = 'tho-vn:phase'
const HCM_NOON = '2026-06-15T12:00:00+07:00'
const HCM_NIGHT = '2026-06-15T22:00:00+07:00'

await mkdir('artifacts', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const errors = []

/** Opens the room at a given place and moment, optionally with a saved choice on the first load only. */
async function open({ timezoneId, time, saved, viewport = { width: 1440, height: 900 } }) {
  const context = await browser.newContext({ timezoneId, viewport, locale: 'en-US' })
  const page = await context.newPage()
  page.on('pageerror', (e) => errors.push(e.message))
  await page.clock.setFixedTime(new Date(time))
  if (saved) {
    await page.addInitScript(([key, value]) => {
      if (sessionStorage.getItem('seeded')) return
      localStorage.setItem(key, value)
      sessionStorage.setItem('seeded', '1')
    }, [KEY, saved])
  }
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  return { context, page }
}

const phaseOf = (page) => page.evaluate(() => document.documentElement.dataset.phase)
const storedOf = (page) => page.evaluate((key) => localStorage.getItem(key), KEY)

try {
  // Auto, from the clock and the zone. The attribute is already there when the DOM is ready.
  {
    const { context, page } = await open({ timezoneId: 'Asia/Ho_Chi_Minh', time: HCM_NOON })
    assert.equal(await phaseOf(page), 'day', 'noon in Ho Chi Minh City is day')
    await context.close()
  }
  {
    const { context, page } = await open({ timezoneId: 'Asia/Ho_Chi_Minh', time: HCM_NIGHT })
    assert.equal(await phaseOf(page), 'night', '22:00 in Ho Chi Minh City is night')
    await context.close()
  }
  {
    const { context, page } = await open({ timezoneId: 'Antarctica/Troll', time: '2027-01-01T00:00:00Z' })
    assert.equal(await phaseOf(page), 'day', 'Troll has the midnight sun on 1 January')
    await context.close()
  }

  // The switch: swap, remember across a reload, then swap back and forget.
  {
    const { context, page } = await open({ timezoneId: 'Asia/Ho_Chi_Minh', time: HCM_NIGHT })
    const button = page.getByRole('button', { name: 'Night mode' })
    await button.waitFor()
    assert.equal(await button.getAttribute('aria-pressed'), 'true')

    await button.click()
    assert.equal(await phaseOf(page), 'day')
    assert.equal(await storedOf(page), 'day', 'an override that differs from the clock is saved')

    await page.reload({ waitUntil: 'domcontentloaded' })
    assert.equal(await phaseOf(page), 'day', 'the override survives a reload')

    await page.getByRole('button', { name: 'Night mode' }).click()
    assert.equal(await phaseOf(page), 'night')
    assert.equal(await storedOf(page), null, 'swapping back to the clock forgets the override')
    await context.close()
  }

  // A saved choice the clock has since caught up with is dropped on load.
  {
    const { context, page } = await open({ timezoneId: 'Asia/Ho_Chi_Minh', time: HCM_NOON, saved: 'day' })
    await page.getByRole('button', { name: 'Night mode' }).waitFor()
    assert.equal(await phaseOf(page), 'day')
    assert.equal(await storedOf(page), null)
    await context.close()
  }

  // Screenshots of both phases at desktop and phone size.
  for (const [phase, time] of [['day', HCM_NOON], ['night', HCM_NIGHT]]) {
    for (const [name, viewport] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
      const { context, page } = await open({ timezoneId: 'Asia/Ho_Chi_Minh', time, viewport })
      await page.waitForTimeout(1500)
      await page.screenshot({ path: `artifacts/daylight-${phase}-${name}.png` })
      await context.close()
    }
  }

  assert.deepEqual(errors, [])
  console.log('daylight: auto day/night, polar day, switch, reload, stale override and screenshots all PASS')
} finally {
  await browser.close()
}
```

- [ ] **Step 2: Run it**

With the dev server running on 5181:
Run: `node scripts/verify-daylight.mjs`
Expected: `daylight: ... all PASS`. If `Antarctica/Troll` is rejected as an unknown time zone by this Edge build, replace that case with `timezoneId: 'Arctic/Longyearbyen'` and `time: '2026-06-21T00:00:00+02:00'`. That zone is in the table as an alias, so the phase is still computed from coordinates, and the assertion stays `'day'`.

- [ ] **Step 3: Inspect the screenshots**

Open `artifacts/daylight-day-desktop.png`, `daylight-night-desktop.png`, `daylight-day-mobile.png` and `daylight-night-mobile.png`, and look at each one. Day has cream UI chrome and a blue window. Night has the dark UI, the moonlit window and a dimmed room with the lights still bright. No text is unreadable in either.

- [ ] **Step 4: Pin `verify-hover.mjs` to day**

That script counts pixels of the exact rim colour, which the night dimming changes. In `scripts/verify-hover.mjs`, directly after `page.on('pageerror', (e) => errors.push(e.message))`, add:

```js
  // The rim colour is measured exactly, and the night dimming shifts it, so check by day.
  await page.addInitScript(() => localStorage.setItem('tho-vn:phase', 'day'))
```

Run: `node scripts/verify-hover.mjs`
Expected: it passes as before.

- [ ] **Step 5: Commit**

```bash
git add scripts/verify-daylight.mjs scripts/verify-hover.mjs
git commit -m "Check day, night and the switch in a real browser

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Small suns and per-plant toss origins

**Files:**
- Modify: `src/art/Sunflower.tsx`
- Modify: `src/art/ApartmentScene.tsx` (`DroppedSun`, `sunLayer`)
- Modify: `src/components/Scene.tsx` (`dropSun`, `takeSun`, the sunflower and sun buttons)

- [ ] **Step 1: Move the landing spot that the Sun-shroom will stand on**

In `src/art/Sunflower.tsx`, in `SUN_SPOTS`, replace `{ x: 56, y: 130 },` with:

```ts
  // Clear of the Sun-shroom at x 62–77, between it and the desk leg.
  { x: 80, y: 132 },
```

- [ ] **Step 2: Make the toss origin a per-sun value, and add the small sun**

In `src/art/Sunflower.tsx`, replace

```ts
const HEAD = { x: 39 - SUN_SIZE / 2, y: 98 - SUN_SIZE / 2 }
```

with

```ts
export const SUNFLOWER_TOSS = { x: 39 - SUN_SIZE / 2, y: 98 - SUN_SIZE / 2 }

/** A Sun-shroom gives small suns until it has grown: half the size, as in the game. */
export type SunSize = 'small' | 'normal'
```

Directly before the comment `/** Two ray sets, shown in turn, so the sun shimmers instead of sitting still. */`, add:

```ts
/** The small sun: 7 units across, drawn in the middle of the same 14-unit spot a normal sun uses. */
const smallSunCore = (x: number, y: number): Px[] => [
  [x + 2, y, 3, 1, SUN_CORE], [x + 1, y + 1, 5, 1, SUN_CORE], [x, y + 2, 7, 3, SUN_CORE],
  [x + 1, y + 5, 5, 1, SUN_RAY], [x + 2, y + 6, 3, 1, SUN_RAY],
  [x + 2, y + 1, 2, 1, SUN_HOT], [x + 1, y + 2, 2, 2, SUN_HOT],
]
const smallRaysA = (x: number, y: number): Px[] => [
  [x + 3, y - 2, 1, 1, SUN_RAY], [x + 3, y + 8, 1, 1, SUN_RAY],
  [x - 2, y + 3, 1, 1, SUN_RAY], [x + 8, y + 3, 1, 1, SUN_RAY],
]
const smallRaysB = (x: number, y: number): Px[] => [
  [x - 1, y - 1, 1, 1, SUN_RAY], [x + 7, y - 1, 1, 1, SUN_RAY],
  [x - 1, y + 7, 1, 1, SUN_RAY], [x + 7, y + 7, 1, 1, SUN_RAY],
]
```

Replace the whole `Sun` function (from its doc comment `/**` through its closing `}`) with:

```tsx
/**
 * One dropped sun. It is drawn at its landing spot and every movement is a transform away from it,
 * so the arcs are described per sun in these offsets and the keyframes stay shared. `from` is where
 * the sun sits as it leaves the plant, which differs between the Sunflower and the Sun-shroom.
 * A small sun keeps the 14-unit spot, so both kinds share the landing spots and the click target.
 */
export function Sun({
  x,
  y,
  size,
  from,
  state,
}: {
  x: number
  y: number
  size: SunSize
  from: { x: number; y: number }
  state: 'idle' | 'taken' | 'fading'
}) {
  const arc = {
    '--sun-from-x': `${from.x - x}px`,
    '--sun-from-y': `${from.y - y}px`,
    // Apex: part way across, and well above both the plant and the floor.
    '--sun-peak-x': `${(from.x - x) * 0.55}px`,
    '--sun-peak-y': `${from.y - y - 14}px`,
    '--sun-to-x': `${CHEST.x - x}px`,
    '--sun-to-y': `${CHEST.y - y}px`,
  } as CSSProperties
  const phase = state === 'taken' ? ' is-taken' : state === 'fading' ? ' is-fading' : ''
  const small = size === 'small'
  return (
    <g className={`f-sun${phase}`} style={arc} data-sun={state} data-sun-size={size}>
      <PixelRects px={small ? smallSunCore(x + 3, y + 3) : sunCore(x, y)} />
      <PixelRects px={small ? smallRaysA(x + 3, y + 3) : sunRaysA(x, y)} className="f-sun-a" />
      <PixelRects px={small ? smallRaysB(x + 3, y + 3) : sunRaysB(x, y)} className="f-sun-b" />
    </g>
  )
}
```

- [ ] **Step 3: Extend `DroppedSun` and the sun layer**

In `src/art/ApartmentScene.tsx`, change the import `import { Sun, Sunflower } from './Sunflower'` to:

```tsx
import { Sun, Sunflower, type SunSize } from './Sunflower'
```

Replace the `DroppedSun` interface with:

```tsx
/** One sun lying on the floor. `collecting` plays it up and out before Scene drops it. */
export interface DroppedSun {
  id: number
  x: number
  y: number
  /** idle: lying on the floor · taken: flying into Thọ · fading: left too long and going out. */
  state: 'idle' | 'taken' | 'fading'
  /** Which plant dropped it. Only the Sun-shroom's small suns count towards its growth. */
  plant: 'sunflower' | 'shroom'
  size: SunSize
  /** Where the sun sits as it leaves the plant, so the toss starts from the right head. */
  origin: { x: number; y: number }
}
```

Replace the `sunLayer` line with:

```tsx
  const sunLayer = suns.map((sun) => (
    <Sun key={sun.id} x={sun.x} y={sun.y} size={sun.size} from={sun.origin} state={sun.state} />
  ))
```

- [ ] **Step 4: Generalise dropping and taking in `Scene.tsx`**

Change the Sunflower import line to:

```tsx
import { SUNFLOWER_BOX, SUNFLOWER_TOSS, SUN_FADE_MS, SUN_LIFE_MS, SUN_SIZE, SUN_SPOTS, SUN_TAKE_MS } from '../art/Sunflower'
```

Replace the whole `dropSun` const (including the two comment lines above it) with:

```tsx
  // Plants vs. Zombies: a plant spits out a sun, a sun left alone goes out on its own, and a sun that
  // is taken flies into Thọ. There is no counter and no score, so the only state is the suns.
  const dropSun = (plant: DroppedSun['plant'], size: DroppedSun['size'], origin: DroppedSun['origin']) =>
    setSuns((current) => {
      const taken = new Set(current.map((sun) => `${sun.x},${sun.y}`))
      const spot = SUN_SPOTS.find((s) => !taken.has(`${s.x},${s.y}`))
      if (!spot) return current
      const id = nextSunId.current++
      after(id, SUN_LIFE_MS, () => {
        setState(id, 'fading')
        after(id, SUN_FADE_MS, () => drop(id))
      })
      return [...current, { id, x: spot.x, y: spot.y, state: 'idle', plant, size, origin }]
    })
```

Replace the whole `takeSun` const with:

```tsx
  const takeSun = (sun: DroppedSun) => {
    clearTimers(sun.id)
    setState(sun.id, 'taken')
    setCharge((n) => n + 1)
    after(sun.id, SUN_TAKE_MS, () => drop(sun.id))
  }
```

In the Sunflower hotspot button, change `onClick={dropSun}` to:

```tsx
          onClick={() => dropSun('sunflower', 'normal', SUNFLOWER_TOSS)}
```

In the sun buttons, change `onClick={() => takeSun(sun.id)}` to:

```tsx
          onClick={() => takeSun(sun)}
```

- [ ] **Step 5: Build and re-run the Sunflower check**

Run: `npm run build`
Expected: `✓ built`.

Run: `node scripts/verify-sunflower.mjs`
Expected: `sunflower: toss arc, cap of 5 suns, and collection all PASS`.

- [ ] **Step 6: Commit**

```bash
git add src/art/Sunflower.tsx src/art/ApartmentScene.tsx src/components/Scene.tsx
git commit -m "Let suns come in two sizes and from more than one plant

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: Sun-shroom sprite and animations

**Files:**
- Create: `src/art/SunShroom.tsx`
- Modify: `src/styles.css` (after the `.f-sun-a` rule, around line 267)

- [ ] **Step 1: Create `src/art/SunShroom.tsx`**

```tsx
import { PixelRects } from './PixelRects'
import { outlineOf } from './outline'
import type { Px } from './palette'
import { SUN_SIZE } from './Sunflower'

/**
 * The Sun-shroom beside the Sunflower, from Plants vs. Zombies, and it follows the game: a gold cap
 * with brown spots on a short cream stem, the face on the stem rather than on the cap, asleep by day
 * with Zs rising off it and awake at night.
 *
 * It starts small and gives small suns, and it grows once the visitor has collected three of them at
 * night. In the game it grows after two minutes awake, which is longer than most visits.
 */

const OUT = '#2a2119'
const CAP = '#d89c00'
const CAP_SHADE = '#a87400'
const CAP_HI = '#fcd824'
const SPOT = '#9c4800'
const STEM = '#f0e4cc'
const STEM_SHADE = '#c0a878'
const INK = '#2a2119'
const Z_INK = '#eadfc3'

/** Small suns collected at night before it grows. */
export const GROW_AFTER = 3

/** Click target over the grown plant and the air just above it, in scene units. */
export const SUNSHROOM_BOX = { x: 60, y: 124, w: 20, h: 22 } as const

/** What Scene keeps about the Sun-shroom and hands down for drawing. */
export interface ShroomState {
  grown: boolean
  /** Counts night clicks; a change replays the flash before a sun comes out. */
  flash: number
  /** Counts day clicks; a change replays the sleepy shake and an extra Z. */
  nudge: number
}

/**
 * Where its sun sits as it leaves the plant: centred on the cap. Both sizes stand on the floor line,
 * so the small cap is lower.
 */
export const shroomToss = (grown: boolean) =>
  grown ? { x: 70 - SUN_SIZE / 2, y: 134 - SUN_SIZE / 2 } : { x: 70 - SUN_SIZE / 2, y: 139 - SUN_SIZE / 2 }

const at = (ox: number, oy: number, px: readonly Px[]): Px[] =>
  px.map(([x, y, w, h, fill]) => [ox + x, oy + y, w, h, fill] as Px)

/* Grown: 16 × 16 at x 62–77, y 130–145, so its base sits on the floor line like the pot beside it. */
const GROWN = { x: 62, y: 130 }
const grownBody = at(GROWN.x, GROWN.y, [
  // Cap: the silhouette in the outline colour, then the fill one unit in.
  [5, 0, 6, 1, OUT], [3, 1, 10, 1, OUT], [2, 2, 12, 1, OUT], [1, 3, 14, 2, OUT], [0, 5, 16, 3, OUT], [1, 8, 14, 1, OUT],
  [4, 1, 8, 1, CAP], [3, 2, 10, 1, CAP], [2, 3, 12, 2, CAP], [1, 5, 14, 2, CAP], [1, 7, 14, 1, CAP_SHADE],
  // The window is up and to the left, so that is where the cap catches the light.
  [4, 2, 3, 1, CAP_HI], [3, 3, 2, 1, CAP_HI],
  // Spots: one big one low in the middle, small ones near the top.
  [6, 5, 4, 2, SPOT], [10, 2, 2, 1, SPOT], [12, 4, 2, 1, SPOT], [2, 5, 2, 1, SPOT],
  // Stem, shaded away from the window.
  [3, 9, 10, 6, OUT], [4, 15, 8, 1, OUT],
  [4, 9, 8, 5, STEM], [10, 9, 2, 5, STEM_SHADE], [4, 14, 8, 1, STEM_SHADE],
])
const grownEyesOpen = at(GROWN.x, GROWN.y, [[6, 10, 1, 2, INK], [9, 10, 1, 2, INK]])
const grownEyesShut = at(GROWN.x, GROWN.y, [[5, 11, 2, 1, INK], [9, 11, 2, 1, INK]])
const grownMouth = at(GROWN.x, GROWN.y, [[7, 13, 2, 1, INK]])

/* Small: 9 × 9 at x 66–74, y 137–145. Drawn on its own, because halving the grown one breaks the grid. */
const SMALL = { x: 66, y: 137 }
const smallBody = at(SMALL.x, SMALL.y, [
  [2, 0, 5, 1, OUT], [1, 1, 7, 1, OUT], [0, 2, 9, 2, OUT], [1, 4, 7, 1, OUT],
  [2, 1, 5, 1, CAP], [1, 2, 7, 1, CAP], [1, 3, 7, 1, CAP_SHADE],
  [2, 1, 2, 1, CAP_HI], [4, 3, 2, 1, SPOT],
  [2, 5, 5, 4, OUT],
  [3, 5, 3, 3, STEM], [5, 5, 1, 3, STEM_SHADE],
])
const smallEyesOpen = at(SMALL.x, SMALL.y, [[3, 6, 1, 1, INK], [5, 6, 1, 1, INK]])
const smallEyesShut = at(SMALL.x, SMALL.y, [[3, 7, 1, 1, INK], [5, 7, 1, 1, INK]])

/** A "Z" in whole pixels: 3 × 3, or 4 × 4 for the larger one that follows it. */
const zGlyph = (x: number, y: number, big: boolean): Px[] =>
  big
    ? [[x, y, 4, 1, Z_INK], [x + 2, y + 1, 1, 1, Z_INK], [x + 1, y + 2, 1, 1, Z_INK], [x, y + 3, 4, 1, Z_INK]]
    : [[x, y, 3, 1, Z_INK], [x + 1, y + 1, 1, 1, Z_INK], [x, y + 2, 3, 1, Z_INK]]

/** Where the Zs start, above the cap and to the right: a small one first, then a bigger one. */
const zStart = (grown: boolean) => (grown ? [{ x: 75, y: 125 }, { x: 77, y: 119 }] : [{ x: 72, y: 132 }, { x: 74, y: 127 }])

export function SunShroom({
  shroom,
  asleep,
  highlight,
}: {
  shroom: ShroomState
  asleep: boolean
  highlight: boolean
}) {
  const { grown, flash, nudge } = shroom
  const body = grown ? grownBody : smallBody
  const eyes = grown ? (asleep ? grownEyesShut : grownEyesOpen) : asleep ? smallEyesShut : smallEyesOpen
  const [z1, z2] = zStart(grown)
  const motion = asleep ? (nudge > 0 ? 'f-shroom-nudge' : undefined) : 'f-shroom-sway'
  return (
    <g data-plant="sunshroom" data-grown={grown} data-asleep={asleep}>
      {/* Growing plays once, when the grown plant first appears. */}
      <g key={grown ? 'grown' : 'small'} className={grown ? 'f-grow' : undefined}>
        <g key={`nudge-${nudge}`} className={motion}>
          {highlight && <PixelRects px={outlineOf(body)} />}
          <PixelRects px={body} />
          <PixelRects px={eyes} className={asleep ? undefined : 'f-blink'} />
          {grown && !asleep && <PixelRects px={grownMouth} />}
          {flash > 0 && !asleep && (
            <g key={`flash-${flash}`} className="f-shroom-flash">
              <PixelRects px={body} />
            </g>
          )}
        </g>
      </g>
      {asleep && (
        <g className="f-zzz">
          <PixelRects px={zGlyph(z1.x, z1.y, false)} className="f-z-1" />
          <PixelRects px={zGlyph(z2.x, z2.y, true)} className="f-z-2" />
          {nudge > 0 && <PixelRects key={`burst-${nudge}`} px={zGlyph(z1.x + 2, z1.y - 2, false)} className="f-z-burst" />}
        </g>
      )}
    </g>
  )
}
```

- [ ] **Step 2: Add the animations to `src/styles.css`**

Directly after the line `.f-sun-a { animation: show-first-half 0.7s linear infinite; }`, add:

```css

/* Sun-shroom. Awake, it rocks on whole pixels and blinks now and then; asleep, it holds still under
   rising Zs. Everything steps, like the rest of the room. Reduced motion turns all of it off, which
   leaves one still Z over the sleeping plant. */
@keyframes shroom-sway {
  0%, 49.99% { transform: translateX(0); }
  50%, 100% { transform: translateX(1px); }
}
@keyframes shroom-blink { 0%, 93.99% { opacity: 1; } 94%, 100% { opacity: 0; } }
@keyframes shroom-nudge {
  0%, 24.99% { transform: translateX(-1px); }
  25%, 49.99% { transform: translateX(1px); }
  50%, 74.99% { transform: translateX(-1px); }
  75%, 100% { transform: translateX(0); }
}
@keyframes z-rise {
  0% { transform: translate(0, 0); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translate(3px, -6px); opacity: 0; }
}
/* Before a sun comes out, the whole plant lights up towards white, as it does in the game. */
@keyframes shroom-flash {
  0% { opacity: 0; }
  50% { opacity: 0.85; }
  100% { opacity: 0; }
}
@keyframes shroom-grow {
  from { transform: scale(0.56); }
  to { transform: scale(1); }
}
.f-shroom-sway { animation: shroom-sway 1.6s linear infinite; }
.f-blink { animation: shroom-blink 3.7s linear infinite; }
.f-shroom-nudge { animation: shroom-nudge 320ms linear both; }
.f-z-1 { animation: z-rise 2.4s steps(6, end) infinite; }
.f-z-2 { opacity: 0; animation: z-rise 2.4s steps(6, end) 1.2s infinite; }
.f-z-burst { opacity: 0; animation: z-rise 700ms steps(4, end) both; }
.f-shroom-flash { opacity: 0; animation: shroom-flash 360ms linear both; }
.f-shroom-flash rect { fill: #fff6d2; }
.f-grow {
  transform-box: fill-box;
  transform-origin: 50% 100%;
  animation: shroom-grow 1s steps(5, end) both;
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: exit 0. `SunShroom` is not rendered yet, and TypeScript does not flag unused exports.

- [ ] **Step 4: Commit**

```bash
git add src/art/SunShroom.tsx src/styles.css
git commit -m "Draw the Sun-shroom, asleep and awake, small and grown

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Put the Sun-shroom in the room

**Files:**
- Modify: `src/art/ApartmentScene.tsx`
- Modify: `src/components/Scene.tsx`
- Modify: `src/content/types.ts`, `src/content/i18n/en.ts`

- [ ] **Step 1: Strings**

In `src/content/types.ts`, replace

```ts
    /** Labels for the two sunflower click targets. Screen readers only; nothing is shown on screen. */
```

with

```ts
    /** Labels for the plant and sun click targets. Screen readers only; nothing is shown on screen. */
```

and directly after `sun: string` add:

```ts
    sunshroom: string
    sunshroomAsleep: string
```

In `src/content/i18n/en.ts`, directly after `sun: 'Collect the sun',` add:

```ts
    sunshroom: 'Shake the Sun-shroom',
    sunshroomAsleep: 'The Sun-shroom is asleep',
```

In the same file, replace the value of `sceneDescription` with:

```ts
      'Pixel art of a small apartment that follows the visitor’s own day and night. Thọ works at a desk with a laptop, a photo album and a notebook, a desktop tower plugged in underneath it, and a potted sunflower and a Sun-shroom on the floor by the window; the Sun-shroom sleeps by day. On the wall, Alhazard and Langrisser cross in one frame, Gran Centurio hangs in a tall frame beside it, and Armageddon rests on pegs below. The display cabinet holds the books behind the Limbus Company sinners and two plushes on the top shelf, a Skaven Grey Seer, an Alpha Legion miniature and a Master Ball on the lit middle shelf, and every boxed Fire Emblem game along the bottom. Click the laptop, the album or the desk drawer to explore, or the plants for a sun.',
```

- [ ] **Step 2: Draw it in `ApartmentScene.tsx`**

Add the import after the `Sunflower` import:

```tsx
import { SunShroom, type ShroomState } from './SunShroom'
```

In `interface ApartmentSceneProps`, directly after the `suns` prop, add:

```tsx
  /** The Sun-shroom's size and the click counters that replay its animations. */
  shroom: ShroomState
```

Add `shroom` to the destructured parameters, directly after `suns,`:

```tsx
export function ApartmentScene({ viewBox, phase, screen, speaking, sparkle, suns, shroom, charge, fanSpeed, highlight }: ApartmentSceneProps) {
```

Directly after `<Sunflower highlight={highlight === 'flower'} />`, add:

```tsx
      <SunShroom shroom={shroom} asleep={!night} highlight={highlight === 'shroom'} />
```

- [ ] **Step 3: State and behaviour in `Scene.tsx`**

Add the import after the Sunflower import:

```tsx
import { GROW_AFTER, SUNSHROOM_BOX, shroomToss } from '../art/SunShroom'
```

Directly after `const timers = useRef(new Map<number, number[]>())`, add:

```tsx
  const [shroomTaken, setShroomTaken] = useState(0)
  const [shroomGrown, setShroomGrown] = useState(false)
  const [shroomFlash, setShroomFlash] = useState(0)
  const [shroomNudge, setShroomNudge] = useState(0)
```

Above the component function (next to `PAN_FRAMES`), add:

```tsx
/** Timer bucket for the Sun-shroom's flash-then-toss; sun ids start at 0, so this never collides. */
const SHROOM_TIMER = -1
/** The flash peaks here, and that is when the sun comes out. */
const SHROOM_FLASH_MS = 180
```

Directly after the `dropSun` const, add:

```tsx
  // The Sun-shroom, as in the game: asleep by day, so a click only stirs it; awake at night, it
  // lights up and spits out a sun, a small one until it has grown.
  const shakeShroom = () => {
    if (phase === 'day') {
      setShroomNudge((n) => n + 1)
      return
    }
    const grown = shroomGrown
    setShroomFlash((n) => n + 1)
    after(SHROOM_TIMER, SHROOM_FLASH_MS, () => dropSun('shroom', grown ? 'normal' : 'small', shroomToss(grown)))
  }
```

Replace the `takeSun` const with:

```tsx
  const takeSun = (sun: DroppedSun) => {
    clearTimers(sun.id)
    setState(sun.id, 'taken')
    setCharge((n) => n + 1)
    after(sun.id, SUN_TAKE_MS, () => drop(sun.id))
    // Growth counts small suns collected while it is awake; one left to go out does not count.
    if (sun.plant === 'shroom' && sun.size === 'small' && phase === 'night') {
      const taken = shroomTaken + 1
      setShroomTaken(taken)
      if (taken >= GROW_AFTER) setShroomGrown(true)
    }
  }
```

In the `<ApartmentScene` element, directly after `suns={suns}`, add:

```tsx
            shroom={{ grown: shroomGrown, flash: shroomFlash, nudge: shroomNudge }}
```

Directly after the Sunflower hotspot block (the `{isOffered(toScreen(SUNFLOWER_BOX)) && (...)}` expression), add:

```tsx
      {isOffered(toScreen(SUNSHROOM_BOX)) && (
        <button
          type="button"
          className="hotspot"
          style={toScreen(SUNSHROOM_BOX)}
          onClick={shakeShroom}
          {...points('shroom')}
          aria-label={phase === 'night' ? ui.sunshroom : ui.sunshroomAsleep}
        />
      )}
```

- [ ] **Step 4: Build and play with it**

Run: `npm run build`
Expected: `✓ built`.

With the dev server running on a desktop-width window, compare against the spec's Behaviour table:
- **Day:** a small sleeping Sun-shroom right of the Sunflower's pot, Zs rising. Pointing at it shows a one-unit rim. Clicking gives a shake and an extra Z, and no sun.
- **Night (toggle):** it sways and blinks. Clicking makes it flash and toss a small sun from its cap onto a free spot. Collect three small suns and it grows over about a second. The next click gives a normal-size sun.
- **Clash check:** the Sunflower still works in both phases, and no sun lands on the Sun-shroom.

- [ ] **Step 5: Commit**

```bash
git add src/art/ApartmentScene.tsx src/components/Scene.tsx src/content/types.ts src/content/i18n/en.ts
git commit -m "Plant a Sun-shroom that sleeps by day and grows at night

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: Browser check for the Sun-shroom

**Files:**
- Create: `scripts/verify-sunshroom.mjs`

- [ ] **Step 1: Write the check**

Create `scripts/verify-sunshroom.mjs`:

```js
/**
 * Checks the Sun-shroom in a real browser: asleep and sunless by day; by night a small sun from its
 * cap, growth after three collected small suns, and a normal sun afterwards.
 *
 * Time zone and clock are fixed per context, so day and night do not depend on when this runs.
 *
 * Run the dev server, then: node scripts/verify-sunshroom.mjs [url]
 */
import { chromium } from 'playwright'
import assert from 'node:assert/strict'

const url = process.argv[2] || process.env.ROOM_URL || 'http://127.0.0.1:5181'
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const errors = []

async function openAt(time) {
  const context = await browser.newContext({
    timezoneId: 'Asia/Ho_Chi_Minh',
    viewport: { width: 1440, height: 900 },
    locale: 'en-US',
  })
  const page = await context.newPage()
  page.on('pageerror', (e) => errors.push(e.message))
  await page.clock.setFixedTime(new Date(time))
  await page.goto(url)
  await page.waitForTimeout(1200)
  return { context, page }
}

try {
  // Day: asleep, Zs up, and a click gives no sun.
  {
    const { context, page } = await openAt('2026-06-15T12:00:00+07:00')
    const plant = page.locator('[data-plant="sunshroom"]')
    assert.equal(await plant.getAttribute('data-asleep'), 'true')
    assert.equal(await page.locator('[data-plant="sunshroom"] .f-zzz').count(), 1, 'Zs rise off it by day')
    await page.getByRole('button', { name: 'The Sun-shroom is asleep' }).click()
    await page.waitForTimeout(800)
    assert.equal(await page.locator('[data-sun]').count(), 0, 'a sleeping Sun-shroom drops no sun')
    await context.close()
  }

  // Night: small suns from the cap, growth after three, then normal suns.
  {
    const { context, page } = await openAt('2026-06-15T22:00:00+07:00')
    const plant = page.locator('[data-plant="sunshroom"]')
    const shroom = page.getByRole('button', { name: 'Shake the Sun-shroom' })
    assert.equal(await plant.getAttribute('data-asleep'), 'false')
    assert.equal(await plant.getAttribute('data-grown'), 'false')

    // The toss starts on the cap: the first frame of the sun sits close to the plant.
    await shroom.click()
    await page.waitForTimeout(220)
    const cap = await plant.evaluate((g) => {
      const r = g.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 3 }
    })
    const start = await page.locator('[data-sun]').first().evaluate((g) => {
      const r = g.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    })
    assert.ok(Math.hypot(start.x - cap.x, start.y - cap.y) < 40, 'the sun starts at the cap')
    assert.equal(await page.locator('[data-sun]').first().getAttribute('data-sun-size'), 'small')

    for (let i = 0; i < 3; i++) {
      if (i > 0) await shroom.click()
      await page.waitForTimeout(1000)
      await page.getByRole('button', { name: 'Collect the sun' }).first().click()
      await page.waitForTimeout(700)
    }
    assert.equal(await plant.getAttribute('data-grown'), 'true', 'three collected small suns grow it')

    await page.waitForTimeout(1100)
    await shroom.click()
    await page.waitForTimeout(1000)
    assert.equal(
      await page.locator('[data-sun="idle"]').last().getAttribute('data-sun-size'),
      'normal',
      'once grown it gives normal suns',
    )
    await context.close()
  }

  assert.deepEqual(errors, [])
  console.log('sunshroom: asleep by day, small suns at night, growth and normal suns all PASS')
} finally {
  await browser.close()
}
```

- [ ] **Step 2: Run it**

With the dev server running on 5181:
Run: `node scripts/verify-sunshroom.mjs`
Expected: `sunshroom: ... all PASS`.

- [ ] **Step 3: Commit**

```bash
git add scripts/verify-sunshroom.mjs
git commit -m "Check the Sun-shroom by day and by night in a real browser

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: Docs and full verification

**Files:**
- Modify: `docs/DESIGN_CONTRACT.md` (append after the last dated entry)
- Modify: `docs/superpowers/specs/2026-09-16-day-night-sunshroom-design.md`

- [ ] **Step 1: Add the contract entry**

Append to `docs/DESIGN_CONTRACT.md`, after the last dated paragraph, separated by a blank line:

```markdown
2026-09-16 owner-approved day and night, and the Sun-shroom: **the room follows the visitor's own day and night.** Auto reads the browser's time zone, places the visitor at that zone's principal city (`src/daylight/zoneCoords.ts`, generated from tzdb by `scripts/build-zone-coords.mjs`) and asks whether the sun is above the horizon there (`src/daylight/solar.ts`). There is no IP lookup and no network call. A top-bar button swaps day and night; the choice is kept in `tho-vn:phase` only while it differs from the clock. **Day** is the daylight view described above with a light cream UI (`src/day.css`); **night** brings back the original night view (moon, twinkling stars, blinking city lights, moonlight on the floor) and dims the room with a navy layer that leaves the window, laptop screen, tower glow and lamp bright. The locked references keep their identity; only the light over them changes. The **Sun-shroom** from Plants vs. Zombies (`src/art/SunShroom.tsx`) stands on the floor line at x 62–77, right of the Sunflower's pot. The sun spot that was at (56, 130) moved to (80, 132) to make room. As in the game it sleeps by day (shut eyes, rising Zs, no sun) and works at night: small suns at half size, and after the visitor collects three of them it grows and gives normal suns. The game's two-minute timer was replaced on purpose, since visits are shorter. Growth is not saved. Like the Sunflower it is a desktop and landscape feature. Checked by `scripts/verify-daylight.mjs` and `scripts/verify-sunshroom.mjs`; `verify-hover.mjs` pins day because the night dimming shifts the rim colour it measures.
```

- [ ] **Step 2: Record the deviations in the spec**

In `docs/superpowers/specs/2026-09-16-day-night-sunshroom-design.md`, replace the bullet that starts with `` - `suncalc` (v2, npm) supplies `` with:

```markdown
- `solar.ts` computes the sun's altitude with the USNO approximate solar coordinates formula: above 0° is `day`, otherwise `night`. Polar day and polar night fall out of the altitude check without special cases. (This replaces the `suncalc` dependency first planned: its v2 API changed in 2026 and could not be verified, and about 30 tested lines do the same job.)
```

Replace the bullet that starts with `` - `nextChange(now, lat, lon)` `` with:

```markdown
- `nextPhaseChange(now, lat, lon)`: scans ahead in 10-minute steps for up to 48 hours and refines the flip to the minute. Returns `null` under polar day or night, and the provider then re-checks hourly.
```

Replace the bullet that starts with `` - Day: `:root[data-phase='day']` overrides the colour tokens `` and the bullet after it (`- Only colour tokens change...`) with:

```markdown
- Day: `src/day.css` recolours the top bar, dialogue, choice menu, hover labels and art notice under `:root[data-phase='day']`, using the CV paper's cream (`#efe6cf`) for surfaces, navy/ink for text and the same red, ochre and teal accents. `color-scheme` becomes `light`.
- Only colours change; layout, spacing and type are untouched. The overrides live in their own file rather than as a token refactor of `styles.css`, because that file layers hard-coded colours and the night UI must stay exactly as it is.
```

- [ ] **Step 3: Run everything**

Run: `npm test`
Expected: PASS, 8 tests.

Run: `npm run build`
Expected: `✓ built`.

Start the dev server on 5181, then run each of these and expect PASS or a clean exit:

```bash
node scripts/verify-daylight.mjs
node scripts/verify-sunshroom.mjs
node scripts/verify-sunflower.mjs
node scripts/verify-hover.mjs
node scripts/verify-fan.mjs
node scripts/verify-interactions.mjs
```

`scripts/verify-room.mjs` expects port 5179, and it was already failing before this work because it looked for the old "Open CV" hotspot name (fixed in commit 95d0d94). Run it with the server on 5179 and report its result as it is.

- [ ] **Step 4: Inspect the final screenshots**

Re-open `artifacts/daylight-*.png` from the `verify-daylight` run and confirm day and night both read well at desktop and phone size. On a desktop viewport in each phase, take one more screenshot showing the Sun-shroom (grown and small, asleep and awake), and look at it directly.

- [ ] **Step 5: Commit**

```bash
git add docs/DESIGN_CONTRACT.md docs/superpowers/specs/2026-09-16-day-night-sunshroom-design.md
git commit -m "Record day, night and the Sun-shroom in the design contract

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

Do not merge to `main` or push unless the owner asks.
