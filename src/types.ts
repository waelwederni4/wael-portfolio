export type ProjectType = 'mobile' | 'web' | 'desktop'

export type Localized = string | { en: string; fr?: string; [k: string]: string | undefined }

export interface LinkSet { demo?: string; code?: string }
export interface MediaItem { type?: 'img' | 'video'; src: string }
export interface Project {
  title: string; slug: string; type: ProjectType
  year: number | null; period?: string; desc?: string
  stack?: string[]; highlights?: string[]; cover?: string; media?: MediaItem[]; links?: LinkSet
}
export interface Experience {
  company: string; role: string; location?: string; period: string; type?: 'fulltime'|'intern'|'parttime'
  bullets: string[]; stack?: string[]
}
