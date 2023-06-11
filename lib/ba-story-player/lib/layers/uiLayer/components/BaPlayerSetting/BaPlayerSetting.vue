<script setup lang="ts">
import BaPlayerSettingRadio from "./BaRadio.vue";
import { SuperResolutionSetting } from "./settings";
import { ObbAudioSetting } from "./settings";
</script>

<template>
  <div id="ba-player-setting">
    <ul>
      <li>
        <BaPlayerSettingRadio
          :data="SuperResolutionSetting"
        ></BaPlayerSettingRadio>
      </li>
      <li>
        <BaPlayerSettingRadio :data="ObbAudioSetting"></BaPlayerSettingRadio>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss"></style>
