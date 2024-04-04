<script setup lang="ts">
import type { Student } from '~/types/app'
import {useAppStore} from "~/stores/app"

const appStore = useAppStore()
const students: ref<Student[]> = appStore.students
</script>

<template>
  <div class="student-select" grid-auto-cols-5>
    <img src="https://sdfsdf.dev/50x50.jpg">
  </div>
</template>
