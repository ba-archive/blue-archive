<template>
  <el-affix :offset="60">
    <PageHeader />
  </el-affix>
  <div style="padding-right: 20px">
    <router-view />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
