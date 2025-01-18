<script setup lang="ts">
import UpdatedPortalCard from "@widgets/UpdatedPortalCard.vue";
import { ref } from "vue";

export interface HomeDisplayInfo {
  type: "mainstory" | "otherStory" | "student" | "minigame";
  icon?: string;
  jumpTo?: string | number;
  title: string;
  startDate?: string; // yyyy/mm/dd
  endDate?: string; // yyyy/mm/dd
  style?: "pixelize";
}

const homepageDisplayInfoList = ref<HomeDisplayInfo[]>([
  {
    type: "student",
    jumpTo: 10038,
    title: "月雪 宫子",
  },
  {
    type: "student",
    jumpTo: 10049,
    title: "杏山 和纱",
  },
  {
    type: "student",
    jumpTo: 13008,
    title: "黑见 芹香",
  },
  {
    type: "minigame",
    title: "小春幸存者游戏",
    icon: "https://games.blue-archive.io/koharu-dream/image/favicon.png",
    jumpTo: "https://games.blue-archive.io/koharu-dream/",
    startDate: "2023/09/01",
    style: "pixelize",
  },
]);
</script>

<template>
  <div id="home-welcome" class="center flex-vertical fill-screen">
    <div class="center flex-vertical">
      <img class="mika-sticker" src="@assets/mika_sticker.webp" alt="mika" />
      <p class="color-transition">先从<span id="choice"></span>选择项目哦</p>
      <div class="update-info-container">
        <transition-group name="update-portal-card">
          <updated-portal-card
            v-for="info in homepageDisplayInfoList"
            :info="info"
            :key="info.title"
          />
        </transition-group>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#home-welcome {
  gap: 1rem;
  user-select: none;

  .mika-sticker {
    transform: scaleX(-1);
    max-width: 200px;
  }

  p {
    color: var(--color-text-main);
    font-weight: bold;
    font-size: 1.5rem;
  }
}

.update-info-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
  margin: 1rem 0;
}

#choice::after {
  content: "左边";
}

.navigation {
  color: var(--color-pallete-arona-blue);
  text-decoration: none;
}

.briefing {
  display: block;
  margin-top: 0.5rem;
  color: #808080;
  font-size: 0.8rem;
}

// FIXME: 没能让vue大人做到平滑过渡，十分抱歉

.update-portal-card-move,
.update-portal-card-enter-active,
.update-portal-card-leave-active {
  transition: all 0.375s ease-in-out;
}

.update-portal-card-enter-from,
.update-portal-card-leave-to {
  opacity: 0;
  transform: scaleY(0);
}

@media screen and (max-width: 768px) {
  #choice::after {
    content: "右上角";
  }
  //noinspection CssOverwrittenProperties
  .update-info-container {
    width: calc(100vw - 2rem);
    width: calc(100dvw - 2rem);
    max-width: 425px;
  }
}
</style>
