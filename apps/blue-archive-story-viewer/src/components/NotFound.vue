<template>
  <div class="error-container">
    <img src="/src/assets/network-error.svg" alt="Network Error" />
    <div class="error-message">
      <p>页面走丢了！</p>
    </div>
    <div class="user-action-container">
      <div class="user-action-button rounded-small" @click="backToLastState">
        后退
      </div>
      <router-link class="user-action-button rounded-small" to="/"
        >返回首页</router-link
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function backToLastState() {
  router.go(-1);
}
</script>

<style scoped lang="scss">
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  user-select: none;

  img {
    width: 20rem;
  }

  p {
    text-align: center;
  }

  .error-content {
    margin-top: 1rem;
    color: #ff3d00;
  }

  .user-action-container {
    grid-gap: 1rem;
    display: grid;
    grid-auto-flow: column;
    margin-top: 1rem;

    .user-action-button,
    a {
      display: flex;
      justify-content: center;
      align-items: center;
      transition: background 0.375s ease-in-out;
      cursor: pointer;
      background: var(--color-primary-button);
      padding: 0.4rem 1rem;
      color: #fff;
      text-decoration: none;
    }
  }
}

@media (max-width: 768px) {
  .error-container {
    word-wrap: anywhere;
    max-width: calc(100vw - 2rem);
  }
}
</style>
