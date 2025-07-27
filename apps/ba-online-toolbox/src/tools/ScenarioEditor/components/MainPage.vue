<template>
  <div class="main-page pt-4">
    <index-page></index-page>
    <player-part></player-part>
    <translation-part></translation-part>
    <transition name="fly-in">
      <div
        v-show="!showFooter"
        class="button-footer-trigger p-3 rounded-full fixed bg-[var(--color-arona-blue)] bottom-0 left-1/2 line-height-0 cursor-pointer"
        @click="showFooter = true"
      >
        <arrow-icon direction="up" :size="24" />
      </div>
    </transition>
    <transition name="fly-in">
      <footer-div v-show="showFooter" ref="footerRef" @downloaded="showFooter = true" />
    </transition>
  </div>
</template>
<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { ref, onMounted } from "vue";
import FooterDiv from "./EditorFooter.vue";
import IndexPage from "./IndexPage.vue";
import PlayerPart from "./Player.vue";
import TranslationPart from "./TranslationPane.vue";
import ArrowIcon from "../../public/components/ArrowIcon.vue";

const footerRef = ref(null);

onClickOutside(footerRef, () => {
  showFooter.value = false;
});

const showFooter = ref(false);

onMounted(() => {
  setTimeout(() => {
    showFooter.value = true;
  }, 8);
  setTimeout(() => {
    showFooter.value = false;
  }, 3 * 1000);
});
</script>
<style scoped lang="scss">
.button-footer-trigger {
  translate: -50% 50%;
  transition: all 0.375s ease-in-out;

  &:hover {
    translate: -50% 0;
  }
}
//noinspection CssOverwrittenProperties
.main-page {
  display: grid;
  grid-template-rows: 1fr min-content min-content;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "actor-lines player"
    "actor-lines translation-pane";
  align-items: center;
  gap: 1rem;
  width: 100vw;
  width: 100dvw;
  max-width: 1440px;
  height: 100vh;
  height: 100dvh;
  user-select: none;
}

.fly-in-enter-active,
.fly-in-leave-active {
  transition: all 0.375s ease-in-out;
}

.fly-in-enter-from,
.fly-in-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
