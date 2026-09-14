# Hoàng Công Thọ: visual novel portfolio (prototype)

A short, choice-driven visual novel. Visitors pick what to ask Thọ and get a short answer, a project, or a piece of the CV.

This is a **review prototype**. The artwork is a placeholder drawn in code, and some text is marked as draft or placeholder (see [Missing content](#missing-content-and-artwork)).

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
| Intro | Three questions: *Bạn đã làm gì?* · *Bạn làm việc thế nào?* · *Ngoài giờ làm thì sao?* |
| Branch 1: Work | Short intro, 3 featured projects (CBPO, CA2T, TheAvoTree), archive of all 7 projects, and a detail page for each (context, role, contributions, technologies) |
| Branch 2: How I work | Three concrete CV items: MongoDB migration (CBPO), webhooks/event integration (TheAvoTree), role-based access (CA2T). Each has a CV fact step and a **draft** first-person step |
| Branch 3: Outside work | Confirmed gaming background, three memory slots (placeholders), and the optional poster → rat-mechanic workshop scene |
| Always available | Top bar: **Dự án**, **CV**, audio toggle (off by default). Dialogue box: **Quay lại**, **Về đầu**, **Dự án** |

Controls: click or tap anything. Keyboard: `Tab` to move, `Enter`/`Space` to activate, `1`–`9` to pick a choice, `Esc` to go back (one dialogue step, then one place).

Layout (fullscreen, the page never scrolls):
- The pixel scene fills the whole screen at any size. A camera (`src/art/camera.ts`) reframes it so the desk, person and poster stay in the area not covered by the UI, at whole-number pixel scales when possible.
- **Desktop / tablet**: compact dialogue box along the bottom with a portrait, a speaker tag, Back/Home/Dự án controls and choices in columns. Project, CV and memory panels open as a card on the right, and the room shifts left.
- **Phone (portrait)**: the dialogue sits at the bottom, choices stack, and panels sit above the dialogue.
- **Phone (landscape)**: the panel gets its own column next to the dialogue.
- The scene reacts to the conversation: the laptop shows code, a diagram, a small game or documents depending on the branch, and a speech bubble appears when Thọ or the mechanic is speaking.
- `prefers-reduced-motion` stops all idle animation (fan, typing, breathing, stars, city lights, speech dots). Dialogue never uses a typewriter effect.

## Editing content

| File | Contains |
| --- | --- |
| `src/content/site.ts` | Name, role, CV file path, contact links, review flags |
| `src/content/story.ts` | Conversation nodes, dialogue steps and choices |
| `src/content/projects.ts` | All projects (featured flag, context, role, contributions, technologies) |
| `src/content/memories.ts` | Gaming memory slots |
| `src/content/cv.ts` | HTML summary of the CV (experience, education, languages) |
| `src/content/types.ts` | Types for all of the above |

Rules the data follows:
- A dialogue step has **at most two short sentences** (`lines` is a 1- or 2-tuple).
- Every step has a `status`:
  - `ready`: fact from the CV or neutral framing text
  - `draft`: proposed first-person reasoning that **Thọ must confirm**. Shown with a red "Bản nháp · cần Thọ xác nhận" tag.
  - `placeholder`: real content not supplied yet
- `project.context = null` shows "CV chưa có mô tả bối cảnh cho dự án này".
- Contact `value: null` shows "Chưa bổ sung".

Before going to production, set `review.showContentStatus` and `review.showArtworkNotice` to `false` in `site.ts`, but only after every draft and placeholder is resolved.

### Adding the CV

Put the PDF at `public/cv/hoang-cong-tho-cv.pdf`. The app checks at runtime that the file exists and is a PDF. Until then, the CV panel shows **"CV chưa được thêm"** instead of a broken link.

### Replacing the artwork

- `src/art/ApartmentScene.tsx`: main room. The core is 320×180 pixels, and wall and floor extend in every direction so wide or tall screens never show empty space.
- `src/art/WorkshopScene.tsx`: optional rat-mechanic workshop
- `src/art/Portrait.tsx`: 16×16 dialogue portraits (placeholders)
- `src/art/palette.ts`: shared palette

Each scene exports a `primary` focus rect (must stay visible) and a `secondary` one (shown whole when there is room). To use a finished PNG instead, draw it as an SVG `<image>` in scene coordinates so the camera keeps working, and give it extra background around the edges for wide and tall screens. If the poster moves, update `POSTER_BOX` so the clickable hotspot still lines up.

## Missing content and artwork

**Artwork (all placeholder)**
- [ ] Final pixel-art apartment scene (the current one is drawn in code; the composition matches the brief)
- [ ] Thọ's likeness for the developer at the desk (the current figure is a generic human placeholder)
- [ ] Final rat-mechanic workshop illustration (current one is original placeholder art, with no franchise assets or symbols)
- [ ] Final poster design (current: original cog/wrench/tail symbol)
- [ ] Optional: favicon and social preview image

**Files and links**
- [ ] CV PDF → `public/cv/hoang-cong-tho-cv.pdf`
- [ ] Email, GitHub and LinkedIn → `src/content/site.ts`

**Text to confirm or supply**
- [ ] Branch 2: confirm or rewrite the three `draft` steps in `story.ts` (`how-migration`, `how-events`, `how-roles`). The CV says *what* was done, not *how Thọ reasoned about it*.
- [ ] Branch 3: game titles and memories for all three slots in `memories.ts` (*Những game đầu tiên*, *Game mình vẫn quay lại*, *Điều mình thích bây giờ*)
- [ ] Rat-mechanic scene: why it is in the portfolio (placeholder step in `story.ts`, node `rat`)
- [ ] Project context for **Suzu.net**, **iKara Admin CMS** and **Yokara** (not described in the CV)
- [ ] Confirm the Vietnamese wording of CV items (translated from the English CV) and company name casing (HDWEBSOFT, SUZU GROUP, INMOBIVN)
- [ ] Confirm "03/2025 – nay" for HDWEBSOFT is still current

**Deliberately not included** (not in the CV): screenshots, client quotes, demo links, results/metrics, years-of-experience figures.

## Project structure

```
src/
  art/          pixel-art scenes + portraits (placeholder), palette, camera framing
  components/   Scene, DialogueBox, ProjectDetail, MemoryPanel, CvPanel, StatusTag
  content/      typed, editable content (see above)
  hooks/        useCvFile (PDF presence check), useBlip (optional sound), useFreeRegion (uncovered screen area)
  state/        navigation reducer (history, back/home) + view builder
  App.tsx       wiring, keyboard shortcuts, focus management
  styles.css    all styles (tokens, desktop/mobile, reduced motion)
public/cv/      CV asset slot
```
