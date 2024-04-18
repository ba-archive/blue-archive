import type { Character } from '~/types/visual-editor'

export class CharacterSelect {
  characterSelectShow: Ref<boolean>
  characterSelected: Ref<Character | null>
  private _resolve: ((value: Character | null) => void) | null = null

  constructor() {
    this.characterSelectShow = ref(false)
    this.characterSelected = ref(null)
  }

  selectCharacter(character: Character | null): Promise<Character | null> {
    this.characterSelected.value = character
    return new Promise((resolve) => {
      this.characterSelectShow.value = true
      this._resolve = resolve
    })
  }

  resolve() {
    if (this._resolve) {
      this._resolve(unref(this.characterSelected.value))
      this.characterSelectShow.value = false
    }
  }
}