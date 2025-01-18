<template>
  <div class="translation-pane flex-1 rounded-4 pr-4 w-full h-full">
    <n-space vertical class="bg-white @dark:bg-slate-800 p-4 rounded-medium">
      <div class="flex justify-between items-center">
        <n-space>
          <n-dropdown
            :options="referenceLanguages"
            @select="handleReferenceLanguageChange"
          >
            <n-tooltip>
              <template #trigger>
                <n-tag size="small" type="info">
                  {{
                    (
                      referenceLanguages.find(
                        el => el.key === config.getLanguage
                      ) || { label: "简中" }
                    ).label
                  }}
                </n-tag>
              </template>
              选择需要参考的语言
            </n-tooltip>
          </n-dropdown>
          <n-text>→</n-text>
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
                <n-tag size="small" type="info">
                  {{
                    (
                      langSelect.find(
                        el => el.key === config.getTargetLang
                      ) || {
                        label: "简体中文",
                      }
                    ).label
                  }}
                </n-tag>
              </template>
              选择需要翻译的语言
            </n-tooltip>
          </n-dropdown>
          <span class="text-gray-300 text-sm"
            >第 {{ completion.completed }} /
            {{ completion.fullLength }} 句</span
          >
          <n-space size="small">
            <n-tooltip>
              <template #trigger>
                <div class="flex gap-3">
                  <n-button
                    size="tiny"
                    :disabled="isLastLine"
                    type="primary"
                    quaternary
                    @click="handleGotoNextLineRequest"
                    >下一句
                  </n-button>
                  <n-button
                    size="tiny"
                    :disabled="isLastLine"
                    quaternary
                    type="primary"
                    @click="handleGotoPrevLineRequest"
                    >上一句
                  </n-button>
                </div>
              </template>
              <span>
                下一句：<kbd>{{ isMac ? "⌘" : "Ctrl" }}</kbd> +
                <kbd>{{ isMac ? "⏎" : "Enter" }}</kbd>
                <br />
                上一句：<kbd>{{ isMac ? "⌘" : "Ctrl" }}</kbd> +
                <kbd>{{ isMac ? "⇧" : "Shift" }}</kbd> +
                <kbd>{{ isMac ? "⏎" : "Enter" }}</kbd>
              </span>
            </n-tooltip>
          </n-space>
        </n-space>
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
      <n-tooltip :show="showCopyPasteTooltip" placement="top-start">
        <template #trigger>
          <original-text-disp
            :text="
              mainStore.getScenario.content[config.getSelectLine]?.[
                config.getLanguage
              ]
            "
            :prefer-semantic="config.getSemanticPreference"
            :select-line="config.getSelectLine"
            v-on-click-outside="handleCloseCopyPasteTooltip"
          />
        </template>
        <div>想把整句原文复制到译文框？</div>
        <div>
          试试 <kbd>{{ isMac ? "⌘" : "Ctrl" }}</kbd> +
          <kbd>{{ isMac ? "⌥" : "Shift" }}</kbd> + <kbd>V</kbd>
        </div>
      </n-tooltip>
      <n-space justify="space-between" align="end">
        <n-space>
          <n-button size="medium" @click="acceptHandle" type="info"
            >接受机翻</n-button
          >
          <n-button
            size="medium"
            @click="handleFormalizePunctuation"
            type="info"
          >
            规范符号
          </n-button>
          <n-button size="medium" type="info" @click="sendRefreshPlayerSignal"
            >刷新播放器</n-button
          >
          <n-button
            size="medium"
            @click="handleLLMTranslateRequest(1)"
            type="info"
            quaternary
            :loading="llmLoading"
          >
            帮帮我，GPT 先生
          </n-button>
        </n-space>
        <n-tooltip :duration="300" placement="top-end">
          <template #trigger>
            <n-tag size="small" :type="modelStabilityLevel.type"
              >风格：{{ modelStabilityLevel.value }}</n-tag
            >
          </template>
          <span>翻译结果自由度，值越小花活越多</span>
          <n-slider
            v-model:value="modelStability"
            :max="1"
            :min="0"
            :step="0.1"
            :tooltip="false"
          ></n-slider>
        </n-tooltip>
      </n-space>
      <div class="grid grid-cols-[3fr_2fr] gap-4">
        <translate-input
          :handleGotoNextLineRequest="handleGotoNextLineRequest"
          :handleGotoPrevLineRequest="handleGotoPrevLineRequest"
        />
        <span class="flex flex-col flex-1 w-full gap-2">
          <n-tooltip placement="top-start">
            <template #trigger>
              <n-input
                v-model:value="systemPromptDelta"
                placeholder="追加全局提示词"
                @keydown.enter="reTranslateHandle"
              />
            </template>
            <div>系统提示词会对每一句话生效。</div>
            <div>例如：「把トリニティ翻译成圣三一」</div>
          </n-tooltip>
          <n-input
            type="textarea"
            placeholder="机翻结果"
            :value="config.getTmpMachineTranslate(currentText)"
            style="width: 100%; height: 120px"
          />
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
          <span class="whitespace-nowrap">校对救救!</span>
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
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from "vue";
import { halfToFull } from "../../public/helper/getTranslation";
import { formalizeStrings } from "../../public/helper/formatterService";
import eventBus from "../eventsSystem/eventBus";
import { useGlobalConfig } from "../store/configStore";
import { useScenarioStore } from "../store/scenarioEditorStore";
import { ContentLine, Language } from "../types/content";
import TranslateInput from "./TranslateInput.vue";
import { ElMessage } from "element-plus";
import { useTextSelection } from "@vueuse/core";
import { vOnClickOutside } from "@vueuse/components";
import {
  ClaudeMessage,
  getClaudeTranslation,
} from "../../public/helper/AnthropicTranslationService";
import { transformStudentName } from "../../public/helper/transformStudentName";
import OriginalTextDisp from "./OriginalTextDisp.vue";
import { isMac } from "../../public/helper/isMac";

const config = useGlobalConfig();
const mainStore = useScenarioStore();

const referenceLanguages = [
  { label: "日本語", key: "TextJp" },
  { label: "English", key: "TextEn" },
  { label: "한국어", key: "ScriptKr" },
  { label: "繁體中文", key: "TextTw" },
];

function handleReferenceLanguageChange(value: Language) {
  config.setLanguage(value);
}

const langSelect = [
  { label: "简体中文", key: "TextCn" },
  { label: "繁體中文", key: "TextTw" },
  { label: "English", key: "TextEn" },
  { label: "ภาษาไทย", key: "TextTh" },
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
    handleLLMTranslateRequest(1);
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

function handleFormalizePunctuation() {
  const line = mainStore.getScenario.content[config.getSelectLine];
  line[config.getTargetLang] = formalizeStrings(line[config.getTargetLang]);
  // mainStore.setContentLine(line as ContentLine, config.getSelectLine);
}

// 检测全文复制 intent
const selectedText = useTextSelection();
const showCopyPasteTooltip = ref(false);

function handleCloseCopyPasteTooltip() {
  showCopyPasteTooltip.value = false;
}

watch(selectedText.text, () => {
  if (
    currentText.value.includes(selectedText.text.value) &&
    selectedText.text.value.length / currentText.value.length > 0.5
  ) {
    showCopyPasteTooltip.value = true;
  } else {
    showCopyPasteTooltip.value = false;
  }
});

function handleKeydown(event: KeyboardEvent) {
  if (isMac) {
    if (event.metaKey && event.altKey && event.code === "KeyV") {
      event.preventDefault();
      mainStore.getScenario.content[config.getSelectLine][
        config.getTargetLang
      ] = currentText.value;
    }
    if (event.metaKey && event.altKey && event.code === "KeyL") {
      handleFormalizePunctuation();
    }
  } else {
    if (event.ctrlKey && event.shiftKey && event.code === "KeyV") {
      event.preventDefault();
      mainStore.getScenario.content[config.getSelectLine][
        config.getTargetLang
      ] = currentText.value;
    }
    if (event.ctrlKey && event.shiftKey && event.code === "KeyL") {
      handleFormalizePunctuation();
    }
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});

// 处理机翻
let llmLastCalled = 0;
const llmLoading = ref(false);
const studentNames = computed(() => config.getStudentList);
const modelStability = computed({
  get: () => config.getModelStability,
  set: value => config.setModelStability(value),
});
const temperature = computed(() => 1 - modelStability.value);
const advice = ref("");
const systemPromptDelta = computed({
  get: () => config.getSystemPromptDelta,
  set: value => config.setSystemPromptDelta(value),
});

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
      advice.value,
      systemPromptDelta.value
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
        let fullWidthText = formalizeStrings(halfToFull(rawText));
        const studentTransformed = transformStudentName(
          fullWidthText,
          studentNames.value
        );
        config.setTmpMachineTranslate(
          currentText.value,
          formalizeStrings(studentTransformed)
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
