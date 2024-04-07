import { acceptHMRUpdate, defineStore } from 'pinia'
import student_data from '~/assets/character_data.json'
import type { CharacterData } from '~/types/app'

const DEFAULT_AVATAR_URL = 'https://sdfsdf.dev/50x50.jpg'

export const useAppStore = defineStore('app', () => {
  const charactersData = ref<CharacterData[]>(student_data.students)

  // todo 优化
  function getCharacterAvatarUrl(id: number) {
    // const url1 = `/avatars/${id}.webp`
    // if (await checkImageExist(url1)) {
    //   return url1
    // }
    // else {
    if (id === 0)
      return DEFAULT_AVATAR_URL
    for (const each of charactersData.value) {
      if (id === each.id) {
        const url2 = `https://yuuka.cdn.diyigemt.com/image/ba-all-data/${each.textureDir}.png`
        // if (await checkImageExist(url2))
        return url2
      }
    }
    return DEFAULT_AVATAR_URL
    // }
  }

  return {
    charactersData,
    getCharacterAvatarUrl,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore as any, import.meta.hot))
