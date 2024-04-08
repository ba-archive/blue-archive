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
      const temp = { ...template }
      if (!character) {
        console.error('buildNexonJSONStory error')
        continue
      }
      const scriptName = appStore.getCharacterScriptName(character.id)
      temp.ScriptKr = `${characterIndex + 1};${scriptName};${character.face};${dialog.text}\n`
      temp.TextCn = node.dialog.text
      result.content.push(temp)
    }
    else if (node.type === StoryNodeType.CharacterNode) {
      currentCharacters = node.characters
      const temp = { ...template }
      for (const [index, character] of node.characters.entries()) {
        if (character) {
          const scriptName = appStore.getCharacterScriptName(character.id)
          temp.ScriptKr += `${index + 1};${scriptName};${character.face};\n`
          if (character.emotion)
            temp.ScriptKr += `#${index + 1};em;${character.emotion}\n`
          if (character.effect)
            temp.ScriptKr += `#${index + 1};${character.effect}\n`
        }
      }
      result.content.push(temp)
    }
    else if (node.type === StoryNodeType.BackgroundNode) {
      result.content.push({ ...template, BGName: node.backgroundId })
    }
    else if (node.type === StoryNodeType.BgmNode) {
      result.content.push({ ...template, BGMId: node.bgmId })
    }
    else if (node.type === StoryNodeType.TitleNode) {
      result.content.push({ ...template, ScriptKr: `#title;${node.text}`, TextCn: node.text })
    }
    else if (node.type === StoryNodeType.WaitNode) {
      result.content.push({ ...template, ScriptKr: `#wait;${node.milliSecond}` })
    }
    else if (node.type === StoryNodeType.NaNode) {
      result.content.push({ ...template, ScriptKr: `#na;${node.text}`, TextCn: node.text })
    }
  }
  return result
}
