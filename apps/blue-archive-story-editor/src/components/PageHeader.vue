<template>
  <div class="dot-bg">
    <el-page-header :content="routerTitle" class="page-header" @back="goBack">
      <template v-if="!routerTitle" #title>
        <slot name="title" />
      </template>
    </el-page-header>
    <el-divider v-if="props.title" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const props = defineProps<Props>();
const goBack = () => {
  router.go(-1);
};
const routerTitle = computed(() => (route.meta.title as string) || (props.title as string) || "");
interface Props {
  title?: string;
}
</script>

<style lang="scss">
.dot-bg {
  margin-right: 20px;
}
.page-header {
  padding-top: 10px;
  margin-bottom: 20px;
}
</style>
