export interface Character {
  id: number
  name: string
  club: string
  face: string // 立绘
  emotion: string
  effect: string // todo use null other than ''
}

export enum StoryNodeType {
  DialogNode = 'DialogNode',
  CharacterNode = 'CharacterNode',
  BackgroundNode = 'BackgroundNode',
  TitleNode = 'TitleNode',
  BgmNode = 'BgmNode',
  WaitNode = 'WaitNode',
  NaNode = 'NaNode',
}

export interface BaseNode {
  id: number
  type: StoryNodeType
  next: number | null
}

export type DialogNode = BaseNode & {
  type: StoryNodeType.DialogNode
  dialog: {
    speaker: number // todo use student id, unwrap dialog
    text: string
  }
}

export type CharacterNode = BaseNode & {
  type: StoryNodeType.CharacterNode
  characters: [Character | null, Character | null, Character | null, Character | null, Character | null]
}

export type BackgroundNode = BaseNode & {
  type: StoryNodeType.BackgroundNode
  backgroundId: number
}

export type BgmNode = BaseNode & {
  type: StoryNodeType.BgmNode
  bgmId: number
}

export type TitleNode = BaseNode & {
  type: StoryNodeType.TitleNode
  text: string
}

export type WaitNode = BaseNode & {
  type: StoryNodeType.WaitNode
  milliSecond: number
}

export type NaNode = BaseNode & {
  type: StoryNodeType.NaNode
  speaker: number
  text: string
}

// todo st clearSt [s] #all:hide #continued #nextepisode
export type StoryNode =
  DialogNode | CharacterNode | BackgroundNode | TitleNode | BgmNode | TitleNode | WaitNode | NaNode
