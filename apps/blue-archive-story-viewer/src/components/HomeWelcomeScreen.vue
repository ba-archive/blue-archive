<script setup lang="ts">
import UpdatedPortalCard from "@widgets/UpdatedPortalCard.vue";

export interface HomeDisplayInfo {
  type: "mainstory" | "otherStory" | "student" | "minigame";
  icon?: string;
  jumpTo?: string | number;
  title: string;
  startDate?: string; // yyyy/mm/dd
  endDate?: string; // yyyy/mm/dd
  style?: "pixelize";
}

const homepageDisplayInfoList: HomeDisplayInfo[] = [
  {
    type: "student",
    jumpTo: 10004,
    title: "空崎 日奈（爱用品）",
  },
  {
    type: "student",
    jumpTo: 10096,
    title: "尾刃 康娜（泳装）",
  },
  {
    type: "student",
    jumpTo: 10097,
    title: "风仓 萌绘（泳装）",
  },
  {
    type: "student",
    jumpTo: 10098,
    title: "小鸟游 星野（临战）",
  },
  {
    type: "student",
    jumpTo: 10100,
    title: "白子＊恐怖",
  },
  {
    type: "student",
    jumpTo: 10101,
    title: "锭前 纱织（泳装）",
  },
  {
    type: "student",
    jumpTo: 10102,
    title: "槌永 日和（泳装）",
  },
  {
    type: "student",
    jumpTo: 10019,
    title: "白洲 梓",
  },
  {
    type: "student",
    jumpTo: 13001,
    title: "和乐 千世（爱用品）",
  },
  {
    type: "student",
    jumpTo: 20037,
    title: "合欢垣 吹雪（泳装）",
  },
  {
    type: "student",
    jumpTo: 26012,
    title: "中务 桐乃（泳装）",
  },
  {
    type: "student",
    jumpTo: 26013,
    title: "秤 亚津子（泳装）",
  },
  {
    type: "minigame",
    title: "小春幸存者游戏",
    icon: "https://games.blue-archive.io/koharu-dream/image/favicon.png",
    jumpTo: "https://games.blue-archive.io/koharu-dream/",
    startDate: "2023/09/01",
    style: "pixelize",
  },
];
</script>

<template>
  <div id="home-welcome" class="center flex-vertical fill-screen">
    <div class="center flex-vertical">
      <img class="mika-sticker" src="@assets/mika_sticker.webp" alt="mika" />
      <p class="color-transition">先从<span id="choice"></span>选择项目哦</p>
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
