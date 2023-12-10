setup
<script setup lang="ts">
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

import type { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

const props = defineProps<{
  code: string
}>()

const emit = defineEmits<{
  'update:code': [code: string]
}>()

// code mirror
const customTheme = EditorView.theme({
  '*': {
    fontFamily: '\'Hack\', monospace',
    fontSize: '12px',
  },
})
const extensions = [javascript(), oneDark, customTheme]
const view = shallowRef<EditorView>()
const codeMirrorStyle = ref({ height: '1200px' })

function handleReady(payload: { view: EditorView; state: EditorState ; container: HTMLDivElement }) {
  view.value = payload.view
}
</script>

<template>
  <div class="codemirror-editor">
    <!-- <NexonScriptEditorToolbar /> -->
    <Codemirror
      :model-value="props.code"
      class="codemirror"
      placeholder=""
      :style="codeMirrorStyle"
      :autofocus="false"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      @update:model-value="emit('update:code', props.code)"
      @ready="handleReady"
    />
  </div>
</template>
