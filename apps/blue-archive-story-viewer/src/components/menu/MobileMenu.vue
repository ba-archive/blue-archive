<template>
  <div class="mobile-menu-wrapper">
    <div class="mobile-menu-bar shadow-far acrylic">
      <div class="id-sensei flex-horizontal">
        <div class="avatar-wrapper center">
          <img src="/src/assets/arona_icon.webp" alt="Arona" />
        </div>
        <div class="welcome-message">
          <user-name-input />
          <span>老师，欢迎</span>
        </div>
      </div>

      <div
        class="button"
        role="button"
        tabindex="0"
        @click="toggleMenu"
        @keydown.space="toggleMenu"
        @keydown.enter="toggleMenu"
        @keydown.esc="closeMenu"
      >
        <span class="menu-line start" :class="{ active: showMenu }"></span>
        <span class="menu-line middle" :class="{ active: showMenu }"></span>
        <span class="menu-line end" :class="{ active: showMenu }"></span>
      </div>
    </div>

    <transition name="menu-transition">
      <div class="mobile-submenu-container flex-vertical" v-if="showMenu">
        <div class="mobile-submenu acrylic fill-width">
          <router-link
            v-for="mainRoute in mainRoutes"
            :key="mainRoute.path"
            :to="mainRoute.path"
            class="nav-link rounded-small"
            @click="closeMenu"
            >{{ getRouteTranslation(mainRoute, selectedLanguage) }}</router-link
          >

          <div class="mobile-settings-container">
            <language-selector />
            <theme-switcher />
          </div>
        </div>

        <div class="submenu-controller fill-screen" @click="closeMenu"></div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSettingsStore } from '../../store/settings';
import { getRouteTranslation } from '../../util/routerUtils';
import LanguageSelector from '../widgets/LanguageSelector.vue';
import ThemeSwitcher from '../widgets/ThemeSwitcher.vue';
import UserNameInput from '../widgets/UserNameInput.vue';

const showMenu = ref(false);

const settingsStore = useSettingsStore();
const selectedLanguage = computed(() => settingsStore.getLang);
const router = useRouter();
// 主导航路由
const mainRoutes = computed(() =>
  router
    .getRoutes()
    .filter(route => route.meta?.shouldShowInNav)
    .sort((a, b) => {
      return (a.meta?.navOrder as number) - (b.meta?.navOrder as number) || 0;
    })
);

function toggleMenu() {
  showMenu.value = !showMenu.value;
}

function closeMenu() {
  showMenu.value = false;
}
</script>

<style scoped lang="scss">
.mobile-menu-wrapper {
  display: flex;
  position: fixed;
  top: -1px;
  left: 0;
  flex-direction: column;
  z-index: 256;
  width: 100vw;
}

.mobile-menu-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.375s ease-in-out;
  background-color: var(--color-mobile-nav-background);
  padding: 0.5rem 1rem;
}

.avatar-wrapper {
  backdrop-filter: brightness(0.8) saturate(0.8);
  -webkit-backdrop-filter: brightness(0.95) saturate(0.8);
  transition: border 0.375s ease-in-out;
  border: 0.1rem var(--color-player-avatar-border) solid;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  padding: 0.1rem;

  img {
    border-radius: 50%;
    -webkit-border-radius: 50%;
    width: 2rem;
  }
}

.welcome-message {
  margin-left: 0.5rem;
  font-weight: bold;
}

.button {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  height: 1.2rem;
}

.menu-line {
  display: block;
  transition: all 0.375s cubic-bezier(0.85, -0.06, 0.22, 1.26);
  background-color: var(--color-text-main);
  width: 1.5rem;
  height: 2px;
  user-select: none;
  -webkit-user-select: none;

  &.active {
    &.start {
      transform: rotate3d(0, 0, 1, 45deg)
        translate3d(
          var(--trigo-param-positive, 10.608px),
          var(--trigo-param-positive, 10.608px),
          0
        )
        scale3d(1.414, 1, 1);
    }

    &.middle {
      transform: scale3d(0, 0, 0);
      opacity: 0;
    }

    &.end {
      transform: rotate3d(0, 0, 1, -45deg)
        translate3d(
          var(--trigo-param-positive, 10.608px),
          var(--trigo-param-negative, -10.608px),
          0
        )
        scale3d(1.414, 1, 1);
    }
  }
}

//noinspection CssOverwrittenProperties
.mobile-submenu-container {
  z-index: -1;
  height: 100vh;
  height: 100dvh;
  color: var(--color-text-main);

  .mobile-submenu {
    display: flex;
    flex-direction: column;
    filter: drop-shadow(0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.12));
    -webkit-filter: drop-shadow(0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.12));
    transition: background-color 0.375s ease-in-out;
    box-shadow: 0 0 0 200vh rgba(0, 0, 0, 0.1);
    background-color: var(--color-mobile-subnav-background);

    a {
      display: flex;
      justify-content: center;
      align-items: center;
      transition: color 0.375s ease-in-out;
      border-radius: 0;
      padding: 0.5rem 1rem;
      width: 100%;
      color: var(--color-text-main);
      text-decoration: none;

      &:first-child {
        padding-top: 0.75rem;
      }

      &.router-link-active:not(:first-child),
      &.router-link-exact-active {
        font-weight: bolder;
      }
    }
  }

  .mobile-settings-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0.5rem 1rem;
  }
}

.submenu-controller {
  width: 100vw;
}

.menu-transition-enter-active,
.menu-transition-leave-active {
  transition: all 0.375s ease;
}

.menu-transition-enter-from,
.menu-transition-leave-to {
  transform: translate3d(0, -100%, 0);
  opacity: 0;
}

@media screen and (prefers-reduced-motion: reduce) {
  .menu-transition-enter-from,
  .menu-transition-leave-to {
    transform: none;
    opacity: 0;
  }
}
</style>
