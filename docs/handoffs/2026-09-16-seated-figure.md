# Handoff: the figure at the desk

Owner: Hoàng Công Thọ · Date: 2026-09-16 · Status: **done** — Codex redrew the head in `823b710`. Kept for the record of what the rejected draft got wrong, and for the native-size check at the bottom, which is the part worth reusing.

Read `AGENTS.md` and `docs/DESIGN_CONTRACT.md` first, in particular the 2026-09-16 notes. This is the companion to `2026-09-16-portrait.md` / `2026-09-16-portrait-revision.md`, which you drew and the owner accepted.

## Goal

The man sitting at the desk, seen from behind at three-quarters, has to be recognisably **the same person as the portrait you just drew** in the dialogue box. Right now he is a leftover placeholder, and the owner asked for him to be brought in line with the portrait.

The portrait is the reference. Read `src/art/Portrait.tsx` — swept short hair with a lit sweep on the upper left of the crown, glasses with two separate lenses, a red sweater. The figure already wears the same red (`C.red` / `C.redDark`).

## What you are drawing

`src/art/ApartmentScene.tsx`, the `developerBody` array. Only the head is wrong. Settled, do not change:

| | |
| --- | --- |
| Grid | the room's own scene grid, **1 unit = 3 screen px at 1440 wide** |
| Head footprint | roughly x 165–187, y 52–74. Shoulders start at y 74, the collar is `[164, 76, 20, 3, C.redDark]` |
| Drawn with | `PixelRects`, where `Px` is `[x, y, width, height, colour]`, painted in order |
| Palette | `C.hair` `#241f24`, `C.skin` `#c99473`, `C.skinShade` `#a8765c`, `C.red`, `C.redDark`. Extra tones are allowed but the room only has 113 colours in total — spend them carefully |
| Hover rim | `OUTLINES.speaker` is `outlineOf([...developerBody, ...developerArm])`, so it follows whatever you draw. Nothing to wire |
| Animation | `developerArm`, `handA`, `handB` and the `f-breathe` / `show-first-half` frames are correct. Leave them |

The head is about **22 units tall**, i.e. 66 screen pixels. That is the whole budget. The portrait has 24 units for an entire face; this is a skull seen from behind, so it has less to say and should carry *less* detail, not more.

## What the rejected draft got wrong

The current pixels are the rejected attempt (`54ed50f`). Its silhouette work is not the problem — the crown steps in, the skull rounds off, the nape stops above the collar. What failed:

- **The head is a black blob.** 22 rows of `C.hair` with one small `#34333a` sweep is almost no value break at all, so at 1:1 the whole skull is one flat dark shape against a dark wall. It needs a real light/shade split — the room's lamp is above and slightly left, and every other object in the room reads because it has a lit face and a shadow face.
- **The sliver of face reads as a stripe glued to the side.** A 5-wide column of `C.skin` running down the right edge of the hair does not read as a cheek *in front of* the skull. Either commit to enough face that it reads as a face, or drop it and let the head be pure hair.
- **The lit sweep and the glasses arm are invisible at native size.** They only appear when you zoom in. That is the tell: the draft was judged at 5× and not at 1:1.
- **Everything was checked at the wrong size.** See below.

## Acceptance

- It reads as a person seen from behind **at native size, in the room, without zooming** — check a 1440×900 screenshot at 1:1. This is the test the draft failed.
- It is recognisably the same man as the portrait: the hair shape and the glasses agree.
- It carries no more pixel detail than the desk, the chair or the shelf beside it.
- The figure still breathes, the hands still type, and the hover rim still traces the silhouette.

## Checks to run

```
npm run build
node scripts/verify-interactions.mjs       # needs a dev server; set ROOM_URL if it is not on 5181
node scripts/verify-hover.mjs              # the speaker rim must still grow, and paint no box
node scripts/verify-reference-refresh.mjs
```

For a native-size look, screenshot at 1440×900 and crop the head **without resampling**:

```js
// clip { x: 580, y: 270, width: 140, height: 130 } at deviceScaleFactor 1
```

Look at that crop as it is. Only zoom afterwards, to check individual pixels — never to judge the drawing.

## Branch

Commit to `prototype/visual-novel`. **Do not merge or push to `main`** — production deploys from `main`, and the owner approves every merge himself, each time.
