<script setup lang="ts">
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "radix-vue";
import { IMenuData } from "../types/MenuProps";
const props = withDefaults(defineProps<IMenuData>(), {
  groupName: "SubMenuDefaultGroupName",
  route: {
    path: "/",
  },
});
import Chevron from "../../Icons/src/Chevron.vue";
import { ref } from "vue";
const isOpen = ref(false);
</script>

<template>
  <CollapsibleRoot
    :open="isOpen"
    :class="[
      'eden-ui__menu__submenu',
      {
        active: isOpen,
      },
    ]"
  >
    <div class="eden-ui__menu__submenu__title">
      <div v-if="props.groupName">{{ props.groupName }}</div>
      <CollapsibleTrigger @click="isOpen = !isOpen">
        <chevron :rotate="isOpen ? 90 : 0" />
      </CollapsibleTrigger>
    </div>
    <CollapsibleContent>
      <slot></slot>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>

<style scoped lang="scss"></style>
