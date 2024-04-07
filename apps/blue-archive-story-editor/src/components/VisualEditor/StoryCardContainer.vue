<script setup lang="ts">
import type { StoryNode } from '~/types/visual-editor.ts'
import { StoryNodeType } from '~/types/visual-editor'

const storyNode = defineModel<StoryNode>({ required: true })

function handleSelect(value: StoryNodeType) {
  storyNode.value.type = value
  if (storyNode.value.type === StoryNodeType.DialogNode) {
    storyNode.value.dialog = storyNode.value.dialog || {
      text: '',
      speaker: '',
    }
  }
  else if (storyNode.value.type === StoryNodeType.CharacterNode) {
    storyNode.value.characters = storyNode.value.characters || [null, null, null, null, null]
  }
}

const cardContainer = ref<HTMLDivElement | null>(null)
provide('cardContainer', cardContainer)
</script>

<template>
  <div
    ref="cardContainer" class="story-card-container" card
  >
    <div class="header">
      id: {{ storyNode.id }}
      <TheSelect :model-value="storyNode.type" @update:model-value="handleSelect($event as StoryNodeType)">
        <TheSelectOption v-for="storyNodeType in StoryNodeType" :key="storyNodeType" :value="storyNodeType">
          {{ storyNodeType }}
        </TheSelectOption>
      </TheSelect>
    </div>
    <DialogCard
      v-if="storyNode.type === StoryNodeType.DialogNode"
      v-model="storyNode"
    />
    <CharacterCard
      v-else-if="storyNode.type === StoryNodeType.CharacterNode"
      v-model="storyNode"
    />
  </div>
</template>

<style scoped>
</style>
