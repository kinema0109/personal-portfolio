import type { LocaleContent } from '../types'

/** English: the source text. Facts come from Thọ's CV (Full-Stack Developer, 2026 edition). */
export const en: LocaleContent = {
  translationStatus: 'ready',
  meta: {
    title: 'Hoàng Công Thọ — Portfolio (prototype)',
    description: 'Hoàng Công Thọ — Full-Stack Engineer. A short visual novel portfolio.',
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
        'I can also go deeper into three pieces of work from my CV.',
        'Pick one: moving production MongoDB from Atlas to self-hosted GCP, a real-time webhook pipeline, or role-based access control.',
      ],
    ],
    'how-migration': [
      [
        'CBPO is an e-commerce data orchestration and logistics platform, built as Python/Django and Vue.js microservices on GCP.',
        'It centralizes order processing, pulls in Amazon marketplace data like BuyBox and competitor tracking, protects brand pricing and optimizes shipping.',
      ],
      [
        'Its data tier is hybrid.',
        'PostgreSQL holds relational order transactions, and MongoDB holds high-velocity marketplace metrics and analytics logs.',
      ],
      [
        'My biggest piece there was moving production MongoDB off MongoDB Atlas.',
        'I built a self-hosted, Docker-orchestrated setup of six VMs on GCP, then migrated several 1.5TB MongoDB clusters onto it.',
      ],
      [
        'To keep the platform online, I designed a zero-downtime replication and parallel restore pipeline with Docker Compose.',
        "The move also cut the platform's dependence on third-party licensing.",
      ],
    ],
    'how-events': [
      [
        'TheAvoTree is a large e-commerce platform that bridges WordPress/WooCommerce with a modern JavaScript management system.',
        'I built the bridge full-stack: a NestJS API over MongoDB, and a React admin dashboard.',
      ],
      [
        "I designed a high-performance MongoDB schema that mirrors WooCommerce's complex data structure.",
        'That keeps the data consistent across both platforms.',
      ],
      [
        'Orders and inventory updates arrive as WooCommerce webhooks.',
        'I built a secure, real-time webhook listener that processes thousands of events a day with zero data loss.',
      ],
      [
        'On top of that data sits the React admin dashboard for sales, user behavior and content performance.',
        'I also covered the core business logic with unit and integration tests.',
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
      ['See the album on my desk?', 'Open it for a small pixel-art gallery.'],
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
    events: 'Real-time webhooks',
    roles: 'Role-based access control',
    seeDetails: (project) => `See ${project} details`,
    askOther: 'Ask about something else',
    approach: 'How did you approach it?',
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
      'These are all the projects in my CV, newest first.',
      'Pick one to see its context, my role, what I contributed and the stack.',
    ],
    galleryEmpty: ['The album is empty for now.', 'Thọ will add the pixel-art pictures soon.'],
    gallery: ['Six pieces of artwork, reinterpreted as pixel art.', 'Use Next or the arrow keys to browse. Press Esc whenever you want to return.'],
    cv: ['Here is a summary of my CV: experience, education and contact details.', 'Click a project name to open its details.'],
  },

  projects: {
    cbpo: {
      context:
        'An e-commerce data orchestration and logistics platform: order processing, Amazon marketplace data, brand pricing and shipping workflows.',
      role: 'Full Stack Engineer',
      contributions: [
        'Scalable microservices with Python/Django and Vue.js on GCP',
        'Hybrid data tier: PostgreSQL for order transactions, MongoDB for marketplace metrics',
        'Built a self-hosted, Docker-orchestrated MongoDB environment of 6 VMs on GCP',
        'Zero-downtime migration of several 1.5TB MongoDB clusters from MongoDB Atlas to that environment',
        'AI-assisted feature delivery, reviewed to production quality',
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
        'Real-time webhook listener processing thousands of events daily with zero data loss',
        'Unit and integration tests for core business logic',
      ],
    },
    singlekey: {
      context: 'A property management platform that makes renting simpler for landlords and tenants.',
      role: 'Full Stack Engineer',
      contributions: [
        'High-conversion landing pages in Next.js and TypeScript',
        'Reusable React component libraries that cut new-feature development time by 30%',
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
      context: 'The admin and in-app economy system behind iKara, a karaoke app by InmobiVN.',
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
        'REST APIs with Express and Firebase Functions, secured by JWT',
        'Virtual-currency and in-app transaction backend with 100% financial accuracy',
        'Optimized MongoDB queries for a high-concurrency real-time mini-game',
        'Feature parity with the Flutter and Swift mobile apps',
      ],
    },
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
    details: 'Details',
    dialogue: 'Dialogue',
    choices: 'Choices',
    dialogueNav: 'Dialogue navigation',
    back: 'Back',
    home: 'Home',
    next: 'Next',
    hotspots: { laptop: 'See projects', album: 'Open album', drawer: 'Open CV' },
    sceneDescription:
      'Pixel art of a small apartment at night. Thọ works at a desk with a laptop, a photo album and a notebook. On the wall, Alhazard and Langrisser share one frame, Gran Centurio hangs in a tall frame beside it, and Ambicion rests on pegs below. In the display cabinet, a Skaven Grey Seer and an Alpha Legion miniature stand on the lit middle shelf next to an empty base, and every boxed Fire Emblem game lines the bottom shelf. Click the laptop, the album or the desk drawer to explore.',
    artNotice: 'Placeholder art',
    artNoticeDetail: ' · final art coming later',
    portrait: 'Developer portrait (placeholder)',
    portraitTemp: 'Temp',
    status: {
      draft: 'Draft · needs Thọ to confirm',
      placeholder: 'Waiting for real content',
      translationDraft: 'Draft translation · needs Thọ to confirm',
    },
    project: {
      context: 'Context',
      role: 'My role',
      contributions: 'Contributions',
      technologies: 'Technologies',
      noContext: 'The CV has no context description for this project.',
      reviewNote: 'Source: CV, plus the product’s public page for context where the CV has none.',
    },
    cv: {
      openPdf: 'Open CV (PDF)',
      notAdded: 'CV not added yet',
      checking: 'Checking…',
      sections: 'CV sections',
      experience: 'Experience',
      education: 'Education',
      contact: 'Contact',
      languages: 'Languages',
      gpa: (value) => `GPA ${value}`,
      notProvided: 'Not provided yet',
      contactLabels: { email: 'Email', github: 'GitHub', linkedin: 'LinkedIn' },
    },
    gallery: {
      finish: 'Finish',
      lastPage: 'You have reached the last picture.',
      keyHint: '← → Browse · Esc Close album',
      loadError: 'The picture could not load. You can still browse or close the album.',
      eyebrow: 'Gallery',
      title: 'Pixel art album',
      noPictures: 'No pictures yet',
      prev: 'Prev',
      next: 'Next',
      close: 'Close',
    },
  },
}
