import { acceptHMRUpdate, defineStore } from 'pinia'
import type { BackgroundNode, BgmNode, CharacterNode, DialogNode, NaNode, StoryNode, StoryNodeT, WaitNode } from '~/types/visual-editor'
import { StoryNodeType } from '~/types/visual-editor'

export const useVisualEditorStore = defineStore('visualEditor', () => {
  const storyNodes = ref<StoryNode[]>([])
  const storyIndex = ref(0)

  function getLastCharacters() {
    for (let i = storyIndex.value - 1; i > 0; i--) {
      const node = storyNodes.value[i]
      if (node.type === StoryNodeType.CharacterNode)
        return JSON.parse(JSON.stringify(node.characters))
    }
    return [null, null, null, null, null]
  }

  // declare function newNode<T extends StoryNodeType>(type: T): StoryNodeT<T>;
  function newNode<T extends StoryNodeType>(type: T): StoryNodeT<T> {
    const newStoryIndex = storyIndex.value + 1
    if (type === StoryNodeType.DialogNode) {
      const temp: DialogNode = {
        id: newStoryIndex,
        type: StoryNodeType.DialogNode,
        dialog: {
          speaker: 0,
          text: '',
        },
        next: null,
      }
      storyNodes.value.push(temp)
      storyIndex.value += 1
      return temp as StoryNodeT<T>
    }
    else if (type === StoryNodeType.BackgroundNode) {
      const temp: BackgroundNode = {
        id: newStoryIndex,
        type: StoryNodeType.BackgroundNode,
        backgroundId: 0,
        next: null,
      }
      storyNodes.value.push(temp)
      storyIndex.value += 1
      return temp as StoryNodeT<T>
    }
    else if (type === StoryNodeType.NaNode) {
      const temp: NaNode = {
        id: newStoryIndex,
        type: StoryNodeType.NaNode,
        speaker: 0,
        text: '',
        next: null,
      }
      storyNodes.value.push(temp)
      storyIndex.value += 1
      return temp as StoryNodeT<T>
    }
    else if (type === StoryNodeType.BgmNode) {
      const temp: BgmNode = {
        id: newStoryIndex,
        type: StoryNodeType.BgmNode,
        bgmId: 0,
        next: null,
      }
      storyNodes.value.push(temp)
      storyIndex.value += 1
      return temp as StoryNodeT<T>
    }
    else if (type === StoryNodeType.CharacterNode) {
      const temp: CharacterNode = {
        id: newStoryIndex,
        type: StoryNodeType.CharacterNode,
        characters: getLastCharacters(),
        next: null,
      }
      storyNodes.value.push(temp)
      storyIndex.value += 1
      return temp as StoryNodeT<T>
    }
    else if (type === StoryNodeType.WaitNode) {
      const temp: WaitNode = {
        id: newStoryIndex,
        type: StoryNodeType.WaitNode,
        milliSecond: 0,
        next: null,
      }
      storyNodes.value.push(temp)
      storyIndex.value += 1
      return temp as StoryNodeT<T>
    }
    else {
      throw new Error('unrecognized node')
    }
  }

  return {
    storyNodes,
    newNode,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore as any, import.meta.hot))
