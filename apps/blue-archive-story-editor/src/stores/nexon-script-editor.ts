import { acceptHMRUpdate, defineStore } from 'pinia'

export const useNexonScriptEditorStore = defineStore('nexon-script-editor', () => {
  const code = ref('')
  return {
    code,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useNexonScriptEditorStore as any, import.meta.hot))
