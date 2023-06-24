<script setup lang="ts">
import UpdatedPortalCard from "@widgets/UpdatedPortalCard.vue";

export interface HomeDisplayInfo {
  type: "mainstory" | "student" | "minigame";
  icon?: string;
  jumpTo?: string | number;
  title: string;
  startDate?: string; // yyyy/mm/dd
  endDate?: string; // yyyy/mm/dd
  style?: "pixelize";
}

const homepageDisplayInfoList: HomeDisplayInfo[] = [
  {
    type: "minigame",
    title: "白子",
    icon: "https://shiroko.blue-archive.io/favicon.gif",
    jumpTo: "https://shiroko.blue-archive.io",
    startDate: "2023/05/16",
    endDate: "2023/06/30",
    style: "pixelize",
  },
  {
    type: "student",
    jumpTo: 10071,
    title: "月雪 宫子（泳装）",
  },
  {
    type: "student",
    jumpTo: 10072,
    title: "空井 咲（泳装）",
  },
  {
    type: "student",
    jumpTo: 26010,
    title: "霞泽 美游（泳装）",
  },
];
</script>

<template>
  <div id="home-welcome" class="center flex-vertical fill-screen">
    <div class="center flex-vertical">
      <img
        class="mika-sticker"
        src="/src/assets/mika_sticker.webp"
        alt="mika"
      />
      <p>先从<span id="choice"></span>选择项目哦</p>
      <div class="update-info-container">
        <updated-portal-card
          v-for="info in homepageDisplayInfoList"
          :info="info"
          :key="info.title"
        />
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
    transition: color 0.375s ease-in-out;
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
