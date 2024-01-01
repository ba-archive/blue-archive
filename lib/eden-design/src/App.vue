<script setup lang="ts">
import DevPanel from "@/views/DevPanel.vue";
import { IMenuData } from "../packages/eden-ui/components/Menu/types/Menu";

const menuData: IMenuData[] = [
  {
    title: "test",
    route: {
      path: "/test",
    },
    children: [
      {
        title: "test1",
        route: {
          path: "/test1",
        },
        children: [
          {
            groupName: "test2",
            route: {
              path: "/test2",
            },
            children: [
              {
                title: "test3",
                route: {
                  path: "/test3",
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    groupName: "test4",
    route: {
      path: "/test4",
    },
  },
];
</script>

<template>
  <e-menu :data="menuData">
    <template #icon>
      <img src="https://eden.blue-archive.io/eden-logo.svg" alt="Eden Logo" />
    </template>
    <template #title> Eden Design </template>
    <e-menu-item>111</e-menu-item>
  </e-menu>
  <div class="w-full" style="margin-top: 32px">
    <dev-panel />
  </div>
</template>

<style scoped lang="scss"></style>
