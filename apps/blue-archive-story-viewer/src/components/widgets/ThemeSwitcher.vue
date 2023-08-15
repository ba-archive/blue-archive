<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import NeuSwitch from "./NeuUI/NeuSwitch.vue";
import { useSettingsStore } from "@store/settings";
import { switchTheme } from "@util/userInterfaceUtils";

const settingsStore = useSettingsStore();
const currentTheme = computed(() => settingsStore.getTheme);

function toggleTheme(value: "light" | "dark") {
  switchTheme(value);
  settingsStore.setTheme(value);
}

const initTheme =
  (window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches) ||
  "dark" === currentTheme.value
    ? "dark"
    : "light";

toggleTheme(initTheme);

function handleThemeChange(event: MediaQueryListEvent) {
  const { matches } = event;
  toggleTheme(matches ? "dark" : "light");
}

onMounted(() => {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", handleThemeChange);
});

onUnmounted(() => {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .removeEventListener("change", handleThemeChange);
});
</script>

<template>
  <div class="theme-switcher">
    <img class="dark-mode-icon" src="@assets/dark-mode.svg" alt="Dark Mode" />
    <neu-switch
      :checked="'light' === currentTheme"
      checked-value="light"
      unchecked-value="dark"
      :accessibility-label="'Toggle Dark Mode'"
      @update:value="toggleTheme"
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
