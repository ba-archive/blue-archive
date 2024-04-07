import { acceptHMRUpdate, defineStore } from 'pinia'
import type { StoryNode } from '~/types/visual-editor'
import { StoryNodeType } from '~/types/visual-editor'

export const useVisualEditorStore = defineStore('visualEditor', () => {
  const storyNodes = ref<StoryNode[]>([])
  const storyIndex = ref(0)

  function newNode() {
    storyNodes.value.push({
      id: storyIndex.value += 1,
      type: StoryNodeType.DialogNode,
      dialog: {
        text: '',
        speaker: '',
        group: '',
      },
      next: null,
    })
    return storyNodes.value.at(-1)
  }

  return {
    storyNodes,
    newNode,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore as any, import.meta.hot))
