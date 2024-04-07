<script setup lang="ts">
const props = defineProps<{
  title?: string
  width?: string
  height?: string
  anchor?: HTMLElement
}>()
const show = defineModel<boolean>('show')
const modal = ref<HTMLDivElement | undefined>(undefined)

const modalPosition = computed(() => {
  void show.value  // 副作用，当 show 更新的时候重新计算
  const el = props.anchor || modal.value
  if (!el)
    return [0, 0]
  const rect = el.getBoundingClientRect()
  const body = document.documentElement

  const x = `${rect.right + body.scrollLeft + 8}px`
  const y = `${rect.top + body.scrollTop}px`
  return [x, y]
})
</script>

<template>
  <div ref="modal" class="the-modal">
    <slot />
  </div>
  <Teleport to="body">
    <div
      v-show="show" class="the-modal-content" :class="{ 'pos-center': !(modalPosition[1] && modalPosition[0]) }"
      :style="{ width, height, top: modalPosition[1], left: modalPosition[0] }"
      absolute
    >
      <div class="header">
        <slot name="header" />
      </div>
      <div class="container">
        <slot name="content" />
      </div>
    </div>
  </Teleport>
</template>
