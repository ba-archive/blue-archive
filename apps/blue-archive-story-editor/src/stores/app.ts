import { acceptHMRUpdate, defineStore } from 'pinia'
import student_data from '~/assets/students.json'
import type { Student } from '~/types/app'

export const useAppStore = defineStore('app', () => {
  const student = ref<Student[]>(
    student_data.map((item) => {
      return {
        id: item.id,
        name: item.name.cn,
        club: item.club,
      }
    }),
  )

  return {
    student,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore as any, import.meta.hot))
