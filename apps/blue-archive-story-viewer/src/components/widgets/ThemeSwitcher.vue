<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useSettingsStore } from '../../store/settings';
import { switchTheme } from '../../util/userInterfaceUtils';
import NeuSwitch from './NeuUI/NeuSwitch.vue';

const settingsStore = useSettingsStore();
const currentTheme = computed(() => settingsStore.getTheme);

function toggleTheme(value: 'light' | 'dark') {
  switchTheme(value);
  settingsStore.setTheme(value);
}

const initTheme =
  (window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches) ||
  'dark' === currentTheme.value
    ? 'dark'
    : 'light';

toggleTheme(initTheme);

function handleThemeChange(event: MediaQueryListEvent) {
  const { matches } = event;
  toggleTheme(matches ? 'dark' : 'light');
}

onMounted(() => {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', handleThemeChange);
});

onUnmounted(() => {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .removeEventListener('change', handleThemeChange);
});
</script>

<template>
  <div class="theme-switcher">
    <img
      class="dark-mode-icon"
      src="/src/assets/dark-mode.svg"
      alt="Dark Mode"
    />
    <neu-switch
      :checked="'light' === currentTheme"
      checked-value="light"
      unchecked-value="dark"
      :accessibility-label="'Toggle Dark Mode'"
      @update:value="toggleTheme"
    />
    <img
      class="light-mode-icon"
      src="/src/assets/light-mode.svg"
      alt="Light Mode"
    />
  </div>
</template>

<style scoped lang="scss">
.theme-switcher {
  grid-gap: 0.5rem;
  display: grid;
  grid-template-columns: min-content auto min-content;
  grid-template-areas: 'dark-mode-icon switch light-mode-icon';
  justify-content: space-evenly;
  align-items: center;
  width: fit-content;
  user-select: none;

  .dark-mode-icon,
  .light-mode-icon {
    cursor: not-allowed;
    width: 1.25rem;
    height: 1.25rem;
  }

  .dark-mode-icon {
    grid-area: dark-mode-icon;
  }

  .light-mode-icon {
    grid-area: light-mode-icon;
  }
}

input.switch {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: 'track';
  grid-area: switch;
  align-items: center;
  justify-items: start;
  appearance: none;
  -webkit-appearance: none;
  transition: all 0.375s ease-in-out;
  cursor: pointer;
  box-sizing: content-box;
  outline: none !important;
  box-shadow: var(--style-switch-track-shadow);
  border: none !important;
  background-color: var(--color-switch-track);
  min-width: 3rem;
  max-width: 3rem;

  /* button-thumb */
  &::after {
    grid-area: track;
    justify-self: start;
    box-shadow: var(--style-switch-shadow);
    border-radius: 50%;
    background: var(--style-switch-texture);
    width: 1.25rem;
    height: 1.25rem;
    content: '';
  }

  &:checked::after {
    justify-self: end;
  }
}
</style>
