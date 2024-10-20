<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const mainRoutes = router
  .getRoutes()
  .filter(route => route.meta?.shouldShowInHomepageNav)
  .sort((a, b) => {
    return (a.meta?.navOrder as number) - (b.meta?.navOrder as number) || 0;
  });
</script>

<template>
  <div class="main-page-screen fill-screen center">
    <div class="main-page-navigation">
      <router-link
        class="home-nav-link rounded-small shadow-far bg-white @dark:bg-slate-800 text-dark @dark:text-gray-200"
        v-for="mainRoute in mainRoutes"
        :key="mainRoute.path"
        :to="mainRoute.path"
      >
        <img :src="mainRoute.meta?.icon" alt="" />
        <div>
          <div class="title">{{ mainRoute.meta.title }}</div>
          <div class="description text-gray-500 @dark:text-gray-400">
            {{ mainRoute.meta.description }}
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main-page-navigation {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: min-content;
  gap: 1rem;
  user-select: none;

  .home-nav-link {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 16px;
    font-weight: bold;
    text-decoration: none;

    img {
      margin-right: 8px;
      width: 32px;
      height: 32px;
    }

    .title {
      font-weight: bold;
      font-size: 1.25rem;
    }

    .description {
      font-weight: normal;
    }
  }
}

@media (max-width: 768px) {
  .main-page-navigation {
    grid-template-columns: 1fr;
    width: calc(100vw - 64px);
  }
}
</style>
