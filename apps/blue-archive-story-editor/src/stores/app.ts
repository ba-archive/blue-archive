import { acceptHMRUpdate, defineStore } from 'pinia'
import student_data from '~/assets/character_data.json'
import type { CharacterData } from '~/types/app'

export const useAppStore = defineStore('app', () => {
  const charactersData = ref<CharacterData[]>(student_data.students)

  return {
    charactersData,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore as any, import.meta.hot))
