<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <div class="nav-header">
    <div class="nav-header__placeholder" h3.05rem />
    <nav class="nav-header__fixed" border="~ b-1" fixed top-0 z-1 h3.05rem w-full flex="~ center" bg-white py1 shadow-sm>
      <div class="left" flex flex-1 gap-2>
        <img src="/plana-studio.svg" alt="logo" class="logo" mx2 h-35px @click="router.push('/story-gallery')">
        <button border shadow-sm btn @click="router.push('/visual-editor')">
          编辑器
        </button>
        <button border shadow-sm btn @click="router.push('/visual-editor/my-works')">
          我的作品
        </button>
      </div>
      <div class="right" flex="~ center">
        <a href="https://github.com/ba-archive/blue-archive/tree/dev-notype/apps/blue-archive-story-editor" target="_blank">
          <i text="gray-9 3xl" i-mdi:github align-top icon-btn />
        </a>
      </div>
    </nav>
  </div>
</template>
