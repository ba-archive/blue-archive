<script setup lang="ts">
withDefaults(
  defineProps<{
    show?: boolean;
    content: string;
    showActionButton?: boolean;
    actionButtonText?: string;
    closeButtonText?: string;
    showPermanentCloseButton?: boolean;
    permanentCloseButtonText?: string;
  }>(),
  {
    show: true,
    content: "",
    showActionButton: false,
    actionButtonText: "Action",
    closeButtonText: "关闭",
    showPermanentCloseButton: false,
    permanentCloseButtonText: "不再提醒",
  }
);

const emit = defineEmits<{
  (event: "actionButtonClicked"): void;
  (event: "closeButtonClicked"): void;
  (event: "permanentCloseButtonClicked"): void;
}>();
</script>

<template>
  <teleport to="body">
    <transition name="slide-fade">
      <div v-if="show" class="headup-banner">
        <div class="headup-banner__content">
          <p>{{ content }}</p>
        </div>
        <div class="headup-banner__action flex-horizontal">
          <div
            v-if="showActionButton || !!actionButtonText"
            class="action-button user-action-button rounded-small"
            @click="emit('actionButtonClicked')"
          >
            {{ actionButtonText }}
          </div>
          <div
            class="close-button user-action-button outline rounded-small"
            @click="emit('closeButtonClicked')"
          >
            {{ closeButtonText }}
          </div>
          <div
            v-if="showPermanentCloseButton"
            class="permanent-close"
            @click="emit('permanentCloseButtonClicked')"
          >
            {{ permanentCloseButtonText }}
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped lang="scss">
.headup-banner {
  display: grid;
  position: fixed;
  top: 0;
  left: 0;
  grid-template-columns: 1fr max-content;
  grid-template-areas: "content action";
  justify-content: center;
  place-items: center;
  gap: 1rem;
  z-index: 9999;
  background-color: #fff;
  padding: 0.5rem 1rem;
  width: 100vw;
  width: 100dvw;

  &__content {
    grid-area: content;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__action {
    grid-area: action;
    gap: 1rem;
    white-space: nowrap;

    .user-action-button {
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
    }

    .permanent-close {
      cursor: pointer;
      font-size: 12px;
      text-decoration: underline;
    }
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
