<script setup lang="ts">
import { ref, watch } from 'vue';
import { useSettingsStore } from '../../store/settings';

const languages = ref([
  {
    name: '简体中文',
    code: 'cn',
  },
  {
    name: '繁體中文',
    code: 'tw',
  },
  {
    name: '日本語',
    code: 'jp',
  },
  {
    name: 'English',
    code: 'en',
  },
  {
    name: '한국어',
    code: 'kr',
  },
  {
    name: 'ไทย',
    code: 'th',
  },
]);

const settingsStore = useSettingsStore();
const selectedLang = ref(settingsStore.getLang);

watch(
  () => settingsStore.getLang,
  newLang => {
    selectedLang.value = newLang;
  }
);

function handleLangChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  settingsStore.setLang(
    target.value as 'cn' | 'tw' | 'jp' | 'en' | 'kr' | 'th'
  );
}
</script>

<template>
  <select
    class="language-switcher rounded-small"
    v-model="selectedLang"
    @change="handleLangChange($event)"
  >
    <option
      v-for="language in languages"
      :key="language.code"
      :value="language.code"
    >
      {{ language.name }}
    </option>
  </select>
</template>

<style scoped lang="scss">
select {
  display: flex;
  flex-direction: row;
  align-items: center;
  appearance: none;
  -webkit-appearance: none;
  transition: all 0.375s ease-in-out;
  cursor: pointer;
  outline: none;
  box-shadow: var(--style-switch-track-shadow);
  border: none;
  background-color: var(--color-switch-track);
  padding: 0 0.5rem;
  width: fit-content;
  color: var(--color-text-main);
  font-size: inherit;
  line-height: inherit;
  font-family: inherit;
  user-select: none;
  text-align: center;
}
</style>
