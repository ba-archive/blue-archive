export interface StoryWorkCreate {
  title: string
  description: string
  cover: string 
  story: object
  released: boolean
}

export type StoryWorkUpdate = Partial<StoryWorkCreate>