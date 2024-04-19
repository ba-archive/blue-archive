<script setup lang="ts">
import type { StoryWork } from '~/types/story-gallery'

defineProps<StoryWork>()
</script>

<template>
  <div class="my-work-card">
    {{ $props }}
  </div>
</template>
