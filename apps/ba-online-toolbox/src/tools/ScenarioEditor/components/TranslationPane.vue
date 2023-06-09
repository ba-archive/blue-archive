<template>
  <div class="translation-pane">
    <n-space vertical class="translation-card rounded-medium">
      <div class="reference">
        <span>
          <n-tag secondary type="info" :bordered="false">参考文本语言</n-tag>
          <n-radio-group style="margin-left: 1rem" :value="config.getLanguage">
            <n-radio
              v-for="lang in Object.keys(langHash)"
              :key="lang"
              :value="lang"
              @click="config.setLanguage(lang as Language)"
              >{{ langHash[lang as Language] }}</n-radio
            >
          </n-radio-group>
        </span>
      </div>
      <div class="referLang">
        <n-input
          type="textarea"
          style="height: 80px; width: 100%"
          :value="
            config.getSelectLine !== -1
              ? mainStore.getScenario.content[config.getSelectLine][
                  config.getLanguage
                ]?.replaceAll('#n', '[#n]')
              : '请选择一行'
          "
          :placeholder="
            config.getSelectLine !== -1
              ? mainStore.getScenario.content[config.getSelectLine][
                  config.getLanguage
                ] || '该语言暂无翻译'
              : ''
          "
        ></n-input>
      </div>
      <div class="trans">
        <n-space>
          <n-button @click="translateHandle" type="info">翻译参考文本</n-button>
          <n-button @click="acceptHandle" type="info">接受机翻</n-button>
          <n-dropdown
            placement="top-start"
            trigger="hover"
            :options="tagHash"
            @select="config.setSelectTag($event)"
          >
            <n-button secondary type="info" @click="addTag()">
              插入标签: {{ config.selectTag }}</n-button
            >
          </n-dropdown>
          <n-dropdown
            trigger="hover"
            :options="langSelect"
            @select="
              {
                config.setTargetLang($event as Language);
              }
            "
          >
            <n-button secondary type="info">
              目标语言: {{ langHash[config.getTargetLang] }}
            </n-button>
          </n-dropdown></n-space
        >
        <span>
          <n-space>
            <n-text>显示全部语言</n-text>
            <n-switch
              @update:value="handleShowAllLanguageChange"
              :value="config.getShowAllLanguage"
            >
            </n-switch>
          </n-space>
        </span>
      </div>
      <div class="textLine">
        <span style="flex: 2">
          <n-input
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
        </span>
        <span style="flex: 1; width: 100%">
          <n-input
            type="textarea"
            placeholder="机翻结果"
            :value="config.tmpMachineTranslate"
            style="width: 100%; height: 120px"
          >
          </n-input>
        </span>
      </div>
      <div class="comment-container flex-horizontal fill-width">
        <n-checkbox
          :checked="
            config.getSelectLine !== -1
              ? mainStore.getScenario.content[config.getSelectLine].Unsure
                ? true
                : false
              : false
          "
          @click="
            () => {
              if (config.getSelectLine !== -1) {
                mainStore.getScenario.content[config.getSelectLine].Unsure =
                  !mainStore.getScenario.content[config.getSelectLine].Unsure;
              }
            }
          "
        >
          <span>这个翻译我不确定!</span>
        </n-checkbox>
        <n-input
          class="commentInput"
          :value="
            config.getSelectLine !== -1
              ? mainStore.getScenario.content[config.getSelectLine].comment ||
                ''
              : ''
          "
          :placeholder="config.getSelectLine !== -1 ? '请输入备注' : ''"
          @input="commentHandle"
          style="width: 100%"
        >
        </n-input>
      </div>
      <n-space align="center">
        <n-button
          :disabled="isLastLine"
          type="primary"
          @click="handleGotoNextLineRequest"
          >下一句
        </n-button>
        <n-button
          :disabled="isLastLine"
          quaternary
          type="primary"
          @click="handleGotoPrevLineRequest"
          >上一句
        </n-button>
        <span style="color: lightgray"
          >当前位置： {{ completion.completed }} /
          {{ completion.fullLength }}</span
        >
      </n-space>
    </n-space>
  </div>
</template>
<script setup lang="ts">
import { Directive, computed, watch } from 'vue';
import { halfToFull, translate } from '../../public/getTranslation';
import { useGlobalConfig } from '../store/configStore';
import { useScenarioStore } from '../store/scenarioEditorStore';
import { ContentLine, Language } from '../types/content';
import { useThrottleFn } from '@vueuse/core';

const config = useGlobalConfig();
const mainStore = useScenarioStore();

const langHash = {
  TextJp: '日语',
  TextEn: '英语',
  TextKr: '韩语',
  TextTh: '泰语',
  TextCn: '简中',
  TextTw: '繁中',
};

const translateHash = {
  TextJp: 'ja',
  TextEn: 'en',
  TextKr: 'ko',
  TextTh: 'th',
  TextCn: 'zh-CHS',
  TextTw: 'zh-CHT',
};

const langSelect = [
  { label: '简体中文', key: 'TextCn' },
  { label: '繁体中文', key: 'TextTw' },
  { label: '日语', key: 'TextJp' },
  { label: '英语', key: 'TextEn' },
  { label: '韩语', key: 'TextKr' },
  { label: '泰语', key: 'TextTh' },
];

const tagHash = [
  { label: '[#n]', key: '#n' },
  { label: '[wa:]', key: '[wa:]' },
  { label: '[]', key: '[]' },
];

const inputHandle = (event: string) => {
  if (config.getSelectLine !== -1) {
    const line = mainStore.getScenario.content[config.getSelectLine];
    line[config.getTargetLang] = event.replaceAll('[#n]', '#n');
    mainStore.setContentLine(line as ContentLine, config.getSelectLine);
  }
};

const translateHandle = () => {
  if (config.getSelectLine !== -1) {
    const text = mainStore.getScenario.content[config.getSelectLine][
      config.getLanguage
    ]
      ?.replaceAll('#n', '[#n]')
      ?.replaceAll(/\[.*?\]/g, '');
    translate(
      text,
      'auto' || translateHash[config.getLanguage],
      translateHash[config.getTargetLang]
    )
      .then(res => {
        config.setTmpMachineTranslate(
          halfToFull((res.translation || [])[0] ?? '')
        );
      })
      .catch(err => {
        console.log(err);
      });
  }
};

const acceptHandle = () => {
  if (config.getSelectLine !== -1) {
    const line = mainStore.getScenario.content[config.getSelectLine];
    if (line[config.getLanguage].split(/(\[.*?\])/g).length > 1) {
      alert('文本中有特殊标记, 请注意添加~');
    }
    line[config.getTargetLang] = config.tmpMachineTranslate;
    mainStore.setContentLine(line as ContentLine, config.getSelectLine);
  }
};

const commentHandle = (event: string) => {
  if (config.getSelectLine !== -1) {
    const line = mainStore.getScenario.content[config.getSelectLine];
    line.comment = event;
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
    handleGotoNextLineRequest();
  } else {
    handleGotoPrevLineRequest();
  }
}, 400);
const vAddComboKeyListener: Directive = {
  mounted(el) {
    el.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        handleGotoPrevLineRequest();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleGotoNextLineRequest();
      }
    });
    el.addEventListener('wheel', wheelEvent);
  },
};

const isLastLine = computed(() => {
  return config.getSelectLine === mainStore.getScenario.content.length - 1;
});

function handleShowAllLanguageChange(value: boolean) {
  config.setShowAllLanguage(value);
}

// 自动拉取翻译
watch(
  () => config.getSelectLine,
  () => {
    translateHandle();
  }
);
function handleGotoNextLineRequest() {
  const currentLine = config.getSelectLine;
  const targetLine = mainStore.getNextLineWhereTextJpIsNotEmpty(currentLine);
  config.setSelectLine(targetLine);
}

function handleGotoPrevLineRequest() {
  const currentLine = config.getSelectLine;
  const targetLine = mainStore.getPrevLineWhereTextJpIsNotEmpty(currentLine);
  config.setSelectLine(targetLine);
}

const completion = computed(() => {
  const currentLine = config.getSelectLine;
  const fullLines = mainStore.getScenario.content;
  const completed = fullLines.filter(
    (line, index) =>
      index <= currentLine && line.TextJp && line[config.getTargetLang]
  ).length;
  const fullLength = fullLines.filter(
    line => line.TextJp && line.TextJp.length > 0
  ).length;
  return {
    completed,
    fullLength,
  };
});

function addTag() {
  // 传统方法，如果加入了其他的textarea记得修改
  let textArea = document.getElementsByTagName('textarea')[1];
  let cursor = textArea.selectionStart;
  let sentence =
    mainStore.scenario.content[config.getSelectLine][config.getTargetLang];
  sentence =
    sentence.substring(0, cursor) +
    tagHash.find(tag => tag.key === config.selectTag)?.key +
    sentence.substring(cursor);
  mainStore.scenario.content[config.getSelectLine][config.getTargetLang] =
    sentence;
}
</script>
<style scoped lang="scss">
.selectedLanguage {
  background-color: var(--color-arona-blue);
  color: white;
}

.translation-pane {
  grid-area: translation-pane;
  flex: 1;
  border-radius: 1em;
  padding-right: 1rem;
  width: 100%;
  height: 100%;

  .translation-card {
    background-color: white;
    padding: 1rem;
  }
}

.reference {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trans,
.textLine {
  display: flex;
  justify-content: space-between;
}

.commentInput {
  flex: 1;
}
</style>
