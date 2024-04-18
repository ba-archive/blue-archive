<script setup lang="ts">
const emits = defineEmits([
  'reloadPlayer',
])
const router = useRouter()
</script>

<template>
  <div class="header-toolbar" flex="~ center" bg-white py1 border="~ b-1" shadow-sm>
    <div class="left" flex flex-1>
      <img src="/plana-studio.svg" alt="logo" class="logo" mx2 h-35px @click="router.push('/storygallerypage')">
      <button border shadow-sm btn @click="emits('reloadPlayer')">
        运行
      </button>
    </div>
    <div class="right" flex="~ center">
      <a href="https://github.com/ba-archive/blue-archive/tree/dev-notype/apps/blue-archive-story-editor" target="_blank">
        <i text="gray-9 3xl" i-mdi:github align-top icon-btn />
      </a>
    </div>
  </div>
</template>
