<script setup lang="ts">
import { inject, ref } from "vue";
import { getUiI18n } from "../../utils";
import BaTabPanel from "../BaTab/BaTabPanel.vue";
import BaTabs from "../BaTab/BaTabs.vue";
import { Language } from "@/types/store";
import BaSliderBar from "./BaSliderBar.vue";
import { VolumeSetting } from "./settings";

const current = ref("volume");
const language = inject<Language>("language", "Cn");
</script>

<template>
  <div id="ba-player-setting">
    <BaTabs v-model:value="current" class="tabs">
      <BaTabPanel name="volume" :label="getUiI18n('volume', language)">
        <BaSliderBar :data="VolumeSetting[0]" unit="%">
          <template #prefix>
            <img src="../../assets/volume_mute.png" class="volume-img" alt="" />
          </template>
          <template #suffix>
            <img
              src="../../assets/volume_full.png"
              class="volume-img volume-img-right"
              alt=""
            />
          </template>
        </BaSliderBar>
      </BaTabPanel>
      <BaTabPanel name="test" label="测试">
        <h1>test</h1>
      </BaTabPanel>
    </BaTabs>
  </div>
</template>

<style scoped lang="scss">
#ba-player-setting {
  background-color: #f0f0f0;
  padding: 6px 8px;
  .tabs {
    border: 1px solid #d8dbe1;
    border-radius: 3px;
    overflow: hidden;
  }
}
.volume-img {
  vertical-align: middle;
  transform: translateY(-1.5px);
  height: 24px;
}
.volume-img-right {
  transform: translateY(-2px);
}
</style>
