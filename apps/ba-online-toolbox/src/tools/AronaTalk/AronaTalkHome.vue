<template>
  <chat-message-renderer />
  <bottom-action-bar />
</template>

<script setup lang="ts">
import { onActivated, onDeactivated, onMounted } from 'vue';
import BottomActionBar from './components/BottomActionBar.vue';
import ChatMessageRenderer from './components/ChatMessageRenderer.vue';

function changeBodyBackgroundColor(colorCode: string) {
  const body = document.querySelector('body') as HTMLBodyElement;
  body.style.backgroundColor = colorCode;
}

onMounted(() => {
  changeBodyBackgroundColor('#edf4fb');
});

onActivated(() => {
  changeBodyBackgroundColor('#edf4fb');
});

onDeactivated(() => {
  changeBodyBackgroundColor('var(--color-body-background)');
});
</script>

<style scoped lang="scss">
body {
  background-color: rgb(255, 247, 225);
}
</style>
