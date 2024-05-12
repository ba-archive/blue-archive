<script setup lang="ts">
import type { StoryWork } from '~/types/story-gallery'

const router = useRouter()

// todo 考虑把 sensei 当成一个宏
const props = defineProps<StoryWork>()

// todo: 使用日期格式化库
function toDate(dateString: string) {
  const date = new Date(dateString)
  return `${date.getMonth() + 1}-${date.getDate()}`
}

function getUploadUrl(path: string) {
  return path.startsWith('.') ? `//127.0.0.1:8000/uploads/${path}` : path
}
</script>

<template>
  <div class="story-work-card" flex="~ col" card max-w-lg w-full gap-1 transition hover:scale-102 hover:shadow-xl @click="router.push(`/player/${id}`)">
    <div class="title-and-name" flex="~ items-center">
      <h2 font="500" text="xl" flex-1 of-hidden text-ellipsis whitespace-nowrap>
        {{ props.title }}
      </h2>
      <span color-gray-5>
        {{ props.author.name }} &#183; {{ toDate(props.created) }}
      </span>
    </div>
    <div flex="~ 1" gap-2>
      <img class="story-work-cover" h9rem w12rem b-rd-md object-cover :src="getUploadUrl(props.cover)">
      <div class="story-work-details" flex="~ 1 col">
        <!-- todo js 实现多行溢出省略号 -->
        <div line-clamp-5 flex-1 of-hidden>
          {{ props.description }}
        </div>
        <div class="story-work-infos" font="thin" text="md gray-5" flex="~ justify-around">
          <div flex-1 children:align-middle>
            <i i-material-symbols:play-circle-outline-rounded inline-block />
            <span>
              {{ props.hits }}
            </span>
          </div>
          <div flex-1 children:align-middle>
            <i i-material-symbols:favorite-outline-rounded inline-block />
            <span>
              {{ props.loves }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
