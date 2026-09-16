# Day and night, and a Sun-shroom

Status: approved by owner (2026-09-16)

## Goal

The room follows the visitor's day and night. A top-bar button swaps day and night by hand. A Plants vs. Zombies Sun-shroom joins the Sunflower by the window: asleep by day, awake at night, small at first and grown later, the way it behaves in the game.

## Owner decisions

| Question | Decision |
| --- | --- |
| What the switch changes | The room (window view, lighting, the Sun-shroom waking up) and the UI (top bar, dialogue, panels) |
| How auto decides | The visitor's own timezone and clock, plus the sun's real position. No IP lookup and no network call |
| The button | One top-bar button next to the sound toggle. Clicking swaps to the other phase |
| UI in each phase | Night keeps today's dark UI. Day gets a light cream/paper variant of the same palette |
| How the Sun-shroom works | Click to drop a sun, like the Sunflower. Collecting 3 small suns grows it |
| The two plants by day and night | As in the game. Day: Sunflower works, Sun-shroom sleeps. Night: both work |

## Revisions during implementation (owner, 2026-09-16)

These override the sections below wherever they disagree.

1. **Night changes brightness only, never colour.** There is no night window view (no moon, stars or city lights) and no light UI for day. Night is the same daylight room under a navy dimming layer (`C.night`, opacity 0.4). Only the laptop screen (not Thọ's arm and hands over it), the tower's lit strips and the lamp's bulb are masked out, each cut to its own pixels. The UI, including the dialogue box, the top bar and the browser chrome colour, is identical in both phases. `src/day.css` was built and then removed.
2. **The Sun-shroom sits in its own pot, smaller than the Sunflower's**, in the same pot colours: rim x 63–76, 10 units tall, on the floor line y = 146. The plant sits on its soil at y = 136.
3. **The solar position is hand-written** (USNO approximate solar coordinates, `src/daylight/solar.ts`) instead of using `suncalc`. `nextPhaseChange` scans ahead in 10-minute steps for up to 48 hours.
4. **The zone table reads `zone.tab` first**, then `zone1970.tab`, then the `backward` aliases. `zone1970.tab` folds country zones into another country's group (Reykjavik into Abidjan, Réunion into Dubai). The table has 549 entries, not about 300.
5. `PhaseProvider` wraps `App` in `main.tsx`, not inside `App.tsx`.

## Research basis

An IP address carries no time, only an approximate location. The visitor's device already knows the time and the timezone, so an IP lookup would only add latitude and longitude. The free browser-callable geo-IP APIs are unreliable: worldtimeapi.org has been sunset, ip-api.com has no HTTPS on its free tier, and ipapi.co's free tier is "not meant for production". Sending visitor IPs to a third party also has GDPR exposure (LG München I, 3 O 17493/20). The site is hosted on Vercel, whose `x-vercel-ip-latitude`/`-longitude` headers remain a possible later upgrade. They are out of scope here.

Sun-shroom facts (PvZ1; plantsvszombies.fandom.com/wiki/Sun-shroom_(PvZ); community reimplementation PvZ-Portable `Plant.cpp`/`Coin.cpp`):
- It gives small sun (15, drawn at half the normal sun's scale) and then normal sun (25) once it has grown. In the game it grows after 120 s awake.
- It sleeps by day unless a Coffee Bean wakes it. Its growth timer pauses while it sleeps.
- Cap: a gold dome (`#D89C00`), with a highlight at the upper left (`#FCD824`) and brown-orange spots (`#9C4800`): one large oval low in the centre and small dots near the top. Stem: short, cream (`#F0E4CC`), shaded on the right and bottom (`#C0A878`). Thick dark outline.
- The face is on the stem, not the cap: two small vertical black eyes with glints and a small smile.
- Asleep: the eyes are short curved lines, and white "Z"s float up and to the right from the cap, small then larger. Awake: a gentle sway and an occasional blink. Before a drop the whole plant brightens towards white, then the sun pops out.

## 1. Day/night phase

### Computing auto (`src/daylight/`)

- `timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone`.
- `zoneCoords.ts`: an IANA zone → `[lat, lon]` map for the principal city of each zone, taken from tzdb `zone1970.tab` (about 300 entries). If the zone is not in the map, use latitude 0 and longitude = −(`Date#getTimezoneOffset()` / 60) × 15.
- `suncalc` (v2, npm) supplies `getPosition(now, lat, lon).altitude`: above 0° is `day`, otherwise `night`. Polar day and polar night fall out of the altitude check without special cases.
- `nextChange(now, lat, lon)`: the next sunrise or sunset, from `suncalc.getTimes` for today and tomorrow. If neither exists (polar), return `null` and re-check in an hour.

### Manual override

- `localStorage` key `tho-vn:phase` holds `day` or `night`, and only while it differs from auto.
- Clicking the button sets the phase to the opposite of what is shown. If that equals auto, the key is removed, so the visitor is back on auto.
- Every storage read and write is in try/catch. If storage fails, the phase is auto.
- On load, a stored value that now equals auto is removed. Example: the visitor forced night in the evening and came back after dark.

### Keeping it current

- While on auto, a timer is set for `nextChange`. On `visibilitychange` to visible the phase is recomputed, because sleeping laptops and background tabs throttle timers.
- An override does not expire during the session.

### No flash on load

- An inline script in `index.html` `<head>` reads `tho-vn:phase` in try/catch. If it finds a value, it sets `document.documentElement.dataset.phase` before first paint. It does no sun maths.
- `main.tsx` computes the full phase (override or auto) and sets `data-phase` before `createRoot().render`.
- `<meta name="theme-color">` follows the phase.
- A visitor on auto whose auto is `day` gets the dark `body` background until the bundle runs. The window before the bundle runs is blank, so this is accepted.

### State in React

- `usePhase()` returns `{ phase, isOverride, toggle }` from a `PhaseProvider` in `App.tsx`. The provider owns the timer and the listeners and mirrors `phase` onto `<html data-phase>`.

### The button

- It sits in `.topnav`, before the sound button, styled like `nav-sound`.
- Visible text: `☀ Day` or `☾ Night` (the glyph is `aria-hidden`).
- `aria-label` is a fixed "Night mode" with `aria-pressed={phase === 'night'}`, so the label never changes while the pressed state flips.
- Strings: `ui.phase`, `ui.phaseDay`, `ui.phaseNight` in `LocaleContent`. Only `en` is enabled today, and `tsc` enforces the keys for any future locale.

### UI theme

- Night: the current tokens in `:root`, unchanged.
- Day: `:root[data-phase='day']` overrides the colour tokens with a light variant. The surfaces take the CV paper's cream (`#eadfc3` family), the text takes navy/ink, and the accents stay the same red, ochre and teal. `color-scheme` becomes `light`.
- Only colour tokens change. Layout, spacing and type are untouched. Any hard-coded colours in the top bar, dialogue box, choice menu and panels are moved onto tokens.

### Room

- `ApartmentScene` takes `phase`.
- Day: exactly today's scene.
- Night:
  - The window view is restored from commit `254f596`: night sky, moon, the blinking `starsA`/`starsB`, the city silhouette with blinking `cityLightsA`/`cityLightsB`, and the moonlight patches on the floor instead of the daylight ones.
  - A navy dimming layer (`C.night`, around 35% opacity) is drawn over the room. The laptop screen, the tower's RGB, the ceiling lamp's light and the suns are drawn above it, so they read as light sources. Exact opacity is tuned by eye on screenshots.
- `DESIGN_CONTRACT.md` reference identities are untouched: at night only the lighting over them changes, which the contract allows.

## 2. Sun-shroom

### Placement

- In its own small pot on the floor to the right of the Sunflower's pot (owner request: "a pot, but smaller"). The pot uses the Sunflower pot's colours at about two thirds its width: rim x 63–76, 10 units tall, standing on the room's floor line y = 146. The plant sits on its soil at y = 136, so the grown plant spans y 120–135 and the small one y 127–135.
- `SUN_SPOTS` entry `{ x: 56, y: 130 }` overlaps that spot and moves to free floor between the shroom and the desk leg (x 94). The exact coordinates are picked on a screenshot.
- Both plants share `SUN_SPOTS`, the cap on the number of suns, the fade timing and the flight into Thọ.
- Like the Sunflower, it is cropped away on portrait phones and tablets, so it is a desktop and landscape feature.

### Drawing (`src/art/SunShroom.tsx`)

- Code-drawn `Px` rectangles, matching `Sunflower.tsx`.
- The pot is static: it does not sway or grow, and it is included in the hover outline.
- Grown sprite about 16 × 16. Small sprite about 9 × 9, drawn separately rather than scaled, because a 0.5 scale breaks the pixel grid.
- Awake face: two vertical eyes with glints and a small smile. Asleep face: two short curved lines.
- A `ZZZ` group of small cream "Z" glyphs that rises up and to the right in steps and loops. It is shown only while asleep.
- Hover outline: `outlineOf` from `src/art/outline.ts` (one-unit rim on the silhouette), per the hover rule in `DESIGN_CONTRACT.md`.
- Exports `SUNSHROOM_BOX` for the hotspot, and the cap-centre toss origin for each size.

### Behaviour

| | Day | Night |
| --- | --- | --- |
| Look | Asleep face, looping Zs | Gentle sway, occasional blink |
| Click | A small shake and a burst of extra Zs. **No sun** | The plant flashes bright for about 200 ms, then tosses a sun from its cap |
| Sun | None | Small form: a 7 × 7 sun. Grown form: a normal 14 × 14 sun |
| Growth | Paused | Collecting the 3rd small sun grows it: a stepped scale from small to grown over about 1 s, then the grown sprite |

- Suns are collected exactly like the Sunflower's: click the sun and it flies into Thọ.
- Growth counts collected small suns, not dropped ones. A sun left to fade does not count.
- Growth resets on reload and is not persisted.
- Switching to day mid-way keeps the current size and the count, and the plant falls asleep.
- The Sunflower's behaviour is unchanged by phase.
- Suns are drawn above the night dimming layer.

### State and types

- `DroppedSun` gains `size: 'small' | 'normal'` and `from: 'sunflower' | 'shroom'`. `Sun` takes `size`, and its toss origin comes from `from` and size.
- `Scene.tsx` holds `shroomSmallSunsTaken: number` and `shroomGrown: boolean`. Its drop, take and fade flow is shared with the Sunflower.
- Hotspot: a `.hotspot` button over `SUNSHROOM_BOX`, gated by `isOffered` like the Sunflower's. Its `aria-label` is `ui.sunshroom` ("Shake the Sun-shroom") by night and `ui.sunshroomAsleep` ("The Sun-shroom is asleep") by day. Small suns use the existing `ui.sun`.
- The room description in `en.ts` mentions that the view follows the visitor's day and night, and that there is a Sun-shroom.

### Reduced motion

Under `prefers-reduced-motion: reduce`, the sway, the Zs' rise, the flash and the grow animation are off. Suns appear directly on their spot, as the Sunflower's already do.

## Verification

The project has no test runner, so checks follow the existing `scripts/verify-*.mjs` pattern (Playwright, Edge, dev server running):

- `scripts/verify-daylight.mjs`
  - With `timezoneId: 'Asia/Ho_Chi_Minh'` and a fixed clock, 12:00 renders `data-phase="day"` and 22:00 renders `night`.
  - A polar case: `Antarctica/Troll` (72° S, a canonical zone in `zone1970.tab`) on 1 January at 00:00 is `day`.
  - `data-phase` is present at `DOMContentLoaded`.
  - The toggle swaps the phase, the choice survives a reload, and toggling back to auto removes the storage key.
  - No page errors. Screenshots of both phases at desktop and mobile for direct inspection.
- `scripts/verify-sunshroom.mjs`
  - By day, clicking drops no sun and the Zs are present.
  - By night, a click drops a small sun that starts at the cap.
  - Collecting 3 small suns grows the plant, and the next sun is normal size.
  - No page errors.
- `scripts/verify-sunflower.mjs` is updated for the moved sun spot. `verify-hover.mjs` and `verify-room.mjs` still pass.
- `npm run build` passes.

## Out of scope

- IP geolocation of any kind, including the Vercel geo headers.
- A three-state auto/day/night control, and an in-room light switch.
- Coffee Bean, sun counters, scores and persisting the shroom's growth.
- Changing the Sunflower's behaviour, or any locked reference's identity.

## Docs

`DESIGN_CONTRACT.md` gets a dated owner-approved entry covering the night scene, the day UI theme and the Sun-shroom (placement, the moved sun spot, and growth after 3 collected suns).
