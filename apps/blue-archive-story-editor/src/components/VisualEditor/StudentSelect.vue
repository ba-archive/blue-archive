<script setup lang="ts">
import { useAppStore } from '~/stores/app'
import type { Student } from '~/types/app'

const appStore = useAppStore()

const modelValue = defineModel<{
  id: number
  name: string
  club: string
  fx: string
  emotion: string
} | null>({ required: true })

const selected = computed({
  get: () => {
    return modelValue.value || {
      id: 0,
      name: '',
      club: '',
      fx: '',
      emotion: '',
    }
  },
  set: (value) => {
    if (!value.id)
      modelValue.value = null
    else
      modelValue.value = value
  },
})

function getStudentAvatar(id: number) {
  if (id)
    return `/avatars/${id}.webp`
  else return 'https://sdfsdf.dev/70x70.jpg'
}

function handleStudentSelect(student: Student) {
  selected.value = { ...student, fx: '', emotion: '' }
}
</script>

<template>
  <div
    class="student-select"
    w480px b-rd-md bg-white p4 shadow-md
  >
    <div class="student-data" mb-2 flex px1>
      <img
        :src="selected ? getStudentAvatar(selected.id) : 'https://sdfsdf.dev/50x50.jpg'"
        h26 w26 b-rd-2
      >
      <div flex="~ col" ml4 gap-y-1>
        <div class="name">
          {{ selected.name }}
        </div>
        <div class="fx">
          <TheInput v-model="selected.fx" label="fx" />
        </div>
        <div class="emotion">
          <TheInput v-model="selected.emotion" label="emotion" />
        </div>
      </div>
    </div>
    <ul
      class="students"
      grid="~ cols-5 justify-items-center"
      hmd wmd gap-2 of-x-hidden of-y-auto p-1
    >
      <li
        v-for="student in appStore.students" :key="student.id"
        relative h20 w20 select-none of-hidden b-rd-2 transition hover:scale-110
        @click="handleStudentSelect(student)"
      >
        <img
          :src="getStudentAvatar(student.id)"
          h20 w20
        >
        <div
          class="name"
          absolute bottom-0 h5 w-full of-hidden ws-nowrap p-x-1
          text="~ white size-sm center shadow-sm ellipsis" bg="gray op-70"
        >
          {{ student.name }}
        </div>
      </li>
    </ul>
  </div>
</template>
