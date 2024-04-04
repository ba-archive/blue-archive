import { acceptHMRUpdate, defineStore } from 'pinia'
import yuuka from '../../scripts/yuuka.json'
import type { NexonJSONStory } from '~/types/story'

export const useAppStore = defineStore('app', () => {
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
  import.meta.hot.accept(acceptHMRUpdate(useAppStore as any, import.meta.hot))
