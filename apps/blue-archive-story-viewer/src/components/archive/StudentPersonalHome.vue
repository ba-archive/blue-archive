<template>
  <div class="fill-width flex-vertical rounded-small">
    <div class="student-home-nav-bar">
      <router-link :to="{ name: 'Momotalk' }" class="button rounded-small"
        >momotalk</router-link
      >
      <router-link :to="{ name: 'StudentStory' }" class="button rounded-small"
        >好感剧情</router-link
      >
    </div>
    <router-view v-slot="{ Component }">
      <keep-alive include="MomotalkContainer" :max="1">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup lang="ts">
// 这行注释别删，删了 prettier 会报错
</script>

<style scoped lang="scss">
.student-home-nav-bar {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr;
  place-items: center;

  .button {
    transition: all 0.375s ease-in-out;
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding: 1rem 1.5rem;
    color: var(--color-text-main);
    font-weight: bold;
    text-decoration: none;

    &.router-link-active {
      box-shadow: var(--style-primary-inset-main);
    }
  }
}
</style>
