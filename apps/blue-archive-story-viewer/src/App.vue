<script setup lang="ts">
// import dayjs from "dayjs";
import { computed, onBeforeMount, onBeforeUnmount, ref } from "vue";
import { useRoute } from "vue-router";
import HomeWelcomeScreen from "@components/HomeWelcomeScreen.vue";
import DesktopMenu from "@components/menu/DesktopMenu.vue";
import MobileMenu from "@components/menu/MobileMenu.vue";
import { useSettingsStore } from "@store/settings";
import { switchTheme } from "@util/userInterfaceUtils";

// import timezone from "dayjs/plugin/timezone";
// import utc from "dayjs/plugin/utc";
//
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

onBeforeMount(() => {
  const htmlElement = document.querySelector("html") as HTMLHtmlElement;
  showMobileMenu.value = htmlElement.clientWidth <= 768;
  window.addEventListener("resize", handleWindowSizeChange);

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    settingsStore.setTheme("dark");
    switchTheme("dark");
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleWindowSizeChange);
});

// function getInitialBannerState() {
//   const now = dayjs().tz("Asia/Shanghai");
//   const startDate = dayjs("2023/07/28 00:01").tz("Asia/Shanghai");
//   const endDate = dayjs("2023/07/29 00:30").tz("Asia/Shanghai");
//   return now.isAfter(startDate) && now.isBefore(endDate);
// }
//
// const shouldShowBanner = ref(getInitialBannerState());
</script>

<template>
  <!--  <headup-banner-->
  <!--    v-if="shouldShowBanner"-->
  <!--    @close="shouldShowBanner = false"-->
  <!--    content="本站将于北京时间 7 月 29 日 00:01 - 00:30 进行维护，届时部分服务将不可用，敬请谅解"-->
  <!--  />-->
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
