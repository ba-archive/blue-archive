<script setup lang="ts">
const emitter = useEmitter()
</script>

<template>
  <div id="visual-editor" flex="~ 1 col" h100vh w100vw of-hidden bg-gray-1>
    <HeaderToolbar
      @reload-player="emitter.emit('editor.reload')"
      @edit-property="emitter.emit('editor.edit_story_property')"
      @save-story="emitter.emit('editor.save')"
    />
    <RouterView flex-1 />
  </div>
</template>
