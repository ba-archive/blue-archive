<template>
  <div
    v-if="'' !== line.TextJp"
    style="cursor: pointer"
    ref="currentElement"
    class="card"
    :class="{ selected: index === config.selectLine, unsure: line.Unsure }"
  >
    <n-image v-if="false"></n-image>
    <n-text>
      <span :class="getLineType(line)">{{
        line[mainLanguage] || "暂无参考文本"
      }}</span>
      <div v-if="config.getShowAllLanguage">
        <div
          v-for="language in availableLanguages.filter(l => l !== mainLanguage)"
          :key="language"
        >
          <span v-if="getContentByLang(line, language)">{{
            getContentByLang(line, language)
          }}</span>
        </div>
      </div>
      <span v-if="!config.getShowAllLanguage">{{ line[targetLanguage] }}</span>
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
}

function getLineType(line: ContentLine) {
  const lineScript = line.ScriptKr || "";
  switch (true) {
    case lineScript.includes("#title"):
      return LineType.title;
    case /\[n?s(\d{0,2})?]/.test(lineScript):
      return LineType.selection;
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
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  background-color: #fff;
  padding: 1rem;
  overflow: visible;
}
.selected {
  background-color: #b2cffa;
}
.unsure {
  background-color: #ffce80;
}
span {
  :is(.type-title, .type-selection, .type-text) {
    &::before {
      display: inline-flex;
      color: #165dff;
      background: rgba(32, 128, 240, 0.12);
      padding: 1px 4px;
      margin-right: 4px;
      border-radius: 2px;
      align-items: center;
      font-size: 0.75rem;
    }
  }
  :not(.type-title, .type-selection, .type-text) {
    padding-left: calc(0.5rem + 4px);
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
}
</style>
