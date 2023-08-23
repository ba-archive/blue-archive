<script setup lang="ts">
import { inject, ref } from "vue";
import { getUiI18n } from "../../utils";
import BaTabPanel from "../BaTab/BaTabPanel.vue";
import BaTabs from "../BaTab/BaTabs.vue";
import { Language } from "@/types/store";
import BaPlayerSettingAbout from "./BaPlayerSettingAbout.vue";
import BaPlayerSettingVolume from "./BaPlayerSettingVolume.vue";

const current = ref("volume");
const language = inject<Language>("language", "Cn");
</script>

<template>
  <div id="ba-player-setting">
    <BaTabs v-model:value="current" class="tabs">
      <BaTabPanel name="volume" :label="getUiI18n('volume', language)">
        <BaPlayerSettingVolume />
      </BaTabPanel>
      <BaTabPanel name="about" :label="getUiI18n('about', language)">
        <BaPlayerSettingAbout />
      </BaTabPanel>
    </BaTabs>
  </div>
</template>

<style scoped lang="scss">
#ba-player-setting {
  background-color: #f0f0f0;
  padding: 6px 8px;
  height: calc(100% - 16px);
  .tabs {
    border: 1px solid #d8dbe1;
    border-radius: 3px;
    height: 100%;
    overflow: hidden;
  }
}
</style>
