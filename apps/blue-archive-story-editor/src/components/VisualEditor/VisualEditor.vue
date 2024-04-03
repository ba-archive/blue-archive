<script setup lang="ts">
import type { GNode } from '~/types/visual-editor.ts'

const testCharacter = {
  id: 'yuuka',
  name: 'yuuka',
  group: 'yuuka\'s group',
  fx: 'normal',
  emotion: 'smile',
}

const testData: Ref<GNode[]> = ref([
  {
    id: 0,
    characters: [null, null, testCharacter, null, null],
    dialog: {
      text: 'textetxttext',
      speaker: 'yuuka',
      group: 'yuuka\'s group',
    },
    position: [50, 25],
    next: 1,
  },
  {
    id: 2,
    characters: [null, null, null, null, null],
    dialog: {
      text: 'textetxttext',
      speaker: 'yuuka',
      group: 'yuuka\'s group',
    },
    position: [150, 25],
    next: 3,
  },
  {
    id: 3,
    characters: [null, null, null, null, null],
    dialog: {
      text: 'textetxttext',
      speaker: 'yuuka',
      group: 'yuuka\'s group',
    },
    position: [250, 25],
    next: 4,
  },
])

const canvas: Ref<HTMLDivElement | null> = ref(null)

// 移动卡片
const currentMoving: Ref<GNode | null> = ref(null)
const cardPositionOffset: Ref<[number, number] | null> = ref(null) // 开始移动相对与卡片左上角偏移量

function handleCardMouseDown(event: MouseEvent, node: GNode) {
  currentMoving.value = node
  cardPositionOffset.value = [event.offsetY, event.offsetX]
}

function handleCardMouseUp() {
  currentMoving.value = null
  cardPositionOffset.value = null
}

function handleMouseMove(event: MouseEvent) {
  if (!currentMoving.value || !canvas.value)
    return
  currentMoving.value.position[0] = event.clientY - canvas.value.offsetTop - cardPositionOffset.value![0]
  currentMoving.value.position[1] = event.clientX - canvas.value.offsetLeft - cardPositionOffset.value![1]
}
</script>

<template>
  <div class="visual-editor">
    <div
      ref="canvas" class="canvas" relative h200 w300 bg-gray-1
      @mouseup="handleCardMouseUp"
      @mousemove.stop="handleMouseMove"
    >
      <ConversationCard
        v-for="node, i in testData"
        :key="node.id"
        v-model="testData[i]"
        :style="{ top: `${node.position[0]}px`, left: `${node.position[1]}px` }"
        absolute select-none
        @mousedown="handleCardMouseDown($event, node)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
