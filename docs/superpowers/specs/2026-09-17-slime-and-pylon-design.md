# A Terraria slime at the window, and a pylon that powers the room

Status: approved by owner (2026-09-17), revised by owner the same day: with the power off the story stays on screen but disabled, and only the PC needs power (see "Off" below).

## 1. Terraria slime

- A blue Terraria slime hops past the window from left to right, the opposite way to the night zombie. It moves along the foot of the skyline in hopping arcs, squashing as it lands, and takes about 7 s to cross.
- **By day and by night**, on its own schedule: the first comes 3–5 s after the room opens, then one every 15–25 s. The zombie keeps its own night schedule, so both can be in the window at once.
- It is clipped to the window glass, cannot be clicked, and does not appear under reduced motion.
- It shares the zombie's machinery: one generic walker hook (`useWalker`) drives both schedules, and both use the same window clip.

## 2. Pylon: the room's power

A StarCraft Protoss pylon replaces the power strip under the desk. It is the room's own power and has nothing to do with sun energy.

### Look

- A gold base on the floor line under the desk, x 103–117. The strip, the cable down the wall and the wall socket above them are gone (above the pylon the socket read as a face), and the tower's lead now starts at the pylon.
- Above the base floats a blue crystal (x 107–113, y 123–137). It bobs one pixel and has a soft blue glow: a faint stepped diamond one to two units past the crystal's own shape, not a box.

### States

- **On (the default):** the crystal glows, and everything electric works.
- **Off:** clicking the pylon powers it down.
  - The crystal goes dark.
  - The PC screen goes black and the tower's RGB goes out.
  - The desk fan stops and the ceiling bulb, with its faint cone of light, goes out. The fan cannot be switched (its button reads "Desk fan: off").
  - Thọ stops typing, his speech bubble goes, and the energy build bar is hidden. Sun energy can still be collected and still drains, but the build holds where it is until power returns.
  - The room's colours are otherwise unchanged; there is no dimming layer.
  - **The story stays on screen but is disabled.** The dialogue box and the choices remain where they are, dimmed to half opacity and `inert`: Next, the choices, Back and Home do nothing, clicking Thọ does not advance, and Enter, Space and 1–9 do nothing.
  - **Only the PC needs power.** The "See projects" hotspot on the PC is unavailable. The album (Game Gallery) and the desk drawer (CV) still open, and their panels work normally, including closing by the backdrop, the Close button and Escape. Escape closes an open panel; with none open it does nothing.
  - **The camera does not move** when the power goes or returns, because the HUD does not change size.
  - Above Thọ, a pixel caption reads "You must construct additional pylons." for about 3 s. It is one always-mounted live region, so screen readers announce it, and it is clamped to stay wholly on screen with 8 px to spare, wrapping on narrow phones if it must.
- **Warping in:** clicking the dark pylon plays a warp-in for about 1.5 s.
  - A blue ring pulses on the floor.
  - The crystal's wireframe appears, top half then bottom half.
  - Then the pylon is solid and lit, and power returns: the story works again from where it was and every electric thing works again.
  - Clicks during the warp are ignored.
- Under reduced motion there is no warp: the pylon comes on at once.
- Power is not persisted. A reload starts with the pylon on.

### Accessibility

- The pylon button is labelled "Power down the pylon" when on and "Warp in the pylon" when off.
- It has the room's one-unit hover rim on its silhouette. The crystal's part of the rim bobs with the crystal; during the warp only the base is outlined.
- Its click box is x 99–122, y 119–147 (23 × 28), clear of the fan, the Sun-shroom and the sun spots.
- It is offered at every breakpoint, because the pylon stands at x ≥ 99. It ignores the choice menu, whose top edge overlaps the pylon's foot on desktop, so power is always within reach.

## Verification

- `scripts/verify-slime.mjs`: with the page clock controlled, a slime appears within 6 s by day and by night, moves left to right, and is clipped to the window glass.
- `scripts/verify-pylon.mjs`:
  - **Power down:** the pylon, screen, tower glow, fan (and its switch), bulb, speech bubble and caption; the HUD still present with the dialogue inert and dimmed; Enter, Space, 1, Escape and a click on Next change nothing; "See projects" absent, "Open Game Gallery" and "Profile" present; the camera unchanged.
  - **Panels while off:** Profile opens the CV and Escape or the backdrop closes it; the album opens the gallery and Close closes it.
  - **Caption:** wholly inside the viewport at 1440 × 900, 390 × 844 and 320 × 640, and gone about 3.2 s after power-down while its live region stays mounted.
  - **Warp in:** the warping state, a second click ignored, power back within about 1.5 s of the first click, the story usable again.
  - **Reduced motion:** with the choices up, they are inert while off; power returns at once with no warp.
  - **Screenshots:** off (desktop, 390 and 320 wide), warping and on.
- Existing checks still pass: `verify-zombie`, `verify-energy`, `verify-fan`, `verify-hover`, `verify-interactions`, `verify-project-screens`, `verify-room`, `verify-daylight`.
