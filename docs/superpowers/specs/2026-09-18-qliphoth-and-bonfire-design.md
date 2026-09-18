# Qliphoth counter on the Sunflower, and a bonfire on the window sill

Status: approved by owner (2026-09-18), after trying the throwaway "Room Props Lab" prototype. Kept from that prototype: the Qliphoth counter (Lobotomy Corporation) and the bonfire (Dark Souls). Parked: the d20 (later), the HoMM calendar and the Arknights gacha (not right yet).

## 1. Qliphoth counter (Lobotomy Corporation) on the Sunflower

The Sunflower becomes a contained Abnormality: click it too eagerly and it breaches.

- **Counter:** starts at 3.
  - A click on the Sunflower that comes less than 800 ms after the previous one lowers the counter by 1. The click still drops a sun as it does today.
  - After 3 s without a click, the counter refills by 1 every 1.5 s, up to 3.
- **Counter display:** three small pixel pips above the Sunflower's head, in ochre, filled for each point left. They only show while the counter is below 3 or during a breach.
- **Breach (counter 0):**
  - The Sunflower shakes one pixel side to side, and its pips turn red.
  - It tosses a real sun every 400 ms, using the normal drop (so suns land on free `SUN_SPOTS` and stop when every spot is taken). Every sun can be collected and gives energy as usual.
  - Its button label becomes "Suppress the sunflower".
  - **Suppression:** 5 clicks on the Sunflower end the breach, and each suppression click drops no sun. The pips then show the progress as 5 steps. The counter resets to 3.
- It works by day and night and whether the pylon is on or off (the Sunflower needs no power).
- Under reduced motion there is no shake. The breach still tosses suns, which land directly as usual.
- State is not persisted.

## 2. Bonfire (Dark Souls) on the window sill

- **Look:** a small bonfire on the window sill, about 10 units wide and 12 tall, with its base on the sill top (y 94), between x 64 and x 90.
  - It is clear of the Sunflower's head (x 28–51) and of the desk fan (x 94+).
  - It shows a coiled sword in an ash mound with a small flame that flickers on a two-frame swap.
- **Rest:** clicking it plays the Souls "BONFIRE LIT" moment and nothing else in the room changes.
  - The flame flares for about 1 s.
  - A gold pixel caption "BONFIRE LIT" fades in over the room for about 2.5 s.
  - The caption is a live region, so it is announced.
- **Button:** labelled "Rest at the bonfire". It has the one-unit hover rim on its silhouette, like every other room object.
- The bonfire works with the pylon off, since it needs no power.
- Under reduced motion the flame does not flicker and the caption appears without fading.
- It is a desktop and landscape feature, like the Sunflower: the camera crops x < 86 on portrait phones.

## Verification

- `scripts/verify-qliphoth.mjs`:
  - Rapid clicks lower the counter and the pips appear.
  - The fourth rapid click breaches: `data-qliphoth="breach"` and the button is renamed.
  - Suns keep arriving during the breach.
  - Five clicks suppress it, and the counter is back to 3.
  - Left alone, a lowered counter refills.
- `scripts/verify-bonfire.mjs`:
  - The bonfire is on the sill, its button is present, and clicking it shows "BONFIRE LIT" and then hides it.
  - It works with the pylon off.
- Existing checks still pass: `verify-sunflower`, `verify-energy`, `verify-hover`, `verify-interactions`, `verify-pylon`, `verify-slime`, `verify-zombie`.
