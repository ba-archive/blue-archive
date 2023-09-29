<template>
  <div
    class="card-unit shadow-near"
    :class="[props.type.toLowerCase(), { unsure: props.unsure }]"
    :id="props?.id"
  >
    <div class="card-title">
      <span
        @click="handleClickToJump"
        :class="{ isJumpAvailable: props.jumpTo }"
        >{{ title }}</span
      >
      <div class="unsure-flag-checkbox">
        <n-checkbox
          v-model:checked="isUnsure"
          @update:checked="handleUnsureChange"
        ></n-checkbox>
        <span>这个翻译我不确定！</span>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    title: string;
    type: 'Title' | 'None' | 'FavorRankUp' | 'Answer' | 'Feedback';
    unsure?: boolean;
    id?: string;
    jumpTo?: string;
  }>(),
  {
    title: '消息卡片',
    type: 'FavorRankUp',
    unsure: false,
  }
);

const isUnsure = ref(props.unsure);

function handleClickToJump() {
  if (props.jumpTo) {
    const element = document.getElementById(props.jumpTo);
    if (element) {
      element.scrollIntoView({
        behavior: 'instant',
        block: 'start',
        inline: 'start',
      });
    }
  }
}

watch(
  () => props.unsure,
  value => {
    isUnsure.value = value;
  }
);

const emit = defineEmits(['flagUnsure']);

function handleUnsureChange(value: boolean) {
  console.log('flagUnsure', value);
  emit('flagUnsure', value);
}
</script>

<style scoped lang="scss">
.card-unit {
  display: flex;
  flex: 1;
  flex-direction: column;
  transition: all 0.375s ease-in-out;
  border-radius: 3px;
  padding: 20px 24px;
  height: 100%;

  &.title,
  &.feedback,
  &.none {
    background-color: #fff;
  }

  &.favorrankup {
    background-color: var(--color-background-error);
  }

  &.answer {
    background-color: var(--color-background-success);
  }

  &.unsure {
    background-color: var(--color-background-warning) !important;
  }

  &:hover {
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.08),
      0 3px 6px 0 rgba(0, 0, 0, 0.06), 0 5px 12px 4px rgba(0, 0, 0, 0.04);
  }
}

.card-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  margin-bottom: 16px;
  font-weight: bold;
  font-size: 18px;

  .isJumpAvailable {
    cursor: pointer;
    text-decoration: underline;
  }

  .unsure-flag-checkbox {
    color: gray;
    font-weight: normal;
    font-size: 14px;

    span {
      margin-left: 4px;
    }
  }
}
</style>
