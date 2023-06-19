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
        class="home-nav-link rounded-small shadow-far"
        v-for="mainRoute in mainRoutes"
        :key="mainRoute.path"
        :to="mainRoute.path"
      >
        <img :src="mainRoute.meta?.icon" alt="" />
        <div>
          <div class="title">{{ mainRoute.meta.title }}</div>
          <div class="description">{{ mainRoute.meta.description }}</div>
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

  .home-nav-link {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: #ffffff;
    padding: 16px;
    color: #333;
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
      color: lightgrey;
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
