<template>
  <div class="error-container">
    <img src="@assets/404_white_stroke_512px.webp" alt="Network Error" />
    <div class="error-message">
      <p>页面找不到了！</p>
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
import { useRouter } from "vue-router";

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
  }
}

@media (max-width: 768px) {
  .error-container {
    word-wrap: anywhere;
    max-width: calc(100vw - 2rem);
  }
}
</style>
