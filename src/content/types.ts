/**
 * Content types for the visual novel.
 * Structure (ids, choice targets, dates, stacks) lives in src/content/*.ts.
 * Visitor-facing text for each language lives in src/content/i18n/*.ts and is typed by LocaleContent.
 */

/** Enabled languages. English only until Thọ's Vietnamese and Japanese translations are ready. */
export type Locale = 'en'

/**
 * ready       – safe to show as-is (facts from the CV, or neutral framing text)
 * draft       – proposed first-person wording that Thọ still has to confirm
 * placeholder – real content not supplied yet
 */
export type ContentStatus = 'ready' | 'draft' | 'placeholder'

/** A dialogue step holds one to three lines, each one or two sentences. */
export type DialogueLines = readonly [string] | readonly [string, string] | readonly [string, string, string]

export type SpeakerId = 'tho' | 'note'

export interface DialogueStep {
  speaker: SpeakerId
  lines: DialogueLines
  status: ContentStatus
  /** Where the fact comes from, shown in review mode (e.g. "CV · CBPO"). */
  source?: string
}

export type NodeId =
  | 'intro'
  | 'work'
  | 'how'
  | 'how-migration'
  | 'how-events'
  | 'how-roles'
  | 'outside'

export type ProjectId =
  | 'cbpo'
  | 'ca2t'
  | 'theavotree'
  | 'singlekey'
  | 'suzu'
  | 'ikara-admin'
  | 'yokara'

/** Objects in the room that open a destination. */
export type HotspotId = 'laptop' | 'album' | 'drawer'

/** Where a choice leads. */
export type Target =
  | { kind: 'node'; id: NodeId }
  | { kind: 'project'; id: ProjectId }
  | { kind: 'archive' }
  | { kind: 'cv' }
  | { kind: 'gallery' }

export interface Choice {
  label: string
  /** Short secondary line under the label. */
  hint?: string
  target: Target
}

export interface StoryNode {
  id: NodeId
  steps: readonly [DialogueStep, ...DialogueStep[]]
  choices: readonly Choice[]
  /**
   * True when the choice list is what the reader came for, not an afterthought to the lines.
   * Such a node shows its list from the first line instead of holding it back until the last, and
   * the list behaves as the top of the screen stack: clicking away from it dismisses it.
   */
  picker?: boolean
}

/** Language-independent project facts. */
export interface ProjectInfo {
  id: ProjectId
  name: string
  company: string
  /** MM/YYYY */
  start: string
  /** MM/YYYY, or null while the project is ongoing. */
  end: string | null
  featured: boolean
  technologies: readonly string[]
  /** Optional "how I work" dialogue about this project. */
  relatedNode?: NodeId
}

/** Project text for one language. */
export interface ProjectText {
  /** null = no context description available yet. */
  context: string | null
  role: string
  contributions: readonly string[]
}

export interface Project extends ProjectInfo, ProjectText {
  /** Formatted date range, e.g. "03/2025 – present". */
  period: string
}

export interface GalleryItem {
  /** Path relative to /public, e.g. 'gallery/rooftop.png'. */
  file: string
  /** Describes the picture for screen readers only; the album shows no visible titles or captions. */
  alt: string
}

export type ContactId = 'email' | 'github' | 'linkedin'

export interface ContactItem {
  id: ContactId
  kind: 'email' | 'url'
  /** null = not supplied yet. Email address or full https:// URL. */
  value: string | null
}

export interface SiteConfig {
  name: string
  contact: readonly ContactItem[]
  review: {
    /** Show draft/placeholder tags and sources. Set to false for production. */
    showContentStatus: boolean
    /** Show the "placeholder artwork" notice on the illustrations. */
    showArtworkNotice: boolean
  }
}

type Lines = DialogueLines

/** Every visitor-facing string for one language. Tuple lengths keep step counts identical across languages. */
export interface LocaleContent {
  /** 'draft' tags every step and panel as a translation Thọ still has to confirm (review mode only). */
  translationStatus: 'draft' | 'ready'
  meta: { title: string; description: string }
  role: string
  /** End of an ongoing date range, e.g. "present". */
  present: string
  speakers: Record<SpeakerId, string>

  story: {
    intro: readonly [Lines, Lines]
    work: readonly [Lines, Lines]
    /** Last work step; mentions how many projects are in the archive. */
    workOverview: (archived: number) => Lines
    how: readonly [Lines, Lines]
    'how-migration': readonly [Lines, Lines, Lines, Lines]
    'how-events': readonly [Lines, Lines, Lines, Lines]
    'how-roles': readonly [Lines, Lines, Lines, Lines]
    /** One step: the room is left to be explored rather than narrated. */
    outside: readonly [Lines]
  }

  choices: {
    work: string
    how: string
    outside: string
    archive: string
    archiveMore: (count: number) => string
    archiveAll: string
    migration: string
    events: string
    roles: string
    seeDetails: (project: string) => string
    askOther: string
    approach: string
    seeFeatured: string
  }

  /** Dialogue generated for panels and the archive. */
  views: {
    project: (project: Pick<Project, 'name' | 'company' | 'period' | 'role'>, hasDeepDive: boolean) => Lines
    archive: Lines
    galleryEmpty: Lines
    gallery: Lines
    cv: Lines
  }

  projects: Record<ProjectId, ProjectText>

  cv: {
    school: string
    major: string
    languages: readonly string[]
  }

  ui: {
    skipToDialogue: string
    language: string
    sound: string
    soundOn: string
    soundOff: string
    /** Top-bar day/night switch: a fixed accessible name, and the visible text for each phase. */
    phase: string
    phaseDay: string
    phaseNight: string
    details: string
    dialogue: string
    choices: string
    dialogueNav: string
    back: string
    home: string
    next: string
    hotspots: Record<HotspotId, string>
    /** Labels for the two sunflower click targets. Screen readers only; nothing is shown on screen. */
    advance: string
    fan: string
    sunflower: string
    sun: string
    sceneDescription: string
    artNotice: string
    artNoticeDetail: string
    portrait: string
    portraitTemp: string
    status: {
      draft: string
      placeholder: string
      translationDraft: string
    }
    project: {
      context: string
      role: string
      contributions: string
      technologies: string
      noContext: string
      reviewNote: string
    }
    cv: {
      sections: string
      experience: string
      education: string
      contact: string
      skills: string
      skillGroups: Record<
        'languages' | 'frontend' | 'backend' | 'data' | 'delivery' | 'craft' | 'practice',
        string
      >
      /** "Used in X, Y" under a skill; the projects are already formatted. */
      usedIn: (projects: string) => string
      since: (year: number) => string
      fromCv: string
      fromCvNote: string
      alsoUses: string
      alsoUsesNote: string
      languages: string
      gpa: (value: string) => string
      notProvided: string
      contactLabels: Record<ContactId, string>
    }
    gallery: {
      finish: string
      lastPage: string
      keyHint: string
      loadError: string
      eyebrow: string
      title: string
      noPictures: string
      prev: string
      next: string
      close: string
    }
  }
}
