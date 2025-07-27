<template>
  <div class="h-full flex-1">
    <n-input
      v-if="translateStruct.translateType === TranslateType.input"
      ref="textInputRef"
      class="explicit-quotation-mark h-[204px]"
      placeholder="暂无翻译"
      type="textarea"
      :value="
        config.getSelectLine !== -1
          ? textPrefab(
              mainStore.getScenario.content[config.getSelectLine][
                config.getTargetLang
              ]
            )
          : ''
      "
      clearable
      @input="inputHandle"
    ></n-input>
    <n-space
      v-if="translateStruct.translateType === TranslateType.select"
      vertical
      :size="16"
      align="stretch"
    >
      <div
        v-for="(selection, idx) in translateStruct.content"
        :key="idx"
        class="select-item"
      >
        <n-tag :bordered="false" type="info" style="margin-right: 8px">
          {{ selection.label }}
        </n-tag>
        <n-input
          :value="selection.translated"
          type="textarea"
          :autosize="{ minRows: 2 }"
          placeholder="请输入"
          clearable
          @input="(e: string) => selectInputHandle(e, idx)"
        />
      </div>
    </n-space>

    <n-space
      v-if="translateStruct.translateType === TranslateType.title"
      :size="8"
      align="center"
    >
      <n-tag :bordered="false" type="info" style="margin-right: 8px"
        >标题
      </n-tag>
      <n-input-group>
        <n-input
          :default-value="translateStruct.content[0].label"
          style="width: 8rem"
          @input="titleInputHandle('label', $event)"
        >
          <template #prefix>
            <span style="color: #999">第</span>
          </template>
          <template #suffix>
            <span style="color: #999">话</span>
          </template>
        </n-input>
        <n-input
          class="explicit-quotation-mark"
          placeholder="暂无翻译"
          :value="translateStruct.content[0].translated"
          clearable
          @input="titleInputHandle('content', $event)"
        ></n-input>
      </n-input-group>
    </n-space>

    <n-space
      v-if="translateStruct.translateType === TranslateType.nextEpisode"
      align="center"
      :size="8"
    >
      <n-tag :bordered="false" type="info" style="margin-right: 8px"
        >标题
      </n-tag>
      <n-input-group>
        <n-input
          class="explicit-quotation-mark"
          placeholder="暂无翻译"
          :value="translateStruct.content[0].translated"
          clearable
          @input="titleInputHandle('content', $event)"
        >
          <template #prefix>
            <span style="color: #999">下一话</span>
          </template>
        </n-input>
      </n-input-group>
    </n-space>
  </div>
</template>
<script setup lang="ts">
import { ComputedRef, computed, ref, onMounted } from "vue";
import { useGlobalConfig } from "../store/configStore";
import { useScenarioStore } from "../store/scenarioEditorStore";
import { ContentLine } from "../types/content";
import { useThrottleFn } from "@vueuse/core";

enum TranslateType {
  input,
  select,
  title,
  nextEpisode,
}

const props = defineProps({
  handleGotoNextLineRequest: Function,
  handleGotoPrevLineRequest: Function,
});

const textInputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  textInputRef.value?.focus();
});

const config = useGlobalConfig();
const mainStore = useScenarioStore();
 
// @ts-ignore
const translateStruct: ComputedRef<{
  translateType: TranslateType;
  label?: string;
  content: Array<{ label: string; translated: string; tag?: number }>;
}> = computed(() => {
  if (-1 === config.getSelectLine)
    return { translateType: TranslateType.input };
  // 翻译前
  const translateText = computed(
    () =>
      mainStore.getScenario.content[config.getSelectLine][config.getLanguage]
  );
  // 翻译后
  const curTranslated = computed(
    () =>
      mainStore.getScenario.content[config.getSelectLine][config.getTargetLang]
  );

  const searchReg = /\[n?s(\d{0,2})?]/g;
  const parseArr = translateText.value.match(searchReg);

  if (parseArr?.length) {
    let translatedArr = [] as string[];
    if (curTranslated.value) {
      translatedArr = curTranslated.value.split("\n").map(i => {
        return i.replace(searchReg, "");
      });
    }

    return {
      translateType: TranslateType.select,
      content: parseArr.map((i, idx) => {
        const curIndex = i.match(/\d+/g)?.[0] || "";
        let label = "选项";
        if (/ns|s/.test(i)) {
          label = label + curIndex;
        }
        return {
          label,
          translated: translatedArr[idx],
          tag: i,
        };
      }),
    };
  }

  const titleRegex = new RegExp(
    /^(第[\d一二三四五六七八九十]+[話话]|Episode \d)[;；]/
  );
  const titleMatch = translateText.value.match(titleRegex);
  if (titleMatch?.length) {
    return {
      translateType: TranslateType.title,
      content: [
        {
          label:
            curTranslated.value.match(/[\d一二三四五六七八九十]+/)?.[0] ||
            translateText.value.match(/[\d一二三四五六七八九十]+/)?.[0] ||
            "",
          translated: curTranslated.value.replace(titleRegex, ""),
        },
      ],
    };
  }

  const nextEpisodeRegex = new RegExp(/^(次回|下一[話话]|Next Episode)[;；]/);
  const nextEpisodeMatch = translateText.value.match(nextEpisodeRegex);
  if (nextEpisodeMatch?.length) {
    return {
      translateType: TranslateType.nextEpisode,
      content: [
        {
          label: "",
          translated: curTranslated.value.replace(nextEpisodeRegex, ""),
        },
      ],
    };
  }

  return {
    translateType: TranslateType.input,
    text: translateText.value,
    content: [],
  };
});

const selectInputHandle = (e: string, idx: number) => {
  const temArr = translateStruct.value.content?.map((i, curIdx) => {
    if (curIdx === idx) {
      return i.tag + e;
    }
    return i.tag + i.translated;
  });
  const parseTranslated = temArr?.join("\n");
  inputHandle(parseTranslated || "");
};

function titleInputHandle(position: "label" | "content", text: string) {
  const line = mainStore.getScenario.content[config.getSelectLine];
  const targetLang = config.getTargetLang;
  const type = translateStruct.value.translateType;
  let titlePrefix = "";
  if (TranslateType.title === type) {
    const label =
      "label" === position ? text : translateStruct.value.content[0].label;

    titlePrefix = "第" + label;
  } else if (TranslateType.nextEpisode === type) {
    titlePrefix = "下一";
  }

  titlePrefix += "TextCn" === targetLang ? "话;" : "話;";

  line[targetLang] =
    "label" === position
      ? titlePrefix + translateStruct.value.content[0].translated
      : titlePrefix + text;
  console.log(line[targetLang], "label" === position);
  mainStore.setContentLine(line as ContentLine, config.getSelectLine);
}

const inputHandle = (event: string) => {
  if (config.getSelectLine !== -1) {
    const line = mainStore.getScenario.content[config.getSelectLine];
    line[config.getTargetLang] = event.replaceAll("[#n]", "#n");
    mainStore.setContentLine(line as ContentLine, config.getSelectLine);
  }
};

const textPrefab = (text: string) => {
  return text ? text.replaceAll("#n", "[#n]") : "";
};

const wheelEvent = useThrottleFn((e: WheelEvent & { [key: string]: any }) => {
  const delta = e.wheelDelta ? e.wheelDelta : -e.detail;
  // 触控板会有 -0 的情况
  if (Math.abs(delta) < 1) return;
  if (delta < 0) {
    props.handleGotoNextLineRequest?.();
  } else {
    props.handleGotoPrevLineRequest?.();
  }
}, 400);
</script>
<style scoped lang="scss">
.select {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-right: 16px;
  height: 100%;
}

.select-item {
  display: flex;
  align-items: center;
}
</style>
