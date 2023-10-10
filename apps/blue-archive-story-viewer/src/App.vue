<script setup lang="ts">
import axios from "axios";
import {
  computed,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import HeadupBanner from "./components/HeadupBanner.vue";
import HomeWelcomeScreen from "@components/HomeWelcomeScreen.vue";
import DesktopMenu from "@components/menu/DesktopMenu.vue";
import MobileMenu from "@components/menu/MobileMenu.vue";
import { useSettingsStore } from "@store/settings";
import { switchTheme } from "@util/userInterfaceUtils";
import { useIntervalFn } from "@vueuse/core";

// import dayjs from "dayjs";
// import timezone from "dayjs/plugin/timezone.js";
// import utc from "dayjs/plugin/utc.js";

// dayjs.extend(utc);
// dayjs.extend(timezone);

const route = useRoute();
const settingsStore = useSettingsStore();
const showMobileMenu = ref(false);

const isMainPage = computed(() => route.path === "/");

const isMac = () => {
  const userAgent = navigator.userAgent;
  return userAgent.indexOf("Mac OS X") > -1;
};

if (!isMac()) {
  const htmlElement = document.querySelector("html") as HTMLHtmlElement;
  htmlElement.dataset.scrollbar = "customize";
}

let ticking = false;

function handleWindowSizeChange() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    const htmlElement = document.querySelector("html") as HTMLHtmlElement;
    showMobileMenu.value = htmlElement.clientWidth <= 768;
    ticking = false;
  });
}

function handleSystemThemeChange(event: MediaQueryListEvent) {
  const { matches } = event;
  settingsStore.setTheme(matches ? "dark" : "light");
}

onBeforeMount(() => {
  const htmlElement = document.querySelector("html") as HTMLHtmlElement;
  showMobileMenu.value = htmlElement.clientWidth <= 768;
  window.addEventListener("resize", handleWindowSizeChange);

  const initTheme =
    (window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches) ||
    "dark" === settingsStore.getTheme
      ? "dark"
      : "light";

  switchTheme(initTheme);

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", handleSystemThemeChange);
});

const currentVersion = computed(() => {
  return settingsStore.getCurrentVersion;
});

const hasUpdate = ref(false);

const remoteVersion = ref({
  build: "",
  timezone: "Asia/Shanghai",
});

async function resolveBuild() {
  if (!settingsStore.getEnableCheckForUpdates) {
    return;
  }
  const currentTime = new Date().getTime();
  const lastUpdated = currentVersion.value.lastUpdated;
  const diff = currentTime - lastUpdated;
  if (diff < 1000 * 60 * 60 * 1) {
    // 1 小时内只检查一次
    return;
  }

  const { data, status } = await axios.get("/version.json");
  if (status !== 200) {
    return;
  }
  const { build, timezone } = data as {
    build: string;
    timezone: string;
  };
  if (
    build &&
    currentVersion.value.build &&
    build !== currentVersion.value.build
  ) {
    hasUpdate.value = true;
    remoteVersion.value = {
      build,
      timezone,
    };
  }
}

function handleDisableCheckForUpdates() {
  hasUpdate.value = false;
  settingsStore.setEnableCheckForUpdates(false);
}

function handleAppUpdate() {
  settingsStore.setCurrentVersion(
    remoteVersion.value.build,
    remoteVersion.value.timezone
  );
  location.reload(true); // 标准浏览器不支持，但是 Firefox 支持
}

const { pause, resume } = useIntervalFn(resolveBuild, 1000 * 60 * 60 * 1);

function handleDocumentVisibilityChange() {
  if ("hidden" === document.visibilityState) {
    pause();
  } else {
    resolveBuild();
    resume();
  }
}

onMounted(() => {
  watch(
    () => settingsStore.getTheme,
    newValue => {
      switchTheme(newValue);
    }
  );
  resolveBuild();
  document.addEventListener("visibilitychange", handleDocumentVisibilityChange);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleWindowSizeChange);
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .removeEventListener("change", handleSystemThemeChange);
});
</script>

<template>
  <headup-banner
    :show="hasUpdate"
    @action-button-clicked="handleAppUpdate"
    @close-button-clicked="hasUpdate = false"
    @permanent-close-button-clicked="handleDisableCheckForUpdates"
    show-permanent-close-button
    close-button-text="关闭"
    action-button-text="更新"
    permanent-close-button-text="永久关闭提醒"
    content="有新版本资源可用，点击以更新（当前的观看进度将丢失）"
  />
  <mobile-menu v-if="showMobileMenu" />
  <desktop-menu v-else />
  <div
    id="main-view"
    class="rounded-large"
    :class="{ 'main-page': '/' === route.path }"
  >
    <home-welcome-screen v-if="isMainPage" />
    <router-view></router-view>
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
