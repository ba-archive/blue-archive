<script setup lang="ts">
import type { StoryWork } from '~/types/story-gallery'

defineProps<StoryWork>()
</script>

<template>
  <div class="my-work-card" card w-full shadow-lg>
    <img :src="cover" h-48 w-full object-cover>
    <div class="work-data" children:mt2>
      <div flex="~ center" gap-2>
        <h3 text="2xl" h1.5em flex-1 of-hidden>
          {{ title }}
        </h3>
        <button text="2xl" i-material-symbols:more-horiz icon-btn />
      </div>
      <div class="work-description" line-clamp-4 h6rem of-hidden>
        {{ description }}
      </div>
      <div class="work-infos" font="thin" text="md gray-5" flex="~ justify-around items-center">
        <div flex-1 children:align-middle>
          <i i-material-symbols:play-circle-outline-rounded inline-block />
          <span>
            {{ hits }}
          </span>
        </div>
        <div flex-1 children:align-middle>
          <i i-material-symbols:favorite-outline-rounded inline-block />
          <span>
            {{ loves }}
          </span>
        </div>
        <div class="btn-group" flex gap-2 text="black sm">
          <button btn>
            发布
          </button>
          <button btn>
            编辑
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
