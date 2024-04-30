<script setup lang="ts">
import type { DialogNode } from '~/types/visual-editor.ts'

const model = defineModel<DialogNode>({ required: true })
</script>

<template>
  <div class="dialog-card">
    <div class="dialog" children:my1>
      <div flex>
        <label>
          <span h-full w-20 flex items-center>角色位置</span>
        </label>
        <div class="radio-group" flex="1 ~ justify-between" gap-1>
          <button
            v-for="i in [0, 1, 2, 3, 4]" :key="i"
            :class="{ 'bg-gray-2': model.dialog.speaker === i }"
            p="x-2 y-.5" max-w-10 w-auto flex-1 text-center btn
            border="~ rounded gray-200 dark:gray-700" outline="none active:none"
            @click="model.dialog.speaker = i"
          >
            {{ i + 1 }}
          </button>
        </div>
      </div>
      <div>
        <TheInput v-model="model.dialog.text" label="text" type="text" />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
