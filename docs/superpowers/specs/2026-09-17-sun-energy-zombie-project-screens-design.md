# Sun energy, a night zombie, and a PC screen per project

Status: approved by owner (2026-09-17)

Three independent room features, built in this order. Each one ships and is verified on its own.

## 1. Sun energy

Collecting a sun already flashes Thọ. From now on it also gives him energy, and energy makes him work faster.

### Energy

- Energy is a number of seconds, from 0 to 60.
- Every collected sun adds 20 s, capped at 60. This counts both sizes: the Sunflower's suns and the Sun-shroom's small and normal suns.
- Energy drains continuously at 1 s per second until it reaches 0.
- It lives in `Scene.tsx` state and is not persisted: a reload starts at 0.
- It works the same by day and by night.

### Tier

Speed follows the current energy, so Thọ slows down as it drains:

| Energy | Tier |
| --- | --- |
| 0 | 0 |
| 1–20 s | 1 |
| 21–40 s | 2 |
| 41–60 s | 3 |

### Showing how much is left: the glow inside Thọ

- A warm glow, the same `#ffe27a` as the existing collect flash, fills Thọ's own silhouette (`developerBody` plus `developerArm`) from the waist up.
- The fill height is proportional to energy / 60: full energy reaches the shoulders, and 0 shows no glow.
- The top edge moves in whole scene units, so it drops pixel by pixel as energy drains.
- The glow sits at about 45% opacity, so the red shirt still reads through it.
- It is drawn inside the `f-breathe` group, so it breathes with him.
- The existing collect flash is unchanged and plays on top.
- There is no number and no separate bar. This is the owner's choice: the glow inside the body is the bar.

### Working faster

| Tier | Typing loop (`f-type-a/b`) | Screen code swap (`f-code-a/b`) | Build bar fills in |
| --- | --- | --- | --- |
| 0 | 2.4 s (today) | 5 s (today) | hidden |
| 1 | 1.6 s | 3.5 s | 12 s |
| 2 | 1.1 s | 2.2 s | 7 s |
| 3 | 0.7 s | 1.2 s | 4 s |

- The tier is applied as a class on the scene SVG (`energy-0` … `energy-3`), and the CSS changes `animation-duration`.
- While Thọ is speaking his hands rest, as today; the screen and the build bar keep going.

### Build bar

- A 1-unit-high bar on the bottom row of the PC screen. It is shown in every screen mode, including the per-project screens (section 3).
- It fills left to right while the tier is above 0.
- When full, the screen shows a pixel "OK ✓" for about 1 s, then a new build starts if energy remains.
- If energy runs out mid-build, the bar hides. The next build starts from empty.

### Accessibility

- Everything here is decorative and hidden from assistive technology.
- Under reduced motion there are no animations: the glow still shows its level, and the build bar and the OK flash stay hidden.

## 2. Zombie at night

- Only at night, walking past the window.
- **Timing:**
  - The first zombie comes a random 10–20 s after night begins (on load or on switching to night).
  - After that, one comes every random 40–90 s.
- **Look:** a small Plants vs. Zombies basic zombie drawn in code: brown coat, red tie, grey-green skin, arms held forward.
- **Walk:** it shambles in whole-pixel steps from right to left along the foot of the skyline inside the window, and takes about 8 s to cross.
- It is clipped to the window glass (26, 22, 74 × 70), so it never shows outside the window.
- It cannot be clicked.
- Switching to day removes it immediately.
- Under reduced motion no zombie appears.

## 3. A PC screen per project

The desk screen belongs to a PC, not a laptop. The code names change to match (`LAPTOP_BOX` → `PC_BOX`, `laptopFrame` → `pcFrame`, the hotspot id `laptop` → `pc`). The visible hotspot label "See projects" is unchanged.

### When a project screen shows

- **While a project's detail panel is open:** that project's diagram.
- **In the story nodes about a project** (each project's `relatedNode`):
  - `how-migration` shows CBPO.
  - `how-events` shows TheAvoTree.
  - `how-roles` shows CA2T.
- **Everywhere else:** the existing section screens (`code`, `diagram`, `game`, `docs`), unchanged.

### What a diagram is

- 3–5 pixel icons inside the 40 × 26 screen (x 198–237, y 74–99), joined by 1-unit lines.
- Bright dots travel along the lines like data flowing, in whole-pixel steps.
- The bottom row (y 99) is left free for the build bar.
- Every element is taken from the CV text in `src/content/i18n/en.ts` and `src/content/projects.ts`. Nothing about the architecture is invented.
- The icons are drawn once and shared: browser window, server box, database cylinder, cloud, phone, person, padlock, chart, gear, coin, shopping cart and wave.

| Project | Diagram (from the CV) |
| --- | --- |
| CBPO | web (Vue.js) → API (Django) → PostgreSQL cylinder and MongoDB cylinder; a GCP cloud holding 6 small VM squares |
| CA2T | two people (admin, learner) → padlock (RBAC) → web (React) → server (Django) → PostgreSQL |
| TheAvoTree | cart (WooCommerce) ⇢ webhook wave → server (NestJS) → MongoDB → chart (React dashboard) |
| SingleKey | web (Next.js landing) → stacked component blocks → A/B chart (VWO) → server (Django) |
| Suzu.net | web (Next.js) ⇄ wave (Supabase Realtime, WebSockets) → PostgreSQL; a Vercel triangle |
| iKara Admin CMS | web (React CMS) → server (Java) → coin (virtual store) → two phones (Android, iOS); a Jenkins gear |
| Yokara | phone (Flutter/Swift) → server (Express/Firebase) with padlock (JWT) → MongoDB |

- Under reduced motion the diagrams show, with the data dots still.
- The screens are decorative. The panel text already describes each project to assistive technology.

## Verification

Checks follow the existing `scripts/verify-*.mjs` pattern: Playwright with Edge, against the dev server.

- `scripts/verify-energy.mjs`:
  - no glow and tier 0 on load;
  - collecting one sun gives tier 1 and a glow;
  - three suns give tier 3 and a taller glow;
  - with a fixed clock advanced 21 s, the tier drops by one and the glow is lower;
  - the build bar appears with energy and hides at 0;
  - the typing animation duration matches the tier.
- `scripts/verify-zombie.mjs`: with the clock controlled and night forced, a zombie appears within 20 s, walks from right to left, and stays inside the window; by day no zombie appears.
- `scripts/verify-project-screens.mjs`: opening each project's panel shows that project's diagram (`data-screen="project:<id>"`); the related story nodes show theirs; other places keep their section screen.
- Existing checks still pass: `verify-sunflower`, `verify-sunshroom`, `verify-hover`, `verify-daylight`, `verify-interactions`, `verify-room`, `verify-album`, `verify-fan`.
- Screenshots of the glow at three levels, of a zombie mid-walk, and of all 7 project screens, inspected directly.

## Out of scope

- Persisting energy, a numeric energy display, or energy affecting the dialogue text (it already appears at once).
- Clicking the zombie, or zombies by day.
- A large readable diagram inside the project panel.
- Changing the IP or day/night logic.
