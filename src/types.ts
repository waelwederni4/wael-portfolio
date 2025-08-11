// src/types.ts
export type ProjectType = 'mobile' | 'web' | 'desktop'
export type Localized = string | { en: string; fr?: string; [k: string]: string | undefined }
export type LocalizedList = string[] | { en: string[]; fr?: string[]; [k: string]: string[] | undefined }

export interface LinkSet { demo?: string; code?: string }

// You can add optional metadata to media items if you like:
export interface MediaItem {
  type?: 'img' | 'video'
  src: string
  caption?: Localized
  device?: 'phone' | 'tablet' | 'browser' | 'desktop'  // "desktop" will be normalized to "browser"
  w?: number
  h?: number
  poster?: string
}

export interface Project {
  title: Localized | string
  slug: string
  type: ProjectType
  year: number | null
  period?: Localized | string
  desc?: Localized | string
  stack?: string[]
  highlights?: Localized[] | string[]
  roles?: LocalizedList            // <-- NEW
  team?: LocalizedList             // <-- NEW
  achievements?: LocalizedList     // <-- NEW
  cover?: string
  media?: MediaItem[]
  links?: LinkSet
}

export interface Experience {
  company: string
  role: string
  location?: string
  period: string
  type?: 'fulltime'|'intern'|'parttime'
  bullets: string[]
  stack?: string[]
}
