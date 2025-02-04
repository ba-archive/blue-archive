<script lang="ts" setup>
import { computed } from "vue";
import type { Title } from "../types/Momotalks";
import MmtkTitle from "./MmtkComponents/MmtkTitle.vue";
import MmtkUnit from "./MmtkComponents/MmtkUnit.vue";
import { momotalkEditorStore } from "../store/momotalkEditorStore";

const useMomotalkEditorStore = momotalkEditorStore();
const props = defineProps<{ title: Title; idx: number; total: number }>();

const selectedTranslation = computed({
  get: () => useMomotalkEditorStore.getSelectedTranslation,
  set: translation =>
    useMomotalkEditorStore.setSelectedTranslation(translation),
});

const targetTranslation = computed({
  get: () => useMomotalkEditorStore.getTargetTranslation,
  set: translation => useMomotalkEditorStore.setTargetTranslation(translation),
});

const mmtkGroup = computed(() =>
  useMomotalkEditorStore.getMomotalkFromScheduleId(props.title.FavorScheduleId)
);
</script>

<template>
  <div w-92 flex flex-col items-stretch rounded-sm>
    <MmtkTitle
      :title="title"
      :from="selectedTranslation"
      :to="targetTranslation"
      :idx="idx"
      :total="total"
    />
    <div flex flex-col gap-4 mb-5 pt-4 px-4 class="bg-[#f2f2f2] @dark:bg-slate-900">
      <MmtkUnit v-for="msg in mmtkGroup" :key="msg.Id" :msg="msg" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
