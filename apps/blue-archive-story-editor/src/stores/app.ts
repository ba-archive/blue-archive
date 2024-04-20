import { acceptHMRUpdate, defineStore } from 'pinia'
import student_data from '~/assets/character_data.json'
import backgrounds from '~/assets/excel/ScenarioBGNameExcelTable.json'
import type { CharacterData } from '~/types/app'

const DEFAULT_AVATAR_URL = 'https://sdfsdf.dev/50x50.jpg'

export const useAppStore = defineStore('app', () => {
  // const pixiApp = shallowRef<Application | undefined>(undefined)
  const charactersData = ref<CharacterData[]>(student_data.students)

  // todo 优化
  function getCharacterAvatarUrl(id: number) {
    if (id === 0)
      return DEFAULT_AVATAR_URL
    for (const each of charactersData.value) {
      if (id === each.id) {
        const url2 = `https://yuuka.cdn.diyigemt.com/image/ba-all-data/${each.textureDir}.png`
        return url2
      }
    }
    return DEFAULT_AVATAR_URL
  }

  function getCharacter(id: number) {
    for (const each of charactersData.value) {
      if (id === each.id)
        return each
    }
  }

  function getCharacterSpineUrl(id: number) {
    // return `/SpineCharacters/${character.id}_spr/${character.id}_spr.skel`
    for (const each of charactersData.value) {
      if (id === each.id) {
        const matched = each.spinePath.match(/CharacterSpine_(.*)/)
        if (matched) {
          const spineName = matched[1]
          return `https://yuuka.cdn.diyigemt.com/image/ba-all-data/spine/${spineName}_spr/${spineName}_spr.skel`
        }
        return ''
      }
    }
    return ''
  }

  function getCharacterScriptName(id: number) {
    const character = getCharacter(id)
    if (character)
      return character.nameKr.replace('(', ' ').replace(')', '')
  }

  function getBackground(id: number) {
    // todo 使用自己的数据结构
    for (const background of backgrounds.DataList) {
      if (background.Name === id)
        return background
    }
  }

  function getBackgroundUrl(id: number) {
    // todo 使用自己的数据结构
    const background = getBackground(id)
    if (background)
      return `https://yuuka.cdn.diyigemt.com/image/ba-all-data/${background.BGFileName}.jpg`
    return 'https://sdfsdf.dev/100x70.jpg'
  }

  return {
    charactersData,
    getCharacterAvatarUrl,
    getCharacterSpineUrl,
    getCharacterScriptName,
    getCharacter,
    getBackground,
    getBackgroundUrl,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore as any, import.meta.hot))
