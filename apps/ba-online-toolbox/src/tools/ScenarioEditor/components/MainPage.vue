<template>
  <div class="main-page pt-4">
    <index-page></index-page>
    <player-part></player-part>
    <translation-part></translation-part>
    <transition name="fly-in">
      <footer-div v-if="showFooter" ref="footerRef" />
    </transition>
  </div>
</template>
<script setup lang="ts">
import { usePointer, useWindowSize, onClickOutside } from "@vueuse/core";
import { ref, watch } from "vue";
import FooterDiv from "./EditorFooter.vue";
import IndexPage from "./IndexPage.vue";
import PlayerPart from "./Player.vue";
import TranslationPart from "./TranslationPane.vue";

const footerRef = ref(null);

onClickOutside(footerRef, () => {
  showFooter.value = false;
});

const { y: pointerY } = usePointer();
const { height: windowHeight } = useWindowSize();

const showFooter = ref(false);

const pixelsToShowFooter = 36;
const previousPointerY = ref(0);

watch(
  () => [pointerY.value, windowHeight.value],
  ([pointerY, windowHeight]) => {
    if (pointerY > windowHeight - pixelsToShowFooter) {
      showFooter.value = true;
      return;
    }
    if (pointerY > previousPointerY.value + pixelsToShowFooter) {
      showFooter.value = true;
      previousPointerY.value = pointerY;
      return;
    }
    if (pointerY < previousPointerY.value) {
      showFooter.value = false;
      previousPointerY.value = pointerY;
      return;
    }
  },
  {
    immediate: false,
  }
);
</script>
<style scoped lang="scss">
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
