# Fumo revision

Implemented the owner-approved code-native revision using the two supplied photos (Sparxie first, Sparkle second). Art remains pending owner visual acceptance.

- Narrowed twintails and face-side locks to separate head, tails and body.
- Sparkle: moved side mask up to the hair, single-pixel eye glints, crossed white collar, dark sash and pale seated feet.
- Sparxie: brim overlaps hair, attached rabbit ears and a readable pink cross eye. Kept contrasting hair colors and red outfits.
- Same mounting and compartment; no labels, generated assets, book edits or room layout changes.

Verification: build, verify-reference-refresh.mjs and verify-fumo.mjs passed. Both plushes fit their compartment and touch floor y66 without overlap at 390x844, 844x390, 768x1024, 1440x900 and 2560x1440. No console, page, HTTP or failed-request errors observed. Native 1440x900 screenshot visually inspected: artifacts/fumo-1440.png. Fine identity details remain necessarily simplified at 17x18 scene units.
