# Project case studies

Status: approved by owner (2026-09-18), draft lines included.

## Goal

Four projects get a case study: **CBPO, TheAvoTree, SingleKey and Yokara**. Each one is told as a dialogue branch, replacing "How did you approach it?". A large pixel architecture diagram sits in the panel beside the dialogue, and each step lights up the part of the diagram it is about. CA2T keeps its existing deep dive (`how-roles`) unchanged. Suzu.net and iKara Admin CMS get nothing new.

## Sources

- **Thọ (owner):** his CBPO brief and his answers on 2026-09-18 about TheAvoTree, SingleKey and Yokara.
- **CV:** the candidate profile in `ai-job-search`.
- **Public pages,** used only for context about the client, never for claims about Thọ's work:
  - SingleKey: https://www.singlekey.com/en-ca/ and https://betakit.com/singlekey-acquires-competitor-naborly-to-take-the-risk-out-of-renting/
  - TheAvoTree: https://theavotree.co.nz/ (the owner confirmed this is the client)
  - Yokara: https://apps.apple.com/us/app/yokara-sing-karaoke-record/id894927596 and https://inmobivn.com/products/
- **CBPO** has no public presence and is described generically.

## Structure

| Node | Steps | Ends with |
| --- | --- | --- |
| `cbpo` | 2 (intro) | picker: Migration · MCP · CI/CD · Shipping |
| `cbpo-migration` | 5 | "Another part of CBPO", "See CBPO details", "Ask about something else" |
| `cbpo-mcp` | 4 | same |
| `cbpo-cicd` | 4 | same |
| `cbpo-shipping` | 4 | same |
| `avotree` | 5 | "See TheAvoTree details", "Ask about something else" |
| `singlekey` | 4 | "See SingleKey details", "Ask about something else" |
| `yokara` | 4 | "See Yokara details", "Ask about something else" |

- **Entry points:** each project's `relatedNode` becomes its case node: CBPO → `cbpo`, TheAvoTree → `avotree`, SingleKey → `singlekey`, Yokara → `yokara`. CA2T stays `how-roles`. The project panel's "How did you approach it?" choice leads there. SingleKey and Yokara gain this choice.
- **"How do you work?" branch:**
  - The "MongoDB: Atlas → self-hosted GCP" choice now goes to `cbpo-migration`.
  - "Real-time webhooks" is relabelled "Orders without a slow WordPress" and goes to `avotree`.
  - "Role-based access control" still goes to `how-roles`.
- `how-migration` and `how-events` are removed.
- **PC screen:** in every case node the PC screen shows that project's small diagram. That includes the four CBPO sub-stories, which map to `cbpo`.

## Panel: the case diagram

- **New panel kind `case`,** shown in the same place as the project panel.
  - It shows the story's title and a large pixel diagram.
  - On the last step it also shows a row of result chips.
- **Diagram data,** `src/content/caseDiagrams.ts`, one diagram per story (8 in all):
  - **Blocks:** `id`, `icon` (from the PC screen's icon set, exported from `ProjectScreens.tsx` and drawn about 3× larger), a text `label`, and a position.
  - **Edges:** from block to block, with an optional text label such as "mongosync".
- **Focus:** each step lists the block and edge ids it is about. Focused parts are drawn at full strength, and the rest at about 35% opacity. When the focus changes, the change steps in whole frames, like the rest of the room.
- **Accessibility:**
  - The diagram has a text description.
  - A visually hidden list names the focused parts for each step.
  - The chips are plain text.
- Under reduced motion the focus changes at once.

## Content corrections (from the owner's answers)

- **TheAvoTree:** orders come in through a scheduled job with a queue and retries, cross-checked against the dashboard. Webhooks carry only statuses and users. This corrects "webhook listener handling orders and inventory with zero data loss" in `en.ts` contributions and in the `how-events` text, which is removed.
- **SingleKey:** remove "cut new-feature development time by 30%".
- **Yokara:**
  - Replace "Express and Firebase Functions, secured by JWT" with "Firebase Cloud Functions with Firebase Auth".
  - Replace "Optimized MongoDB queries for a real-time mini-game" with the Sicbo settlement job on Firebase's database.
  - `technologies` becomes: Firebase (Cloud Functions, database, Auth), Java, Flutter, Swift. Express, MongoDB, JWT and "Query optimization" are dropped. The Skills tab, which is derived from these, updates on its own.
- **CBPO:** commit the owner's pending rewrite (Node/Express, TypeScript/Hapi, MongoDB + Redis, the Atlas migration, MCP, CI/CD, carriers and labels) as it stands.

## Draft lines (English, 1–2 lines per step)

In each step, `focus` lists the ids that light up. Sources show in review mode.

### `cbpo` (source: Thọ · CBPO)
Diagram: Amazon SP-API, Shopify → API (Express · Hapi) → MongoDB (5 clusters), Redis; API → Vue portal; API → carriers.
1. "CBPO is a multi-service platform for Amazon sellers. It pulls marketplace data from Amazon SP-API and Shopify, manages FBA shipments and shipping labels, and watches brand pricing with MAP Watcher." / "It runs on Node.js (Express), TypeScript (Hapi) and a Vue micro-frontend portal on GCP."
   Focus: `amazon`, `shopify`, `api`, `portal`.
2. "Its data lives in MongoDB with Redis beside it: 5 production clusters, from 100GB to 1.6TB each." / "I've worked across most of it. Which part do you want to hear about?"
   Focus: `mongo`, `redis`.
   Picker labels: "Moving MongoDB off Atlas", "An MCP server for AI agents", "One deploy pipeline", "Carriers and label printing".

### `cbpo-migration`
Diagram: Atlas (5 clusters, M50/M60) — mongosync → 6 × Compute Engine VMs (replica sets); vCPU quota; API → (cutover) VMs.
1. "The 5 clusters ran on MongoDB Atlas, on costly managed M50/M60 tiers." / "The plan was to run MongoDB ourselves on GCP instead."
   Focus: `atlas`.
2. "First, capacity: I led the planning as our GCP vCPU quota grew from 24 to 78 cores."
   Focus: `quota`, `vms`.
3. "I provisioned 6 Compute Engine VMs and set them up as MongoDB replica sets."
   Focus: `vms`.
4. "mongosync then kept each cluster continuously replicated from Atlas to its new replica set, while the platform kept running on Atlas."
   Focus: `atlas`, `e-mongosync`, `vms`.
5. "Once a cluster was in sync, we cut over with near-zero downtime." / "All 5 clusters moved, and the platform no longer depends on M50/M60 Atlas tiers."
   Focus: `api`, `e-cutover`, `vms`.
   Chips: `5 clusters` · `100GB–1.6TB each` · `vCPU 24 → 78` · `near-zero downtime`.

### `cbpo-mcp`
Diagram: AI agent → MCP server (inside the TypeScript API) → 6 tools → MongoDB; auth guard on the MCP server.
1. "AI agents are good at questions like 'how did this product sell last week?', but they couldn't see CBPO's data."
   Focus: `agent`.
2. "I built a Model Context Protocol server inside the central TypeScript API: about 1,400 lines."
   Focus: `mcp`, `api`.
3. "It exposes 6 authenticated tools over products, orders, financial events, sales and sync status."
   Focus: `tools`, `auth`.
4. "So an agent can query marketplace data directly and get the same answers the portal gets."
   Focus: `agent`, `e-agent-mcp`, `mongo`.
   Chips: `6 tools` · `~1,400 LOC` · `authenticated`.

### `cbpo-cicd`
Diagram: several production branches → GitLab CI → Helm (per-environment values) → 3 services; deploy checks; AI review on merge requests.
1. "Production deployments came from several separate branches across 3 services."
   Focus: `branches`.
2. "I merged them into one GitLab CI pipeline that deploys with Helm, with values per environment."
   Focus: `gitlab`, `helm`.
3. "Automated deploy checks run before a release goes out, for all 3 services."
   Focus: `checks`, `services`.
4. "I also set up AGENTS.md and AI code review in merge requests, to speed delivery up without lowering the bar."
   Focus: `review`.
   Chips: `3 services` · `1 pipeline` · `GitLab CI + Helm`.

### `cbpo-shipping`
Diagram: Vue portal → Express API → rate comparison → UPS, EasyPost (version mediator + error mapping); label printing (2D barcode, FNSKU) → print history.
1. "Sellers ship with several carriers and compare rates before buying a label."
   Focus: `rates`.
2. "I added UPS to the rate comparison."
   Focus: `ups`.
3. "EasyPost v2 returned raw API errors, so I re-architected the integration with a version mediator and an error-mapping layer. Users now see what to fix."
   Focus: `easypost`, `mediator`.
4. "I also delivered 2D-barcode and FNSKU label printing across Vue and Express, with UPC resolution, skip rules and print history, and brought Jest unit tests into the frontend's CI."
   Focus: `labels`, `portal`.
   Chips: `UPS added` · `readable carrier errors` · `FNSKU labels` · `Jest in CI`.

### `avotree` (sources: Public · TheAvoTree for step 1, Thọ · TheAvoTree for the rest)
Diagram: WordPress/WooCommerce shop → (scheduled job → queue + retries) → NestJS API → MongoDB (mirrors subscriptions and metadata) → React dashboard for staff; webhooks (statuses, users) → API.
1. "TheAvoTree delivers orchard-fresh avocados around New Zealand on subscription, from a WordPress/WooCommerce shop." / "Its WordPress dashboard had become so heavy and slow that it held up shipping."
   Focus: `woo`.
2. "With one other developer, in a team of 6, I built a separate management system: a NestJS API over MongoDB, with a React dashboard."
   Focus: `api`, `mongo`, `dashboard`.
3. "The hard part was the data. WooCommerce carries subscriptions and a great deal of metadata, and the MongoDB schema had to mirror it faithfully."
   Focus: `mongo`.
4. "Orders matter too much to trust to webhooks alone. A scheduled job pulls them through a queue with retries and checks WordPress's responses against the dashboard." / "Webhooks carry the less critical changes, like statuses and users."
   Focus: `job`, `queue`, `e-webhooks`.
5. "Staff now do nearly everything from the new dashboard, at around 2,000 orders a day."
   Focus: `dashboard`.
   Chips: `~2,000 orders / day` · `2 of 6 developers` · `WooCommerce mirrored in MongoDB`.

### `singlekey` (sources: Public · SingleKey for step 1, Thọ · SingleKey for the rest)
Diagram: landlord or tenant → Next.js (static) Rent Guarantee flow → document upload, credit check → REST → Django; VWO over the pages.
1. "SingleKey is a Canadian rental-tech company: tenant screening, rent collection and a Rent Guarantee." / "Since buying its competitor Naborly in 2022, it has served around 60,000 landlords."
   Focus: `user`.
2. "For two months, in a team of 6, I worked on the Rent Guarantee flow: uploading documents and running credit checks."
   Focus: `flow`, `upload`, `credit`.
3. "The pages are built static with Next.js and talk to a Django backend over REST."
   Focus: `next`, `e-rest`, `django`.
4. "We tested everything with VWO, from the smallest button to each step and each word. A winning change usually lifted sign-ups by around 20%."
   Focus: `vwo`, `flow`.
   Chips: `~20% per winning test` · `2 months` · `team of 6`.

### `yokara` (sources: Public · Yokara for step 1, Thọ · Yokara for the rest)
Diagram: Yokara app (iOS, Android) → Firebase Auth → Cloud Functions → Firebase database (balances, ledger); Sicbo room → round-end job → batches → transaction.
1. "Yokara is an online karaoke app by INMOBI in Vietnam, with over 2 million users, up to 10,000 of them online at once."
   Focus: `app`.
2. "Its economy runs on virtual currency: top-ups, VIP, gifts in livestream rooms and rewards." / "Money can't be wrong, so every change is a transaction, a ledger records it, and the books are reconciled."
   Focus: `functions`, `db`, `ledger`.
3. "Sicbo is a dice mini-game with rooms of up to about 50 players." / "When a round ends, a job collects every bet, splits them into batches if there are many, and settles each balance in a transaction."
   Focus: `sicbo`, `job`, `batches`.
4. "It all runs on Firebase: its database, Cloud Functions for the backend and Firebase Auth for sign-in. I was one of about 20 people on the team."
   Focus: `auth`, `functions`, `db`.
   Chips: `2M+ users` · `10,000 online at once` · `~50 players / room`.

## Verification

- **`scripts/verify-case-studies.mjs`:**
  - For each case node, every step shows the case panel with a diagram, and its focused parts (`data-focus` on blocks) match the step's `focus`.
  - The last step shows the chips.
  - The CBPO picker lists 4 stories, and "Another part of CBPO" returns to it.
  - "How did you approach it?" on CBPO, TheAvoTree, SingleKey and Yokara leads to the case, and on CA2T to `how-roles`.
  - The PC screen shows the right project.
  - Screenshots of every story's final step go to `artifacts/`, and are looked at.
- **Existing checks still pass:** `verify-project-screens` (its deep-dive expectations updated), `verify-interactions`, `verify-hover`, `verify-album` and `npm test`.
- **`npm run build`:** type-checks the tuple lengths of the story text.

## Out of scope

- Case studies for CA2T, Suzu.net and iKara Admin CMS.
- A separate article page, deep links, and other languages.
