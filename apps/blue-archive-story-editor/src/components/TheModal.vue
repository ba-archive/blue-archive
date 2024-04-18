<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    width?: string
    height?: string
    anchor?: HTMLElement | 'body' | 'slot'
    position?: 'top' | 'right' | 'bottom' | 'left' | 'center'
  }>(),
  {
    title: 'TheModal',
    position: 'center',
  },
)
const show = defineModel<boolean>('show', { default: false, required: true})
const modal = ref<HTMLDivElement | undefined>(undefined)

const modalPosition = computed(() => {
  void show.value // 副作用，当 show 更新的时候重新计算
  let el: HTMLElement

  if (props.anchor === 'body')
    el = document.documentElement
  else if (props.anchor === 'slot')
    el = modal.value || document.documentElement
  else if (props.anchor)
    el = props.anchor
  else
    el = document.documentElement

  if (props.position === 'center')
    return [Number.NaN, Number.NaN]

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
      v-show="show" class="the-modal-content"
      :class="{ 'pos-center': Number.isNaN(modalPosition[1]) && Number.isNaN(modalPosition[0]) }"
      :style="{ width, height, top: modalPosition[1], left: modalPosition[0] }"
      absolute box-content card h-auto w-auto shadow-lg
    >
      <div class="header" flex="~">
        <slot name="header">
          <div class="header-content" flex-1 text-center>
            <h2>{{ title }}</h2>
          </div>
        </slot>
        <i i-material-symbols:cancel-outline icon-btn @click="show = false" />
      </div>
      <div class="wrapper">
        <slot name="content" />
      </div>
    </div>
  </Teleport>
</template>
