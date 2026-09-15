/**
 * Content types for the visual novel.
 * All visitor-facing text lives in src/content/*.ts and is typed by this file.
 */

/**
 * ready       – safe to show as-is (facts from the CV, or neutral framing text)
 * draft       – proposed first-person wording that Thọ still has to confirm
 * placeholder – real content not supplied yet
 */
export type ContentStatus = 'ready' | 'draft' | 'placeholder'

/** A dialogue step holds one to three lines, each one or two sentences. */
export type DialogueLines = readonly [string] | readonly [string, string] | readonly [string, string, string]

export interface DialogueStep {
  speaker: string
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
  /** Makes the album on the desk clickable on this node. */
  albumEnabled?: boolean
  steps: readonly [DialogueStep, ...DialogueStep[]]
  choices: readonly Choice[]
}

export interface Project {
  id: ProjectId
  name: string
  company: string
  period: string
  featured: boolean
  /** null = no context description available yet. */
  context: string | null
  role: string
  contributions: readonly string[]
  technologies: readonly string[]
  /** Optional "how I work" dialogue about this project. */
  relatedNode?: NodeId
}

export interface GalleryItem {
  /** Path relative to /public, e.g. 'gallery/rooftop.png'. */
  file: string
  title: string
  /** Describes the picture for screen readers. */
  alt: string
  /** Optional credit line shown under the picture. */
  credit?: string
}

export interface ContactItem {
  label: string
  kind: 'email' | 'url'
  /** null = not supplied yet. Email address or full https:// URL. */
  value: string | null
}

export interface SiteConfig {
  name: string
  role: string
  cv: {
    /** Path relative to /public. The app checks at runtime that it exists. */
    file: string
  }
  contact: readonly ContactItem[]
  review: {
    /** Show draft/placeholder tags and sources. Set to false for production. */
    showContentStatus: boolean
    /** Show the "placeholder artwork" notice on the illustrations. */
    showArtworkNotice: boolean
  }
}
