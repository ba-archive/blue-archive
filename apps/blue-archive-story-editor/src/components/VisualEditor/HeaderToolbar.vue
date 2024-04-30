<script setup lang="ts">
const emits = defineEmits([
  'reloadPlayer',
  'editProperty',
  'saveStory',
])
const router = useRouter()
</script>

<template>
  <nav class="header-toolbar" flex="~ center" bg-white py1 border="~ b-1" shadow-sm>
    <div class="left" flex flex-1 gap-2>
      <img src="/plana-studio.svg" alt="logo" class="logo" mx2 h-35px @click="router.push('/story-gallery')">
      <button border shadow-sm btn @click="emits('reloadPlayer')">
        运行
      </button>
      <button border shadow-sm btn @click="emits('editProperty')">
        属性
      </button>
      <button border shadow-sm btn @click="emits('saveStory')">
        保存
      </button>
      <button border shadow-sm btn @click="router.push('/visual-editor/my-works')">
        我的作品
      </button>
      <button border shadow-sm btn @click="router.push('/visual-editor/')">
        新故事
      </button>
    </div>
    <div class="right" flex="~ center">
      <a href="https://github.com/ba-archive/blue-archive/tree/dev-notype/apps/blue-archive-story-editor" target="_blank">
        <i text="gray-9 3xl" i-mdi:github align-top icon-btn />
      </a>
    </div>
  </nav>
</template>
