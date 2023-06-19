<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import HomepageNavigator from './HomepageNavigator.vue';

const route = useRoute();

const isMainPage = computed(() => {
  return '/' === route.path;
});
</script>

<template>
  <transition name="menu">
    <div class="nav-bar shadow-far" id="nav-bar" v-if="!isMainPage">
      <router-link to="/"
        ><svg
          class="navigation-arrow"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 451.8 451.8"
        >
          <!-- eslint-disable max-len -->
          <path
            fill="#3f88f2"
            d="M225.9 354.7c-8.1 0-16.2-3.1-22.4-9.3L9.3 151.2c-12.4-12.4-12.4-32.4 0-44.8C21.7 94 41.7 94 54 106.4l171.9 171.9 171.9-171.9c12.4-12.4 32.4-12.4 44.7 0 12.4 12.4 12.4 32.4 0 44.8L248.3 345.4c-6.2 6.2-14.3 9.3-22.4 9.3z"
          />
          <!-- eslint-enable max-len --></svg
        ><span>Home</span></router-link
      >
    </div>
  </transition>
  <homepage-navigator v-if="isMainPage" />
  <div id="main-router-view">
    <router-view v-slot="{ Component }">
      <keep-alive :max="2">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<style scoped lang="scss">
.nav-bar {
  display: flex;
  position: fixed;
  justify-content: center;
  align-items: center;
  z-index: 114514;
  background-color: #fff;
  width: 100%;
  font-weight: bold;
  font-size: 16px;
  user-select: none;

  .navigation-arrow {
    display: none;
  }

  a {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    transition: all 0.375s ease-in-out;
    padding: 0 8px;
    height: 48px;
    color: var(--color-arona-blue);
    text-decoration: none;

    &:hover {
      background-color: var(--color-arona-blue);
      color: #fff;
    }

    &.router-link-exact-active {
      &::after {
        position: absolute;
        bottom: 0;
        left: 0;
        background-color: var(--color-arona-blue);
        width: 100%;
        height: 2px;
        content: '';
      }
    }
  }
}

#main-router-view {
  padding-top: 48px;
}

@media (max-width: 768px) {
  .nav-bar {
    justify-content: flex-start;
    font-weight: normal;

    a:hover {
      background-color: inherit;
      color: var(--color-arona-blue);
    }

    .navigation-arrow {
      display: inline-flex;
      transform: rotate(90deg);
      width: 16px;
      height: 16px;
    }
  }
}

.menu-enter-active,
.menu-leave-active {
  transition: all 0.375s ease-in-out;
}

.menu-enter-from,
.menu-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
