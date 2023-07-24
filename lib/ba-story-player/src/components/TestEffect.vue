<template>
  <div class="tester">
    <select
      v-model="effectType"
      @change="
        () => {
          $nextTick(resizeTextareas);
        }
      "
    >
      <option>transition</option>
      <option>bgeffect</option>
      <option>other</option>
    </select>
    <div v-if="effectType === 'transition'">
      <label>transitionName</label>
      <input
        list="transitionNames"
        v-model="currentTransition"
        @input="updateTransitionItem"
      />
      <datalist id="transitionNames">
        <option v-for="(name, index) in transitionNames" :key="index">
          {{ name }}
        </option>
      </datalist>
      <label>具体参数</label>
      <textarea
        :value="JSON.stringify(currentTransitionItem, null, 2)"
        @input="event => { currentTransitionItem = JSON.parse((event.target as HTMLTextAreaElement).value) }"
      />
    </div>
    <div v-else-if="effectType === 'bgeffect'">
      <label>effectType</label>
      <select v-model="currentBGEffectType" @change="effectTypeChange">
        <option
          v-for="(effect, index) in Object.keys(effectNamesTable)"
          :key="index"
        >
          {{ effect }}
        </option>
      </select>
      <label>bgEffect name</label>
      <select v-model="currentBGEffect" @change="updateBGEffectItem">
        <option v-for="(name, index) in currentBGEffectNames" :key="index">
          {{ name }}
        </option>
      </select>
      <textarea
        :value="JSON.stringify(currentBGEffectItem, null, 2)"
        @input="event => { currentBGEffectItem = JSON.parse((event.target as HTMLTextAreaElement).value) }"
      />
      <label>option(该参数仅当前起效)</label>
      <textarea
        :value="
          JSON.stringify(bgEffectHandlerOptions[currentBGEffectType], null, 2)
        "
        @input="event => { bgEffectHandlerOptions[currentBGEffectType] 
          = JSON.parse((event.target as HTMLTextAreaElement).value) }"
      />
    </div>
    <div v-else-if="effectType === 'other'">
      <label>otherEffect type</label>
      <select v-model="currentOtherEffectType">
        <option>zmc</option>
        <option>wait</option>
        <option>bgshake</option>
      </select>
      <div v-if="currentOtherEffectType === 'wait'">
        <label>时长</label>
        <input v-model="otherEffectArgs" type="number" />
      </div>
      <div v-else-if="currentOtherEffectType === 'zmc'">
        <label style="display: block">参数</label>
        <textarea
          :value="JSON.stringify(otherEffectArgs, null, 2)"
          @input="event => { otherEffectArgs = JSON.parse((event.target as HTMLTextAreaElement).value) }"
        />
      </div>
    </div>
    <button @click="playEffect">播放特效</button>
    <button @click="removeEffect">移除特效</button>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import eventBus from "../../lib/eventBus";
import { resourcesLoader } from "../../lib/index";
import { removeEffect } from "../../lib/layers/effectLayer";
import { bgEffectHandlerOptions } from "../../lib/layers/effectLayer/bgEffectHandlers";
import { usePlayerStore } from "../../lib/stores/index";
import { Effect, ZmcArgs } from "../../lib/types/common";
import { BGEffectType } from "../../lib/types/excels";
import { wait } from "../../lib/utils";
import { setDataUrl } from "../../lib/utils";
import { resizeTextareas } from "../utils";

setDataUrl("https://yuuka.cdn.diyigemt.com/image/ba-all-data");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
await resourcesLoader.loadExcels();
let effectType = ref<"transition" | "bgeffect" | "other">("transition");
async function playEffect() {
  switch (effectType.value) {
    case "transition":
      if (currentTransitionItem.value) {
        eventBus.emit("transitionIn", currentTransitionItem.value);
        await wait(currentTransitionItem.value.TransitionInDuration);
        eventBus.emit("transitionOut", currentTransitionItem.value);
      }
      break;
    case "bgeffect":
      if (currentBGEffectItem.value) {
        eventBus.emit("playEffect", {
          BGEffect: currentBGEffectItem.value,
          otherEffect: [],
        });
      }
      break;
    case "other":
      eventBus.emit("playEffect", {
        otherEffect: [
          {
            type: currentOtherEffectType.value,
            args: otherEffectArgs.value,
          },
        ],
      });
      break;
  }
}
let stores = usePlayerStore();

//transition
let transitionNames = Array.from(stores.TransitionExcelTable.keys());
let currentTransition = ref(0);
function updateTransitionItem() {
  let item = stores.TransitionExcelTable.get(Number(currentTransition.value));
  if (item) {
    currentTransitionItem.value = item;
  }
}
let currentTransitionItem = ref(
  stores.TransitionExcelTable.get(transitionNames[0])
);

//bgEffect
let effectNamesTable: Record<string, number[]> = {};
for (let [key, item] of stores.BGEffectExcelTable.entries()) {
  if (Reflect.get(effectNamesTable, item.Effect)) {
    effectNamesTable[item.Effect].push(key);
  } else {
    effectNamesTable[item.Effect] = [key];
  }
}
let currentBGEffect = ref(0);
let currentBGEffectType = ref<BGEffectType>("BG_Rain_L");
let currentBGEffectItem = ref(
  stores.BGEffectExcelTable.get(effectNamesTable["BG_Rain_L"][0])
);
let currentBGEffectNames = computed(() => {
  if (effectNamesTable[currentBGEffectType.value]) {
    return effectNamesTable[currentBGEffectType.value];
  } else {
    return [];
  }
});
function updateBGEffectItem() {
  let item = stores.BGEffectExcelTable.get(Number(currentBGEffect.value));
  if (item) {
    currentBGEffectItem.value = item;
    currentBGEffectType.value = item.Effect;
  }
}
function effectTypeChange() {
  currentBGEffect.value = currentBGEffectNames.value[0];
  updateBGEffectItem();
}

//otherEffect
let currentOtherEffectType = ref<Effect["type"]>("zmc");
let defaultZmcArgs: ZmcArgs = {
  type: "move",
  position: [0, -222],
  size: 2528,
  duration: 10,
};
let otherEffectArgs = ref<any>(defaultZmcArgs);
watch(currentOtherEffectType, () => {
  if (currentOtherEffectType.value === "zmc") {
    otherEffectArgs.value = defaultZmcArgs;
  }
  nextTick(() => resizeTextareas());
});

//缓存值以便刷新后正常使用
let cache = {
  effectType,
  currentBGEffect,
  currentTransition,
};
let cacheKey = "effectCache";
watch(Object.values(cache), () => {
  let tempCache: any = {};
  for (let key of Object.keys(cache) as Array<keyof typeof cache>) {
    Reflect.set(tempCache, key, cache[key].value);
  }
  localStorage.setItem(cacheKey, JSON.stringify(tempCache));
});
if (localStorage.getItem(cacheKey)) {
  let tempCache = JSON.parse(localStorage.getItem(cacheKey)!);
  for (let key of Object.keys(cache) as Array<keyof typeof cache>) {
    if (typeof cache[key].value === "number") {
      cache[key].value = Number(tempCache[key]);
    } else {
      cache[key].value = tempCache[key];
    }
  }
  updateBGEffectItem();
}

onMounted(() => {
  resizeTextareas();
});
</script>

<style scoped>
.tester > div {
  display: flex;
  flex-direction: column;
}
</style>
