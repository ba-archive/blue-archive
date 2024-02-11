import { StoryNode } from "../type";
import NodePlayer from "./nodePlayer";
import { ComputedRef, Ref } from "vue";
import { waitMs } from "../utils";

export default class StoryManager {
  currentStoryIndex: Ref<number>;
  currentStoryNode: ComputedRef<StoryNode>;
  storyNodes: () => StoryNode[];
  nodePlayer: NodePlayer;
  nodeState: "unplay" | "played" = "played";
  storyState: "playing" | "stop" = "stop";
  auto: Ref<boolean>;
  autoTimeOutMs: Ref<number>;
  errorCallback: (error: unknown) => void;
  constructor(
    storyNodes: () => StoryNode[],
    nodePlayer: NodePlayer,
    currentStoryIndex: Ref<number>,
    currentStoryNode: ComputedRef<StoryNode>,
    auto: Ref<boolean>,
    autoTimeOutMs: Ref<number>,
    errorCallback: (error: unknown) => void
  ) {
    this.currentStoryIndex = currentStoryIndex;
    this.storyNodes = storyNodes;
    this.nodePlayer = nodePlayer;
    this.currentStoryNode = currentStoryNode;
    this.errorCallback = errorCallback;
    this.auto = auto;
    this.autoTimeOutMs = autoTimeOutMs;
  }
  next() {
    if (
      this.nodeState !== "unplay" &&
      this.currentStoryNode.value.nextNodeIndex !== -1
    ) {
      this.currentStoryIndex.value = this.currentStoryNode.value.nextNodeIndex;
      this.nodeState = "unplay";
    }
  }

  async play() {
    this.storyState = "playing";
    this.nodeState = "unplay";
    const playFunction = async () => {
      if (this.storyState === "playing") {
        if (this.nodeState === "played") {
          window.requestIdleCallback(playFunction);
          if (import.meta.env.DEV) {
            this.auto.value = false;
          }
          return;
        }
        try {
          await this.nodePlayer.playNode(this.currentStoryNode.value);
        } catch (error) {
          this.errorCallback(error);
        }
        this.nodeState = "played";
        if (this.auto.value && !this.currentStoryNode.value.ui.option) {
          await waitMs(this.autoTimeOutMs.value);
          this.next();
        }
        window.requestAnimationFrame(playFunction);
      } else {
        return;
      }
    };
    window.requestAnimationFrame(playFunction);
  }

  async stop() {
    await this.nodePlayer.stop();
    this.storyState = "stop";
  }
  select(selectIndex: number) {
    if (selectIndex === -1) {
      throw new Error("index不合法");
    }
    if (this.nodeState === "played") {
      this.currentStoryIndex.value = selectIndex;
    }
  }
  async switch(index: number) {
    if (index === -1) {
      throw new Error("index不合法");
    }
    await this.nodePlayer.stop();
    this.nodeState = "played";
    this.currentStoryIndex.value = index;
    this.nodeState = "unplay";
    if (this.storyState === "stop") {
      this.play();
    }
  }
}
