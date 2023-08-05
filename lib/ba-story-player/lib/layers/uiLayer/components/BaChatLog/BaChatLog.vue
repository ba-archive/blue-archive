<script lang="ts" setup>
import { usePlayerStore } from "@/stores";
import { Ref, onMounted, ref } from "vue";
import BaChatMessage from "./BaChatMessage.vue";

const props = defineProps({
  show: Boolean,
});

const content = ref(null) as unknown as Ref<HTMLElement>;

// 日志记录拖动功能
const deltaY = ref(0);
const dragStartY = ref(0);
const startScrollTop = ref(0);
const isDraggingDialog = ref(false);

onMounted(() => {
  content.value.scrollTo({
    top: content.value.scrollHeight,
  });
});

function handleDragStart($event: MouseEvent) {
  if ($event.button === 0) {
    isDraggingDialog.value = true;
    dragStartY.value = $event.clientY;
    deltaY.value = 0;

    if (content.value) {
      startScrollTop.value = content.value.scrollTop;
    }
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
// 似乎没有作用
// watch(
//   () => props.show,
//   newValue => {
//     if (newValue) {
//       setTimeout(() => {
//         let elem = content.value;
//         let currentScroll = elem.scrollTop;
//         let clientHeight = elem.offsetHeight;
//         let scrollHeight = elem.scrollHeight;
//         elem.scrollTo(0, scrollHeight);
//       }, 300);
//     }
//   }
// );
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
  position: relative;
  margin: var(--ba-chat-log);
  box-shadow: inset #bdc8d0 0 0px 2px 1px;
  border-radius: 0 0 0.4375em 0.4375em;
  background-color: #d5d5d5; // 213

  background: no-repeat right bottom/contain
      linear-gradient(
        135deg,
        rgba(213, 213, 213, 1) 0%,
        rgba(213, 213, 213, 1) 67%,
        rgba(213, 213, 213, 0.85) 85%,
        rgba(213, 213, 213, 0) 100%
      ),
    repeat right -30% bottom/50% url(../../assets/UITex_BGPoliLight_1.svg) rgb(201, 232, 250);
  width: calc(100% - 2 * var(--ba-chat-log));
  height: calc(100% - 2 * var(--ba-chat-log));
  overflow-y: hidden;

  ul.ba-chat-content {
    cursor: grab;
    margin: 0;
    padding: 0;
    // position: absolute;
    height: 100%;
    overflow-y: scroll;

    // hide scrollbar
    scrollbar-width: none;
    list-style: none;

    &::-webkit-scrollbar {
      display: none;
      /* Chrome Safari */
    }

    &:active {
      cursor: grabbing;
      user-select: none;
    }
  }
}
</style>
