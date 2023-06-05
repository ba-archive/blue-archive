<script lang="ts" setup>
import BaChatMessage from "./BaChatMessage.vue";
import { usePlayerStore } from "@/stores";
import { Ref, ref, watch } from "vue";
import { checkBgOverlap } from "@/layers/translationLayer/utils";

const props = defineProps({
  show: Boolean,
});
const content = ref(null) as unknown as Ref<HTMLElement>;

// 日志记录拖动功能
const isDraggingDialog = ref(false);
const dragStartY = ref(0);
const deltaY = ref(0);
const startScrollTop = ref(0);

function handleDragStart($event: MouseEvent) {
  isDraggingDialog.value = true;
  dragStartY.value = $event.clientY;
  deltaY.value = 0;

  if (content.value) {
    startScrollTop.value = content.value.scrollTop;
  }
}

function handleDragMove($event: MouseEvent) {
  if (isDraggingDialog.value) {
    deltaY.value = $event.clientY - dragStartY.value;

    if (content.value) {
      content.value.scrollTop = startScrollTop.value - deltaY.value;
    }
  }
}

function handleDragEnd() {
  setTimeout(() => {
    isDraggingDialog.value = false;
  });
}

let store = usePlayerStore();
let chatMesasages = store.logText;
watch(
  () => props.show,
  newValue => {
    if (newValue) {
      setTimeout(() => {
        let elem = content.value;
        let currentScroll = elem.scrollTop;
        let clientHeight = elem.offsetHeight;
        let scrollHeight = elem.scrollHeight;
        elem.scrollTo(0, scrollHeight);
      }, 300);
    }
  }
);
</script>

<template>
  <div class="ba-chat-log">
    <ul
      class="ba-chat-content"
      @mousedown.stop="handleDragStart"
      @mousemove.stop="handleDragMove"
      @mouseup.stop="handleDragEnd"
      @mouseleave.stop="handleDragEnd"
      ref="content"
    >
      <li
        class="ba-chat-item"
        v-for="(chatMessage, key) in chatMesasages"
        :key="key"
      >
        <BaChatMessage :deltaY="deltaY" :chat-message="chatMessage" />
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.ba-chat-log {
  --ba-chat-log: 0.5em;
  width: calc(100% - 2 * var(--ba-chat-log));
  height: calc(100% - 2 * var(--ba-chat-log));
  background-color: #d5d5d5; // 213
  margin: var(--ba-chat-log);
  border-radius: 0 0 0.4375em 0.4375em;
  overflow-y: hidden;
  position: relative;
  box-shadow: inset #bdc8d0 0 0px 2px 1px;

  background: no-repeat right bottom/contain
      linear-gradient(
        135deg,
        rgba(213, 213, 213, 1) 0%,
        rgba(213, 213, 213, 1) 67%,
        rgba(213, 213, 213, 0.85) 85%,
        rgba(213, 213, 213, 0) 100%
      ),
    repeat right -30% bottom/50% url(../../assets/UITex_BGPoliLight_1.svg) rgb(201, 232, 250);

  ul.ba-chat-content {
    // position: absolute;
    height: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-y: scroll;

    cursor: grab;

    // hide scrollbar
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
      /* Chrome Safari */
    }

    &:active {
      user-select: none;
      cursor: grabbing;
    }
  }
}
</style>
