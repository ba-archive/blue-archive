import { acceptHMRUpdate, defineStore } from 'pinia'
import yuuka from '../../scripts/yuuka.json'
import type { NexonJSONStory } from '~/types/story'

export const useEditorStore = defineStore('editor', () => {
  const nexonJSONStory = ref<NexonJSONStory>()

  function loadNexonJSONStory() {
    nexonJSONStory.value = yuuka
    return nexonJSONStory as Ref<NexonJSONStory >
  }

  return {
    nexonJSONStory, loadNexonJSONStory,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useEditorStore as any, import.meta.hot))
