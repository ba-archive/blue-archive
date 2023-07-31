<script setup lang="ts">
defineProps<{
  content: string;
}>();

const emit = defineEmits<{ (event: "close"): void }>();
</script>

<template>
  <teleport to="body">
    <div class="headup-banner flex-horizontal">
      <div class="headup-banner__content">
        <p>{{ content }}</p>
      </div>
      <div
        class="headup-banner__action user-action-button rounded-small"
        @click="emit('close')"
      >
        关闭
      </div>
    </div>
  </teleport>
</template>

<style scoped lang="scss">
.headup-banner {
  position: fixed;
  top: 0;
  left: 0;
  justify-content: center;
  gap: 1rem;
  z-index: 9999;
  background-color: #fff;
  padding: 1rem;
  width: 100vw;
  width: 100dvw;

  &__action {
    white-space: nowrap;
  }
}
</style>
