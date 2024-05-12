<script setup lang="ts">
import { IconDelete } from "@arco-design/web-vue/es/icon";
function handleClick() {
  const shouldClearLocalStorage = confirm("确定清空本地缓存吗？\n一旦清空，所有数据都会丢失。");
  if (shouldClearLocalStorage) {
    localStorage.clear();
    location.reload();
  }
}
</script>

<template>
  <n-tooltip placement="left">
    <template #trigger>
      <div
        role="button"
        class="p-3 bg-white rounded-full shadow-lg flex cursor-pointer"
        @click="handleClick"
      >
        <icon-delete class="w-[20px] text-red-6" />
      </div>
    </template>
    <span>清空本地缓存，此操作不可逆</span>
  </n-tooltip>
</template>

<style scoped lang="scss"></style>
