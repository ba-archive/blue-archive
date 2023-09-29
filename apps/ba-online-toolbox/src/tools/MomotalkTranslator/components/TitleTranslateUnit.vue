<template>
  <card-unit
    title="剧情标题（点击标题跳转）"
    type="Title"
    :unsure="isUnsure"
    :jumpTo="`${props.content?.FavorScheduleId}`"
    @flagUnsure="handleFlagUnsure"
  >
    <div class="content-container">
      <div class="vertical-grid grid-auto-resize">
        <div class="origin-title">
          <n-tag :bordered="false">日语</n-tag>
          <div class="origin-text">{{ titleJp }}</div>
        </div>
        <n-input-group>
          <n-tag type="info" :bordered="false">中译</n-tag>
          <textarea
            rows="3"
            cols="30"
            class="translation-area"
            v-model="titleCn"
            @change="updateTitle"
            @keydown.enter.prevent
          ></textarea>
        </n-input-group>
      </div>
      <n-space vertical>
        <n-space
          vertical
          justify="space-between"
          :class="localReferenceMode ? 'hidden' : ''"
        >
          <n-button
            secondary
            type="primary"
            @click="handleTranslateRequest(titleKr, 'ko', 'zh-CHS')"
          >
            翻译韩语
          </n-button>
          <n-button type="primary" @click="handleTranslateRequest(titleJp)">
            翻译日语
          </n-button>
          <n-button type="primary" @click="acceptTranslation"
            >接受翻译</n-button
          >
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
            v-model="translateCn"
            class="translation-area"
            tabindex="-1"
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
  </card-unit>
</template>

<script setup lang="ts">
import { PropType, Ref, computed, ref, watch } from 'vue';
import CardUnit from '../../public/components/CardUnit.vue';
import { halfToFull, translate } from '../../public/helper/getTranslation';
import { useMainStore } from '../store/mainStore';
import { Title } from '../types/FileContent';
import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface';
import { Key } from 'naive-ui/es/menu/src/interface';

const props = defineProps({
  index: [Number, String],
  content: Object as PropType<Title>,
});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const indexValue = parseInt(props.index!.toString());
const mainStore = useMainStore();

const titleJp = computed(() => props.content?.TextJp);
const titleCn = ref(props.content?.TextCn);
const titleKr = computed(() => props.content?.TextKr);
const titleEn = computed(() => props.content?.TextEn);
const titleTh = computed(() => props.content?.TextTh);
const titleTw = computed(() => props.content?.TextTw);
const isUnsure = ref(props.content?.unsure || false);

const translateCn = ref('');
const translateSuccess = ref(false);

const globalReferenceMode = computed(() => mainStore.getGlobalReferenceMode);
const localReferenceMode: Ref<boolean> = ref(globalReferenceMode.value);

watch(
  () => globalReferenceMode.value,
  newValue => {
    localReferenceMode.value = newValue;
  }
);

const referenceLanguageLabel = ref('韩语');
const referenceTitle = ref(titleKr.value);
const availableLanguageMap = {
  kr: {
    label: '韩语',
    key: 'TextKr',
  },
  jp: {
    label: '日语',
    key: 'TextJp',
  },
  en: {
    label: '英语',
    key: 'TextEn',
  },
  th: {
    label: '泰语',
    key: 'TextTh',
  },
  tw: {
    label: '繁中',
    key: 'TextTw',
  },
};
const availableLanguage = computed(() => {
  const reference: DropdownMixedOption[] = [];
  [titleKr.value, titleEn.value, titleTh.value, titleTw.value].forEach(
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

function updateTitle() {
  mainStore.updateTitle(indexValue, {
    TextJp: titleJp.value || '',
    TextCn: titleCn.value || '',
    TextKr: titleKr.value || '',
    TextEn: titleEn.value || '',
    TextTh: titleTh.value || '',
    TextTw: titleTw.value || '',
    unsure: isUnsure.value,
  });
}

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
          translateCn.value = `翻译失败：错误代码 ${res.errorCode}`;
        }
      })
      .catch(() => {
        translateCn.value = '翻译失败，请重试';
      });
  }
}

function acceptTranslation() {
  titleCn.value = translateCn.value;
  updateTitle();
}

function handleChangeLanguage(key: string) {
  const targetLanguage = Reflect.get(
    props.content as object,
    Reflect.get(availableLanguageMap, key)?.key
  );
  referenceLanguageLabel.value = Reflect.get(availableLanguageMap, key)?.label;
  referenceTitle.value = targetLanguage;
}

function getReferenceTextByKey(key: Key | undefined) {
  if (key) {
    return Reflect.get(
      props.content as object,
      Reflect.get(availableLanguageMap, key)?.key
    );
  }
  return '';
}

function handleFlagUnsure(value: boolean) {
  isUnsure.value = value;
  updateTitle();
}
</script>

<style scoped lang="scss"></style>
