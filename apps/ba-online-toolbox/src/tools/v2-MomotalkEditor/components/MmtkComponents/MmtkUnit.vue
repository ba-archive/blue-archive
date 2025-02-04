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

const isImage = computed(() => props.msg.ImagePath)
</script>

<template>
  <div
    flex
    :class="{
      'justify-end': 'Answer' === msg.MessageCondition,
    }"
  >
    <div
      px-4
      py-2
      z-0
      class="talk-bubble max-w-80 relative"
      :class="{
        'talk-bubble--answer': 'Answer' === msg.MessageCondition,
        'talk-bubble--favor': msg.FavorScheduleId != 0,
      }"
    >
      <div class="orininal-msg pl-[2px]">
        <span v-if="!isImage">{{ props.msg[from] }}</span>
        <img
          w-40
          v-else
          :src="
            'https://yuuka.cdn.diyigemt.com/image/ba-all-data/' +
            props.msg.ImagePath + '.png'
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
        <!-- <a-input v-model="msg[to] as string" ></a-input> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.talk-bubble {
  @apply rounded-md bg-white @dark:bg-slate-700 @dark:text-gray-2;

  &--answer {
    @apply bg-[#4a91e7] text-white @dark:bg-[#397ee1];
  }

  &--favor {
    @apply bg-[#E62C8C]! text-white @dark:bg-[#eb509b]!;
  }
}
</style>
