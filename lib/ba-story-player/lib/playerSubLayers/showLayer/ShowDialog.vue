<template>
  <div class="dialog" v-show="dialogContent">
    <div class="dialog__content">{{ dialogContent }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ShowLayer } from ".";
import { StoryNode } from "../../type";

const props = defineProps<{
  textLayerInstance: ShowLayer;
  currentStoryNode: StoryNode;
}>();
const dialogContent = computed(() => {
  const dialogInfo = props.currentStoryNode.text.dialog;
  if (dialogInfo) {
    return dialogInfo.content.reduce((pre, currentText) => {
      return pre + currentText.content[props.textLayerInstance.language.value];
    }, "");
  } else {
    return "";
  }
});
</script>

<style lang="scss" scoped>
.dialog {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30%;
  padding: 5% 10%;
  background-image: linear-gradient(
    to bottom,
    rgba(255, 0, 0, 0),
    rgba(19, 32, 45, 0.9) 30%
  );

  &__content {
    padding-top: 5%;
    text-align: left;
  }
}
</style>
