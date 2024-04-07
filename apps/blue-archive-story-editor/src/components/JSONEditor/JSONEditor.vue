<script setup lang="ts">
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

import type { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

const props = defineProps<{
  code: string
  height?: string,
  width?: string,
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
const codeMirrorStyle = ref({ height: props.height || '1200px', width: props.width })

function handleReady(payload: { view: EditorView, state: EditorState, container: HTMLDivElement }) {
  view.value = payload.view
}
</script>

<template>
  <div class="json-editor">
    <!-- <NexonScriptEditorToolbar /> -->
    <Codemirror
      class="codemirror"
      placeholder=""
      v-bind="$attrs"
      :model-value="props.code"
      :style="codeMirrorStyle"
      :autofocus="false"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      @update:model-value="emit('update:code', $event)"
      @ready="handleReady"
    />
  </div>
</template>
