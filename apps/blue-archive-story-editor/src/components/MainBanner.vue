<template>
  <div class="banner-container cursor-pointer dot-bg" @click="goHome">
    <div class="font-bold text-left antialiased font-sans banner-text">Arona</div>
  </div>
</template>

<script setup lang="ts">
import useBaseStore from "@/store/base";

const router = useRouter();
const baseStore = useBaseStore();
const select = ref<number>();
function goHome() {
  router.push("/config");
}
</script>

<style lang="scss" scoped>
.banner-container {
  display: flex;
  justify-content: space-between;
  position: sticky;
  z-index: 999;
  $font-size: 36px;
  line-height: $font-size + 12px;
  top: 0;
  width: 100%;
  left: 0;
  padding: 0 20px;
  border-bottom: 1px solid var(--el-border-color);
  > div {
    flex: 1;
    &:last-child {
      text-align: right;
    }
  }
  .banner-text {
    font-size: $font-size;
  }
}
</style>
