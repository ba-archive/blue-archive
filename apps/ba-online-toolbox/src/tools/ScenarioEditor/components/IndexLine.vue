<template>
  <div
    v-if="'' !== line.TextJp"
    style="cursor: pointer"
    ref="currentElement"
    class="card bg-white @dark:bg-slate-800 border-solid border-1 border-gray-300 @dark:border-gray-700"
    :class="{ selected: index === config.selectLine, unsure: line.Unsure }"
  >
    <n-image v-if="false"></n-image>
    <n-text class="pl-4">
      <n-text class="line-type" :class="getLineType(line)">{{
        line[mainLanguage] || "暂无参考文本"
      }}</n-text>
      <div class="pl-[38px]" v-if="config.getShowAllLanguage">
        <div
          v-for="language in availableLanguages.filter(l => l !== mainLanguage)"
          :key="language"
        >
          {{ getContentByLang(line, language as keyof ContentLine) }}
        </div>
      </div>
      <div class="pl-[38px]" v-else>{{ line[targetLanguage] }}</div>
    </n-text>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useGlobalConfig } from "../store/configStore";
import { ContentLine } from "../types/content";

const config = useGlobalConfig();
const props = defineProps<{
  line: ContentLine;
  index: number;
}>();

onMounted(() => {
  const activeElement = document.querySelector(".selected");
  if (activeElement) {
    activeElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
});

const currentElement = ref<HTMLElement>();

function isInViewport(el: HTMLElement | undefined) {
  if (!el) return true;
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

const availableLanguages = [
  "TextJp",
  "TextTw",
  "TextCn",
  "TextEn",
  // 'TextKr',
  // 'TextTh',
];

const mainLanguage = computed(() => config.getLanguage);
const targetLanguage = computed(() => config.getTargetLang);

watch(
  () => config.selectLine,
  newVal => {
    if (newVal === props.index) {
      if (!isInViewport(currentElement.value)) {
        currentElement.value?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }
);

function getContentByLang(line: ContentLine, lang: keyof ContentLine) {
  return line[lang];
}

enum LineType {
  title = "type-title",
  text = "type-text",
  selection = "type-selection",
  reply = "type-reply",
  place = "type-place",
}

function getLineType(line: ContentLine) {
  const lineScript = line.ScriptKr || "";
  const selectionGroup = line.SelectionGroup;
  switch (true) {
    case lineScript.includes("#title"):
      return LineType.title;
    case /\[n?s(\d{0,2})?]/.test(lineScript):
      return LineType.selection;
    case lineScript.includes("#place"):
      return LineType.place;
    case selectionGroup > 0:
      return LineType.reply;
    default:
      return LineType.text;
  }
}
</script>

<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: all 0.375s ease-in-out;
  border-radius: 4px;
  padding: 1rem 1rem 1rem 0.5rem;
  overflow: visible;
}
.selected {
  background-color: #b2cffa;
}
.unsure {
  background-color: #ffce80;
}

@media (prefers-color-scheme: dark) {
  .selected {
    background-color: #113078;
  }
  .unsure {
    background-color: #79440b;
  }
}

div {
  .line-type {
    &::before {
      display: inline-flex;
      color: #165dff;
      background: #e8f3ff;
      padding: 1px 4px;
      margin-right: 6px;
      border-radius: 2px;
      align-items: center;
      font-size: 0.75rem;
      width: 24px;
    }
  }
  .type-title::before {
    content: "标题";
  }
  .type-selection::before {
    content: "选项";
  }
  .type-text::before {
    content: "文本";
  }
  .type-place::before {
    content: "地点";
  }
  .type-reply::before {
    content: "回复";
  }
}

@media (prefers-color-scheme: dark) {
  div {
    .line-type {
      &::before {
        color: #3c7eff;
        background: #000d4d;
      }
    }
  }
}
</style>
