<template>
  <span
    class="user-name-input"
    contenteditable="true"
    @keydown.enter="activeLoseFocus"
    @focusout="updateUsername"
  >
    {{ username }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSettingsStore } from '../../store/settings';

const settingsStore = useSettingsStore();
const username = computed(() => settingsStore.getUsername);

// 触发主动失焦事件
function activeLoseFocus(event: Event) {
  (event.target as HTMLElement).blur();
}

function updateUsername(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = target.innerText ?? '';
  const result = '' === value ? 'Sensei' : value;
  settingsStore.setUsername(result.replaceAll(/\s/g, '').slice(0, 10));
}
</script>

<style scoped lang="scss">
.user-name-input {
  max-width: 8rem;
  text-decoration: underline;
  text-underline-offset: 0.1rem;
}
</style>
