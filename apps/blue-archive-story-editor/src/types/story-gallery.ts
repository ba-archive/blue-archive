import type { StoryNode } from './visual-editor'

export interface StoryWork {
  created: string
  updated: string
  id: string
  title: string
  description: string
  cover: string
  author: {
    created: string
    updated: string
    name: string
    nickname: string
    email: string
    avatar: string
    id: string
  }
  loves: number
  hits: number
  released: boolean
  story: { content: StoryNode[] }
}
