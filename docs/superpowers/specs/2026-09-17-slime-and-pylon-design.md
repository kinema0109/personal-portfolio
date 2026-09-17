# A Terraria slime at the window, and a pylon that powers the room

Status: approved by owner (2026-09-17)

## 1. Terraria slime

- A blue Terraria slime hops past the window from left to right, the opposite way to the night zombie. It moves along the foot of the skyline in hopping arcs, squashing as it lands, and takes about 7 s to cross.
- **By day and by night**, on its own schedule: the first comes 3–5 s after the room opens, then one every 15–25 s. The zombie keeps its own night schedule, so both can be in the window at once.
- It is clipped to the window glass, cannot be clicked, and does not appear under reduced motion.
- It shares the zombie's machinery: one generic walker hook (`useWalker`) drives both schedules, and both use the same window clip.

## 2. Pylon: the room's power

A StarCraft Protoss pylon replaces the power strip under the desk. It is the room's own power and has nothing to do with sun energy.

### Look

- A gold base on the floor line under the desk, x 103–117. The strip and the cable down the wall are gone, and the tower's lead now starts at the pylon.
- Above the base floats a blue crystal (x 107–113, y 123–137). It bobs one pixel and has a soft blue glow.

### States

- **On (the default):** the crystal glows, and everything electric works.
- **Off:** clicking the pylon powers it down.
  - The crystal goes dark.
  - The PC screen goes black and the tower's RGB goes out.
  - The desk fan stops and the ceiling bulb, with its faint cone of light, goes out.
  - Thọ stops typing and the energy build bar is hidden. Sun energy can still be collected.
  - The room's colours are otherwise unchanged; there is no dimming layer.
  - **The whole visual novel goes away:** the dialogue box, the choices and any panel are hidden. The PC, album and drawer hotspots and the click-Thọ-to-advance target are unavailable, and the dialogue keyboard shortcuts do nothing. The room and the top bar stay.
  - Above Thọ, a pixel caption reads "You must construct additional pylons." for about 3 s, and it is announced to screen readers.
- **Warping in:** clicking the dark pylon plays a warp-in for about 1.5 s.
  - A blue ring pulses on the floor.
  - The crystal's wireframe appears, top half then bottom half.
  - Then the pylon is solid and lit, and power returns: the visual novel comes back where it was and every electric thing works again.
  - Clicks during the warp are ignored.
- Under reduced motion there is no warp: the pylon comes on at once.
- Power is not persisted. A reload starts with the pylon on.

### Accessibility

- The pylon button is labelled "Power down the pylon" when on and "Warp in the pylon" when off.
- It has the room's one-unit hover rim on its silhouette.
- It is offered at every breakpoint, because the pylon stands at x ≥ 101.

## Verification

- `scripts/verify-slime.mjs`: with the page clock controlled, a slime appears within 6 s by day and by night, moves left to right, and is clipped to the window glass.
- `scripts/verify-pylon.mjs`:
  - **Power down:** the pylon, screen, tower glow, fan, the HUD's absence, the room hotspots' absence and the caption.
  - **Warp in:** the warping state, then everything back, including the HUD and the "See projects" hotspot.
  - **Reduced motion:** power returns at once.
  - **Screenshots:** off, warping and on.
- Existing checks still pass: `verify-zombie`, `verify-energy`, `verify-fan`, `verify-hover`, `verify-interactions`, `verify-project-screens`, `verify-room`, `verify-daylight`.
