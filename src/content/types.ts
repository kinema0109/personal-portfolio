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

/** A dialogue step holds at most two short sentences. */
export type DialogueLines = readonly [string] | readonly [string, string]

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
  | 'rat'

export type ProjectId =
  | 'cbpo'
  | 'ca2t'
  | 'theavotree'
  | 'singlekey'
  | 'suzu'
  | 'ikara-admin'
  | 'yokara'

export type MemorySlotId = 'early' | 'return' | 'now'

export type SceneId = 'apartment' | 'workshop'

/** Where a choice leads. */
export type Target =
  | { kind: 'node'; id: NodeId }
  | { kind: 'project'; id: ProjectId }
  | { kind: 'archive' }
  | { kind: 'memory'; id: MemorySlotId }
  | { kind: 'cv' }

export interface Choice {
  label: string
  /** Short secondary line under the label. */
  hint?: string
  target: Target
}

export interface StoryNode {
  id: NodeId
  scene: SceneId
  /** Makes the poster in the apartment scene clickable. */
  posterEnabled?: boolean
  steps: readonly [DialogueStep, ...DialogueStep[]]
  choices: readonly Choice[]
}

export interface Project {
  id: ProjectId
  name: string
  company: string
  period: string
  featured: boolean
  /** null = the CV has no context description for this project. */
  context: string | null
  role: string
  contributions: readonly string[]
  technologies: readonly string[]
  /** Optional "how I work" dialogue about this project. */
  relatedNode?: NodeId
}

export interface MemoryEntry {
  title: string
  platform?: string
  note?: string
}

export interface MemorySlot {
  id: MemorySlotId
  label: string
  /** Confirmed statement for this slot, if any. */
  confirmed: DialogueStep | null
  /** Specific titles and memories. Empty = not supplied yet. */
  entries: readonly MemoryEntry[]
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
