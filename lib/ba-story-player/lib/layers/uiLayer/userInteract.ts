import eventBus from "@/eventBus";
import { eventEmitter, storyHandler } from "@/index";
import { usePlayerStore } from "@/stores";

const keyStatus = {} as any;

// 进行下一步的定时器
let nexting: any;
function clearNextInterval() {
  if (nexting) {
    clearInterval(nexting);
    storyHandler.isSkip = false;
  }
}
const keyEvent = (e: KeyboardEvent) => {
  keyStatus[e.key] = true;
  if (Object.values(keyStatus).filter(i => i).length >= 2) {
    return;
  }
  // 显示历史 log 不允许操作
  if (eventEmitter.isStoryLogShow || !isPlayerFocus()) {
    return;
  }
  switch (e.key) {
    case "Enter":
    case " ":
      if (!nexting) {
        interactNext();
        nexting = setInterval(() => {
          interactNext();
        }, 1000);
      }
      break;
    case "ArrowUp":
      eventBus.emit("showStoryLog", true);
      break;
    case "Control":
      // 限流
      storyHandler.isSkip = true;
      if (!nexting) {
        interactNext();
        nexting = setInterval(() => {
          eventBus.emit("skipping");
          interactNext();
        }, 200);
      }
  }
};
const keyUpEvent = (e: KeyboardEvent) => {
  keyStatus[e.key] = false;
  clearInterval(nexting);
  nexting = undefined;
  switch (e.key) {
    case "Control":
      storyHandler.isSkip = false;
  }
};

const wheelEvent = (e: WheelEvent & { [key: string]: any }) => {
  const delta = e.wheelDelta ? e.wheelDelta : -e.detail;
  if (eventEmitter.isStoryLogShow || !isPlayerFocus()) {
    return;
  }
  if (delta >= 0) {
    eventBus.emit("showStoryLog", true);
  } else {
    interactNext();
  }
};

eventBus.on("loaded", () => {
  document.addEventListener("keydown", keyEvent);
  document.addEventListener("keyup", keyUpEvent);
  document.addEventListener("focusout", clearNextInterval);
  document
    .querySelector("#player")
    ?.addEventListener("wheel", wheelEvent as any);
});
eventBus.on("dispose", () => {
  document.removeEventListener("keydown", keyEvent);
  document.removeEventListener("keyup", keyUpEvent);
  document.removeEventListener("focusout", clearNextInterval);
  document
    .querySelector("#player")
    ?.removeEventListener("wheel", wheelEvent as any);
});

function getLastDataFromIndex(index: number) {
  const allStory = usePlayerStore().allStoryUnit;
  const recentStory = allStory.slice(0, index + 1).reverse();
  const lastCharacterIdx = recentStory.findIndex(currentStoryUnit => {
    return currentStoryUnit.characters?.length;
  });
  const lastCharacter = recentStory[lastCharacterIdx];
  const characters = lastCharacter?.characters || [];
  if (lastCharacter) {
    // 拼装人物层展示情况
    recentStory.slice(lastCharacterIdx + 1).some(story => {
      if (story.characters?.length) {
        const filterSamePosition = story.characters.filter(character => {
          return !characters.find(j => j.position === character.position);
        });
        filterSamePosition.forEach(character => {
          character.highlight = false;
          character.effects = [];
        });
        characters.push(...filterSamePosition);
      }
      return story.hide === "all";
    });
  }
  const lastBg = recentStory.find(currentStoryUnit => {
    return currentStoryUnit.bg;
  });
  const lastBgm = recentStory.find(currentStoryUnit => {
    return currentStoryUnit.audio?.bgm;
  });
  return { lastBg, lastBgm, lastCharacter };
}

export const changeStoryIndex = (index?: number | string) => {
  if (!["string", "number"].includes(typeof index)) {
    return;
  }

  if ("string" === typeof index && Number.isInteger(Number(index))) {
    index = Number(index);
  }

  // 不允许跳到最后
  if (index >= usePlayerStore().allStoryUnit.length - 1) {
    return;
  }
  index -= 1;
  if (index < 0) {
    index = 0;
  }
  const currentUnit = usePlayerStore().stackStoryUnit[index];
  eventBus.emit("removeEffect");
  eventBus.emit("hideCharacter");
  function next() {
    eventBus.off("characterDone", next);
    eventBus.emit("next");
  }
  setTimeout(() => {
    // 在 hideCharacter 后触发
    eventBus.on("characterDone", next);
    eventEmitter.showCharacter(currentUnit);
  }, 4);
  eventEmitter.playAudio(currentUnit);
  eventEmitter.showBg(currentUnit).then(() => {
    storyHandler.currentStoryIndex = index ?? 0;
  });
};

function interactNext() {
  const currentStoryUnit = storyHandler.currentStoryUnit;
  if (
    currentStoryUnit?.textAbout?.options ||
    (currentStoryUnit?.textAbout?.titleInfo &&
      currentStoryUnit.type !== "place") ||
    eventEmitter.l2dPlaying ||
    currentStoryUnit.l2d
  ) {
    console.log("不允许下一步", storyHandler.currentStoryUnit);
    return;
  }
  eventBus.emit("next");
}
function isPlayerFocus() {
  return document.activeElement?.className.includes("baui");
}
function focusPlayer() {
  // 选择后继续能跳过
  (document.querySelector(".baui") as any).focus();
}
eventBus.on("select", () => {
  focusPlayer();
});
eventBus.on("isStoryLogShow", e => {
  // 选择后继续能跳过
  !e && focusPlayer();
});
