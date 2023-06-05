<template>
  <div class="desktop-menu-panel">
    <div class="id-sensei">
      <div class="avatar-wrapper center">
        <img src="/src/assets/arona_icon.webp" alt="Arona" />
      </div>
      <div class="welcome-message">
        <p>欢迎，</p>
        <user-name-input />
        <span>老师</span>
      </div>
    </div>
    <div id="navigation">
      <router-link
        v-for="mainRoute in mainRoutes"
        :key="mainRoute.path"
        :to="mainRoute.path"
        class="nav-link rounded-small"
        >{{ getRouteTranslation(mainRoute, selectedLanguage) }}</router-link
      >
    </div>

    <div id="settings">
      <language-selector :style="{ gridArea: 'language' }" />
      <theme-switcher :style="{ gridArea: 'theme' }" />
      <div class="sponsor-message">
        Served with
        <a href="https://cloudflare.com" target="_blank">Cloudflare</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSettingsStore } from '../../store/settings';
import { getRouteTranslation } from '../../util/routerUtils';
import LanguageSelector from '../widgets/LanguageSelector.vue';
import ThemeSwitcher from '../widgets/ThemeSwitcher.vue';
import UserNameInput from '../widgets/UserNameInput.vue';

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
</script>

<style scoped lang="scss">
.desktop-menu-panel {
  display: flex;
  grid-area: navigation-pane;
  flex-direction: column;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: stretch;
  padding: 2rem 0 0.5rem 0;
}

.id-sensei {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 2rem;
  margin-left: 1rem;
  color: var(--color-text-main);

  .avatar-wrapper {
    backdrop-filter: brightness(0.8) saturate(0.8);
    -webkit-backdrop-filter: brightness(0.95) saturate(0.8);
    transition: border 0.375s ease-in-out;
    border: 0.15rem var(--color-player-avatar-border) solid;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    padding: 0.15rem;

    img {
      border-radius: 50%;
      -webkit-border-radius: 50%;
      width: 3rem;
      height: 3rem;
    }
  }

  .welcome-message {
    transition: color 0.375s ease-in-out;
    margin-left: 1rem;
    color: var(--color-text-main);
    font-weight: bold;
    font-size: 1rem;
  }
}

#navigation {
  display: flex;
  flex-direction: column;
}

.nav-link {
  display: flex;
  transition: color 0.375s ease-in-out;
  padding: 0.25rem 1rem;
  color: var(--color-text-main);
  text-decoration: none;

  &.router-link-active:not(:first-child),
  &.router-link-exact-active {
    font-weight: bolder;
  }

  &:hover {
    background: var(--color-glass-panel-hover);
  }
}

#settings {
  display: grid;
  grid-template-areas:
    'language theme'
    'sponsor sponsor';
  grid-auto-flow: column;
  column-gap: 1rem;
  row-gap: 0.5rem;
  margin-top: auto;
  margin-left: 1rem;

  .sponsor-message {
    grid-area: sponsor;

    a {
      -webkit-text-fill-color: transparent;
      background: linear-gradient(to right, #f48120, #faad3f);
      background-clip: text;
      color: transparent;
      font-family: 'Asap Condensed Bold Italic', 'Microsoft YaHei',
        'PingFang SC', -apple-system, system-ui, 'Segoe UI', Roboto, Ubuntu,
        Cantarell, 'Noto Sans', BlinkMacSystemFont, 'Helvetica Neue',
        'Hiragino Sans GB', Arial, sans-serif;
      text-decoration: none;
    }
  }
}
</style>
