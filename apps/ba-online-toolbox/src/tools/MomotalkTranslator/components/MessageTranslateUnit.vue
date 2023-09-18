<template>
  <card-unit
    :title="messageType"
    :type="
      0 === props.content?.FavorScheduleId
        ? props.content?.MessageCondition
        : 'FavorRankUp'
    "
    :unsure="isUnsure"
    @flagUnsure="handleFlagUnsure"
  >
    <div
      class="content-container"
      v-if="'Image' !== props.content?.MessageType"
    >
      <div class="vertical-grid grid-auto-resize">
        <div class="origin-title">
          <n-tag :bordered="false">日语</n-tag>
          <div class="origin-text">{{ messageJp }}</div>
        </div>
        <n-input-group>
          <n-tag :bordered="false" type="info">中译</n-tag>
          <textarea
            rows="3"
            cols="30"
            class="translation-area"
            v-model="messageCn"
            @change="updateMessage"
            @keydown.enter.prevent
          >
          </textarea>
        </n-input-group>
      </div>
      <n-space vertical>
        <n-switch v-model:value="localReferenceMode">
          <template #checked
            ><span class="hint-reference-mode">参考模式开</span></template
          >
          <template #unchecked
            ><span class="hint-reference-mode">参考模式关</span></template
          >
        </n-switch>
        <n-space vertical justify="space-between">
          <n-button
            secondary
            type="primary"
            @click="handleTranslateRequest(messageKr, 'ko', 'zh-CHS')"
          >
            翻译韩语
          </n-button>
          <n-button type="primary" @click="handleTranslateRequest(messageJp)">
            翻译日语
          </n-button>
          <n-button
            type="primary"
            class="accept-button"
            @click="acceptTranslation"
            >接受翻译
          </n-button>
        </n-space>
      </n-space>
      <div class="vertical-grid grid-auto-resize" v-if="!localReferenceMode">
        <div class="origin-title">
          <n-dropdown
            :options="availableLanguage"
            @select="handleChangeLanguage"
          >
            <n-tag :bordered="false" type="info">{{
              referenceLanguageLabel
            }}</n-tag>
          </n-dropdown>
          <div class="origin-text">{{ referenceTitle }}</div>
        </div>
        <n-input-group>
          <n-tag :bordered="false">预览</n-tag>
          <textarea
            rows="3"
            cols="30"
            class="translation-area"
            tabindex="-1"
            v-model="translateCn"
          ></textarea>
        </n-input-group>
      </div>

      <div v-else class="vertical-grid grid-auto-resize">
        <div
          v-for="(reference, index) in availableLanguage"
          class="reference-row"
          :key="index"
        >
          <n-tag :bordered="false" type="info">{{ reference.label }}</n-tag>
          <div class="origin-text">
            {{ getReferenceTextByKey(reference.key) }}
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <img
        class="momotalk-picture"
        :src="getImagePath(props.content.ImagePath)"
      />
    </div>
  </card-unit>
</template>

<script setup lang="ts">
import { PropType, Ref, computed, onMounted, ref, watch } from 'vue';
import CardUnit from '../../public/components/CardUnit.vue';
import { halfToFull, translate } from '../../public/helper/getTranslation';
import { useMainStore } from '../store/mainStore';
import { Content } from '../types/FileContent';
import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface';
import { Key } from 'naive-ui/es/menu/src/interface';

const mainStore = useMainStore();
const props = defineProps({
  content: Object as PropType<Content>,
});

const messageCondition = {
  None: '学生信息',
  FavorRankUp: '好感度消息',
  Answer: '玩家回复',
  Feedback: '学生回复',
};

const messageJp = ref(props.content?.MessageJP);
const messageCn = ref(props.content?.MessageCN);
const messageKr = ref(props.content?.MessageKR);
const messageEn = ref(props.content?.MessageEN);
const messageTh = ref(props.content?.MessageTH);
const messageTw = ref(props.content?.MessageTW);
const messageType = computed(() => {
  if ('Image' === props.content?.MessageType) {
    return '图片消息';
  }
  if (0 !== props.content?.FavorScheduleId) {
    return '前往羁绊剧情';
  }
  return messageCondition[props.content?.MessageCondition || 'None'];
});
const isUnsure = ref(props.content?.unsure || false);

const translateCn = ref('');
const translateSuccess = ref(false);

function updateMessage() {
  mainStore.updateMomotalk(props.content?.Id, {
    MessageJP: messageJp.value,
    MessageCN: messageCn.value,
    MessageKR: messageKr.value,
    MessageEN: messageEn.value,
    MessageTH: messageTh.value,
    MessageTW: messageTw.value,
    unsure: isUnsure.value,
  });
}

const globalReferenceMode = computed(() => mainStore.getGlobalReferenceMode);
const localReferenceMode: Ref<boolean> = ref(globalReferenceMode.value);

watch(
  () => globalReferenceMode.value,
  newValue => {
    localReferenceMode.value = newValue;
  }
);

const referenceLanguageLabel = ref('韩语');
const referenceTitle = ref(messageKr.value);
const availableLanguageMap = {
  kr: {
    label: '韩语',
    key: 'MessageKR',
  },
  jp: {
    label: '日语',
    key: 'MessageJP',
  },
  en: {
    label: '英语',
    key: 'MessageEN',
  },
  th: {
    label: '泰语',
    key: 'MessageTH',
  },
  tw: {
    label: '繁中',
    key: 'MessageTW',
  },
};
const availableLanguage = computed(() => {
  const reference: DropdownMixedOption[] = [];
  [messageKr.value, messageEn.value, messageTh.value, messageTw.value].forEach(
    (item, index) => {
      if (item) {
        reference.push({
          label: ['韩语', '英语', '泰语', '繁中'][index],
          key: ['kr', 'en', 'th', 'tw'][index],
        });
      }
    }
  );
  return reference;
});

function handleTranslateRequest(
  text: string | undefined,
  from = 'ja',
  to = 'zh-CHS'
) {
  if (text !== undefined && text?.length > 0) {
    translate(text, from, to)
      .then(res => {
        if (0 === parseInt(res.errorCode)) {
          translateCn.value = halfToFull(res.translation[0]);
          translateSuccess.value = true;
        } else {
          translateCn.value = `获取内容失败，请重试：错误代码 ${res.errorCode}`;
        }
      })
      .catch(() => {
        translateCn.value = '翻译失败，请重试';
      });
  }
}

function acceptTranslation() {
  messageCn.value = translateCn.value;
  updateMessage();
}

function handleChangeLanguage(key: string) {
  console.log(key);
  const targetLanguage = Reflect.get(
    props.content as object,
    Reflect.get(availableLanguageMap, key)?.key
  );
  referenceLanguageLabel.value = Reflect.get(availableLanguageMap, key)?.label;
  referenceTitle.value = targetLanguage;
}

onMounted(() => {
  // 使所有按钮不可选中，增加键盘工作效率
  const buttons = document.querySelectorAll('button, .n-switch');
  buttons.forEach(button => {
    button.setAttribute('tabindex', '-1');
  });
});

function getReferenceTextByKey(key: Key | undefined) {
  if (key) {
    return Reflect.get(
      props.content as object,
      Reflect.get(availableLanguageMap, key)?.key
    );
  }
  return '';
}

function getImagePath(rawPath: string | undefined) {
  if (rawPath) {
    return `https://yuuka.cdn.diyigemt.com/image/ba-all-data/UIs/03_Scenario/04_ScenarioImage/${rawPath
      .split('/')
      .pop()}.png`;
  }
  return '';
}

function handleFlagUnsure(value: boolean) {
  isUnsure.value = value;
  updateMessage();
}
</script>

<style scoped lang="scss">
.momotalk-picture {
  width: 200px;
}
</style>
