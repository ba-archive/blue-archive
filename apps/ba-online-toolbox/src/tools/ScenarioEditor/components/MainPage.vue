<template>
  <div class="main-page">
    <index-page></index-page>
    <player-part></player-part>
    <translation-part></translation-part>
    <footer-div id="footer"></footer-div>
  </div>
</template>
<script setup lang="ts">
// import { useScenarioStore } from '../store/scenarioEditorStore';
import FooterDiv from './EditorFooter.vue';
import IndexPage from './IndexPage.vue';
import PlayerPart from './Player.vue';
import TranslationPart from './TranslationPane.vue';

// const mainStore = useScenarioStore();
</script>
<style scoped lang="scss">
//noinspection CssOverwrittenProperties
.main-page {
  display: grid;
  grid-template-rows: 1fr min-content min-content;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    'actor-lines player'
    'actor-lines translation-pane'
    'footer footer';
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  width: 100vw;
  width: 100dvw;
  height: calc(100vh - 48px);
  height: calc(100dvh - 48px);
  user-select: none;
}
</style>
