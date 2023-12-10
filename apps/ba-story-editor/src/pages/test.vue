<script setup lang="ts">
import 'ba-story-player/dist/style.css'
import yuuka from './../../scripts/yuuka.json'

const storySummary = {
  chapterName: '章节名',
  summary: '从奇怪的梦中醒来之后的[USERNAME]老师从联邦学生会的干部七神凛那里听到学生会长失踪的消息。由于学生会长失踪，学园城市基沃托斯陷入了混乱。为了解决这场混乱，老师和学生会的干部一同前往夏莱办公室。',
}
const story = yuuka
</script>

<template>
  <div id="editor">
    <div>
      <!-- <BaStoryPlayer
        class="player-container"
        data-url="https://yuuka.cdn.diyigemt.com/image/ba-all-data"
        language="Cn"
        user-name="sensei"
        use-super-sampling=""
        :story="story"
        :story-summary="storySummary"
        :width="750"
        :height="400"
        :exit-fullscreen-time-out="5000"
      /> -->
    </div>
  </div>
</template>
../../scripts/yuuka.json
