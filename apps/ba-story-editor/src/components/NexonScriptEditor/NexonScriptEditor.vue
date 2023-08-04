<script setup lang="ts">
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

import type { EditorState } from '@codemirror/state'
import type { EditorView } from '@codemirror/view'

const props = defineProps<{}>()

// code mirror
const code = ref('')
const extensions = [javascript(), oneDark]
const view = shallowRef<EditorView>()
const codeMirrorStyle = ref({ height: '400px' })

function handleReady(payload: { view: EditorView; state: EditorState ; container: HTMLDivElement }) {
  view.value = payload.view
}
</script>

<template>
  <div class="nexon-script-editor">
    <Codemirror
      :module-value="code"
      placeholder="Code goes here..."
      :style="codeMirrorStyle"
      :autofocus="false"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      @ready="handleReady"
    />
  </div>
</template>

<style scoped>

</style>
