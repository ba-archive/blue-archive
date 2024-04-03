<template>
  <div class="error-container">
    <h3 class="error-title color-transition">
      诶？{{ isNotOpenError ? "好像还没开放……" : "数据去哪了？" }}
    </h3>
    <img
      class="error-image"
      src="@assets/404_white_stroke_512px.webp"
      alt="Network Error"
    />
    <div class="error-message" v-if="!isNotOpenError">
      <p>数据加载失败，请刷新页面重试。</p>
      <!--eslint-disable max-len-->
      <p>
        如果多次刷新页面仍无效，请
        <a
          :href="`mailto:mail@blue-archive.io?subject=%E9%94%99%E8%AF%AF%E6%8A%A5%E5%91%8A%EF%BC%88${baseUrl}%EF%BC%89&body=[ERROR MESSAGE]%0D%0A${JSON.stringify(
            props.errorMessage
          )}%0D%0A%0D%0A[ERROR ORIGIN]%0D%0A${props.routePath}`"
          target="_blank"
          >联系我们</a
        >。
      </p>
      <!--eslint-enable max-len-->
      <p class="error-content">{{ JSON.stringify(props.errorMessage) }}</p>
    </div>
    <div class="flex-vertical" :style="{ gap: '1rem' }" v-else>
      <p>这段剧情好像还没翻译完……</p>
      <div class="user-action-group flex-horizontal">
        <router-link class="user-action-button rounded-small" to="/archive">
          返回学生列表
        </router-link>
        <router-link
          class="user-action-button rounded-small"
          :to="{ name: 'UpdateLog' }"
        >
          查看已有翻译
        </router-link>
        <router-link class="user-action-button rounded-small" to="/library">
          来一局小游戏？
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorMessage: any;
  routePath: string | undefined;
}>();

const baseUrl = window.location.origin;

const isNotOpenError = computed(
  () => 1919 === (props.errorMessage ?? {})?.response?.status
);
</script>

<style scoped lang="scss">
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  user-select: none;

  .error-image {
    width: 20rem;
  }

  p {
    text-align: center;
  }

  .error-content {
    margin-top: 1rem;
    color: #ff3d00;
  }

  .user-action-group {
    gap: 0.5rem;
  }
}

p {
  transition: color 0.375s ease-in-out;
}

@media (max-width: 768px) {
  .error-container {
    word-wrap: anywhere;
    max-width: calc(100vw - 2rem);

    .error-image {
      width: 100%;
      max-width: calc(100vw - 6rem);
    }
  }
}
</style>
