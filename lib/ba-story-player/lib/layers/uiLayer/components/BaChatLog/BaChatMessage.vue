<script lang="ts" setup>
import { PropType, ref, watch } from "vue";
import avatarBG from "../../assets/Deco_GachaItemBg.webp";
import { changeStoryIndex } from "../../userInteract";
import { LogText } from "@/types/store";

const props = defineProps({
  deltaY: Number,
  chatMessage: Object as PropType<LogText>,
});
const avatarBGRef = ref<string>(avatarBG);

const bubbleType = ref<"student" | "teacher" | "narration">("student");

// 日志记录拖动功能
const delta = ref(props.deltaY);

watch(
  () => props.deltaY,
  newVal => {
    delta.value = newVal;
  }
);

switch (props.chatMessage?.type) {
  case "character":
    bubbleType.value = "student";
    break;
  case "user":
    bubbleType.value = "teacher";
    break;
  case "none":
    bubbleType.value = "narration";
    break;
  default:
    bubbleType.value = "student";
    break;
}
</script>

<template>
  <div
    :class="['ba-chat-message', bubbleType]"
    @click="delta ? null : changeStoryIndex(chatMessage?.index)"
  >
    <!-- 设置透明度为0如果没有图片需要显示 -->
    <div
      class="ba-chat-message-avatar-border"
      :style="{ opacity: props.chatMessage?.avatarUrl ? 1 : 0 }"
    >
      <div
        class="ba-chat-message-avatar"
        role="img"
        :style="{
          'background-image':
            'url(' +
            props.chatMessage?.avatarUrl +
            ')' +
            ', url(' +
            avatarBGRef +
            ')',
        }"
      />
    </div>
    <div class="ba-chat-message-bubble">
      <div class="ba-chat-message-bubble-name-bg">
        <div class="ba-chat-message-bubble-text-bg"></div>
        <div class="ba-chat-message-bubble-bg-arrow"></div>
      </div>
      <h4 class="ba-chat-message-name">{{ chatMessage?.name }}</h4>
      <p class="ba-chat-message-text">{{ chatMessage?.text }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ba-chat-message {
  display: flex;
  position: relative;
  z-index: 0;

  // 学生样式
  &.student > .ba-chat-message-bubble {
    filter: drop-shadow(0 1px 2px #afb7ba);
    color: #373737;
    .ba-chat-message-bubble-name-bg {
      background-color: white;
      .ba-chat-message-bubble-text-bg {
        background: #f0f0f0;
      }
      .ba-chat-message-bubble-bg-arrow {
        transform: translate(calc(-100% + 2px), 2px);
        border-width: 8px 10px 8px 0;
        border-color: transparent #f0f0f0 transparent transparent;
      }
    }
  }
  // 老师样式
  &.teacher > .ba-chat-message-bubble {
    filter: drop-shadow(0 1px 2px #2c3f4a);
    color: #fefefe;
    .ba-chat-message-bubble-name-bg {
      background-color: #426487;
      .ba-chat-message-bubble-text-bg {
        background-color: #334b65;
      }
      .ba-chat-message-bubble-bg-arrow {
        right: -7px;
        left: initial;
        transform: translate(1px, 1px);
        border-width: 8px 0 8px 10px;
        border-color: transparent transparent transparent #334b65;
      }
    }
  }
  // 旁白样式
  &.narration {
    filter: drop-shadow(0 1px 2px #2c3f4a);
    .ba-chat-message-avatar-border {
      height: 0;
    }
    .ba-chat-message-bubble {
      margin: 0.5em 1.75em 0.25em 0;
      .ba-chat-message-bubble-name-bg {
        visibility: hidden;
        background-color: #426487;
        height: inherit;
        .ba-chat-message-bubble-text-bg {
          top: 0;
          visibility: visible;
          background-color: #334b65;
        }
        .ba-chat-message-bubble-bg-arrow {
          display: none;
        }
      }
      .ba-chat-message-name {
        display: none;
      }
      .ba-chat-message-text {
        min-height: 1em;
        color: #fefefe;
        font-weight: bold;
        text-align: center;
      }
    }
  }
  .ba-chat-message-avatar-border {
    position: relative;
    transform: skewX(-10deg);
    transform-origin: center;
    margin: 1em 1em;
    box-shadow: 0 3px 1px #777, -0.5px 0 1px #888, 0.5px 0 1px #888;
    border: solid #fff 1.3px;
    border-radius: 1em;
    width: 5em;
    height: 4.6875em;
    overflow: hidden;

    .ba-chat-message-avatar {
      position: absolute;
      right: -10%;
      left: -10%;
      transform: skewX(10deg);
      transform-origin: center;
      background-position: center;
      background-size: cover, cover;
      background-repeat: no-repeat;
      height: 100%;
    }
  }
  .ba-chat-message-bubble {
    position: relative;
    flex: 1;
    margin: 0.5em 1.5em 0.25em 0;

    .ba-chat-message-bubble-name-bg {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      transform: skewX(-10deg);
      z-index: -2;
      border-radius: 0.3125em;

      .ba-chat-message-bubble-text-bg {
        position: absolute;
        top: 1.95em;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: -1;
        border-radius: 0.3125em;
      }
    }
    // 小箭头
    .ba-chat-message-bubble-bg-arrow {
      display: block;
      position: absolute;
      top: 1.95em;
      left: 0;
      z-index: -3;
      border-style: solid;

      border-color: transparent #f5f5f5 transparent transparent;
      width: 0;
      height: 0;
      content: "";
    }

    .ba-chat-message-name {
      margin: 0.25em 1.5em;
      min-height: 1.6em;
    }

    .ba-chat-message-text {
      margin: 0.5em 1.5em;
      min-height: 5em;
      font-size: 1.2em;
    }
  }
}
</style>
