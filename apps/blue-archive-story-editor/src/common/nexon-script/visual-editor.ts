import type { NexonJSONStory } from '~/types/story'
import type { Character, StoryNode } from '~/types/visual-editor'
import { StoryNodeType } from '~/types/visual-editor'

const appStore = useAppStore()

export function buildNexonJSONStory(nodes: StoryNode[]) {
  const result: NexonJSONStory = {
    GroupId: 2333,
    translator: '',
    content: [],
  }
  let currentCharacters: (Character | null)[] = [null, null, null, null, null]
  for (const node of nodes) {
    const template = {
      GroupId: result.GroupId,
      SelectionGroup: 0,
      BGMId: 0,
      Sound: '',
      Transition: 0,
      BGName: 0,
      BGEffect: 0,
      PopupFileName: '',
      ScriptKr: '',
      TextJp: '',
      TextCn: '',
      TextTw: '',
      TextEn: '',
      VoiceJp: '',
    }
    // if (command.type === JSONStoryCommandType.Title) {
    //   temp.ScriptKr = `#title;${AST2Text([command.title[Lang.kr]])};${AST2Text([command.subtitle?.[Lang.kr]])};`
    // }
    // else if (command.type === JSONStoryCommandType.Place) {
    //   temp.ScriptKr = `#place;${command.place};`
    // }
    // else if (command.type === JSONStoryCommandType.Wait) {
    //   temp.ScriptKr = `#wait;${command.millionSecond};`
    // }
    if (node.type === StoryNodeType.DialogNode) {
      const dialog = node.dialog
      const characterIndex = node.dialog.speaker
      const character = currentCharacters[characterIndex]
      if (!character) {
        console.error('buildNexonJSONStory error')
        continue
      }
      const scriptName = appStore.getCharacterScriptName(character.id)
      template.ScriptKr = `${characterIndex + 1};${scriptName};${character.face};${dialog.text}\n`
      template.TextCn = node.dialog.text
      result.content.push({ ...template })
    }
    else if (node.type === StoryNodeType.CharacterNode) {
      currentCharacters = node.characters
      for (const [index, character] of node.characters.entries()) {
        if (character) {
          const scriptName = appStore.getCharacterScriptName(character.id)
          template.ScriptKr += `${index + 1};${scriptName};${character.face};\n`
        }
      }
      result.content.push({ ...template })
    }
  }
  return result
}
