<script setup lang="ts">
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "radix-vue";
import { IMenuData } from "../types/Menu";
const props = withDefaults(defineProps<IMenuData>(), {
  title: "SubMenu",
  route: {
    path: "/",
  },
});
</script>

<template>
  <CollapsibleRoot>
    <CollapsibleTrigger>{{ props.title }}</CollapsibleTrigger>
  </CollapsibleRoot>
</template>

<style scoped lang="scss"></style>
