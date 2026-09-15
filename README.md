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
| Gallery | Pixel-art album opened by clicking the photo album on the desk (on the intro and outside-work nodes), a top-bar button, or a choice. Thumbnails open a full-size lightbox (arrow keys / Prev / Next, Esc or backdrop to close) |
| Always available | Top bar: **Projects**, **Gallery**, **CV**, sound toggle (off by default). Dialogue box: **Back**, **Home**, **Projects** |

Controls: click or tap anything. Keyboard: `Tab` to move, `Enter`/`Space` to activate, `1`–`9` to pick a choice, `Esc` to go back (one dialogue step, then one place).

Layout (fullscreen, the page never scrolls):
- The pixel scene fills the whole screen at any size. A camera (`src/art/camera.ts`) reframes it so the desk and person stay in the area not covered by the UI, at whole-number pixel scales when possible.
- **Desktop / tablet**: compact dialogue box along the bottom with a portrait, a speaker tag, Back/Home/Projects controls and choices in columns. Project, CV and gallery panels open as a card on the right, and the room shifts left.
- **Phone (portrait)**: the dialogue sits at the bottom, choices stack, and panels sit above the dialogue.
- **Phone (landscape)**: the panel gets its own column next to the dialogue.
- The scene reacts to the conversation: the laptop shows code, a diagram, a small game or documents depending on the branch, and a speech bubble appears while Thọ is speaking.

Motion (all stepped, to match the pixel art):
- **Reveal**: dialogue lines step in one after another, then the choices. Panels slide in with their sections staggered. It finishes in under half a second and never blocks clicks.
- **Talking portrait**: Thọ's mouth flaps a few times while a new line appears.
- **Camera glide**: when a panel opens or closes, the room moves over in 5 frames instead of jumping. Dialogue steps, resizes and zoom changes still snap.
- **Iris**: the first load opens with a stepped circle wipe.
- **Album glint**: the album on the desk flashes a small glint every few seconds until the visitor opens the gallery. This is remembered per browser (localStorage) and comes back when pictures are added.
- **Lightbox**: the gallery viewer fades and scales in and out.
- `prefers-reduced-motion` stops all of the above except a plain short fade on new content. Dialogue never uses a typewriter effect.

## Editing content

| File | Contains |
| --- | --- |
| `src/content/site.ts` | Name, role, CV file path, contact links, review flags |
| `src/content/story.ts` | Conversation nodes, dialogue steps and choices |
| `src/content/projects.ts` | All projects (featured flag, context, role, contributions, technologies) |
| `src/content/gallery.ts` | Pixel-art album pictures (file, title, alt text, optional credit) |
| `src/content/cv.ts` | HTML summary of the CV (experience, education, languages) |
| `src/content/types.ts` | Types for all of the above |

Rules the data follows:
- A dialogue step has **one to three lines**, each one or two sentences (`lines` is a 1-, 2- or 3-tuple).
- Every step has a `status`:
  - `ready`: fact from the CV (or from Thọ directly) or neutral framing text
  - `draft`: wording that **Thọ must confirm**. Shown with a red "Draft · needs Thọ to confirm" tag. (None at the moment.)
  - `placeholder`: real content not supplied yet
- Project text comes from the CV, with the CBPO migration details (6 GCP VMs, 100GB–1.6TB databases) from Thọ directly. The one-line context for Suzu.net, iKara Admin CMS and Yokara also uses the products' public pages (suzu.net, the iKara App Store listing, inmobivn.com).
- Contact `value: null` shows "Not provided yet".

Before going to production, set `review.showContentStatus` and `review.showArtworkNotice` to `false` in `site.ts`, once the artwork and gallery are in.

### Adding gallery pictures

Put the images in `public/gallery/` and list each one in `src/content/gallery.ts`:

```ts
{ file: 'gallery/rooftop.png', title: 'Rooftop at night', alt: 'Pixel art of a rooftop at night', credit: '…' }
```

Pictures are drawn with `image-rendering: pixelated`, so export pixel art at its native size (or an exact multiple) rather than a smoothed upscale. While the list is empty, the panel shows empty frames and a placeholder note.

### The CV

The PDF lives at `public/cv/hoang-cong-tho-cv.pdf`. The app checks at runtime that the file exists and is a PDF, and shows **"CV not added yet"** otherwise. The PDF includes a phone number and date of birth, so anyone who opens the site can read them.

### Replacing the artwork

- `src/art/ApartmentScene.tsx`: the room. The core is 320×180 pixels, and wall and floor extend in every direction so wide or tall screens never show empty space.
- `src/art/Portrait.tsx`: 16×16 dialogue portrait, with an open-mouth frame for the talking animation
- `src/art/palette.ts`: shared palette

The scene exports a `primary` focus rect (must stay visible) and a `secondary` one (shown whole when there is room). To use a finished PNG instead, draw it as an SVG `<image>` in scene coordinates so the camera keeps working, and give it extra background around the edges for wide and tall screens. If the album moves, update `ALBUM_BOX` so the clickable hotspot still lines up.

## Missing content and artwork

**Artwork (all placeholder, coming later)**
- [ ] Final pixel-art room, developer figure (a character, not a portrait) and album
- [ ] Gallery pictures → `public/gallery/` + `src/content/gallery.ts`
- [ ] Optional: favicon and social preview image

**To confirm**
- [ ] GitHub and LinkedIn links in `site.ts` (taken from Thọ's previous portfolio; the CV shows the icons but not the URLs)
- [ ] "03/2025 – present" for HDWEBSOFT is still current

**Deliberately not included**: screenshots, client quotes, demo links, and the phone number and date of birth (these are only in the PDF).

## Project structure

```
src/
  art/          pixel-art scene + portrait (placeholder), palette, camera framing
  components/   Scene, DialogueBox, ProjectDetail, CvPanel, GalleryPanel, StatusTag
  content/      typed, editable content (see above)
  hooks/        useCvFile (PDF presence check), useBlip (optional sound), useFreeRegion (uncovered screen area)
  state/        navigation reducer (history, back/home) + view builder
  App.tsx       wiring, keyboard shortcuts, focus management
  styles.css    all styles (tokens, desktop/mobile, motion, reduced motion)
public/cv/      the CV PDF
public/gallery/ pixel-art pictures for the album
```
