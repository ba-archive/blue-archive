export interface Character {
  id: number,
  name: string
  club: string
  face: string // 立绘
  emotion: string
}

export enum StoryNodeType {
  DialogNode = 'DialogNode',
  CharacterNode = 'CharacterNode',
}

export interface BaseNode {
  id: number
  type: StoryNodeType
  next: number | null
}

export type DialogNode = BaseNode & {
  type: StoryNodeType.DialogNode
  dialog: {
    speaker: number
    text: string
  }
}

export type CharacterNode = BaseNode & {
  type: StoryNodeType.CharacterNode
  characters: [Character | null, Character | null, Character | null, Character | null, Character | null]
}

export type StoryNode = DialogNode | CharacterNode
