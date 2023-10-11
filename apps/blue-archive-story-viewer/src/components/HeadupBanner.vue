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

@media screen and (max-width: 768px) {
  .headup-banner {
    grid-template-columns: 1fr;
    grid-template-areas:
      "content"
      "action";
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    width: 100vw;
    width: 100dvw;

    &__content {
      border-bottom: 1px solid var(--color-text-decoration);
      padding-bottom: 0.5rem;

      p {
        white-space: normal;
      }
    }
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.625s ease-in-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translate3d(0, -100%, 0);
  opacity: 0;
}
</style>
