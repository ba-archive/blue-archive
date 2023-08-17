<script setup lang="ts">
import { computed } from "vue";
import NeuSwitch from "./NeuUI/NeuSwitch.vue";
import { useSettingsStore } from "@store/settings";

const settingsStore = useSettingsStore();
const currentTheme = computed(() => settingsStore.getTheme);
</script>

<template>
  <div class="theme-switcher">
    <img class="dark-mode-icon" src="@assets/dark-mode.svg" alt="Dark Mode" />
    <neu-switch
      :checked="'light' === currentTheme"
      checked-value="light"
      unchecked-value="dark"
      :accessibility-label="'Toggle Dark Mode'"
      @update:value="settingsStore.setTheme"
    />
    <img
      class="light-mode-icon"
      src="@assets/light-mode.svg"
      alt="Light Mode"
    />
  </div>
</template>

<style scoped lang="scss">
.theme-switcher {
  grid-gap: 0.5rem;
  display: grid;
  grid-template-columns: min-content auto min-content;
  grid-template-areas: "dark-mode-icon switch light-mode-icon";
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
</style>
