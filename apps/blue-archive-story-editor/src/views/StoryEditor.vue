<template>
  <div class="story-editor">
    <textarea v-model="storyText" class="story-editor__text"></textarea>
    <div class="story-editor__sidebar">
      <!-- Story unit selection goes here -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { ApiServiceAdapter } from '@/interface/http';

export default defineComponent({
  name: 'StoryEditor',
  setup() {
    const storyText = ref('');
    const selectedStoryUnit = ref(null);

    const saveStory = async () => {
      await ApiServiceAdapter.upload('/story', new FormData().append('story', storyText.value));
    };

    const retrieveStory = async () => {
      const response = await ApiServiceAdapter.download('/story');
      storyText.value = response.data;
    };

    onMounted(retrieveStory);

    return {
      storyText,
      selectedStoryUnit,
      saveStory,
      retrieveStory,
    };
  },
});
</script>

<style scoped>
.story-editor {
  display: flex;
}

.story-editor__text {
  flex: 1;
}

.story-editor__sidebar {
  width: 200px;
}
</style>
