<script setup lang="ts">
const nexonScriptEditorStore = useNexonScriptEditorStore()
function loadAndPlay() {

}
</script>

<template>
  <div class="nexon-script-editor-toolbar" flex="~">
    <button @click="loadAndPlay">
      加载播放
    </button>
  </div>
</template>
