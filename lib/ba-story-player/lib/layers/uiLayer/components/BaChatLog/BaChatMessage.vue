<script lang="ts" setup>
import { LogText } from "@/types/store";
import { PropType, ref, watch } from "vue";
import avatarBG from "../../assets/Deco_GachaItemBg.webp";
import { changeStoryIndex } from "../../userInteract";
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
  position: relative;
  z-index: 0;
  display: flex;

  // 学生样式
  &.student > .ba-chat-message-bubble {
    color: #373737;
    filter: drop-shadow(0 1px 2px #afb7ba);
    .ba-chat-message-bubble-name-bg {
      background-color: white;
      .ba-chat-message-bubble-text-bg {
        background: #f0f0f0;
      }
      .ba-chat-message-bubble-bg-arrow {
        border-width: 8px 10px 8px 0;
        border-color: transparent #f0f0f0 transparent transparent;
        transform: translate(calc(-100% + 2px), 2px);
      }
    }
  }
  // 老师样式
  &.teacher > .ba-chat-message-bubble {
    color: #fefefe;
    filter: drop-shadow(0 1px 2px #2c3f4a);
    .ba-chat-message-bubble-name-bg {
      background-color: #426487;
      .ba-chat-message-bubble-text-bg {
        background-color: #334b65;
      }
      .ba-chat-message-bubble-bg-arrow {
        left: initial;
        right: -7px;
        border-width: 8px 0 8px 10px;
        border-color: transparent transparent transparent #334b65;
        transform: translate(1px, 1px);
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
        background-color: #426487;
        visibility: hidden;
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
        color: #fefefe;
        font-weight: bold;

        min-height: 1em;
        text-align: center;
      }
    }
  }
  .ba-chat-message-avatar-border {
    position: relative;
    height: 4.6875em;
    width: 5em;
    margin: 1em 1em;
    border: solid #fff 1.3px;
    border-radius: 1em;
    overflow: hidden;
    transform: skewX(-10deg);
    transform-origin: center;
    box-shadow: 0 3px 1px #777, -0.5px 0 1px #888, 0.5px 0 1px #888;

    .ba-chat-message-avatar {
      position: absolute;
      height: 100%;
      left: -10%;
      right: -10%;
      transform: skewX(10deg);
      background-repeat: no-repeat;
      background-position: center;
      transform-origin: center;
      background-size: cover, cover;
    }
  }
  .ba-chat-message-bubble {
    position: relative;
    margin: 0.5em 1.5em 0.25em 0;
    flex: 1;

    .ba-chat-message-bubble-name-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      transform: skewX(-10deg);
      z-index: -2;
      border-radius: 0.3125em;

      .ba-chat-message-bubble-text-bg {
        position: absolute;
        top: 1.95em;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        border-radius: 0.3125em;
      }
    }
    // 小箭头
    .ba-chat-message-bubble-bg-arrow {
      content: "";
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border-style: solid;

      border-color: transparent #f5f5f5 transparent transparent;
      z-index: -3;
      top: 1.95em;
      left: 0;
    }

    .ba-chat-message-name {
      min-height: 1.6em;
      margin: 0.25em 1.5em;
    }

    .ba-chat-message-text {
      font-size: 1.2em;
      margin: 0.5em 1.5em;
      min-height: 5em;
    }
  }
}
</style>
