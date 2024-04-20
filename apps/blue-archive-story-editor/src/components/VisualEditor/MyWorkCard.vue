<script setup lang="ts">
import { updateStoryWork } from '~/api'
import type { StoryWork } from '~/types/story-gallery'

const model = defineModel<StoryWork>({ required: true })

const router = useRouter()
async function toggleReleaseStory(id: string) {
  const resp = await updateStoryWork(id, { released: !model.value.released })
  model.value = resp
}
</script>

<template>
  <div class="my-work-card" card w-full shadow-lg>
    <img :src="model.cover" h-48 w-full object-cover>
    <div class="work-data" children:mt2>
      <div flex="~ center" gap-2>
        <h3 text="2xl" h1.5em flex-1 of-hidden>
          {{ model.title }}
        </h3>
        <button text="2xl" i-material-symbols:more-horiz icon-btn />
      </div>
      <div class="work-description" line-clamp-4 h6rem of-hidden>
        {{ model.description }}
      </div>
      <div class="work-infos" font="thin" text="md gray-5" flex="~ justify-around items-center">
        <div flex-1 children:align-middle>
          <i i-material-symbols:play-circle-outline-rounded inline-block />
          <span>
            {{ model.hits }}
          </span>
        </div>
        <div flex-1 children:align-middle>
          <i i-material-symbols:favorite-outline-rounded inline-block />
          <span>
            {{ model.loves }}
          </span>
        </div>
        <div class="btn-group" flex gap-2 text="black sm">
          <button btn @click="toggleReleaseStory(model.id)">
            {{ model.released ? '取消发布' : '发布' }}
          </button>
          <button btn @click="router.push(`/visual-editor/${model.id}`)">
            编辑
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
