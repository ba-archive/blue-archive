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
              >{{
                langHash[lang as "TextJp" | "TextEn" | "TextTw" | "ScriptKr"]
              }}</n-radio
            >
          </n-radio-group>
        </span>
        <n-space>
          <n-checkbox
            :checked="config.getSemanticPreference"
            @update:checked="updateParseSemanticPref"
            size="large"
            label="解析语素"
          />
          <n-checkbox
            :checked="config.getShowAllLanguage"
            @update:checked="handleShowAllLanguageChange"
            size="large"
            label="显示所有语言"
          />
        </n-space>
      </div>
      <original-text-disp
        :text="mainStore.getScenario.content[config.getSelectLine]?.TextJp"
        :prefer-semantic="config.getSemanticPreference"
        :select-line="config.getSelectLine"
      />
      <div class="flex justify-between items-end">
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
              @click="handleLLMTranslateRequest(1)"
              type="info"
              quaternary
              :loading="llmLoading"
            >
              帮帮我，GPT 先生
            </n-button>
          </n-space>
        </n-space>
        <n-tooltip :duration="300" placement="top-end">
          <template #trigger>
            <div class="flex h-full flex-1 justify-end">
              翻译风格：
              <n-tag size="small" :type="modelStabilityLevel.type">{{
                modelStabilityLevel.value
              }}</n-tag>
            </div>
          </template>
          <span>翻译结果随机性，值越小花活越多</span>
          <n-slider
            v-model:value="modelStability"
            :max="1"
            :min="0"
            :step="0.1"
            :tooltip="false"
          ></n-slider>
        </n-tooltip>
      </div>
      <div class="grid grid-cols-[3fr_2fr] gap-4">
        <translate-input
          :handleGotoNextLineRequest="handleGotoNextLineRequest"
          :handleGotoPrevLineRequest="handleGotoPrevLineRequest"
        ></translate-input>
        <span class="flex flex-col flex-1 w-full gap-2">
          <n-input
            type="textarea"
            placeholder="机翻结果"
            :value="config.getTmpMachineTranslate(currentText)"
            style="width: 100%; height: 120px"
          >
          </n-input>
          <div class="flex flex-1 gap-2">
            <n-input
              v-model:value="advice"
              placeholder="指出机翻需要更正的地方……"
              @keydown.enter="reTranslateHandle"
            />
            <n-button
              secondary
              :loading="llmLoading"
              @click="handleLLMTranslateRequest(1, TranslationMode.amend)"
            >
              <svg
                class="w-[20px] h-[20px]"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 32 32"
              >
                <path
                  d="M27.45 15.11l-22-11a1 1 0 0 0-1.08.12a1 1 0 0 0-.33 1L7 16L4 26.74A1 1 0 0 0 5 28a1 1 0 0 0 .45-.11l22-11a1 1 0 0 0 0-1.78zm-20.9 10L8.76 17H18v-2H8.76L6.55 6.89L24.76 16z"
                  fill="#18A058"
                ></path>
              </svg>
            </n-button>
          </div>
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
          <span>校对救救!</span>
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
        <n-tooltip>
          <template #trigger>
            <div class="flex gap-3">
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
            </div>
          </template>
          <span>
            下一句：<kbd>Ctrl</kbd> + <kbd>Enter</kbd> <br />
            上一句：<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Enter</kbd> <br />
            Mac 使用 <kbd>Cmd</kbd> 代替 <kbd>Ctrl</kbd>
          </span>
        </n-tooltip>
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
import OriginalTextDisp from "./OriginalTextDisp.vue";

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

function updateParseSemanticPref(value: boolean) {
  config.setSemanticPreference(value);
}

const currentText = computed(() => {
  return mainStore.getScenario.content[config.getSelectLine]?.[
    config.getLanguage
  ];
});

const translateHandle = (force = false) => {
  if (!force && config.getTmpMachineTranslate(currentText.value)) return;
  if (config.getSelectLine !== -1) {
    handleLLMTranslateRequest(0);
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
  {
    from: "log＝",
    to: "log=",
  },
  {
    from: "／log",
    to: "/log",
  },
  {
    from: "wa：",
    to: "wa:",
  },
  {
    from: "\\n",
    to: "\n",
  },
  {
    from: "！ ！",
    to: "！！",
  },
  {
    from: "〜。",
    to: "〜",
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
const modelStability = ref(0.6);
const temperature = computed(() => 1 - modelStability.value);
const advice = ref("");

enum ModelStability {
  "Low" = 0.33,
  "Medium" = 0.7,
  "High" = 1.0,
}

const modelStabilityLevel = computed(() => {
  if (temperature.value < ModelStability.Low) {
    return {
      type: "success",
      value: "稳重",
    };
  } else if (temperature.value < ModelStability.Medium) {
    return {
      type: "warning",
      value: "平衡",
    };
  } else {
    return {
      type: "error",
      value: "整活",
    };
  }
});

enum TranslationMode {
  "new",
  "amend",
}

function handleLLMTranslateRequest(
  model: 0 | 1 | 2 | "haiku" | "sonnet" | "opus" = 0,
  mode: TranslationMode = TranslationMode.new
) {
  if (llmLoading.value) {
    return;
  }
  if (config.getSelectLine !== -1) {
    if (Date.now() - llmLastCalled < 2000) {
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

    if (!text) {
      ElMessage({
        message: "没有需要翻译的文本",
        type: "error",
      });
      llmLoading.value = false;
      return;
    }

    if (mode === TranslationMode.amend && !advice.value) {
      ElMessage({
        message: "用中文告诉模型你需要怎么更正",
        type: "error",
      });
      llmLoading.value = false;
      return;
    }

    const currentTranslation = config.getTmpMachineTranslate(currentText.value);

    getClaudeTranslation(
      text,
      model,
      temperature.value,
      mode,
      text,
      currentTranslation,
      advice.value
    )
      .then((res: ClaudeMessage) => {
        const rawResponse = res.content[0];

        if (rawResponse.type === "error") {
          let additionalErrorInfo = "";

          switch (rawResponse.error_code) {
            case 529:
              additionalErrorInfo = "模型服务器过载，请稍后再试";
              break;
            default:
              additionalErrorInfo = "未知错误，请稍后再试";
              break;
          }

          config.setTmpMachineTranslate(
            currentText.value,
            rawResponse.text + additionalErrorInfo
          );
          return;
        }

        const rawText = rawResponse.text ?? "";
        let fullWidthText = halfToFull(rawText);
        replaceStrings.forEach(item => {
          fullWidthText = fullWidthText.replaceAll(item.from, item.to);
        });
        const studentTransformed = transformStudentName(
          fullWidthText,
          studentNames.value
        );
        config.setTmpMachineTranslate(
          currentText.value,
          formalizeQuotation(studentTransformed)
        );
        advice.value = "";
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        llmLoading.value = false;
      });
  }
}

function reTranslateHandle(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    handleLLMTranslateRequest(1, TranslationMode.amend);
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

kbd {
  border: 1px solid #fff;
  border-radius: 4px;
  padding: 0 4px;
}
</style>
