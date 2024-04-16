<script setup lang="ts">
// todo 考虑把 sensei 当成一个宏
const mockStoryWork = {
  id: 114,
  title: '爱丽丝和sensei幸福美满的生活',
  description: '爱丽丝和sensei结婚后的故事,爱丽丝和sensei结婚后的故事,爱丽丝和sensei结婚后的故事,爱丽丝和sensei结婚后的故事,爱丽丝和sensei结婚后的故事,爱丽丝和sensei结婚后的故事',
  cover: 'https://sdfsdf.dev/400x300.jpg',
  publishTs: 1713182236234,
  author: {
    name: 'isnotype',
    avatar: 'https://sdfsdf.dev/50x50.jpg',
  },
  loves: 1919819,
  hits: 114514,
}
const mockStoryWorks = [mockStoryWork, mockStoryWork, mockStoryWork, mockStoryWork, mockStoryWork, mockStoryWork, mockStoryWork, mockStoryWork, mockStoryWork, mockStoryWork, mockStoryWork, mockStoryWork, mockStoryWork, mockStoryWork, mockStoryWork, mockStoryWork, mockStoryWork, mockStoryWork, mockStoryWork, mockStoryWork, mockStoryWork, mockStoryWork, mockStoryWork, mockStoryWork]
</script>

<template>
  <div class="story-gallery" flex="~ col" gap-2>
    <NavHeader />
    <StoryWorkList :story-works="mockStoryWorks" />
  </div>
</template>
