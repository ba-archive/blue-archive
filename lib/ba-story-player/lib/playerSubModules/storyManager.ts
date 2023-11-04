import { StoryNode } from "../type";
import NodePlayer from "./nodePlayer";
import { ComputedRef, Ref } from "vue";
import { waitMs } from "../utils";

export default class StoryManager {
  currentStoryIndex: Ref<number>;
  currentStoryNode: ComputedRef<StoryNode>;
  storyNodes: StoryNode[];
  nodePlayer: NodePlayer;
  state: "playing" | "done";
  auto: Ref<boolean>;
  autoTimeOutMs = 1500;
  errorCallback: () => void;
  constructor(
    storyNodes: StoryNode[],
    nodePlayer: NodePlayer,
    currentStoryIndex: Ref<number>,
    currentStoryNode: ComputedRef<StoryNode>,
    auto: Ref<boolean>,
    errorCallback: () => void
  ) {
    this.currentStoryIndex = currentStoryIndex;
    this.storyNodes = storyNodes;
    this.nodePlayer = nodePlayer;
    this.currentStoryNode = currentStoryNode;
    this.errorCallback = errorCallback;
    this.state = "done";
    this.auto = auto;
  }
  async next() {
    if (this.state !== "playing") {
      this.currentStoryIndex.value = this.currentStoryNode.value.nextNodeIndex;
      if (this.currentStoryNode.value.nextNodeIndex === -1) {
        this.auto.value = false;
        return;
      }
      await this.play();
    }
  }

  async play() {
    this.state = "playing";
    try {
      await this.nodePlayer.playNode(this.currentStoryNode.value);
    } catch (error) {
      this.errorCallback();
    }

    this.state = "done";
    if (this.auto.value) {
      await waitMs(this.autoTimeOutMs);
      if (this.auto.value && this.currentStoryNode.value.ui.option) {
        this.next();
      }
    }
  }
  select(selectIndex: number) {
    this.currentStoryIndex.value = selectIndex;
    this.play();
  }
  async switch(index: number) {
    await this.nodePlayer.stop();
    this.currentStoryIndex.value = index;
    this.play();
  }
}
