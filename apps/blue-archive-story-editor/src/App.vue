<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
// @ts-ignore
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

const locale = zhCn;
</script>

<style lang="scss" scoped>
.arona-container {
  position: absolute;
  top: 100px;
  left: 300px;
  height: 600px;
  width: 300px;
  background-color: black;
  display: none;
}
</style>
