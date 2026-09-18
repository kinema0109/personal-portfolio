import type { LocaleContent } from '../types'

/** English: the source text. Facts come from Thọ's CV (Full-Stack Developer, 2026 edition). */
export const en: LocaleContent = {
  translationStatus: 'ready',
  // Kept in step with index.html, which is what link previews and search engines read.
  meta: {
    title: 'Hoàng Công Thọ — Full-Stack Engineer',
    description: 'Full-Stack Engineer, three years in the JavaScript and TypeScript ecosystem: React and Next.js interfaces, NestJS APIs, SQL and NoSQL. CV and projects inside.',
  },
  role: 'Full-Stack Engineer',
  present: 'present',
  speakers: { tho: 'THỌ', note: 'NOTE' },

  story: {
    intro: [
      [
        "Hi, I'm Thọ, a Full-Stack Engineer with three years across the JavaScript and TypeScript ecosystem.",
        'I build fast React and Next.js interfaces and design NestJS APIs over SQL and NoSQL databases.',
        'I care about clean design patterns, testing and CI/CD.',
      ],
      [
        'I currently work at HDWEBSOFT in Ho Chi Minh City, on platforms for e-commerce, logistics, corporate training and property management.',
        "Ask me what I've built, how I work, or what I do away from the keyboard.",
        'Or just look around the room; a few things on the desk open up.',
      ],
    ],
    work: [
      [
        "I've been a Full Stack Engineer at HDWEBSOFT since March 2025.",
        'Before that I built a community social network at Suzu Group (2024–2025), and worked on karaoke and social music apps at InmobiVN (2022–2024).',
      ],
      [
        'I mostly write TypeScript and JavaScript: React, Next.js, Redux and Vue.js on the frontend, NestJS and Express on the backend, plus Python/Django and Java.',
        'For data I use PostgreSQL, MongoDB, MySQL and Supabase, and I ship with Docker, GCP, Vercel and Jenkins.',
      ],
    ],
    workOverview: (archived) => [
      'Three projects show my day-to-day work best: CBPO, CA2T and TheAvoTree.',
      `The other ${archived} are in the project archive.`,
    ],
    how: [
      [
        'One habit runs through all my work: I use AI tooling like Claude Code to deliver faster.',
        'I still review, debug and test the result myself, so speed never costs code quality.',
      ],
      [
        'I can also go deeper into three pieces of work.',
        'Pick one: moving production MongoDB from Atlas to self-hosted GCP, taking orders off a slow WordPress, or role-based access control.',
      ],
    ],
    cbpo: [
      [
        'CBPO is a multi-service platform for Amazon sellers. It pulls marketplace data from Amazon SP-API and Shopify, manages FBA shipments and shipping labels, and watches brand pricing with MAP Watcher.',
        'It runs on Node.js (Express), TypeScript (Hapi) and a Vue micro-frontend portal on GCP.',
      ],
      [
        'Its data lives in MongoDB with Redis beside it: 5 production clusters, from 100GB to 1.6TB each.',
        "I've worked across most of it. Which part do you want to hear about?",
      ],
    ],
    'cbpo-migration': [
      ['The 5 clusters ran on MongoDB Atlas, on costly managed M50/M60 tiers.', 'The plan was to run MongoDB ourselves on GCP instead.'],
      ['First, capacity: I led the planning as our GCP vCPU quota grew from 24 to 78 cores.'],
      ['I provisioned 6 Compute Engine VMs and set them up as MongoDB replica sets.'],
      ['mongosync then kept each cluster continuously replicated from Atlas to its new replica set, while the platform kept running on Atlas.'],
      [
        'Once a cluster was in sync, we cut over with near-zero downtime.',
        'All 5 clusters moved, and the platform no longer depends on M50/M60 Atlas tiers.',
      ],
    ],
    'cbpo-mcp': [
      ["AI agents are good at questions like 'how did this product sell last week?', but they couldn't see CBPO's data."],
      ['I built a Model Context Protocol server inside the central TypeScript API: about 1,400 lines.'],
      ['It exposes 6 authenticated tools over products, orders, financial events, sales and sync status.'],
      ['So an agent can query marketplace data directly and get the same answers the portal gets.'],
    ],
    'cbpo-cicd': [
      ['Production deployments came from several separate branches across 3 services.'],
      ['I merged them into one GitLab CI pipeline that deploys with Helm, with values per environment.'],
      ['Automated deploy checks run before a release goes out, for all 3 services.'],
      ['I also set up AGENTS.md and AI code review in merge requests, to speed delivery up without lowering the bar.'],
    ],
    'cbpo-shipping': [
      ['Sellers ship with several carriers and compare rates before buying a label.'],
      ['I added UPS to the rate comparison.'],
      ['EasyPost v2 returned raw API errors, so I re-architected the integration with a version mediator and an error-mapping layer. Users now see what to fix.'],
      ["I also delivered 2D-barcode and FNSKU label printing across Vue and Express, with UPC resolution, skip rules and print history, and brought Jest unit tests into the frontend's CI."],
    ],
    avotree: [
      [
        'TheAvoTree delivers orchard-fresh avocados around New Zealand on subscription, from a WordPress/WooCommerce shop.',
        'Its WordPress dashboard had become so heavy and slow that it held up shipping.',
      ],
      ['With one other developer, in a team of 6, I built a separate management system: a NestJS API over MongoDB, with a React dashboard.'],
      ['The hard part was the data. WooCommerce carries subscriptions and a great deal of metadata, and the MongoDB schema had to mirror it faithfully.'],
      [
        "Orders matter too much to trust to webhooks alone. A scheduled job pulls them through a queue with retries and checks WordPress's responses against the dashboard.",
        'Webhooks carry the less critical changes, like statuses and users.',
      ],
      ['Staff now do nearly everything from the new dashboard, at around 2,000 orders a day.'],
    ],
    singlekey: [
      [
        'SingleKey is a Canadian rental-tech company: tenant screening, rent collection and a Rent Guarantee.',
        'Since buying its competitor Naborly in 2022, it has served around 60,000 landlords.',
      ],
      ['For two months, in a team of 6, I worked on the Rent Guarantee flow: uploading documents and running credit checks.'],
      ['The pages are built static with Next.js and talk to a Django backend over REST.'],
      ['We tested everything with VWO, from the smallest button to each step and each word. A winning change usually lifted sign-ups by around 20%.'],
    ],
    yokara: [
      ['Yokara is an online karaoke app by INMOBI in Vietnam, with over 2 million users, up to 10,000 of them online at once.'],
      [
        'Its economy runs on virtual currency: top-ups, VIP, gifts in livestream rooms and rewards.',
        "Money can't be wrong, so every change is a transaction, a ledger records it, and the books are reconciled.",
      ],
      [
        'Sicbo is a dice mini-game with rooms of up to about 50 players.',
        'When a round ends, a job collects every bet, splits them into batches if there are many, and settles each balance in a transaction.',
      ],
      ['It all runs on Firebase: its database, Cloud Functions for the backend and Firebase Auth for sign-in. I was one of about 20 people on the team.'],
    ],
    suzu: [
      ['Suzu.net is a social network for creators, artists and their fans, built on Supabase and Vercel.'],
      [
        'Sign-in runs on Supabase Auth, and messages and notifications arrive live over Supabase Realtime.',
        'Integrating Realtime cut messaging latency by 40%.',
      ],
      ['A "Smart Feed" ranks posts by engagement, written as PostgreSQL functions inside the database.'],
      [
        'Lazy loading and image optimisation lifted Core Web Vitals from "Needs Improvement" to "Good".',
        'CI/CD on Vercel cut deployment time by half.',
      ],
    ],
    ikara: [
      [
        "iKara is INMOBI's karaoke app, on the App Store since 2013 with over 111,000 ratings in Vietnam.",
        'It runs on the same platform as Yokara.',
      ],
      [
        'Behind both apps sits an admin CMS that runs their whole economy.',
        'It is React over Java Servlets, signed into with Firebase Auth and built and deployed by Jenkins.',
      ],
      ['My part was the money: top-up packages, icoin prices and exchange rates, validated as they are entered so the figures stay 100% correct.'],
      [
        "Much of that money moves through Yokara's dice game, Sicbo, so I built the reports on how users spend icoin.",
        'The apps pick up every store change over REST, on Android and iOS.',
      ],
    ],
    'how-roles': [
      [
        'CA2T is a learning management system for corporate training, built with React, Python/Django and PostgreSQL.',
        'I was a Full Stack Engineer there and led the team.',
      ],
      ['I designed its dynamic role-based access control.', 'Admins and learners each get their own dashboard and learning interface.'],
      ['I led a cross-functional team of five.', 'I kept the timelines and technical decisions aligned.'],
      ["I also brought AI tooling (Claude Code) into the team's workflow to speed up delivery."],
    ],
    outside: [
      [
        'Outside work, I play a lot of games.',
        'I started back on the Famicom/NES and still play modern games today, gacha games included.',
      ],
    ],
  },

  choices: {
    work: 'What have you worked on?',
    how: 'How do you work?',
    outside: 'What about outside work?',
    archive: 'Project archive',
    archiveMore: (count) => `${count} more projects`,
    archiveAll: 'Every project in the CV',
    migration: 'MongoDB: Atlas → self-hosted GCP',
    events: 'Orders without a slow WordPress',
    roles: 'Role-based access control',
    seeDetails: (project) => `See ${project} details`,
    askOther: 'Ask about something else',
    approach: 'How did you approach it?',
    cbpoMigration: 'Moving MongoDB off Atlas',
    cbpoMcp: 'An MCP server for AI agents',
    cbpoCicd: 'One deploy pipeline',
    cbpoShipping: 'Carriers and label printing',
    anotherCbpo: 'Another part of CBPO',
    seeFeatured: 'See featured projects',
  },

  views: {
    project: (p, hasDeepDive) => [
      `${p.name} is a project at ${p.company} (${p.period}), where I worked as ${p.role}.`,
      hasDeepDive
        ? 'The panel shows what I built and the stack. Ask me how I approached the hardest part.'
        : 'The panel shows what I built and the stack I used.',
    ],
    archive: [
      'Every project I have worked on, newest first.',
      'Pick one to see its context, my role, what I contributed and the stack.',
    ],
    galleryEmpty: ['The album is empty for now.', 'Thọ will add the pixel-art pictures soon.'],
    gallery: ['A collection of artwork, reinterpreted as pixel art.', 'Use Next or the arrow keys to browse. Press Esc whenever you want to return.'],
    cv: ['Here is the short version: experience, skills, education and contact.', 'Click a project name to open its details.'],
  },

  projects: {
    cbpo: {
      context:
        'A multi-service e-commerce data and logistics platform for Amazon sellers: marketplace data ingestion (Amazon SP-API, Shopify), FBA shipments and shipping labels, pricing monitoring (MAP Watcher) and a Vue micro-frontend portal.',
      role: 'Full Stack Engineer',
      contributions: [
        'Migrated 5 production MongoDB clusters (100GB–1.6TB) off MongoDB Atlas onto 6 self-hosted GCP VMs with mongosync and a near-zero-downtime cutover; led capacity planning (vCPU quota 24 → 78 cores)',
        'Built a Model Context Protocol (MCP) server in the TypeScript API (~1,400 LOC) with 6 authenticated tools, so AI agents can query marketplace data directly',
        'Merged several production deploy branches into one GitLab CI + Helm pipeline across 3 services',
        'Added UPS rate comparison and re-architected the EasyPost v2 integration, so users get actionable validation messages instead of raw API errors',
        'Delivered 2D-barcode and FNSKU label printing across Vue and Express, and introduced Jest unit tests to the frontend CI',
        'Set up AGENTS.md and AI code review in merge requests to speed up delivery without lowering code quality',
      ],
    },
    ca2t: {
      context: 'A learning management system for corporate training, with separate admin and learner roles.',
      role: 'Full Stack Engineer / Team Lead',
      contributions: [
        'Dynamic role-based access control with a tailored dashboard for each role',
        'Led a cross-functional team of 5',
        'Integrated AI tooling (Claude Code) to accelerate delivery',
        'Fast, interactive UI with React and Tailwind',
      ],
    },
    theavotree: {
      context: 'A large e-commerce platform bridging WordPress/WooCommerce with a JavaScript management system.',
      role: 'Full Stack Engineer',
      contributions: [
        'Full-stack WooCommerce bridge: NestJS API and React admin dashboard',
        'High-performance MongoDB schema that mirrors the WooCommerce data structure',
        'Orders pulled by a scheduled job through a queue with retries, cross-checked against the dashboard; webhooks for statuses and users',
        'Unit and integration tests for core business logic',
      ],
    },
    singlekey: {
      context: 'A property management platform that makes renting simpler for landlords and tenants.',
      role: 'Full Stack Engineer',
      contributions: [
        'High-conversion landing pages in Next.js and TypeScript',
        'A reusable React and Tailwind component library for the application flow',
        'VWO A/B tests that lifted sign-ups',
        'Turned product requirements into technical specifications',
      ],
    },
    suzu: {
      context: 'A community social network for creators, artists and their fans.',
      role: 'Full Stack Engineer',
      contributions: [
        'Social network built with Next.js and Supabase',
        'Instant messaging with Supabase Realtime over WebSockets (40% lower latency)',
        '"Smart Feed" ranking with PostgreSQL functions',
        'Core Web Vitals raised to "Good", with average session length up 15%',
        'Automated CI/CD pipelines on Vercel that cut deployment time by 50%',
      ],
    },
    'ikara-admin': {
      context: 'The admin and in-app economy system behind iKara and Yokara, karaoke apps by InmobiVN.',
      role: 'Full Stack Engineer',
      contributions: [
        'Java Servlet and React CMS managing data for 10,000+ users with 100% transaction integrity',
        'Virtual store, item and price validation workflows',
        'Internal reporting tools, including virtual currency spending',
        'REST APIs that keep store items in sync on Android and iOS',
        'Jenkins build and deployment pipelines',
      ],
    },
    yokara: {
      context: 'A social music and karaoke app by InmobiVN for singing, recording and sharing songs.',
      role: 'Full Stack Engineer',
      contributions: [
        'Backend on Firebase Cloud Functions, with Firebase Auth',
        'Virtual-currency and in-app transaction backend with 100% financial accuracy',
        'Sicbo settlement: a round-end job collects every bet, batches them and settles balances in transactions',
        'Feature parity with the Flutter and Swift mobile apps',
      ],
    },
  },

  cases: {
    cbpo: { title: 'CBPO at a glance', chips: [] },
    'cbpo-migration': { title: 'Moving MongoDB off Atlas', chips: ['5 clusters', '100GB–1.6TB each', 'vCPU 24 → 78', 'near-zero downtime'] },
    'cbpo-mcp': { title: 'An MCP server for AI agents', chips: ['6 tools', '~1,400 LOC', 'authenticated'] },
    'cbpo-cicd': { title: 'One deploy pipeline', chips: ['3 services', '1 pipeline', 'GitLab CI + Helm'] },
    'cbpo-shipping': { title: 'Carriers and label printing', chips: ['UPS added', 'readable carrier errors', 'FNSKU labels', 'Jest in CI'] },
    avotree: { title: 'TheAvoTree: orders without a slow WordPress', chips: ['~2,000 orders / day', '2 of 6 developers', 'WooCommerce mirrored in MongoDB'] },
    singlekey: { title: 'SingleKey: the Rent Guarantee flow', chips: ['~20% per winning test', '2 months', 'team of 6'] },
    yokara: { title: "Yokara: money that can't be wrong", chips: ['2M+ users', '10,000 online at once', '~50 players / room'] },
    ikara: { title: 'iKara: the money behind two apps', chips: ['data for 10,000+ users', '100% transaction integrity', 'Jenkins CI/CD'] },
    suzu: { title: 'Suzu.net: live on Supabase and Vercel', chips: ['−40% messaging latency', 'Core Web Vitals: Good', '−50% deploy time'] },
  },

  cv: {
    school: 'Duy Tan University',
    major: 'Bachelor of Science in Software Technology',
    languages: ['Vietnamese: native', 'English: working proficiency (TOEIC 695/990)'],
  },

  ui: {
    skipToDialogue: 'Skip to dialogue',
    language: 'Language',
    sound: 'Sound',
    soundOn: 'On',
    soundOff: 'Off',
    phase: 'Night mode',
    phaseDay: 'Day',
    phaseNight: 'Night',
    details: 'Details',
    dialogue: 'Dialogue',
    choices: 'Choices',
    dialogueNav: 'Dialogue navigation',
    back: 'Back',
    home: 'Home',
    next: 'Next',
    hotspots: { pc: 'See projects', album: 'Open Game Gallery', drawer: 'Profile' },
    sceneDescription:
      'Pixel art of a small apartment that follows the visitor’s own day and night. Thọ works at a desk with a PC, a photo album and a notebook, a desktop tower underneath it powered by a Protoss pylon that can be switched off, and a potted sunflower and a Sun-shroom on the floor by the window; the Sun-shroom sleeps by day. On the wall, Alhazard and Langrisser cross in one frame, Gran Centurio hangs in a tall frame beside it, and Armageddon rests on pegs below. The display cabinet holds the books behind the Limbus Company sinners and two plushes on the top shelf, a Skaven Grey Seer, an Alpha Legion miniature and a Master Ball on the lit middle shelf, and every boxed Fire Emblem game along the bottom. Click the PC, the album or the desk drawer to explore, or the plants for a sun.',
    artNotice: 'Placeholder art',
    artNoticeDetail: ' · final art coming later',
    portrait: 'Developer portrait (placeholder)',
    portraitTemp: 'Temp',
    status: {
      draft: 'Draft · needs Thọ to confirm',
      placeholder: 'Waiting for real content',
      translationDraft: 'Draft translation · needs Thọ to confirm',
    },
    advance: 'Keep listening',
    fan: 'Desk fan',
    sunflower: 'Shake the sunflower',
    sun: 'Collect the sun',
    sunshroom: 'Shake the Sun-shroom',
    sunshroomAsleep: 'The Sun-shroom is asleep',
    pylonOff: 'Power down the pylon',
    pylonOn: 'Warp in the pylon',
    pylonLine: 'You must construct additional pylons.',
    project: {
      context: 'Context',
      role: 'My role',
      contributions: 'Contributions',
      technologies: 'Technologies',
      noContext: 'The CV has no context description for this project.',
      reviewNote: 'Source: CV, plus the product’s public page for context where the CV has none.',
    },
    cv: {
      sections: 'Profile sections',
      experience: 'Experience',
      education: 'Education',
      contact: 'Contact',
      skills: 'Skills',
      skillGroups: {
        languages: 'Languages',
        frontend: 'Interfaces',
        backend: 'Services',
        data: 'Data',
        delivery: 'Shipping and running it',
        craft: 'How the work is built',
        practice: 'Tools of the trade',
      },
      usedIn: (projects) => `in ${projects}`,
      since: (year) => `since ${year}`,
      fromCv: 'On the CV, not shown here',
      fromCvNote: 'These are on the CV, but no project on this site demonstrates them.',
      alsoUses: 'Also works with',
      alsoUsesNote: 'Not on the CV either, so take these as a plain claim.',
      languages: 'Languages',
      gpa: (value) => `GPA ${value}`,
      notProvided: 'Not provided yet',
      contactLabels: { email: 'Email', github: 'GitHub', linkedin: 'LinkedIn' },
    },
    case: { eyebrow: 'Case study', now: 'Now showing:' },
    gallery: {
      finish: 'Finish',
      lastPage: 'You have reached the last picture.',
      keyHint: '← → Browse · Esc Close gallery',
      loadError: 'The picture could not load. You can still browse or close the gallery.',
      eyebrow: 'Pixel art',
      title: 'Game Gallery',
      noPictures: 'No pictures yet',
      prev: 'Prev',
      next: 'Next',
      close: 'Close',
    },
  },
}
