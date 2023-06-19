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
      <span>{{ line[mainLanguage] || '暂无参考文本' }}</span>
      <!--      <br v-if="3 === config.isSwitchLanguage" />-->
      <!--      <span v-if="config.isSwitchLanguage & 0b01">{{-->
      <!--        line[config.getTargetLang] || '暂无翻译'-->
      <!--      }}</span>-->
      <div>
        <div
          v-show="config.getShowAllLanguage"
          v-for="language in availableLanguages.filter(l => l !== mainLanguage)"
          :key="language"
        >
          <span>{{ line[language as keyof ContentLine] }}</span>
        </div>
        <div v-show="!config.getShowAllLanguage">
          <span>{{ line[targetLanguage] }}</span>
        </div>
      </div>
    </n-text>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useGlobalConfig } from '../store/configStore';
// import { useScenarioStore } from '../store/scenarioEditorStore';
import { ContentLine } from '../types/content';

// const mainStore = useScenarioStore();
const config = useGlobalConfig();
const props = defineProps<{
  line: ContentLine;
  index: number;
}>();

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
  'TextJp',
  'TextTw',
  'TextCn',
  'TextEn',
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
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }
);
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
}
.selected {
  background-color: #b2cffa;
}
.unsure {
  background-color: #ffce80;
}
</style>
