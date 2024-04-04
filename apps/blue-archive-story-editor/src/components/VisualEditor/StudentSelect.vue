<script setup lang="ts">
import { useAppStore } from '~/stores/app'

const appStore = useAppStore()
</script>

<template>
  <div class="student-select" grid-auto-cols-5>
    <img
      v-for="student in appStore.students"
      :key="student.id" src="https://sdfsdf.dev/50x50.jpg"
    >
  </div>
</template>
