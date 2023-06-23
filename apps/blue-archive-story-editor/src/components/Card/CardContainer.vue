<template>
  <div class="card">
    <div class="card-header">{{ title }}</div>
    <div class="card-body"><slot /></div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<IProps>(), {
  title: "",
});

type IProps = {
  title: string;
};
</script>

<style scoped lang="scss">
.card {
  $padding-top: 2px;
  $decoration-width: 3px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  .card-header {
    position: relative;
    padding-left: $decoration-width + 8px;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: $padding-top;
      height: calc(100% - $padding-top * 2);
      width: $decoration-width;
      background-color: var(--el-color-primary);
    }
  }
  .card-body {
    margin-top: 8px;
    flex: 1;
  }
}
</style>
