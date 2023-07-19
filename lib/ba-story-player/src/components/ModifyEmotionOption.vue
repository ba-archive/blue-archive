<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import eventBus from "../../lib/eventBus";
import actionOptions, {
  actionDescriptions,
} from "../../lib/layers/characterLayer/options/actionOptions";
import emotionOptions, {
  emotionDescriptions,
} from "../../lib/layers/characterLayer/options/emotionOptions";
import fxOptions, {
  fxOptionsDescriptions,
} from "../../lib/layers/characterLayer/options/fxOptions";
import { EffectsWord } from "../../lib/types/characterLayer";
import { resizeTextareas } from "../utils";

let effectType = ref<"action" | "emotion" | "fx">("emotion");
let current = ref("Music");
let signal = ref(false);
let highlight = ref(true);
let selectCache: { effectType: "action" | "emotion" | "fx"; current: string };
if (localStorage.getItem("selectCache")) {
  selectCache = JSON.parse(localStorage.getItem("selectCache")!);
  effectType.value = selectCache["effectType"];
  current.value = selectCache["current"];
} else {
  selectCache = {
    effectType: effectType.value,
    current: current.value,
  };
  localStorage.setItem("selectCache", JSON.stringify(selectCache));
}

let optionsMap = {
  emotion: emotionOptions,
  action: actionOptions,
  fx: fxOptions,
};

let descriptionsMap = {
  emotion: emotionDescriptions,
  action: actionDescriptions,
  fx: fxOptionsDescriptions,
};

function checkAndReturn(property: string, object: any) {
  if (property in object) {
    return object[property];
  } else {
    return {};
  }
}

let currentOptions = computed(() => {
  return checkAndReturn(current.value, optionsMap[effectType.value]);
});

let currentDescriptions = computed(() => {
  return checkAndReturn(current.value, descriptionsMap[effectType.value]);
});

function showCharacter() {
  eventBus.emit("showCharacter", {
    characters: [
      {
        CharacterName: 3715128518,
        face: "05",
        position: 3,
        highlight: true,
        signal: false,
        spineUrl:
          "https://yuuka.diyigemt.com/image/ba-all-data/spine/CH0184ND_spr/CH0184ND_spr.skel",
        effects: [
          {
            type: "action",
            effect: "a",
            async: false,
          },
        ],
      },
    ],
  });
}

function playEffect() {
  eventBus.emit("showCharacter", {
    characters: [
      {
        /**
         * 注意如果不是体香1剧情需要更改
         */
        CharacterName: 3715128518,
        face: "05",
        position: 3,
        highlight: highlight.value,
        signal: signal.value,
        spineUrl: "",
        effects: [
          {
            type: effectType.value,
            effect: current.value as EffectsWord,
            async: false,
          },
        ],
      },
    ],
  });
}

function changeOption(option: string, value: any) {
  Reflect.set(currentOptions.value, option, value);
}

function outputOptions() {
  navigator.clipboard.writeText(JSON.stringify(currentOptions.value, null, 2));
}

function updateType() {
  nextTick(() => {
    resizeTextareas();
  });

  localStorage.setItem(
    "selectCache",
    JSON.stringify({
      effectType: effectType.value,
      current: current.value,
    })
  );
}

onMounted(() => {
  resizeTextareas();
});
</script>

<template>
  <div>
    <div>
      <label>signal:</label>
      <input type="checkbox" v-model="signal" />
      <label>highlight:</label>
      <input type="checkbox" v-model="highlight" />
    </div>
    <select v-model="effectType" @change="updateType">
      <option>emotion</option>
      <option>action</option>
      <option>fx</option>
    </select>
    <select v-model="current" @change="updateType">
      <option v-for="effect in Object.keys(optionsMap[effectType])">
        {{ effect }}
      </option>
    </select>
    <div v-for="option in Object.keys(currentOptions)">
      <div v-if="typeof currentOptions[option] === 'string'">
        <p :title="currentDescriptions[option]">{{ option }}</p>
        <input
          :value="currentOptions[option]"
          @input="(event) => changeOption(option, (event.target as HTMLInputElement).value)"
        />
      </div>
      <div v-else-if="typeof currentOptions[option] === 'number'">
        <p :title="currentDescriptions[option]">{{ option }}</p>
        <input
          type="number"
          step="0.01"
          :value="currentOptions[option]"
          @input="(event) => changeOption(option, Number((event.target as HTMLInputElement).value))"
        />
      </div>
      <div v-else-if="typeof currentOptions[option] === 'object'">
        <p :title="currentDescriptions[option]">{{ option }}</p>
        <textarea
          :value="JSON.stringify(currentOptions[option], null, 2)"
          @input="(event) => changeOption(option, JSON.parse((event.target as HTMLInputElement).value))"
        />
      </div>
    </div>
    <div class="mt-8 text-left">
      <button @click="showCharacter">显示人物(显示后再播放特效)</button>
    </div>
    <div class="mt-8 text-left">
      <button @click="playEffect">播放人物特效</button>
    </div>
    <div class="mt-8 text-left">
      <button @click="outputOptions">复制参数(可填入参数文件)</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mt-8 {
  margin-top: 8px;
}
.text-left {
  text-align: left;
}
</style>
