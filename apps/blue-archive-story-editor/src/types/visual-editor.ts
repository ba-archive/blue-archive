export interface Character {
  id: string
  name: string
  group: string
  fx: string // 立绘
  emotion: string
}

export interface GNode {
  id: number
  characters: [Character | null, Character | null, Character | null, Character | null, Character | null]
  dialog: {
    text: string
    speaker: string
    group: string
  }
  position: [number, number]
  next: number | null
}
