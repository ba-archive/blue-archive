<script lang="ts" setup>
import eventBus from "@/eventBus";

const props = defineProps({
  width: {
    type: String,
    default: "min(520px, 80%)",
  },
  height: {
    type: String,
    default: "min(400px, 70%)",
  },
  title: String,
  show: Boolean,
  showAnimation: Boolean, // 当对话框出现时是否展示动画
});

const emit = defineEmits<{
  (ev: "update:show", event: boolean): void;
}>();

function handleClose() {
  emit("update:show", false);
  eventBus.emit("playOtherSounds", "back");
}

// 对话框缓入动画
</script>

<template>
  <Transition name="dialog">
    <div class="ba-dialog" v-if="show" @click.self="handleClose">
      <div
        class="ba-dialog-container"
        :style="{ width: props.width, height: props.height }"
      >
        <div class="ba-dialog-header">
          <h3 class="ba-dialog-title">
            <span>{{ title }}</span>
          </h3>
          <button class="ba-dialog-close button-nostyle" @click="handleClose">
            <i style="user-select: none">
              <img
                src="../assets/close.svg"
                alt="close dialog"
                style="width: 1em; height: 1em; vertical-align: -0.15em"
              />
            </i>
          </button>
        </div>
        <div class="ba-dialog-content-wrapper">
          <slot></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.ba-dialog {
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  background: rgba(63, 63, 63, 0.4);
  width: 100%;
  height: 100%;

  &.dialog-enter-active .ba-dialog-container,
  &.dialog-leave-active .ba-dialog-container {
    transition: transform 0.3s ease-out;
  }

  &.dialog-enter-from .ba-dialog-container,
  &.dialog-leave-to .ba-dialog-container {
    transform: translateY(40%);
  }

  .ba-dialog-container {
    display: flex;
    position: absolute;
    flex-flow: nowrap column;
    transition: transform 1s ease-in;
    box-shadow: rgb(56, 56, 56) 0 2px 2px 1px;
    border-radius: 0.625em;
    background-color: #f0f0f0;
    overflow: hidden;

    .ba-dialog-header {
      position: relative;
      flex: 0 0 auto;
      box-shadow: #d1d8da 0 1px 2px 0px;
      background: no-repeat center/contain
          linear-gradient(
            58deg,
            rgba(240, 240, 240, 0.1) 0%,
            rgba(240, 240, 240, 1) 38%,
            rgba(240, 240, 240, 1) 100%
          ),
        url(../assets/UITex_BGPoliLight_1.svg) rgb(164 216 237);
      background-position: 0 30%;
      background-size: 100%;
      overflow: hidden;

      .ba-dialog-title {
        margin: 0.2em 0.5em 0 0.5em;
        font-weight: bold;
        font-size: 1.6em;
        user-select: none;
        text-align: center;

        span {
          display: inline-block;

          &::after {
            display: block;
            border-radius: 0.1875em;
            background-color: #fbef62;
            width: 100%;
            height: 0.25em;
            content: "";
          }
        }
      }

      .ba-dialog-close {
        display: inline;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        margin: 0;
        margin-right: 1em;
        border: none;
        background-color: initial;
        padding: 0;
        font-weight: bold;
        font-size: 1.5em;
      }
    }

    .ba-dialog-content-wrapper {
      position: relative;
      flex: 1 1 auto;
      // 阴影效果
      margin-top: 2px;

      background: no-repeat right bottom/contain
          linear-gradient(
            135deg,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 255, 255, 1) 67%,
            rgba(255, 255, 255, 0.85) 85%,
            rgba(255, 255, 255, 0) 100%
          ),
        repeat right -30% bottom/50% url(../assets/UITex_BGPoliLight_1.svg) rgb(135, 196, 232);
      min-height: 0;
    }
  }
}
</style>
