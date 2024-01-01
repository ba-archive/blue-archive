<script setup lang="ts">
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "radix-vue";
import { IMenuData } from "../types/MenuProps";
const props = withDefaults(defineProps<IMenuData>(), {
  title: "SubMenuDefaultTitle",
  route: {
    path: "/",
  },
});
import Chevron from "../../Icons/src/Chevron.vue";
import { ref } from "vue";
const isOpen = ref(false);
</script>

<template>
  <CollapsibleRoot>
    <div>{{ props.title }}</div>
    <CollapsibleTrigger @click="isOpen = !isOpen">
      <chevron />
    </CollapsibleTrigger>
  </CollapsibleRoot>
</template>

<style scoped lang="scss"></style>
