export interface StoryWorkCreate {
  title: string
  description: string
  cover: string
  story: object
  released: boolean
}

export type StoryWorkUpdate = Partial<StoryWorkCreate>

export interface Upload {
  created: string
  updated: string
  user: {
    created: string
    updated: string
    name: string
    nickname: string
    email: string
    avatar: string
    id: string
  }
  ext: string
  name: string
  path: string
  hash: string
}
