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
      group: '',
    }
  }
  else if (storyNode.value.type === StoryNodeType.CharacterNode) {
    storyNode.value.characters = storyNode.value.characters || [null, null, null, null, null]
  }
}
</script>

<template>
  <div
    class="story-card-container"
    w-sm b-rd bg-white
    p4 py2 shadow-md
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
