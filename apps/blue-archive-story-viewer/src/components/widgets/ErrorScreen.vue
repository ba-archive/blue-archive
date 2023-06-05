<template>
  <div class="error-container">
    <img src="/src/assets/network-error.svg" alt="Network Error" />
    <div class="error-message">
      <p>数据加载失败，请刷新页面重试。</p>
      <!--eslint-disable max-len-->
      <p>
        如果多次刷新页面仍无效，请
        <a
          :href="`mailto:mail@blue-archive.io?subject=%E9%94%99%E8%AF%AF%E6%8A%A5%E5%91%8A%EF%BC%88${baseUrl}%EF%BC%89&body=[ERROR MESSAGE]%0D%0A${JSON.stringify(
            errorMessage
          )}%0D%0A%0D%0A[ERROR ORIGIN]%0D%0A${routePath}`"
          target="_blank"
          >联系我们</a
        >。
      </p>
      <!--eslint-enable max-len-->
      <p class="error-content">{{ JSON.stringify(errorMessage) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  errorMessage: object | string;
  routePath: string | undefined;
}>();

const baseUrl = window.location.origin;
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
    max-width: 20rem;
  }

  p {
    text-align: center;
  }

  .error-content {
    margin-top: 1rem;
    color: #ff3d00;
  }
}

@media (max-width: 768px) {
  .error-container {
    word-wrap: anywhere;
    max-width: calc(100vw - 2rem);
  }
}
</style>
