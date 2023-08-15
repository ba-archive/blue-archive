<script setup lang="ts">
import UpdatedPortalCard from "@widgets/UpdatedPortalCard.vue";
import { fetchRecordData, displayRecordData } from "@utils/recordData";
let fetchErrorMessage = '';
let storyId = '';
import { fetchRecordData, displayRecordData } from "@utils/recordData";
let fetchErrorMessage = '';
let storyId = '';

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
  // {
  //   type: "minigame",
  //   title: "白子",
  //   icon: "https://shiroko.blue-archive.io/favicon.gif",
  //   jumpTo: "https://shiroko.blue-archive.io",
  //   startDate: "2023/05/16",
  const homepageDisplayInfoList: HomeDisplayInfo[] = [
      {
        type: "student",
        jumpTo: 13010,
        title: "早濑 优香",
      },
      {
        type: "student",
        jumpTo: 10014,
        title: "久田 泉奈",
      },
      {
        type: "mainstory",
        title: "Vol.3 第二章",
      },
    ];
  
  async function handleRecord(storyId: number | string) {
    try {
      const recordData = await fetchRecordData(storyId);
      displayRecordData(recordData);
    } catch (error) {
      fetchErrorMessage.value = 'Failed to fetch record data';
    }
  }
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
        <div
          @click="handleRecord(info.jumpTo)"
          class="user-button shadow-near rounded-small"
        >
          Record
        </div>
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
