<script lang="ts" setup>
import type { Content } from "../../types/Momotalks";
import { momotalkEditorStore } from "../../store/momotalkEditorStore";
import { computed } from "vue";
import EInput from "../widgets/EInput.vue";
const props = defineProps<{ msg: Content }>();

const useMomotalkEditorStore = momotalkEditorStore();
const from = computed(
  () =>
    ("Message" +
      useMomotalkEditorStore.getSelectedTranslation.toUpperCase()) as keyof Content
);
const to = computed(
  () =>
    ("Message" +
      useMomotalkEditorStore.getTargetTranslation.toUpperCase()) as keyof Content
);

const isImage = computed(() => props.msg.ImagePath);
</script>

<template>
  <div
    flex
    :class="{
      'justify-end': 'Answer' === msg.MessageCondition,
    }"
  >
    <div
      z-0
      class="talk-bubble max-w-80 relative"
      :class="{
        'talk-bubble--answer': 'Answer' === msg.MessageCondition,
        'talk-bubble--favor': msg.FavorScheduleId != 0,
        'px-4 py-2': !isImage,
      }"
    >
      <div
        class="orininal-msg"
        :class="{
          'pl-[2px]': !isImage,
          'lh-0': isImage
        }"
      >
        <span v-if="!isImage">{{ props.msg[from] }}</span>
        <img
          w-40
          v-else
          m-0
          :src="
            'https://yuuka.cdn.diyigemt.com/image/ba-all-data/' +
            props.msg.ImagePath +
            '.png'
          "
        />
      </div>
      <div class="msg-translation" v-if="!isImage">
        <EInput
          v-model="msg[to] as string"
          :text-white="
            'Answer' === msg.MessageCondition || msg.FavorScheduleId != 0
          "
          placeholder="输入内容翻译"
          width="auto"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.talk-bubble {
  @apply rounded-md bg-white @dark:bg-slate-700 @dark:text-gray-2;

  &::after {
    content: "";
    position: absolute;
    top: calc(50% - 5px);
    left: -10px;
    border-color: transparent;
    @apply w-0 h-0 border-solid border-5 border-t-white @dark:border-t-slate-700 rotate-[90deg];
  }

  &--answer {
    @apply bg-[#4a91e7] text-white @dark:bg-[#397ee1];

    &::after {
      @apply left-[100%] rotate-[-90deg] border-t-[#4a91e7] @dark:border-t-[#397ee1];
    }
  }

  &--favor {
    @apply bg-[#E62C8C]! text-white @dark:bg-[#eb509b]!;

    &::after {
      @apply border-t-[#E62C8C] @dark:border-t-[#eb509b];
    }
  }
}
</style>
