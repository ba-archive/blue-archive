<template>
  <el-menu :default-active="currentActiveMenu" :default-openeds="mapExpand" router class="main-menu custom-menu">
    <el-sub-menu index="1">
      <template #title>
        <span>{{ t("side menu config") }}</span>
      </template>
      <el-menu-item index="/config/config/config-arona-main">主配置</el-menu-item>
      <el-menu-item index="/config/config/config-arona-blockly">条件执行</el-menu-item>
      <el-menu-item index="/config/config/config-arona-reply-group">随机回复语句</el-menu-item>
      <el-menu-item index="/config/config/config-arona-reply-label">随机回复语句标签</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>
        <span>{{ t("side menu database") }}</span>
      </template>
      <el-menu-item index="/config/database/database-gacha-pool">GachaPool</el-menu-item>
      <el-menu-item index="/config/database/database-gacha-history">GachaHistory</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <span>{{ t("side menu setting") }}</span>
      </template>
      <el-menu-item index="/config/setting/setting-api">api</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
const { t } = useI18n();
const route = useRoute();
const mapExpand = ["1", "2", "3"];
const currentActiveMenu = computed(() => route.path);
</script>

<style lang="scss" scoped>
.main-menu {
  height: 100%;
  border-right: none;
  :deep(.el-sub-menu) {
    .el-menu {
      .el-menu-item {
        border-radius: 4px;
      }
    }
  }
}
</style>

<i18n>
{
  "en": {
    "side menu config": "config",
    "side menu database": "database",
    "side menu setting": "setting"
  },
  "zh-cn": {
    "side menu config": "配置文件",
    "side menu database": "数据库文件",
    "side menu setting": "设置"
  }
}
</i18n>
