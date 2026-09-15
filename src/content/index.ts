import { en } from './i18n/en'
import { localizeProjects } from './projects'
import { buildStory } from './story'
import type { DialogueLines, Locale, LocaleContent, NodeId, Project, ProjectId, StoryNode } from './types'

/** Everything the screen needs in one language. */
export interface Content {
  locale: Locale
  text: LocaleContent
  story: Readonly<Record<NodeId, StoryNode>>
  projects: readonly Project[]
  featuredProjects: readonly Project[]
  archivedProjects: readonly Project[]
  getProject: (id: ProjectId) => Project
  /** Every dialogue step this language can show; sizes the fixed textbox to the longest one. */
  allLines: readonly DialogueLines[]
}

function build(locale: Locale, text: LocaleContent): Content {
  const projects = localizeProjects(text)
  const featuredProjects = projects.filter((p) => p.featured)
  const archivedProjects = projects.filter((p) => !p.featured)
  const story = buildStory(text, featuredProjects, archivedProjects.length)
  return {
    locale,
    text,
    story,
    allLines: [
      ...Object.values(story).flatMap((node) => node.steps.map((step) => step.lines)),
      ...projects.map((p) => text.views.project(p, Boolean(p.relatedNode))),
      text.views.archive,
      text.views.galleryEmpty,
      text.views.gallery,
      text.views.cv,
    ],
    projects,
    featuredProjects,
    archivedProjects,
    getProject: (id) => {
      const project = projects.find((p) => p.id === id)
      if (!project) throw new Error(`Unknown project: ${id}`)
      return project
    },
  }
}

/** One entry per enabled language. To add one: extend `Locale`, add its file in ./i18n and list it here and in LOCALES. */
export const CONTENT: Readonly<Record<Locale, Content>> = {
  en: build('en', en),
}
