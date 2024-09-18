<script setup lang="ts">
import ESpace from "@eden-design/components/ESpace.vue";
import EIconAdd from "@eden-design/components/icon/EIconAdd.vue";
import EIconClose from "@eden-design/components/icon/EIconClose.vue";
import EIconSubtract from "@eden-design/components/icon/EIconSubtract.vue";
import EIconError from "@eden-design/components/icon/EIconError.vue";
import { computed } from "vue";
import EText from "@eden-design/components/typography/EText.vue";
import { useClipboard } from "@vueuse/core";
import { ElMessage } from "element-plus";

const { copy } = useClipboard({
  legacy: true,
});

const props = withDefaults(
  defineProps<{
    name: string;
    size?: string;
    color?: string;
    rotate?: string | number;
    strokeWidth?: string | number;
  }>(),
  {
    size: "24px",
    color: "arona-blue-6",
    rotate: 0,
    strokeWidth: 2,
  }
);

const iconList = [
  {
    name: "e-icon-add",
    icon: EIconAdd,
  },
  {
    name: "e-icon-close",
    icon: EIconClose,
  },
  {
    name: "e-icon-subtract",
    icon: EIconSubtract,
  },
  {
    name: "e-icon-error",
    icon: EIconError,
  },
];

const iconProps = computed(() => {
  return {
    size: props.size || "24px",
    color: props.color,
    rotate: props.rotate,
    strokeWidth: props.strokeWidth,
  };
});

function handleCopy(name: string) {
  try {
    const copyString = `<${name} :size="${props.size}" color="${props.color}" :stroke-width="${props.strokeWidth}" />`;
    copy(copyString);
    ElMessage.success(`复制成功: ${copyString}`);
  } catch (error) {
    ElMessage.error("复制失败");
  }
}
</script>

<template>
  <div
    class="icon-showcase p-4 grid grid-rows-[48px_24px] gap-2 place-items-center border-1 border-solid border-gray-200 rounded-md cursor-pointer"
    @click="handleCopy(name)"
  >
    <component
      :is="iconList.find(icon => icon.name === name)?.icon"
      v-bind="iconProps"
    />
    <EText>{{ name }}</EText>
  </div>
</template>

<style lang="scss" scoped></style>
