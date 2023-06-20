import { Ref } from "vue";
import { Spine } from "pixi-spine";
import useStoryStore from "@/views/Editor/tools/store";
import { InternalStoryUnit, StoryRawUnit, StoryUnitType } from "@/views/Editor/tools/types";
import { StoryRawUnitGeneratorMap } from "@/views/Editor/tools/storyUnitMap";

export function buildDefaultStoryRawUnit(
  override: Partial<Omit<StoryRawUnit, "type">> & Required<Pick<StoryRawUnit, "type">>,
): StoryRawUnit {
  return {
    BGEffect: 0,
    BGMId: 0,
    BGName: 0,
    GroupId: 0,
    PopupFileName: "",
    ScriptKr: "",
    SelectionGroup: 0,
    Sound: "",
    TextJp: "",
    Transition: 0,
    VoiceJp: "",
    ...override,
  };
}

export function deleteStoryUnit(index: number) {
  const store = useStoryStore();
  store.deleteStoryUnit(index);
}

export function inspectFormData<K extends StoryUnitType>(
  type: K,
  deps: Parameters<(typeof StoryRawUnitGeneratorMap)[K]["internal"]>,
  index: Ref<number>,
  customStoryBuilder?: () => PromiseLike<StoryRawUnit>,
  customInternalStoryBuilder?: () => PromiseLike<InternalStoryUnit>,
) {
  const store = useStoryStore();
  const defaultStoryBuilder = StoryRawUnitGeneratorMap[type].raw;
  const defaultInternalStoryBuilder = StoryRawUnitGeneratorMap[type].internal;
  debouncedWatch(
    deps,
    () => {
      if (customStoryBuilder) {
        customStoryBuilder().then((data) => {
          store.updateStoryUnit(data, index.value);
        });
      } else {
        // @ts-ignore
        const override: Partial<Omit<StoryRawUnit, "type">> & Required<Pick<StoryRawUnit, "type">> = {};
        Object.keys(defaultStoryBuilder).forEach((key) => {
          const fn = Reflect.get(defaultStoryBuilder, key);
          Reflect.set(override, key, fn.apply(defaultStoryBuilder, deps));
        });
        store.updateStoryUnit(
          buildDefaultStoryRawUnit({
            ...override,
            type,
          }),
          index.value,
        );
      }
      if (customInternalStoryBuilder) {
        customInternalStoryBuilder().then((data) => {
          store.updateInternalStoryUnit(data, index.value);
        });
      } else {
        // @ts-ignore
        const data = defaultInternalStoryBuilder(...deps) as InternalStoryUnit;
        store.updateInternalStoryUnit(data, index.value);
      }
    },
    { deep: true, debounce: 1000, maxWait: 3000 },
  );
}

/**
 * 从
 *
 * https://github.com/sanmusen214/arisstudio-blockly/blob/a116d44c0a4eaa9a42c548dcc836c94e3ef17e71/src/renderer/components/tabmenu/SprTab.js#LL109C4-L109C4
 *
 * 扣过来的计算face react的方法
 *
 * 未测试
 * @param spine
 */
export function calcFaceReact(spine: Spine) {
  // 找到默认表情, 如果没有说明不是正常的立绘
  const defaultAnimation = spine.spineData.animations.find((it) => it.name === "00");
  if (!defaultAnimation) {
    return undefined;
  }
  // @ts-ignore
  const deformTimeline = defaultAnimation.timelines.find((it) => it.attachment);
  // @ts-ignore
  if (!deformTimeline || !deformTimeline.attachment.name) {
    return undefined;
  }
  // @ts-ignore
  const slotName = deformTimeline.attachment.name;
  const slot = spine.skeleton.slots.find((it) => it.data.name === slotName);
  if (!slot) {
    return undefined;
  }
  const hullpos: [number, number][] = [];
  const attachment = slot.getAttachment();
  // @ts-ignore
  const vertices = new Float32Array(attachment.vertices.length);
  // @ts-ignore
  // eslint-disable-next-line no-bitwise
  const hullLength = (attachment.hullLength >> 1) * 2;
  // @ts-ignore
  attachment.computeWorldVertices(slot, 0, attachment.worldVerticesLength, vertices, 0, 2);
  const lastX = vertices[hullLength - 2];
  const lastY = vertices[hullLength - 1];
  hullpos.push([lastX, lastY]);
  for (let ii = 0, nn = hullLength; ii < nn; ii += 2) {
    const x = vertices[ii];
    const y = vertices[ii + 1];
    hullpos.push([x, y]);
  }
  const xList = hullpos.map((each) => {
    return each[0];
  });
  const yList = hullpos.map((each) => {
    return each[1];
  });
  const viewPad = 50;
  return {
    x: Math.min(...xList) - viewPad,
    y: Math.min(...yList) - viewPad,
    width: Math.max(...xList) - Math.min(...xList) + 2 * viewPad,
    height: Math.max(...yList) - Math.min(...yList) + 2 * viewPad,
  };
}
