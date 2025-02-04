<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import HomepageNavigator from "./HomepageNavigator.vue";
import FAB from "./tools/public/components/FAB.vue";
import { useGlobalConfig } from "./tools/ScenarioEditor/store/configStore";
import { getStudents } from "./tools/public/helper/getStudents";
import { ElMessage } from "element-plus";
import { useColorMode } from "@vueuse/core";
import { darkTheme } from "naive-ui";
import ArrowIcon from "./tools/public/components/ArrowIcon.vue";

const mode = useColorMode();
const config = useGlobalConfig();

onMounted(() => {
  getStudents().then(students => {
    if (!students || students.length === 0) {
      ElMessage({
        message: "No students found",
        type: "warning",
      });
    }
    config.setStudents(students);
  });
});

watch(mode, () => {
  switch (mode.value) {
    case "dark":
      document.body.setAttribute("arco-theme", "dark");
      break;
    case "light":
      document.body.removeAttribute("arco-theme");
      break;
  }
});

const route = useRoute();

const isMainPage = computed(() => {
  return "/" === route.path;
});
</script>

<template>
  <homepage-navigator v-if="isMainPage" />
  <div id="main-router-view">
    <n-config-provider :theme="mode === 'dark' ? darkTheme : undefined">
      <router-view v-slot="{ Component }">
        <keep-alive :max="2">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </n-config-provider>
  </div>
  <FAB />
  <router-link
    to="/"
    class="button-back fixed grid place-items-center text-white rounded-full"
  >
    <arrow-icon direction="left" :size="24" />
  </router-link>
</template>

<style scoped lang="scss">
.button-back {
  width: 48px;
  height: 48px;
  background-color: var(--color-arona-blue);
  left: 0;
  top: 50%;
  translate: -50% -50%;
  z-index: 114514;
  transition: all 0.375s ease-in-out;
  &:hover {
    translate: 0 -50%;
  }
}

.nav-bar {
  font-size: 16px;

  .navigation-arrow {
    display: none;
  }

  a {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    transition: all 0.375s ease-in-out;
    padding: 0 8px;
    height: 48px;
    color: var(--color-arona-blue);
    text-decoration: none;

    &:hover {
      background-color: var(--color-arona-blue);
      color: #fff;
    }

    &.router-link-exact-active {
      &::after {
        position: absolute;
        bottom: 0;
        left: 0;
        background-color: var(--color-arona-blue);
        width: 100%;
        height: 2px;
        content: "";
      }
    }
  }
}

@media (max-width: 768px) {
  .nav-bar {
    justify-content: flex-start;
    font-weight: normal;

    a:hover {
      background-color: inherit;
      color: var(--color-arona-blue);
    }

    .navigation-arrow {
      display: inline-flex;
      transform: rotate(90deg);
      width: 16px;
      height: 16px;
    }
  }
}

.menu-enter-active,
.menu-leave-active {
  transition: all 0.375s ease-in-out;
}

.menu-enter-from,
.menu-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
