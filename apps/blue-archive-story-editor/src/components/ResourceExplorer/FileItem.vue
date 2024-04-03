<script setup lang="ts">
const props = withDefaults(defineProps<{
  arrow?: 'expanded' | 'collapsed' | 'none' // 箭头 展开 收起 不显示
  indentLevel?: number
  color?: string
  icon?: string
  title: string
}>(), {
  arrow: 'none',
  indentLevel: 0,
  color: 'white',
  icon: 'i-vscode-icons:default-file',
})

const emit = defineEmits<{
  (e: 'update:arrow', value: 'expanded' | 'collapsed' | 'none'): void
  (e: 'click', event: MouseEvent): void
}>()

const INDENT_LENGTH = 10

const arrowClass = computed(() => {
  const classBuilder = {
    'i-ic:twotone-keyboard-arrow-right': props.arrow === 'collapsed',
    'i-ic:twotone-keyboard-arrow-down': props.arrow === 'expanded',
    'invisible': props.arrow === 'none',
  }
  return classBuilder
})

const fileItemStyle = computed(() => {
  return {
    paddingLeft: `${INDENT_LENGTH * props.indentLevel}px`,
  }
})

function handleClick(event: MouseEvent) {
  emit('update:arrow', props.arrow === 'none' ? 'none' : props.arrow === 'expanded' ? 'collapsed' : 'expanded')
  emit('click', event)
}
</script>

<template>
  <div
    class="file-item" :style="fileItemStyle" min-w-70px flex="~ items-center" cursor-pointer
    @click="handleClick"
  >
    <i :class="{ ...arrowClass }" inline-block h-5 w-5 shrink-0 />
    <i :class="[props.icon]" inline-block shrink-0 />
    <span mx-1 select-none of-hidden text-ellipsis>{{ title }}</span>
  </div>
</template>

<style lang="scss" scoped>

</style>

<preview lang="md">
  # Preview FileItem.vue

  <script setup>
    import FileItem from "./FileItem.vue"
    const arrow = ref('collapsed')
    const previewProps = ref({
      title: 'yuuka',
      arrow: arrow,
      indentLevel: 2,
    })
    const handleClick = () => {
      arrow.value = arrow.value === 'collapsed' ? 'expanded' : 'collapsed'
    }
  </script>

  <template>
    <div style="resize: horizontal; width: 300px; overflow: hidden;">
      <FileItem v-bind="previewProps" v-model:arrow="previewProps.arrow"/>
    </div>
  </template>
</preview>
