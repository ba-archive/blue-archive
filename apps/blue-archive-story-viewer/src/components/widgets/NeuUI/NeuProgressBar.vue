<template>
  <div class="progress-bar-container">
    <div class="percentage" v-if="showPercentage">{{ progress }}%</div>
    <div class="progress-bar-background">
      <div
        class="progress"
        :style="{ width: (progress > 100 ? 99 : progress) + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    progress: number;
    showPercentage?: boolean;
  }>(),
  {
    progress: 0,
  }
);
</script>

<style scoped lang="scss">
.progress-bar-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 20rem;

  .percentage {
    color: var(--color-text-main);
  }

  .progress-bar-background {
    box-shadow: inset 0.1rem 0.1rem 0.1rem #ccc,
      inset -0.1rem -0.1rem 0.1rem #dbdbdb;
    border-radius: 0.5rem;
    background-color: #d3d3d3;
    width: 100%;
    height: 0.5rem;

    .progress {
      border-radius: 0.5rem;
      background-image: linear-gradient(
        180deg,
        hsl(215deg 80% 60%),
        #006bff,
        hsl(215deg 100% 40%)
      );
      height: 100%;
    }
  }
}

@media (max-width: 768px) {
  .progress-bar-container {
    max-width: calc(100% - 2rem);
  }
}
</style>
