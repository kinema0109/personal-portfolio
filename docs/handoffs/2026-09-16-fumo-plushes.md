# Handoff: Sparkle and Sparxie fumo plushes

Owner: Hoàng Công Thọ · Date: 2026-09-16 · Status: **art not accepted yet** — the scaffolding is in place, the drawing needs redoing.

Read `AGENTS.md` and `docs/DESIGN_CONTRACT.md` first, in particular the two dated notes from 2026-09-16: the room decorates with the owner's hobbies only, and every sprite lives on the room's own pixel grid.

## Goal

Draw two sitting fumo plushes, **Sparkle** and **Sparxie** from Honkai: Star Rail, standing side by side in the right compartment of the display cabinet's top bay. They replace the headphones, paint pots and brush that used to sit there, which the owner asked to have removed.

## Reference images

**The owner has the two reference photos and will paste them to you — ask for them before you draw.** They are chat attachments; they are not in the repository and cannot be exported from the previous session. Image 1 is the Sparkle fumo, image 2 is the Sparxie figure. Written descriptions are below so you can check that you received the right pair.

### Sparkle (花火)

Official 30 cm sitting fumo plush, miHoYo, shipping September 2026.

- **Hair:** black, long straight twintails that fall well past the body, blunt fringe.
- **Head:** red hair ornaments high on both sides; a small white-and-red mask worn pushed to one side of her head, not over her face.
- **Face:** pale, large dark eyes with red in them, small blush marks.
- **Outfit:** red kimono with a white inner collar crossed at the chest, a dark sash, and pale socks on the folded legs.

### Sparxie (火花)

An alternate version of Sparkle, released in version 4.0 (2026): Fire, the Path of Elation. Her Chinese name inverts Sparkle's, 火花 against 花火.

- **Hair:** white, long twintails plus thinner braids, blunt fringe — the same silhouette as Sparkle's in the opposite colour.
- **Head:** a black wide-brimmed hat tilted over one side, with a red band and white rabbit ears standing out of it.
- **Face:** one eye winking shut, the other marked with a pink cross; a small heart on one cheek.
- **Outfit:** red and black harlequin bodice over a white apron, a pale blue ribbon with a small gold bell at the collar, black boots with red diamonds.

The pair is the point: the owner wants them read as inverses of each other, black against white over the same reds. Whatever is simplified away, keep that contrast.

## Where they go

| | value |
| --- | --- |
| Cabinet top bay, interior | x 307–383, y 21–66 (the bay floor is the shelf board at y 66) |
| Divider | x 343–346 |
| Left compartment | x 307–343 — the Limbus Company books, do not touch |
| **Slot for this task** | **x 346–383, 37 units wide, 45 units of headroom** |

Current placement in `src/art/ApartmentScene.tsx`:

```tsx
<Fumo kind="sparkle" x={348} floor={66} />
<Fumo kind="sparxie" x={366} floor={66} />
```

Each plush is 17 units wide and 18 tall, so they fill 348–365 and 366–383. You may change the size and spacing if the drawing needs it, as long as both stay inside x 346–383 and stand on y 66. There is room above their heads for Sparxie's hat and ears.

## Style: draw it in code, do not generate a sprite

`src/art/Fumo.tsx` exists and is mounted. It draws each plush as a list of flat rectangles through `PixelRects`, where `Px` is `[x, y, width, height, colour]` in scene units.

One scene unit is one pixel of the room's art, which is 3 screen pixels at a 1440-wide window. Everything around these plushes — the desk, the cabinet, the window, the books — is drawn this way.

Do not produce a generated PNG for this. In September 2026 the owner rejected the generated sprites twice for carrying far more detail than the room, and they had to be downsampled onto the room grid afterwards (`scripts/coarsen-references.mjs`). A 17×18 figure drawn directly as rectangles avoids that whole problem and is the right tool at this size.

## What the first attempt got wrong

The version currently in `src/art/Fumo.tsx` is a rejected first pass. Keep the file and the mounting; replace the artwork. What failed:

- **The hair swallowed the figure.** Fringe, side locks and twintails were all wide and all the same colour, so each plush read as one solid black or white mass with a face cut into it. The twintails need to be narrow, about 2 units, and clearly separated from the head so the silhouette reads as *head plus tails*.
- **The head was too wide and the body invisible.** A fumo is a big round head on a small body with stubby legs pushed forward. The head should dominate, but the body and legs still have to be readable underneath it.
- **The eyes were stacked bars.** A dark block with a red block on top of it reads as an eyebrow, not an eye. Two units wide, two tall, one dark colour with a single lighter pixel as a glint, is enough at this size.
- **Sparxie's hat floated.** It sat above the head with a gap. It has to overlap the hair.

Suggested budget for a 17 wide × 18 tall figure, as a starting point, not a rule: twintails 2 units wide down each edge; head 13 wide centred, roughly rows 0–11; face 9 wide inside it; body 11 wide, rows 12–16; two stubby legs on the bottom row.

## Acceptance

- Both plushes read as sitting plush dolls at native size, not at a zoom. Check a screenshot at 1440×900 without magnifying it.
- The two are told apart at a glance by hair colour, and each carries at least its own signature: Sparkle's red kimono and side mask, Sparxie's black hat with rabbit ears and her pink cross eye.
- Neither carries more pixel detail than the Fire Emblem spines or the room furniture beside them.
- They stay inside the compartment and do not overlap the divider, the shelf board or each other.
- Present at 390×844, 844×390, 768×1024, 1440×900 and 2560×1440, with no console or network errors.

Hover labels are an open question for the owner. The game spines and the book spines name themselves on hover; the miniatures and the Master Ball do not. Default to no label, matching the other figures, unless the owner asks.

## Checks to run

```
npm run build
node scripts/verify-reference-refresh.mjs     # needs a dev server; set ROOM_URL if it is not on 5181
```

## Branch

Commit to `prototype/visual-novel`. **Do not merge or push to `main`** — production deploys from `main`, and the owner approves every merge himself, each time.
