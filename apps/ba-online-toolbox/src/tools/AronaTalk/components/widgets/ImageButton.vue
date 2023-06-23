<template>
  <div
    class="button-container"
    :style="{ paddingLeft: paddingLeft, paddingRight: paddingRight }"
  >
    <svg
      class="add-button"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <!-- eslint-disable max-len -->
      <path
        d="M256,0C114.8,0,0,114.8,0,256s114.8,256,256,256s256-114.9,256-256S397.2,0,256,0z M256,472.3
	c-119.3,0-216.3-97-216.3-216.3S136.7,39.7,256,39.7s216.3,97,216.3,216.3S375.3,472.3,256,472.3z"
      />
      <path
        d="M355.1,234.4h-79.3v-79.3c0-10.9-8.9-19.8-19.8-19.8s-19.8,8.9-19.8,19.8v79.3h-79.3c-11,0-19.8,8.9-19.8,19.8
	s8.9,19.8,19.8,19.8h79.3v79.3c0,10.9,8.9,19.8,19.8,19.8c11,0,19.8-8.9,19.8-19.8V274h79.3c11,0,19.8-8.9,19.8-19.8
	S366.1,234.4,355.1,234.4z"
      />
      <!-- eslint-disable max-len -->
    </svg>
    <input style="display: none" ref="imageInput" accept="image/*" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    paddingLeft?: string;
    paddingRight?: string;
  }>(),
  {
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
  }
);
</script>

<style scoped lang="scss">
.button-container {
  display: flex;
  flex: none;
  justify-content: center;
  align-items: center;
}

.add-button {
  fill: var(--color-text-main);
  width: 1.5rem;
  height: 1.5rem;
}
</style>
