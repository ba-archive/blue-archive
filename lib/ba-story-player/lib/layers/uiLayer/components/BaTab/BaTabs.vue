<template>
  <div class="ba-tabs">
    <div class="ba-tabs-side">
      <div
        class="ba-tabs-tab-item"
        v-for="(e, index) in panelList"
        :key="index"
        :class="{ active: e.name === currentActivePanel }"
        @click="onTabClick(e.name)"
      >
        {{ e.label }}
      </div>
    </div>
    <div class="ba-tabs-wrapper">
      <slot />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { isEqual } from "lodash-es";
import {
  Component,
  VNode,
  onMounted,
  onUpdated,
  provide,
  ref,
  useSlots,
  watch,
} from "vue";
import { useProgress } from "./utils";

defineOptions({
  name: "BaTabs",
});
type TabList = {
  name: string;
  label: string;
};
const props = withDefaults(
  defineProps<{
    value: string;
    isStatic?: boolean;
  }>(),
  {
    value: "",
    isStatic: false,
  }
);
const emit = defineEmits<{
  "update:value": [value: string];
}>();
const { _ref: currentActivePanel, uuid } = useProgress();
provide("uuid", uuid);
const panelList = ref<TabList[]>([]);
const slots = useSlots();

/**
 * 当标签页被单击时触发, 向父组件发消息
 * @param name 被单击的标签页的name
 * @param index 被单击的标签页的index(从1开始)
 */
function onTabClick(name: string) {
  emit("update:value", name);
}

watch(
  () => props.value,
  cur => {
    currentActivePanel.value = cur;
  }
);
function calculatePanel() {
  if (slots.default) {
    const panels = (slots.default() as VNode[])
      .filter(it => it.type && (it.type as Component).name === "BaTabPanel")
      .map(it => it.props)
      .filter((it: any) => it && it.name && it.label)
      .map((it: any) => ({
        name: it.name,
        label: it.label,
      }));
    const isUpdate = !(
      panelList.value.length === panels.length &&
      isEqual(panelList.value, panels)
    );
    if (isUpdate) {
      panelList.value = panels;
    }
  } else if (panelList.value.length !== 0) {
    panelList.value = [];
  }
}
onUpdated(() => {
  if (!props.isStatic) {
    calculatePanel();
  }
});
onMounted(() => {
  currentActivePanel.value = props.value;
  calculatePanel();
});
</script>

<style lang="scss" scoped>
.ba-tabs {
  display: flex;
  flex-direction: row;
  .ba-tabs-side {
    background-color: #c6e9fe;
    min-width: 80px;
    .ba-tabs-tab-item {
      position: relative;
      transition: all 0.15s ease-in-out;
      padding: 8px 16px;
      text-align: center;
      &.active {
        background-color: white;
        &::after {
          display: none;
        }
      }
      &:hover {
        cursor: pointer;
      }
      &::after {
        $offset: 6px;
        position: absolute;
        bottom: 0;
        left: $offset;
        background: #c3d2e0;
        width: calc(100% - 2 * #{$offset});
        height: 1px;
        content: "";
      }
    }
  }
  .ba-tabs-wrapper {
    flex: 1;
    background-color: white;
    padding: 4px;
  }
}
</style>
