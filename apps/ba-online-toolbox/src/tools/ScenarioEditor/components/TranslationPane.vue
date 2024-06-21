<template>
  <div class="translation-pane flex-1 rounded-4 pr-4 w-full h-full">
    <n-space vertical class="bg-white p-4 rounded-medium">
      <div class="flex justify-between items-center">
        <span>
          <n-tag secondary type="info" :bordered="false">参考文本语言</n-tag>
          <n-radio-group class="ml-4" :value="config.getLanguage">
            <n-radio
              v-for="lang in Object.keys(langHash)"
              :key="lang"
              :value="lang"
              @click="config.setLanguage(lang as Language)"
              >{{ langHash[lang as Language] }}</n-radio
            >
          </n-radio-group>
        </span>
        <n-switch
          @update:value="handleShowAllLanguageChange"
          :value="config.getShowAllLanguage"
        >
          <template #checked> 所有语言 </template>
          <template #unchecked> 当前语言 </template>
        </n-switch>
      </div>
      <div class="referLang">
        <n-input
          type="textarea"
          class="h-[80px] w-full"
          :value="
            config.getSelectLine !== -1
              ? mainStore.getScenario.content[config.getSelectLine][
                  config.getLanguage
                ]?.replaceAll('#n', '\n')
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
      <div class="flex content-between gap-4">
        <n-space vertical>
          <n-space>
            <n-button type="info" @click="sendRefreshPlayerSignal"
              >刷新播放器</n-button
            >
            <n-tooltip>
              <template #trigger>
                <n-button type="info" @click="addTag()"> 插入等待时长</n-button>
              </template>
              <div>
                在Live2D剧情中会看到 [wa:xxxx]
                的标签，这些标签用于控制文字出现的等待时间。
              </div>
              <div>
                在右边的输入框中输入数字，点击“插入等待时长”，即可在相应位置插入一个同样的标签。
              </div>
            </n-tooltip>
            <n-input-number
              v-model:value="waitTime"
              size="medium"
              :default-value="0"
              :min="0"
              :step="500"
              style="width: 8.5rem"
              @keydown.enter="addTag()"
            >
              <template #suffix
                ><span style="color: #999; font-size: 0.8rem"
                  >毫秒</span
                ></template
              >
            </n-input-number>
            <n-dropdown
              trigger="hover"
              :options="langSelect"
              @select="
                {
                  config.setTargetLang($event as Language);
                }
              "
            >
              <n-tooltip>
                <template #trigger>
                  <n-button secondary type="info">
                    {{
                      (
                        langSelect.find(
                          el => el.key === config.getTargetLang
                        ) || { label: "简中" }
                      ).label
                    }}
                  </n-button>
                </template>
                <span> 选择需要翻译的语言 </span>
              </n-tooltip>
            </n-dropdown>
          </n-space>
          <n-space>
            <n-button @click="acceptHandle" type="info">接受机翻</n-button>
            <n-button @click="handleFormalizePunctuation" type="info">
              规范符号
            </n-button>
            <n-button
              @click="handleLLMTranslateRequest(2)"
              type="info"
              quaternary
              :loading="llmLoading"
            >
              帮帮我，GPT 先生
            </n-button>
          </n-space>
        </n-space>
      </div>
      <div class="flex justify-between gap-4">
        <span style="flex: 2">
          <translate-input
            :handleGotoNextLineRequest="handleGotoNextLineRequest"
            :handleGotoPrevLineRequest="handleGotoPrevLineRequest"
          ></translate-input>
        </span>
        <span style="flex: 1; width: 100%">
          <n-input
            type="textarea"
            placeholder="机翻结果"
            :value="config.getTmpMachineTranslate(currentText)"
            style="width: 100%; height: 120px"
          >
          </n-input>
        </span>
      </div>
      <div class="comment-container flex-horizontal fill-width">
        <n-checkbox
          :checked="
            config.getSelectLine !== -1
              ? !!mainStore.getScenario.content[config.getSelectLine].Unsure
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
          class="flex"
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
        <span class="text-gray-300"
          >当前位置： {{ completion.completed }} /
          {{ completion.fullLength }}</span
        >
      </n-space>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { halfToFull } from "../../public/helper/getTranslation";
import { formalizeQuotation } from "../../public/helper/quotation";
import eventBus from "../eventsSystem/eventBus";
import { useGlobalConfig } from "../store/configStore";
import { useScenarioStore } from "../store/scenarioEditorStore";
import { ContentLine, Language } from "../types/content";
import TranslateInput from "./TranslateInput.vue";
import { ElMessage } from "element-plus";
import {
  ClaudeMessage,
  getClaudeTranslation,
} from "../../public/helper/AnthropicTranslationService";
import { transformStudentName } from "../../public/helper/transformStudentName";
import { el } from "date-fns/locale";

const config = useGlobalConfig();
const mainStore = useScenarioStore();

const langHash = {
  TextJp: "日语",
  TextEn: "英语",
  ScriptKr: "韩语",
  // TextTh: "泰语",
  // TextCn: "简中",
  TextTw: "繁中",
};

const langSelect = [
  { label: "简中", key: "TextCn" },
  { label: "繁中", key: "TextTw" },
  { label: "日语", key: "TextJp" },
  { label: "英语", key: "TextEn" },
  { label: "韩语", key: "TextKr" },
  { label: "泰语", key: "TextTh" },
];

const currentText = computed(() => {
  return mainStore.getScenario.content[config.getSelectLine]?.[
    config.getLanguage
  ];
});

const translateHandle = (force = false) => {
  if (!force && config.getTmpMachineTranslate(currentText.value)) return;
  if (config.getSelectLine !== -1) {
    const text = currentText.value
      ?.replaceAll("#n", "[#n]")
      ?.replaceAll(/\[.*?\]/g, "");
    handleLLMTranslateRequest(0);
    // translate(
    //   text,
    //   translateHash[config.getLanguage],
    //   translateHash[config.getTargetLang]
    // )
    //   .then(res => {
    //     config.setTmpMachineTranslate(
    //       currentText.value,
    //       halfToFull((res.translation || [])[0] ?? "")
    //     );
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }
};

const acceptHandle = () => {
  if (config.getSelectLine !== -1) {
    const line = mainStore.getScenario.content[config.getSelectLine];
    line[config.getTargetLang] = config.getTmpMachineTranslate(
      currentText.value
    );
    mainStore.setContentLine(line as ContentLine, config.getSelectLine);
  }
};

const replaceStrings = [
  {
    from: "……。",
    to: "……",
  },
  {
    from: "~",
    to: "～",
  },
  {
    from: " ”",
    to: "”",
  },
  {
    from: "  ",
    to: "，",
  },
  {
    from: "·",
    to: "・",
  },
  {
    from: "...",
    to: "…",
  },
  {
    from: "momotalk",
    to: "MomoTalk",
  },
  {
    from: "momo talk",
    to: "MomoTalk",
  },
];

function handleFormalizePunctuation() {
  const line = mainStore.getScenario.content[config.getSelectLine];
  line[config.getTargetLang] = formalizeQuotation(line[config.getTargetLang]);
  replaceStrings.forEach(item => {
    line[config.getTargetLang] = line[config.getTargetLang].replaceAll(
      item.from,
      item.to
    );
  });
}

let llmLastCalled = 0;
const llmLoading = ref(false);
const studentNames = computed(() => config.getStudentList);

function handleLLMTranslateRequest(
  model: 0 | 1 | 2 | "haiku" | "sonnet" | "opus" = 0
) {
  if (config.getSelectLine !== -1) {
    if (Date.now() - llmLastCalled < 5000) {
      ElMessage({
        message: "太……太快啦♡小小的接口♡要受不了啦♡",
        type: "error",
      });
      return;
    }
    llmLastCalled = Date.now();
    llmLoading.value = true;

    const text =
      mainStore.getScenario.content[config.getSelectLine][config.getLanguage];

    getClaudeTranslation(text, model)
      .then((res: ClaudeMessage) => {
        const rawText = res.content[0].text ?? "";
        const fullWidthText = halfToFull(rawText);
        const studentTransformed = transformStudentName(
          fullWidthText,
          studentNames.value
        );
        config.setTmpMachineTranslate(
          currentText.value,
          formalizeQuotation(studentTransformed)
        );
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        llmLoading.value = false;
      });
  }
}

const commentHandle = (event: string) => {
  if (config.getSelectLine !== -1) {
    const line = mainStore.getScenario.content[config.getSelectLine];
    line.comment = event;
    mainStore.setContentLine(line as ContentLine, config.getSelectLine);
  }
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

const waitTime = ref(0);

function addTag() {
  // 传统方法，如果加入了其他的textarea记得修改
  // TODO: 改成 ref
  let textArea = document.getElementsByTagName("textarea")[1];
  let cursor = textArea.selectionStart;
  let sentence =
    mainStore.scenario.content[config.getSelectLine][config.getTargetLang];
  sentence =
    sentence.substring(0, cursor) +
    `[wa:${waitTime.value}]` +
    sentence.substring(cursor);
  mainStore.scenario.content[config.getSelectLine][config.getTargetLang] =
    sentence;
}

function sendRefreshPlayerSignal() {
  eventBus.emit("refreshPlayer");
}
</script>
<style scoped lang="scss">
.selectedLanguage {
  background-color: var(--color-arona-blue);
  color: white;
}

.translation-pane {
  grid-area: translation-pane;
}
</style>
