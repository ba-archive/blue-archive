<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import NodePlayer, { PIXIHeight } from "./playerSubModules/nodePlayer";
import StoryManager from "./playerSubModules/storyManager";
import resourceManager, {
  setDataUrl,
} from "./playerSubModules/recourageManager";
import { ResourceMap, StoryNode, Ii8nString } from "./type";
import ShowDialog from "./playerSubLayers/showLayer/ShowDialog.vue";
const props = defineProps<{
  storyNodes: StoryNode[];
  dataUrl: string;
  height: number;
  width: number;
  language: keyof Ii8nString;
  endCallback: () => void;
}>();
setDataUrl(props.dataUrl);
const pixiWidth = computed(() => (PIXIHeight * props.width) / props.height);
const nodePlayer = new NodePlayer(pixiWidth.value);
nodePlayer.handlerMap.getResources = <T extends keyof ResourceMap>(
  type: T,
  key: ResourceMap[T]["key"]
) => resourceManager.getResource(type, key);
const language = ref(props.language);
nodePlayer.serversInstance.show.language = language;
watch(
  () => props.language,
  newVal => {
    language.value = newVal;
  }
);

const playerStyle = computed(() => {
  return {
    height: `${props.height}px`,
    width: `${props.width}px`,
  };
});

const currentStoryIndex = ref(0);
const auto = ref(false);
const autoTimeoutMs = ref(1500);
const currentStoryNode = computed(() => {
  if (
    currentStoryIndex.value >= 0 &&
    currentStoryIndex.value < props.storyNodes.length
  ) {
    return props.storyNodes[currentStoryIndex.value];
  } else {
    return props.storyNodes[props.storyNodes.length - 1];
  }
});
const storyManager = new StoryManager(
  () => props.storyNodes,
  nodePlayer,
  currentStoryIndex,
  currentStoryNode,
  auto,
  autoTimeoutMs,
  error => {
    console.error(error);
  }
);
const pixiCanvas = ref<HTMLDivElement>();

const pixiScale = computed(
  //比实际放大一点放置并隐藏解决缩放不精确的问题
  () => `scale(${(props.height + 1) / PIXIHeight})`
);

if (import.meta.env.DEV) {
  Reflect.set(window, "nodePlayer", nodePlayer);
  Reflect.set(window, "StoryManager", storyManager);
  Reflect.set(window, "ResourceManager", resourceManager);
}
defineExpose({ storyManager, nodePlayer });
onMounted(async () => {
  nodePlayer.mouted(pixiCanvas.value as HTMLDivElement);
  await resourceManager.load(props.storyNodes);
  storyManager.play();
});
onUnmounted(() => {
  nodePlayer.unMounted();
});

const emits = defineEmits(["loaded"]);
watch(
  () => props.storyNodes,
  async newVal => {
    await resourceManager.load(newVal);
    emits("loaded");
  }
);
</script>

<template>
  <div @click="storyManager.next" class="player" :style="playerStyle">
    <div ref="pixiCanvas"></div>
    <ShowDialog
      :text-layer-instance="nodePlayer.serversInstance.show"
      :current-story-node="currentStoryNode"
    ></ShowDialog>
  </div>
</template>

<style scoped lang="scss">
.player {
  position: relative;
  overflow: hidden;
}
</style>

<style lang="scss">
.player {
  canvas {
    transform-origin: top left;
    transform: v-bind(pixiScale);
  }
}
</style>
