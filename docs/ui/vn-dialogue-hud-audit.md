# Visual-novel dialogue HUD audit

Date: 2026-09-15  
Scope: textbox, name label, advance indicator, choice menu and their responsive behaviour in the portfolio visual novel.  
Skills loaded: `board-game-production-flow`, `game-visual-reference-researcher`, `board-game-ui-director`. `board-game-reconstructor` is not applicable: there are no board rules, map topology or hidden information. Realtime play is out of scope.

## Owner report

"The chat box is sometimes big, sometimes small; the text frame is often not fixed."

## Evidence ledger

External images were downloaded for inspection only. They are not committed to the repository, and no artwork or trade dress is copied; only layout principles are transferred.

| visualRefId | sourceType | sourceUri | purpose | observations | status |
|---|---|---|---|---|---|
| `vr-renpy-say-001` | official (engine documentation) | https://www.renpy.org/doc/html/_images/easy_say_screen.jpg | Textbox geometry for a normal line | Full-width textbox anchored to the bottom (about the lower quarter of the screen). Speaker name top-left inside the box. A two-line line leaves the lower half of the box empty, so the box does not shrink to the text. Quick-menu row along the bottom edge. | accepted |
| `vr-renpy-choice-001` | official (engine documentation) | https://www.renpy.org/doc/html/_images/easy_choice_screen.jpg | Choice presentation | Choices are a centred vertical menu above the textbox. The textbox keeps the same size as in `vr-renpy-say-001` while showing a one-line prompt. | accepted |
| `vr-renpy-namebox-001` | official (engine documentation) | https://www.renpy.org/doc/html/_images/intermediate_dialogue.jpg | Name plate variant | Name sits in its own plate on the top edge of the box; the box height is unchanged. | accepted |
| `vr-renpy-history-001` | official (engine documentation) | https://www.renpy.org/doc/html/_images/history.png | Backlog convention | Separate full screen lists earlier lines with their speakers. | accepted (not implemented, see O1) |
| `vr-renpy-docs-001` | official documentation text | https://www.renpy.org/doc/html/gui.html, https://www.renpy.org/doc/html/dialogue.html, https://github.com/renpy/renpy/blob/master/tutorial/game/screens.rpy | Default values behind the screenshots | `gui.textbox_height = 278`, `gui.textbox_yalign = 1.0`; `style window: ysize gui.textbox_height` (fixed height). Choice `vbox` uses `xalign 0.5`, `ypos 270`. Quick menu: Back, History, Skip, Auto, Save, Q.Save, Q.Load, Prefs. "A click-to-continue indicator is displayed once all the text has finished displaying, to prompt the user to advance." | accepted |
| `vr-va11-dialogue-001` | comparable (small pixel-art visual novel, store page) | https://img.itch.zone/aW1hZ2UvNDEzNS8zMzMzNDUucG5n/original/4hoNP1.png (VA-11 Hall-A, itch.io) | Textbox stability in a small pixel-art visual novel, three-line line | Fixed dark textbox bottom-left; name as a coloured inline prefix; "NEXT" icon top-right and ▼ indicator bottom-right. | accepted |
| `vr-va11-dialogue-002` | comparable | https://img.itch.zone/aW1hZ2UvNDEzNS8zMzMzNDIucG5n/original/4tkb%2F%2F.png | Same screen with a two-line line | Box bounds are identical to `vr-va11-dialogue-001`; empty lines remain empty. | accepted |
| `vr-va11-dialogue-003` | comparable | https://img.itch.zone/aW1hZ2UvNDEzNS8xMTk2MDgucG5n/original/Z9usG0.png | Advance indicator | ▼ indicator at the bottom-right of a two-line box with a large empty area. | accepted |

Coverage gaps: no mobile-portrait visual novel reference was inspected; mobile decisions extend the same fixed-box principle and were validated by rendered captures only.

## Findings

Before-fix captures were taken from the working tree (`build: working-tree`), English, reduced motion, by walking every dialogue step.

| id | finding | evidence | status |
|---|---|---|---|
| F1 | The textbox height changed between steps: 171 / 196 / 222 / 252 px at 1440×900, and 138–375 px at 390×844 (top edge moved between 461 and 698 px). | `capture-en-d1440-intro-0`, `capture-en-d1440-how-migration-0`, `capture-en-p390-intro-0`, `capture-en-p390-outside-1`; contradicts `vr-renpy-say-001`, `vr-va11-dialogue-002` | fixed |
| F2 | The camera re-framed on every step (SVG `viewBox` y changed), so the whole room jumped with the box. | same captures, `viewBox` column | fixed |
| F3 | Choices were visible from the first line of a multi-step node, next to the Next button. | `capture-en-d1440-how-migration-0`; contradicts `vr-renpy-choice-001` | fixed |
| F4 | Choices were inside the textbox, so a node with 7 choices grew the box. | archive state; contradicts `vr-renpy-choice-001` | fixed |
| F5 | No click-on-text advance and no Enter/Space advance; only a Next button. | code review; `vr-renpy-docs-001` | fixed |
| F6 | Found during the fix: the detail panel and the new choice menu shared a React key, which kept a stale panel on screen. | `capture-en-d1440-archive-0` (build `fixed-textbox`) | fixed |
| F7 | Found during the fix: on phones the choice menu covered room hotspots (the CV drawer could not be clicked). | Playwright click interception | fixed |
| F8 | Found during the fix: older `.hud.has-panel .dialogue` rules placed the textbox in the menu's grid row in landscape. | `en-l844-project` (build `fixed-textbox-3`) | fixed |
| F9 | Found during the fix: `flex: 1` overrode the fixed text height on portrait phones, and `flex: none` stopped wrapping in landscape (horizontal page overflow at 568×320). | measurements; `en-l568-archive` | fixed |

## Decision matrix

| decisionId | UI question | chosen pattern | supporting visualRefIds | rejected alternatives | affected components | validation captureIds |
|---|---|---|---|---|---|---|
| `decision-textbox-fixed-height` | Should the textbox follow its text? | One height per layout mode. The text area is sized to the longest step in the current language at the current width (`useStableTextHeight`), with a viewport cap and internal scroll only beyond the cap. | `vr-renpy-say-001`, `vr-renpy-docs-001`, `vr-va11-dialogue-001`, `vr-va11-dialogue-002` | Fixed line count (breaks with Vietnamese/Japanese length); auto height (the reported bug) | `DialogueBox`, `useStableTextHeight`, `styles.css` | `capture-en-d1440-intro-0`, `capture-en-d1440-intro-1`, `capture-en-p390-intro-0`, `capture-en-p390-intro-1` |
| `decision-reserved-slots` | What else changed the box size? | Portrait slot always reserved (hidden when the speaker has no portrait); advance slot always reserved; status rule always takes its width; name row never wraps. | `vr-va11-dialogue-002` | Collapsing empty slots | `DialogueBox`, `styles.css` | same as above |
| `decision-choice-menu` | Where and when do choices appear? | Only after the last line, as a menu in its own HUD row above the textbox. | `vr-renpy-choice-001`, `vr-renpy-docs-001` | Choices inside the textbox; choices visible with Next | `ChoiceMenu`, `view.ts`, `App` | `capture-en-d1440-intro-1`, `capture-en-p390-intro-1`, `en-l844-project` |
| `decision-menu-overlays-room` | The menu covers the room on phones | The menu overlays the room; the camera ignores it, so the desk never shrinks or moves when choices appear. Hotspots intersecting the menu are not rendered (no dead or hidden focus targets) and return when the menu closes. Supersedes `decision-room-makes-way` (room glided up and could zoom out), rejected by the owner on 2026-09-15. | `vr-renpy-choice-001` (menu drawn over the scene) | Reframing the room around the menu; permanent reserved menu area | `useFreeRegion`, `Scene` | `capture-en-d1440-intro-1`, `capture-en-p390-intro-1` (build `overlay-menu`) |
| `decision-advance-input` | How does the player advance? | Click or tap the text, Enter or Space (unless a button is focused), or the Next ▼ button. Esc rolls back one step. 1–9 only work once the menu is shown. | `vr-renpy-docs-001`, `vr-va11-dialogue-003` | Next button only | `App`, `DialogueBox` | advance test (below) |
| `decision-name-label` | Name plate or inline name? | Keep the compact inline label on the top row. | `vr-va11-dialogue-001` | Separate plate (`vr-renpy-namebox-001`) costs height on phones | `DialogueBox` | `capture-en-p390-intro-0` |

## Render verification (after)

Build identifiers are working-tree labels (`fixed-textbox-5`); nothing is committed. Captures were stored in the session scratchpad and inspected directly.

Textbox height across every dialogue step (intro, work, project, archive, how, how-migration, outside, gallery, CV), English:

| viewport | textbox height | changes between steps |
|---|---|---|
| 1440×900 | 169 px | none |
| 390×844 | 249 px | none |
| 844×390 without panel / with panel | 134 px / 205 px | none within a layout mode |

Japanese at 1440×900 stays at 144 px for every step.

Responsive QA script, 11 viewports (1920×1080 to 568×320) × 6 states × 3 languages:
- no page overflow;
- no textbox under the top bar;
- no panel/textbox overlap;
- no clipped button text;
- no console errors.

Remaining internal scroll only occurs on long detail panels and at the extreme sizes listed in O3/O4.

Inspected captures:
- `capture-en-d1440-intro-0`: box with Next ▼, no menu.
- `capture-en-d1440-intro-1`: same box bounds, menu above.
- `capture-en-p390-intro-0` and `capture-en-p390-intro-1`: same.
- `en-l844-project`: menu and textbox in the left column, panel on the right, no overlap.
- `en-l568-archive`: no horizontal overflow; the 7-item menu scrolls.

Advance test (1440×900, English, all pass):
- start at 1/2 with no choices;
- "1" before the last line does nothing;
- Space advances and shows 3 choices;
- Esc rolls back;
- Enter advances;
- click on text advances;
- "1" on the last line opens the first choice;
- Space on a focused Back button activates Back only.

`npm run build` passes.

## Open items

- **O1**: No History/backlog screen (`vr-renpy-history-001`). Back rolls back one step, which covers short dialogue. Add a backlog if nodes grow longer.
- **O2**: No Skip/Auto/Save (quick-menu convention in `vr-renpy-docs-001`). Not needed for a short portfolio; deliberately omitted.
- **O3**: At 320×568 and 568×320, the text-area cap is reached for the longest steps and the text scrolls inside the box.
- **O4**: At 568×320, the 7-item archive menu covers most of the room and scrolls.
- **O5**: The room art and portrait are temporary placeholders. This audit does not make the scene visually complete.

## Handoff manifest

| phase | status | artifacts |
|---|---|---|
| Reconstruct | not applicable | — |
| Inspect | complete for dialogue HUD scope | evidence ledger above |
| Direct UI | complete for dialogue HUD scope | decision matrix above |
| Produce assets | not in scope | room/portrait assets remain temporary (O5) |
| Judge pixels | complete for listed captures | render verification above |
| Engineer realtime | not applicable | — |

Next permitted phase: backlog screen (O1) or final room art, on owner request.
