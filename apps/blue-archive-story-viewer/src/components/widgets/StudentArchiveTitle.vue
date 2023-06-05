<script setup lang="ts">
import { computed } from 'vue';

const emit = defineEmits(['clicked']);
const props = defineProps({
  avatar: { type: String, required: false, default: '' },
  title: { type: Object, required: true },
  index: { type: Number, required: false },
  language: { type: String, required: true },
  isActive: { type: Boolean, required: false },
});

function handleClick() {
  emit('clicked');
}

const languageMap = {
  cn: 'TextCn',
  zh: 'TextCn',
  tw: 'TextTw',
  en: 'TextEn',
  jp: 'TextJp',
  kr: 'TextKr',
  th: 'TextTh',
};

function stripRubyContent(content: string | undefined): string {
  if (!content) {
    return '';
  }
  return content.replaceAll(/\[\/?ruby=?.*?]/gi, '');
}

const selectedLangTitle = computed(() => {
  const rawTitle = Reflect.get(
    props.title,
    Reflect.get(languageMap, props.language)
  );
  return stripRubyContent(rawTitle);
});

// 用于指定语言无对应文本时返回 fallback 文本
function getFallbackTitle() {
  for (const lang in languageMap) {
    const text = Reflect.get(props.title, Reflect.get(languageMap, lang));
    if (text) {
      return stripRubyContent(text);
    }
  }
  return 'NoFallbackText';
}
</script>

<template>
  <div
    class="archive-title rounded-medium shadow-farther"
    tabindex="0"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space="handleClick"
  >
    <div class="section-title">
      <img :src="props.avatar" class="avatar rounded-small" alt="avatar" />
      <span class="title">{{
        selectedLangTitle || `!!FallBack: ${getFallbackTitle()}`
      }}</span>
      <span class="ordered-list">{{
        `${parseInt(index?.toString() || '0') + 1}`.padStart(2, '0')
      }}</span>
    </div>

    <div class="navigation-button rounded-small" role="button" tabindex="0">
      <svg
        class="navigation-arrow"
        :class="isActive ? 'open' : ''"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 451.8 451.8"
      >
        <!-- eslint-disable max-len -->
        <path
          fill="#fff"
          d="M225.9 354.7c-8.1 0-16.2-3.1-22.4-9.3L9.3 151.2c-12.4-12.4-12.4-32.4 0-44.8C21.7 94 41.7 94 54 106.4l171.9 171.9 171.9-171.9c12.4-12.4 32.4-12.4 44.7 0 12.4 12.4 12.4 32.4 0 44.8L248.3 345.4c-6.2 6.2-14.3 9.3-22.4 9.3z"
        />
        <!-- eslint-enable max-len -->
      </svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
.archive-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  transition: all 0.375s ease-in-out;
  cursor: pointer;
  background: var(--color-title-container);
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  width: 100%;
  color: var(--color-text-ingame);
  font-weight: bold;
  font-size: 1.25rem;
  user-select: none;

  .section-title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    img.avatar {
      flex: none;
      width: 2rem;
      height: 2rem;
      object-fit: cover;
    }

    .ordered-list {
      transition: color 0.375s ease-in-out;
      margin-right: 1rem;
      margin-left: 0.5rem;
      color: var(--color-text-decoration);

      &::before {
        content: '#';
      }
    }

    .title {
      margin-left: 0.5rem;
    }
  }

  .navigation-button {
    display: flex;
    flex: none;
    justify-content: center;
    align-items: center;
    transition: background 0.375s ease-in-out;
    box-shadow: var(--style-primary-button-inset-shadow);
    background: var(--color-primary-button);
    width: 1.75rem;
    height: 1.75rem;
  }

  .navigation-arrow {
    transform: rotate(90deg);
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.1));
    -webkit-filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.1));
    transition: transform 0.175s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    cursor: pointer;
    width: 1rem;
    height: 1rem;

    &.open {
      transform: rotate(0deg);
    }
  }
}
</style>
