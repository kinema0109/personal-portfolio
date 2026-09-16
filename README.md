# Hoàng Công Thọ: visual novel portfolio (prototype)

A short, choice-driven visual novel. Visitors pick what to ask Thọ and get an answer, a project, or a piece of the CV.

This is a **review prototype**. The artwork is a placeholder drawn in code (see [Missing content](#missing-content-and-artwork)).

- React 19 + TypeScript + Vite 7, plain CSS
- No backend, no auth, no paid services, no game engine
- All visitor-facing text lives in typed data files under `src/content/`

## Run it

Requires **Node.js 20.19+** (22 or 24 recommended).

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run typecheck  # tsc --noEmit
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ on http://localhost:4173
```

> If you use nvm-windows and `node -v` shows an old version, run `nvm use 24` first.

## How it works

| Where | What |
| --- | --- |
| Intro | Two-step introduction, then three questions: *What have you worked on?* · *How do you work?* · *What about outside work?* |
| Branch 1: Work | Career summary and stack, 3 featured projects (CBPO, CA2T, TheAvoTree), archive of all 7 projects, and a detail page for each (context, role, contributions, technologies) |
| Branch 2: How I work | How Thọ uses AI-assisted tools, then three deep dives: moving production MongoDB from Atlas to 6 self-hosted GCP VMs (CBPO), the real-time webhook listener (TheAvoTree), role-based access control (CA2T) |
| Branch 3: Outside work | Gaming background, then the album on the desk |
| Gallery | Pixel-art album that **only** opens by clicking the photo album on the desk (no menu or dialogue choice leads there). One picture at a time with no titles or captions; Prev/Next or arrow keys to browse, Esc or Close to leave |
| Explore the room | There are no shortcut buttons: click the **laptop** for projects, the **album** for the gallery and the **desk drawer** (a CV sheet peeks out) for the CV. The sword frames and display cabinet are personal references and do not open; each boxed Fire Emblem game on the bottom shelf shows its name on hover or tap. Hotspots show a label on hover/focus and are hidden while covered by the UI |
| Always available | Top bar: name (goes home) and sound toggle (off by default). Dialogue box: **Back**, **Home** |

Controls: click or tap anything; click the dialogue text (or **Next ▼**) to advance. Keyboard: `Enter`/`Space` advance the dialogue (or activate the focused button), `Tab` to move, `1`–`9` to pick a choice, `Esc` to go back (one dialogue step, then one place).

Visual-novel conventions (see `docs/ui/vn-dialogue-hud-audit.md`):
- The textbox has **one fixed height** per layout: the text area is sized to the longest dialogue step in the current language, the portrait and advance slots are always reserved, so the box and the room never jump between lines.
- **Choices appear only after the last line**, in a menu drawn over the room above the textbox. The room does not move or zoom when the menu appears; hotspots covered by the menu are not offered until it closes.

Layout (fullscreen, the page never scrolls):
- The pixel scene fills the whole screen at any size. A camera (`src/art/camera.ts`) reframes it so the desk and person stay in the area not covered by the UI, at whole-number pixel scales when possible.
- **Desktop / tablet**: fixed-height dialogue box along the bottom with a portrait, the speaker name and Back/Home controls; choices appear in a menu above it after the last line. Project, CV and gallery panels open as a card on the right, and the room shifts left.
- **Phone (portrait)**: the dialogue sits at the bottom, choices stack, and panels sit above the dialogue.
- **Phone (landscape)**: the panel gets its own column next to the dialogue.
- The scene reacts to the conversation: the laptop shows code, a diagram, a small game or documents depending on the branch, and a speech bubble appears while Thọ is speaking.

Motion (all stepped, to match the pixel art):
- **Reveal**: dialogue lines step in one after another, then the choices. Panels slide in with their sections staggered. It finishes in under half a second and never blocks clicks.
- **Talking portrait**: Thọ's mouth flaps a few times while a new line appears.
- **Camera glide**: when a panel opens or closes, the room moves over in 5 frames instead of jumping. Dialogue steps, resizes and zoom changes still snap.
- **Iris**: the first load opens with a stepped circle wipe.
- **Album glint**: the album on the desk flashes a small glint every few seconds until the visitor opens the gallery. This is remembered per browser (localStorage) and comes back when pictures are added.
- **Album viewer**: opens as a full-screen dialog over the room.
- `prefers-reduced-motion` stops all of the above except a plain short fade on new content. Dialogue never uses a typewriter effect.

## Editing content

| File | Contains |
| --- | --- |
| `src/content/i18n/en.ts` | **All visitor-facing text**: dialogue, choices, project text, CV text, UI labels |
| `src/content/site.ts` | Name, CV file path, contact links, review flags |
| `src/content/story.ts` | Conversation structure: nodes, step status/sources and choice targets |
| `src/content/projects.ts` | Project facts (name, company, dates, featured flag, technologies) |
| `src/content/gallery.ts` | Pixel-art album pictures (file and screen-reader alt text; nothing else is shown) |
| `src/content/cv.ts` | CV structure (companies, dates, GPA) |
| `src/content/types.ts` | Types for all of the above, including `LocaleContent` |

### Languages

English only for now; Vietnamese and Japanese will be added once Thọ's own translations are ready (the earlier drafts are in git history, commit `bcc8d86`). The i18n structure stays in place, and the language buttons appear automatically once more than one language is enabled.

To add a language:
1. Add its code to `Locale` in `src/content/types.ts`.
2. Copy `src/content/i18n/en.ts` to e.g. `vi.ts` and translate it. Story steps are fixed-length tuples in `LocaleContent`, so a missing or extra step fails `npm run typecheck`.
3. Register it in `CONTENT` (`src/content/index.ts`) and `LOCALES` (`src/i18n/locale.ts`).
4. `translationStatus: 'draft'` shows a "draft translation" tag in review mode; set it to `'ready'` when the wording is final.

Proper nouns, technology names, dates, gallery titles and the CV PDF are not translated.

Rules the data follows:
- A dialogue step has **one to three lines**, each one or two sentences (`lines` is a 1-, 2- or 3-tuple).
- Every step has a `status`:
  - `ready`: fact from the CV (or from Thọ directly) or neutral framing text
  - `draft`: wording that **Thọ must confirm**. Shown with a red "Draft · needs Thọ to confirm" tag. (None at the moment.)
  - `placeholder`: real content not supplied yet
- Project text comes from the CV (Full-Stack Developer edition), with the CBPO six-VM detail confirmed by Thọ directly. Older details that the current CV no longer lists (BuyBox/competitor tracking, Chart.js, Tailwind on CA2T and SingleKey, Django on SingleKey, BMAD, Flutter/Swift parity, iKara Android/iOS sync) were confirmed by Thọ to stay. The one-line context for Suzu.net, iKara Admin CMS and Yokara also uses the products' public pages (suzu.net, the iKara App Store listing, inmobivn.com).
- Contact `value: null` shows "Not provided yet".

`review.showArtworkNotice` is already `false` (no "Placeholder art" notice or "Temp" portrait tag). Set `review.showContentStatus` to `false` in `site.ts` as well before the final release to hide draft/placeholder tags.

### Adding gallery pictures

Put the images in `public/gallery/` and list each one in `src/content/gallery.ts`:

```ts
{ file: 'gallery/rooftop.png', alt: 'Pixel art of a rooftop at night' }
```

Pictures are drawn with `image-rendering: pixelated`, so export pixel art at its native size (or an exact multiple) rather than a smoothed upscale. While the list is empty, the panel shows empty frames and a placeholder note.

### Replacing the artwork

- `src/art/ApartmentScene.tsx`: the room. The core is 320×180 pixels, and wall and floor extend in every direction so wide or tall screens never show empty space.
- `src/art/Portrait.tsx`: 16×16 dialogue portrait, with an open-mouth frame for the talking animation
- `src/art/palette.ts`: shared palette

The scene exports a `primary` focus rect (must stay visible) and a `secondary` one (shown whole when there is room). To use a finished PNG instead, draw it as an SVG `<image>` in scene coordinates so the camera keeps working, and give it extra background around the edges for wide and tall screens. If the album moves, update `ALBUM_BOX` so the clickable hotspot still lines up.

## Missing content and artwork

**Artwork (all placeholder, coming later)**
- [ ] Final pixel-art room, developer figure (a character, not a portrait) and album
- [x] Gallery pictures → `public/gallery/` + `src/content/gallery.ts` (six approved images)
- [ ] Optional: favicon and social preview image

**To confirm**
- [ ] GitHub and LinkedIn links in `site.ts` (taken from Thọ's previous portfolio; the CV shows the icons but not the URLs)

**Deliberately not included**: screenshots, client quotes, demo links, the CV PDF, and the phone number.

## Project structure

```
src/
  art/          pixel-art scene + portrait (placeholder), palette, camera framing
  components/   Scene, DialogueBox, ProjectDetail, CvPanel, GalleryPanel, StatusTag
  content/      typed, editable content (see above)
  hooks/        useBlip (optional sound), useFreeRegion (uncovered screen area)
  state/        navigation reducer (history, back/home) + view builder
  App.tsx       wiring, keyboard shortcuts, focus management
  styles.css    all styles (tokens, desktop/mobile, motion, reduced motion)
public/gallery/ pixel-art pictures for the album
```
