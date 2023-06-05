<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { useRoute } from 'vue-router';
import HomeWelcomeScreen from './components/HomeWelcomeScreen.vue';
import DesktopMenu from './components/menu/DesktopMenu.vue';
import MobileMenu from './components/menu/MobileMenu.vue';
import { useSettingsStore } from './store/settings';
import { switchTheme } from './util/userInterfaceUtils';

const route = useRoute();
const settingsStore = useSettingsStore();
const showMobileMenu = ref(false);

const isMainPage = computed(() => route.path === '/');

const isMac = () => {
  const userAgent = navigator.userAgent;
  return userAgent.indexOf('Mac OS X') > -1;
};

if (!isMac()) {
  const htmlElement = document.querySelector('html') as HTMLHtmlElement;
  htmlElement.dataset.scrollbar = 'customize';
}

let ticking = false;
function handleWindowSizeChange() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    const htmlElement = document.querySelector('html') as HTMLHtmlElement;
    showMobileMenu.value = htmlElement.clientWidth <= 768;
    ticking = false;
  });
}

onBeforeMount(() => {
  const htmlElement = document.querySelector('html') as HTMLHtmlElement;
  showMobileMenu.value = htmlElement.clientWidth <= 768;
  window.addEventListener('resize', handleWindowSizeChange);

  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    settingsStore.setTheme('dark');
    switchTheme('dark');
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleWindowSizeChange);
});
</script>

<template>
  <mobile-menu v-if="showMobileMenu" />
  <desktop-menu v-else />
  <div
    id="main-view"
    class="rounded-large"
    :class="{ 'main-page': '/' === route.path }"
  >
    <home-welcome-screen v-if="isMainPage" />
    <router-view> </router-view>
  </div>
</template>

<style scoped lang="scss">
#main-view {
  display: flex;
  grid-area: main;
  flex: 1;
  flex-direction: column;
  align-items: stretch;
  transition: background-color 0.375s ease-in-out;
  background-color: var(--color-main-background);
  overflow-y: auto;

  &.main-page {
    background-color: transparent;
  }
}

@media screen and (max-width: 768px) {
  //noinspection CssOverwrittenProperties
  #main-view {
    border-radius: 0;
    -webkit-border-radius: 0;
    padding: 3.5rem 1rem 0 1rem;
    width: 100vw;
    min-height: 100vh;
    min-height: 100dvh;
    overflow-x: hidden;
    overflow-y: scroll;
  }
}
</style>
