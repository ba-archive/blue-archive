<template>
  <div style="height: 100%">
    <n-input
      v-if="translateStruct.translateType === TranslateType.input"
      v-add-combo-key-listener
      class="explicit-quotation-mark"
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
      @input="inputHandle"
      style="width: 95%; height: 120px"
      clearable
    ></n-input>
    <div
      v-if="translateStruct.translateType === TranslateType.select"
      class="select"
    >
      <div
        v-for="(i, idx) in translateStruct.content"
        class="select-item"
        :key="idx"
      >
        <n-tag :bordered="false" type="info" style="margin-right: 8px">
          {{ i.label }}
        </n-tag>
        <n-input
          :value="i.translated"
          type="text"
          @input="e => selectInputHandle(e, idx)"
          placeholder="请输入"
          clearable
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Directive, computed } from 'vue';
import { useGlobalConfig } from '../store/configStore';
import { useScenarioStore } from '../store/scenarioEditorStore';
import { ContentLine } from '../types/content';
import { useThrottleFn } from '@vueuse/core';

enum TranslateType {
  input,
  select,
}
const props = defineProps({
  handleGotoNextLineRequest: Function,
  handleGotoPrevLineRequest: Function,
});
const config = useGlobalConfig();
const mainStore = useScenarioStore();
const translateStruct = computed(() => {
  if (!config.getSelectLine) return { translateType: TranslateType.input };
  // 翻译前
  const translateText =
    mainStore.getScenario.content[config.getSelectLine][config.getLanguage];
  // 翻译后
  const curTranslated =
    mainStore.getScenario.content[config.getSelectLine][config.getTargetLang];
  const searchReg = /\[ns\d?\]|\[s\d?\]/g;
  const parseArr = translateText.match(searchReg);
  if (parseArr?.length) {
    let translatedArr = [] as string[];
    if (curTranslated) {
      translatedArr = curTranslated.split('\n').map(i => {
        return i.replace(searchReg, '');
      });
    }
    return {
      translateType: TranslateType.select,
      content: parseArr.map((i, idx) => {
        const curIndex = i.match(/\d/g)?.[0] || '';
        let label = '选项';
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
  return {
    translateType: TranslateType.input,
  };
});
const selectInputHandle = (e: string, idx: number) => {
  const temArr = translateStruct.value.content?.map((i, curIdx) => {
    if (curIdx === idx) {
      return i.tag + e;
    }
    return i.tag + i.translated;
  });
  const parseTranslated = temArr?.join('\n');
  inputHandle(parseTranslated || '');
};
const inputHandle = (event: string) => {
  if (config.getSelectLine !== -1) {
    const line = mainStore.getScenario.content[config.getSelectLine];
    line[config.getTargetLang] = event.replaceAll('[#n]', '#n');
    mainStore.setContentLine(line as ContentLine, config.getSelectLine);
  }
};
const textPrefab = (text: string) => {
  return text ? text.replaceAll('#n', '[#n]') : '';
};
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
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
const vAddComboKeyListener: Directive = {
  mounted(el) {
    el.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        props.handleGotoNextLineRequest?.();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        props.handleGotoPrevLineRequest?.();
      }
    });
    el.addEventListener('wheel', wheelEvent);
  },
};
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
