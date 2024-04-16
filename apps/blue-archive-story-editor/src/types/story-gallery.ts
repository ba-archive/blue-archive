export interface StoryWork{
  id: number
  title: string
  description: string
  cover: string
  publishTs: number
  author: {
    name: string
    avatar: string
  }
  loves: number
  hits: number
}
