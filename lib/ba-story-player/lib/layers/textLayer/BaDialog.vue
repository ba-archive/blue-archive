<template>
  <div
    class="text-container"
    :style="{
      height: `${playerHeight}px`,
      '--standard-font-size': standardFontSize,
      '--standard-unity-font-size': standardUnityFontSize,
    }"
    @click="simulateUiClick"
  >
    <div
      class="container-inner"
      :class="{ 'prevent-interact': preventInteract }"
    >
      <div class="loading-container absolute-container" v-if="showLoading">
        <img
          class="loading-image"
          :src="loadingImageSrc"
          alt="本来应该是加载图片的"
        />
        <div class="loading-log">
          <div
            v-for="(e, index) in mapLoadLog"
            class="loading-log-item"
            :key="index"
          >
            <span v-if="e.type === 'success'" class="loading-log-item-success">
              加载资源:{{ e.resourceName }}
            </span>
            <span v-else class="loading-log-item-error">
              错误:{{ e.resourceName }}
            </span>
          </div>
        </div>
      </div>
      <div
        ref="nextEpisodeContainer"
        class="next-episode-container absolute-container"
        @click="endPlay"
        v-if="showNextEpisode"
      >
        <div class="next-episode-cover" />
        <div class="next-episode-cover" />
      </div>
      <div
        class="to-be-continued-container absolute-container"
        v-if="showToBeContinue"
      >
        <div ref="toBeContinuedBg0" class="to-be-continued-bg0" />
        <div ref="toBeContinuedBg1" class="to-be-continued-bg1" />
        <div
          ref="toBeContinuedText"
          class="to-be-continued"
          :style="{ fontSize: `${standardFontSize}rem` }"
        >
          To Be Continued...
        </div>
      </div>
      <div
        class="image-video-container absolute-container"
        v-if="popupSrc.image || popupSrc.video"
      >
        <div class="image-video-container-inner">
          <div
            class="image-container absolute-container"
            :style="{ height: `${playerHeight - dialogHeight}px` }"
            v-if="popupSrc.image"
          >
            <img :src="popupSrc.image" alt="完了加载失败了" class="image" />
          </div>
          <VideoBackground
            ref="videoComponent"
            :src="popupSrc.video"
            objectFit="contain"
            style="width: 100%; height: 100%"
            v-if="popupSrc.video"
            @ended="onPopupVideoEnd"
          />
        </div>
      </div>
      <div
        class="st-container absolute-container"
        :style="{
          '--st-width-half': `${stWidth / 2}`,
          '--st-height-half': `${stHeight / 2}`,
          '--st-pos-bounds-x': `${stPositionBounds.width}`,
          '--st-pos-bounds-y': `${stPositionBounds.height}`,
        }"
        @click="onStContainerClick"
        v-if="stText.length > 0"
      >
        <StUnit
          v-for="(e, index) in stText"
          :index="String(index)"
          :config="e"
          :key="index"
          :base-index="index"
        />
      </div>
      <div
        ref="titleEL"
        class="title-container absolute-container"
        :style="overrideTitleStyle"
        v-if="titleText.length"
      >
        <div
          class="title-border"
          :style="{ '--side-padding': `${titleBorderPadding}px` }"
        >
          <img src="./assets/title_border__upper_left.svg" alt="upper-left" />
          <img src="./assets/title_border__upper_right.svg" alt="upper-right" />
          <img src="./assets/title_border__lower_right.svg" alt="lower-right" />
          <img src="./assets/title_border__lower_left.svg" alt="lower-left" />
          <div
            ref="titleContain"
            class="title-contain"
            :style="{ '--font-size': `${fontSize(4)}rem` }"
            :data-translator="titleTranslatorContent"
          >
            <div class="sub-title" v-if="subTitleContent">
              <span class="sub-title-inner">{{ subTitleContent }}</span>
            </div>
            <div class="main-title">
              <TypingUnit
                v-for="(e, index) in titleText"
                :index="'title-' + index"
                :key="index"
                :text="e"
                instant
                title
              />
            </div>
          </div>
        </div>
      </div>
      <div
        ref="placeEL"
        class="place-container"
        :style="{ '--font-size': `${fontSize(2)}rem` }"
        v-if="placeContent"
      >
        <div class="round-place">
          <span class="place-content">{{ placeContent }}</span>
        </div>
      </div>
      <div
        ref="placeTranslatorEL"
        class="place-translator-container place-container"
        :style="{ '--font-size': `${fontSize(2) * 0.6}rem` }"
        v-if="placeTranslatorContent"
      >
        <div class="round-place">
          <span class="place-content">{{ placeTranslatorContent }}</span>
        </div>
      </div>
      <div
        v-if="showDialog"
        :style="{
          padding: `0 ${fontSize(8)}rem ${fontSize(3)}rem`,
          height: `${dialogHeight}px`,
          '--text-dialog-padding-left': `${fontSize(8)}rem`,
          '--text-dialog-width': textDialogWidth,
        }"
        class="dialog"
        ref="TextDialog"
      >
        <div class="inner-dialog" id="player__text_inner_dialog">
          <div class="title">
            <span :style="{ '--fs': `${fontSize(3.5)}rem` }" class="name">{{
              name ? name : "&emsp;"
            }}</span>
            <span :style="{ '--fs': `${fontSize(2)}rem` }" class="department">{{
              nickName
            }}</span>
          </div>
          <hr />
          <div class="content">
            <TypingUnit
              v-for="(e, index) in dialogText"
              :index="String(index)"
              :key="index"
              :text="e"
              @unit-click="simulateUiClick"
            />
          </div>
          <div class="next-image-btn" v-if="typingComplete">&zwj;</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import eventBus from "@/eventBus";
import { usePlayerStore } from "@/stores";
import { deepCopyObject } from "@/utils";
import gsap from "gsap";
import {
  Ref,
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from "vue";
import VideoBackground from "vue-responsive-video-background-player";
import TypingUnit from "./components/TypingUnit.vue";
import TypingEmitter from "./utils/typingEmitter";
import StUnit from "@/layers/textLayer/components/StUnit.vue";
import { Text } from "@/types/common";
import {
  LoadingImageUrl,
  ResourceLoadState,
  ShowText,
  ShowTitleOption,
  StText,
} from "@/types/events";
import { useThrottleFn } from "@vueuse/core";

const textDialogWidth = ref(0);
const TextDialog = ref<HTMLElement>() as Ref<HTMLElement>; // 文本框长度, 用于计算tooltip最大位置
const toBeContinuedBg0 = ref<HTMLElement>(); // to be continued的背景
const toBeContinuedBg1 = ref<HTMLElement>(); // to be continued的背景
const toBeContinuedText = ref<HTMLElement>(); // to be continued的字
const titleEL = ref<HTMLElement>(); // 大标题的el
const placeEL = ref<HTMLElement>(); // place的el
const placeTranslatorEL = ref<HTMLElement>(); // 译者的el
const nextEpisodeContainer = ref<HTMLElement>(); // 下一章的el
const titleContain = ref<HTMLElement>(); // 标题内容的el, 为了实现scale效果
const overrideTitleZIndex = ref<number>();
const videoComponent = ref();

// 对话
const dialogText = ref<Text[]>([]);
// st
const stText = ref<StText[]>([]);
// 标题
const titleText = ref<Text[]>([]);

// 外部传入播放器高度,用于动态计算字体等数值
const props = withDefaults(defineProps<TextLayerProps>(), {
  playerHeight: 0,
  playerWidth: 0,
});
// 当出现option之类时阻止dialog的交互
const preventInteract = ref(false);
// 副标题
const subTitleContent = ref<string>("");
// 标题下的译者信息
const titleTranslatorContent = ref<string>("");
// 位置
const placeContent = ref<string>("");
// 位置下的译者信息
const placeTranslatorContent = ref<string>("");
// 昵称
const name = ref<string>();
// 所属(昵称右边)
const nickName = ref<string>();
// 在执行st特效时置为false以隐藏对话框
const showDialog = ref<boolean>(false);
// 显示加载动画
const showLoading = ref<boolean>(false);
// 显示to be continued
const showToBeContinue = ref<boolean>(false);
// 显示next episode
const showNextEpisode = ref<boolean>(false);
const popupSrc = reactive({
  // image: "https://yuuka.diyigemt.com/image/full-extra/output/media/UIs/03_Scenario/04_ScenarioImage/popup49.png",
  // video: "https://yuuka.diyigemt.com/image/full-extra/output/media/Video/pv-v.mp4"
  image: "",
  video: "",
});
const loadingImageSrc = ref<string>("");
let showNextEpisodeLock = false;
// 打印完成
const typingComplete = ref<boolean>(false);
function endPlay() {
  if (showNextEpisodeLock) {
    return;
  }
  eventBus.emit("next");
}
/**
 * 单击屏幕后触发效果 next或者立即显示当前对话
 */
function moveToNext() {
  if (!showDialog.value) return; // 显示st期间不允许跳过
  // 没打过任何一行字(初始化)或者对话已经显示完成, 点击屏幕代表继续
  if (typingComplete.value) {
    eventBus.emit("next");
  } else {
    // 否则立即显示所有对话
    TypingEmitter.emit("skip");
  }
}
/**
 * 展示主标题
 */
function handleShowTitle(e: ShowTitleOption) {
  subTitleContent.value = e.subtitle || "";
  if (e.translator) {
    titleTranslatorContent.value = buildTranslatorInfo(e.translator);
  }
  proxyShowCoverTitle(titleEL, titleText, e.title).then(() => {
    subTitleContent.value = "";
    titleTranslatorContent.value = "";
    eventBus.emit("titleDone");
  });
}
/**
 * 展示左上角位置标题
 */
function handleShowPlace(e: string) {
  proxyShowCoverTitle(placeEL, placeContent, e);
}

/**
 * 展示左上角位置标题下面的译者信息
 */
function handleShowPlaceTranslator(e: string) {
  proxyShowCoverTitle(
    placeTranslatorEL,
    placeTranslatorContent,
    buildTranslatorInfo(e)
  );
}

/**
 * 统一方法, 淡入淡出el
 * @param el 要操作的el
 * @param proxy 要操作的el显示的内容
 * @param value 要显示的内容
 * @param onElUpdate 在el显示后的回调, 给next episode用的
 */
function proxyShowCoverTitle<T extends string | unknown[]>(
  el: Ref<HTMLElement | undefined>,
  proxy: Ref<T>,
  value: T,
  onElUpdate?: (el: HTMLElement) => void
) {
  return new Promise<void>(resolve => {
    if (!value) {
      resolve();
      return;
    }
    proxy.value = value;
    nextTick(() => {
      const elValue = el.value as HTMLElement;
      onElUpdate && el.value && onElUpdate(el.value);
      const timeline = gsap.timeline();
      timeline.to(elValue, {
        opacity: 1,
        duration: 0.75,
      });
      if (!onElUpdate) {
        timeline.to(
          elValue,
          {
            opacity: 0,
            duration: 0.75,
          },
          "+=1.5"
        );
      }
      timeline.then(() => {
        if (!onElUpdate) {
          if (Array.isArray(value)) {
            (proxy.value as unknown[]) = [];
          } else {
            (proxy.value as string) = "";
          }
        }
        resolve();
      });
    });
  });
}
/**
 * 清除特效字
 */
function handleClearSt() {
  // 清除所有已存在的st
  stText.value = [];
}
/**
 * 处理st显示事件
 */
function handleShowStEvent(e: StText) {
  // st特效必须有数组长度为3的参数
  if (!e.stArgs || !Array.isArray(e.stArgs) || e.stArgs.length !== 3) {
    console.error("st特效参数不足", e);
    return;
  }
  // e = deepCopyObject(e);
  // 显示st时隐藏对话框
  showDialog.value = false;
  stText.value.push(e);
  // 因为是vdom操作所以等生效后继续
  nextTick(() => {
    if (
      e.stArgs[1] === "instant" &&
      e.text.length === 0 &&
      e.stArgs[0][0] === 0 &&
      e.stArgs[0][1] === 0
    ) {
      eventBus.emit("stDone");
      return;
    }
    function observer(index = "0") {
      if (index === String(stText.value.length - 1)) {
        TypingEmitter.off("stComplete", observer);
        eventBus.emit("stDone");
      }
    }
    TypingEmitter.on("stComplete", observer);
    TypingEmitter.emit("start", String(stText.value.length - 1));
  });
}

/**
 * 处理dialog对话事件
 */
function handleShowTextEvent(e: ShowText) {
  usePlayerStore().updateLogText(e);
  if (e.text.length === 0) {
    setTimeout(() => {
      eventBus.emit("textDone");
      setTimeout(() => {
        eventBus.emit("next");
      }, 200);
    });
    return;
  }
  showDialog.value = true;
  e = deepCopyObject(e);
  // 清除上次输入
  dialogText.value = [];
  typingComplete.value = false;
  nextTick(() => {
    updateTextDialogWidth();
    // 设置昵称
    name.value = e.speaker?.name;
    // 设置次级标题
    nickName.value = e.speaker?.nickName;
    dialogText.value = e.text;
    function observer(index = "0") {
      if (index !== String(e.text.length - 1)) {
        TypingEmitter.emit("start", String(Number(index) + 1));
      } else {
        TypingEmitter.off("complete", observer);
        eventBus.emit("textDone");
        typingComplete.value = true;
      }
    }
    nextTick(() => {
      TypingEmitter.on("complete", observer);
      TypingEmitter.emit("start", "0");
    });
  });
}

/**
 * 處理hide和hideDialog事件
 */
function handleHideDialog() {
  showDialog.value = false;
}

/**
 * 处理 to be continued 效果
 */
function handleToBeContinued() {
  hideMenu();
  showToBeContinue.value = true;
  nextTick(() => {
    const _toBeContinuedText = toBeContinuedText.value as HTMLElement;
    const _toBeContinuedBg0 = toBeContinuedBg0.value as HTMLElement;
    const _toBeContinuedBg1 = toBeContinuedBg1.value as HTMLElement;
    const style = getComputedStyle(_toBeContinuedText);
    const w = Number(style.width.replace("px", ""));
    _toBeContinuedText.style.right = `${-w - 10}px`;
    _toBeContinuedText.style.opacity = "1";
    const timeline = gsap.timeline();
    timeline
      .to(_toBeContinuedBg0, {
        opacity: 1,
        duration: 0.3,
      })
      .to(
        _toBeContinuedBg1,
        {
          opacity: 1,
          duration: 0.4,
        },
        "-=0.15"
      )
      .to(
        _toBeContinuedText,
        {
          right: 20,
          duration: 0.3,
        },
        "<"
      )
      .to(
        _toBeContinuedText,
        {
          opacity: 0,
          duration: 0.6,
        },
        "+=1.2"
      )
      .then(() => eventBus.emit("toBeContinueDone"))
      .then(() => {
        eventBus.emit("toBeContinueDone");
      });
  });
}

/**
 * 显示下一章标题
 */
function handleNextEpisode(e: ShowTitleOption) {
  showNextEpisodeLock = true;
  showNextEpisode.value = true;
  hideMenu();
  nextTick(() => {
    const container = nextEpisodeContainer.value as HTMLElement;
    const topChild = container.children[0];
    const bottomChild = container.children[1];
    let flag = false;
    const timeline = gsap.timeline();
    timeline
      .to(topChild, {
        translateY: 0,
        duration: 0.5,
        ease: "power4.out",
      })
      .to(
        bottomChild,
        {
          translateY: 0,
          duration: 0.5,
          ease: "power4.out",
          onComplete() {
            showToBeContinue.value = false;
          },
        },
        "<"
      )
      .to(topChild, {
        translateY: "-100%",
        duration: 0.5,
        ease: "power4.in",
      })
      .to(
        bottomChild,
        {
          translateY: "100%",
          duration: 0.5,
          ease: "power4.in",
          onUpdate() {
            if (flag) {
              return;
            }
            const matrix = getComputedStyle(bottomChild).transform;
            if (
              Number(
                matrix.substring(matrix.lastIndexOf(",") + 2).replace(")", "")
              ) > 100
            ) {
              subTitleContent.value = e.subtitle || "";
              proxyShowCoverTitle(titleEL, titleText, e.title, el => {
                const tl = gsap.timeline();
                tl.fromTo(
                  el,
                  {
                    scaleY: 0.8,
                  },
                  {
                    scaleY: 1,
                    duration: 0.2,
                  }
                );
              });
              flag = true;
            }
          },
        },
        "<"
      )
      .then(() => {
        eventBus.emit("nextEpisodeDone");
      });
  });
}
function handlePopupImage(url: string) {
  popupSrc.image = url;
}
function handlePopupVideo(url: string) {
  hideMenu();
  popupSrc.video = url;
}
function onPopupVideoEnd() {
  console.log("video end");
}
function hideMenu() {
  eventBus.emit("hidemenu");
}
function handlePopupClose() {
  popupSrc.image = "";
  videoComponent.value?.pause();
  nextTick(() => {
    popupSrc.video = "";
  });
}
/**
 * 播放加载动画
 * @param dataUrl
 */
function handleStartLoading(url: LoadingImageUrl) {
  loadLog.value = [];
  if (loadingImageSrc.value) {
    return;
  }
  if (url.restrict) {
    loadingImageSrc.value = url.url;
  } else {
    const loadingImageIndex = Math.floor(Math.random() * 40);
    loadingImageSrc.value = `${url.url}/loading/${loadingImageIndex}.webp`;
  }
  showLoading.value = true;
}

/**
 * 滚动加载log
 * @param state 已加载的资源状态
 */
function handleOneResourceLoaded(state: ResourceLoadState) {
  showLoading.value = true;
  const tmp: ResourceLoadState[] = [];
  if (typeof state.resourceName === "string") {
    tmp.push(state);
  } else {
    tmp.push(...state.resourceName.map((it) => ({
      type: state.type,
      resourceName: it,
    })));
  }
  loadLog.value.splice(0, 0, ...tmp);
}

/**
 * 隐藏加载动画
 */
function handleEndLoading() {
  showLoading.value = false;
  nextTick(() => {
    loadingImageSrc.value = "";
  });
}
const fontSizeBounds = computed(() => props.playerHeight / 1080);
const stWidth = 3000;
const stHeight = 1600;
// st坐标系映射视口坐标系
const stPositionBounds = computed(() => ({
  width: props.playerWidth / stWidth,
  height: props.playerHeight / stHeight,
}));
// 按比例缩放文字
function fontSize(multi: number) {
  return fontSizeBounds.value * multi;
}
const standardFontSize = computed(() => fontSize(2.5));
const standardUnityFontSize = 64;

const overrideTitleStyle = computed(() => {
  if (overrideTitleZIndex.value) {
    return {
      "z-index": overrideTitleZIndex.value,
    };
  }
  return {
    //当为nexetEpisode时取消背景模糊
    "backdrop-filter": showNextEpisode.value ? "none" : "blur(7px)",
  };
});
// 文本框总高度
const dialogHeight = computed(() => props.playerHeight * 0.37);
// 计算title的padding以让其符合边框第二边线
const titleBorderWidth = 2280;
const standardBorderWidth = 26;
const titleBorderPadding = computed(
  () => (props.playerWidth / titleBorderWidth) * standardBorderWidth
);
const loadLog = ref<ResourceLoadState[]>([]);
const mapLoadLog = computed(() =>
  loadLog.value
    .slice(0, 4)
    .map(it => it || { type: "success", resourceName: "" })
);
const updateTextDialogWidth = useThrottleFn(() => {
  if (!TextDialog.value) {
    return;
  }
  const react = TextDialog.value.getBoundingClientRect();
  textDialogWidth.value = react.width;
}, 40);
function doPreventInteract() {
  preventInteract.value = true;
}
function exitPreventInteract() {
  preventInteract.value = false;
}
function simulateUiClick() {
  // 导致onStContainerClick和simulateUiClick事件重复发送
  if (stText.value.length > 0) {
    return;
  }
  eventBus.emit("click");
}
function onStContainerClick() {
  // st层和dialog同时出现的情况, 由于st会覆盖到text上面导致点击对话框无法next
  if (stText.value.length && dialogText.value.length) {
    eventBus.emit("click");
  }
}
onMounted(() => {
  eventBus.on("option", doPreventInteract);
  eventBus.on("select", exitPreventInteract);
  eventBus.on("resize", updateTextDialogWidth);
  eventBus.on("showTitle", handleShowTitle);
  eventBus.on("showPlace", handleShowPlace);
  eventBus.on("showPlaceTranslator", handleShowPlaceTranslator);
  eventBus.on("showText", handleShowTextEvent);
  eventBus.on("st", handleShowStEvent);
  eventBus.on("clearSt", handleClearSt);
  eventBus.on("hide", handleHideDialog);
  eventBus.on("hideDialog", handleHideDialog);
  eventBus.on("click", moveToNext);
  eventBus.on("toBeContinue", handleToBeContinued);
  eventBus.on("nextEpisode", handleNextEpisode);
  eventBus.on("popupImage", handlePopupImage);
  eventBus.on("popupVideo", handlePopupVideo);
  eventBus.on("hidePopup", handlePopupClose);
  eventBus.on("startLoading", handleStartLoading);
  eventBus.on("oneResourceLoaded", handleOneResourceLoaded);
  eventBus.on("loaded", handleEndLoading);
});
onUnmounted(() => {
  eventBus.off("option", doPreventInteract);
  eventBus.off("select", exitPreventInteract);
  eventBus.off("resize", updateTextDialogWidth);
  eventBus.off("showTitle", handleShowTitle);
  eventBus.off("showPlace", handleShowPlace);
  eventBus.off("showPlaceTranslator", handleShowPlaceTranslator);
  eventBus.off("showText", handleShowTextEvent);
  eventBus.off("st", handleShowStEvent);
  eventBus.off("clearSt", handleClearSt);
  eventBus.off("hide", handleHideDialog);
  eventBus.off("hideDialog", handleHideDialog);
  eventBus.off("click", moveToNext);
  eventBus.off("toBeContinue", handleToBeContinued);
  eventBus.off("nextEpisode", handleNextEpisode);
  eventBus.off("popupImage", handlePopupImage);
  eventBus.off("popupVideo", handlePopupVideo);
  eventBus.off("hidePopup", handlePopupClose);
  eventBus.off("startLoading", handleStartLoading);
  eventBus.off("oneResourceLoaded", handleOneResourceLoaded);
  eventBus.off("loaded", handleEndLoading);
});
function buildTranslatorInfo(translator: string) {
  if (translator) {
    return "翻译：" + translator;
  }
  return translator;
}

/**
 * 用来算比例的
 */
type TextLayerProps = {
  playerHeight: number; // 整块视口的高
  playerWidth: number; // 整块视口的宽
};
</script>

<style scoped lang="scss">
$border-radius: 5px;
$dialog-z-index: 3;
$place-z-index: 8;
$title-z-index: 10;
$select-z-index: 10;
$image-video-z-index: 10;
$to-be-continue-z-index: 200;
$next-episode-z-index: 201;
$loading-z-index: 202;
$st-z-index: 10;
$text-outline: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
* {
  box-sizing: border-box;
}

.dialog {
  position: absolute;
  bottom: 0;
  z-index: $text-layer-z-index + $dialog-z-index;
  box-sizing: border-box;
  background-image: linear-gradient(
    to bottom,
    rgba(255, 0, 0, 0),
    rgba(19, 32, 45, 0.9) 30%
  );
  padding: 3rem 8rem;
  width: 100%;
  white-space: pre-line;

  .inner-dialog {
    position: relative;
    width: 100%;
    height: 100%;
    .name {
      align-self: flex-end;
      color: white;
      font-size: max(var(--fs), var(--minimum-fs));
    }
    .department {
      margin-left: 10px;
      color: rgb(156, 218, 240);
      font-size: var(--fs);
    }
  }

  .next-image-btn {
    $size: 10px;
    position: absolute;
    right: 0;
    bottom: 1rem;
    animation: next-btn 0.6s linear alternate infinite;
    background: url("./assets/text-next.webp");
    background-size: $size $size;
    width: 10px;
    height: 10px;
  }

  @keyframes next-btn {
    0% {
      transform: translateY(0);
    }

    40% {
      transform: translateY(10%);
    }

    100% {
      transform: translateY(50%);
    }
  }
}

.content {
  //--font-size: 2rem;
  --param-font-size: 64;
  margin-top: 1.5%;
  color: white;
  :deep(span.unit) {
    --font-size: max(
      calc(
        (
            var(--param-font-size) / var(--standard-unity-font-size) *
              var(--standard-font-size)
          ) * 1rem
      ),
      var(--minimum-fs)
    );
    font-size: var(--font-size);
    line-height: calc(1.5 * var(--font-size));
  }
}

.text-container {
  --minimum-fs: 14px; // 最小字体大小
  position: absolute;
  overflow: hidden;
  pointer-events: none;
  font-family: "TJL", "Microsoft YaHei", "PingFang SC", -apple-system, system-ui,
    "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", BlinkMacSystemFont,
    "Helvetica Neue", "Hiragino Sans GB", Arial, sans-serif;
  user-select: none;
  hr {
    border: 0.1px rgba(255, 255, 255, 0.666) solid;
  }

  .container-inner {
    position: relative;
    width: 100%;
    height: 100%;
    pointer-events: auto;
  }
  .container-inner.prevent-interact {
    pointer-events: none;
  }

  .title-container {
    $padding: 20px;
    opacity: 0;
    z-index: $text-layer-z-index + $title-z-index;
    padding: $padding;
    color: white;
    text-align: center;
    .title-border {
      --side-padding: 0px;
      $border-svg-size: 32px;
      $border-opacity: 0.5;
      $border-color: rgba(255, 255, 255, $border-opacity);

      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      border: 2px solid $border-color;
      border-radius: 8px;
      background: linear-gradient(to top, white, $border-color),
        linear-gradient(to left, white, $border-color),
        linear-gradient(to top, white, $border-color),
        linear-gradient(to left, white, $border-color);
      background-position: 31px 12px, 11px 32px, 31px calc(100% - 12px),
        calc(100% - 12px) 32px;
      background-size: calc(100% - 62px) 0.5px, 0.5px calc(100% - 65px),
        calc(100% - 62px) 0.5px, 0.5px calc(100% - 65px);
      background-repeat: no-repeat;
      // width: calc(100% - 2 * #{$padding} - 2 * var(--side-padding));
      width: 100%;
      height: 100%;
      line-height: 1;
      img {
        position: absolute;
        opacity: $border-opacity;
        filter: drop-shadow(0 0 0.2px white);
        width: $border-svg-size;

        &:nth-child(1) {
          top: 0;
          left: 0;
        }
        &:nth-child(2) {
          top: 0;
          right: 0;
        }
        &:nth-child(3) {
          right: 0;
          bottom: 0;
        }
        &:nth-child(4) {
          bottom: 0;
          left: 0;
        }
      }

      .title-contain {
        --font-size: 2rem;
        --sub-title-font-size: calc(var(--font-size) * 0.6);
        position: absolute;
        left: 0;
        background: linear-gradient(
            58deg,
            rgba(240, 240, 240, 0.1) 0%,
            rgba(240, 240, 240, 1) 38%,
            rgba(240, 240, 240, 0.1) 100%
          ),
          url(../uiLayer/assets/UITex_BGPoliLight_1.svg) rgb(164 216 237)
            no-repeat 0 30%;
        background-size: 100%, 100%;
        padding: var(--font-size) 0;
        width: 100%;
        color: black;
        font-weight: 700;
        font-size: var(--font-size);
        line-height: 1;
        .sub-title {
          margin-bottom: calc(var(--font-size) * 0.52);
          font-size: var(--sub-title-font-size);
          .sub-title-inner {
            background: linear-gradient(
                0deg,
                #f6ed7e 0%,
                #f6ed7d 13%,
                transparent 13%
              )
              0 calc(var(--font-size) * -0.12);
            padding: 0 5px;
          }
        }
        .main-title {
          color: #4a609a;
        }
        // 译者信息
        &::after {
          position: absolute;
          bottom: calc(-8px - min(var(--font-size, 2rem), 16px));
          left: 0;
          width: 100%;
          content: attr(data-translator);
          color: white;
          font-weight: 400;
          font-size: min(var(--font-size), 16px);
          text-shadow: $text-outline;
        }
      }
    }
  }

  .place-translator-container {
    top: calc(10% + 16px + var(--padding-size) * 4 / 0.6) !important;
  }

  .place-container {
    --font-size: 1rem;
    --padding-size: calc(var(--font-size) / 2);
    position: absolute;
    top: 10%;
    left: 0;
    opacity: 0;
    z-index: $text-layer-z-index + $place-z-index;
    color: white;
    .round-place {
      position: relative;
      padding: var(--padding-size) 3rem var(--padding-size) 1rem;
      line-height: var(--font-size);

      &:after {
        position: absolute;
        top: 0;
        left: -20px;
        transform: skewX(-20deg);
        z-index: -1;
        border-radius: 0 10px 10px 0;
        background-color: rgba(44, 65, 92, 0.7);
        width: 100%;
        height: 100%;
        content: "";
      }

      .place-content {
        padding-left: 10px;
        color: white;
        font-style: var(--font-size);
        font-size: var(--font-size);

        &:after {
          display: block;
          position: absolute;
          top: var(--padding-size);
          background-color: rgba(255, 255, 255, 0.3);
          width: 3px;
          height: calc(100% - var(--font-size));
          content: "";
        }
      }
    }
  }

  .st-container {
    z-index: $text-layer-z-index + $st-z-index;
    color: white;
    text-shadow: $text-outline;
  }

  .fade-in-out {
    animation: fade-in-out 3s;
  }
}

@keyframes fade-in-out {
  0% {
    opacity: 0;
  }

  25% {
    opacity: 1;
  }

  75% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.next-episode-container {
  z-index: $text-layer-z-index + $next-episode-z-index;
  pointer-events: none;

  .next-episode-cover {
    display: block;
    background-color: black;
    width: 100%;
    height: 50%;

    &:first-child {
      transform: translateY(-100%);
    }

    &:last-child {
      transform: translateY(100%);
    }
  }
}

.to-be-continued-container {
  z-index: $text-layer-z-index + $to-be-continue-z-index;
  pointer-events: none;

  .to-be-continued-bg0,
  .to-be-continued-bg1 {
    opacity: 0;
    width: 100%;
    height: 100%;
  }

  .to-be-continued-bg0 {
    background: #545454;
  }

  .to-be-continued-bg1 {
    transform: translateY(-100%);
    background: radial-gradient(
      #808080,
      #808080 30%,
      #545454 65%,
      #545454 100%
    );
  }

  .to-be-continued {
    position: absolute;
    right: -150px;
    bottom: 20px;
    opacity: 0;
    color: white;
    text-shadow: $text-outline;
  }
}

.image-video-container {
  z-index: $text-layer-z-index + $image-video-z-index;

  .image-video-container-inner {
    position: relative;
    width: 100%;
    height: 100%;

    .image-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .image {
        transform: translateY(10%);
        height: 70%;
        object-fit: contain;
      }
    }
  }
}

.loading-container {
  z-index: $text-layer-z-index + $loading-z-index;
  background-color: black;
  .loading-image {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    object-fit: contain;
  }
  .loading-log {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    text-align: right;
    .loading-log-item {
      color: grey;
    }
    // .loading-log-item-success {
    // }
    .loading-log-item-error {
      color: #ff3a30;
    }
  }
}

.absolute-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
