<script setup lang="ts">
import type { CharacterNode, DialogNode, StoryNode } from '~/types/visual-editor.ts'
import { StoryNodeType } from '~/types/visual-editor'

const storyIndex = ref(4)

const testCharacter = {
  id: 'yuuka',
  name: 'yuuka',
  group: 'yuuka\'s group',
  fx: 'normal',
  emotion: 'smile',
}

const testData: Ref<DialogNode[]> = ref([
  {
    id: 0,
    type: StoryNodeType.DialogNode,
    dialog: {
      text: 'textetxttext',
      speaker: 'yuuka',
      group: 'yuuka\'s group',
    },
    next: 1,
  },
  {
    id: 2,
    type: StoryNodeType.DialogNode,
    dialog: {
      text: 'textetxttext',
      speaker: 'yuuka',
      group: 'yuuka\'s group',
    },
    next: 3,
  },
  {
    id: 3,
    type: StoryNodeType.DialogNode,
    dialog: {
      text: 'textetxttext',
      speaker: 'yuuka',
      group: 'yuuka\'s group',
    },
    next: 4,
  },
])

const testCharacterData: Ref<CharacterNode[]> = ref([
  {
    id: 4,
    type: StoryNodeType.CharacterNode,
    characters: [null, null, null, testCharacter, null],
    next: 5,
  },
])

const storyNodes = ref<StoryNode[]>([
  ...testData.value,
  ...testCharacterData.value,
])

function handleAddCard() {
  storyNodes.value.push({
    id: storyIndex.value += 1,
    type: StoryNodeType.DialogNode,
    dialog: {
      text: '',
      speaker: '',
      group: '',
    },
    next: null,
  })
}

const selectedStudent = ref<{
  id: number
  name: string
  club: string
  fx: string
  emotion: string
} | null>(null)
</script>

<template>
  <div class="visual-editor">
    <div
      class="canvas" inline-block
      bg-gray-1 p-3 children:m-y-3
    >
      <StoryCardContainer
        v-for="_, i in storyNodes" :key="storyNodes[i].id"
        v-model="storyNodes[i]"
      />
      <AddCard @click="handleAddCard" />
      <StudentSelect v-model="selectedStudent" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
