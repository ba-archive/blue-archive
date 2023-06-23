<template>
  <div class="card" :style="paddingTop">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ disablePaddingTop: boolean }>(), {
  disablePaddingTop: false,
});
const paddingTop = computed(() => {
  if (props.disablePaddingTop) {
    return { "padding-top": "0" };
  }
  return {};
});
</script>
<style lang="scss" scoped>
.card {
  padding: 16px;
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-light);
}
</style>
