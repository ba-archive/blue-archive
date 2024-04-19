<script setup lang="ts">
const show = defineModel<boolean>('show', { required: true })
const store = useVisualEditorStore()


</script>

<template>
  <TheModal v-model:show="show" title="故事属性">
    <template #content>
      <div class="story-property">
        <TheInput label="故事名" v-model="store.storyTitle"/>
        <TheInput label="故事描述" v-model="store.storyDescription"/>
        <TheInput label="封面" v-model="store.storyCover"/>
        <TheInput label="是否发布" v-model="store.storyReleased"/>
      </div>
    </template>
  </TheModal>
</template>
