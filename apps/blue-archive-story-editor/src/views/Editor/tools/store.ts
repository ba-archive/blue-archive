import { defineStore } from "pinia";
import { BGNameExcelTableItem, CharacterNameExcelTableItem } from "ba-story-player/dist/lib/types/excels";
import { StoryStoreState, StoryRawUnit, InternalStoryUnit } from "@/views/Editor/tools/types";
import { buildDefaultStoryRawUnit } from "@/views/Editor/tools/index";
import { ActualBaseExcelTable, ExcelTableType } from "@/types";
import StoryApi from "@/views/Editor/tools/api";

const useStoryStore = defineStore({
  id: "story",
  state: (): StoryStoreState => ({
    story: [],
    internalStory: [],
  }),
  actions: {
    insertStoryUnit(unit: StoryRawUnit) {
      this.story.push(unit);
    },
    updateStoryUnit(unit: StoryRawUnit, index: number) {
      return this.story.splice(index, 1, unit);
    },
    deleteStoryUnit(index: number) {
      this.story.splice(index, 1);
      this.normalizeStoryUnit();
    },
    insertInternalStoryUnit(unit: InternalStoryUnit) {
      this.internalStory.push(unit);
    },
    updateInternalStoryUnit(unit: InternalStoryUnit, index: number) {
      return this.internalStory.splice(index, 1, unit);
    },
    deleteInternalStoryUnit(index: number) {
      this.internalStory.splice(index, 1);
      this.normalizeStoryUnit();
    },
    normalizeStoryUnit() {
      if (this.story.length === 0) {
        this.insertStoryUnit(buildDefaultStoryRawUnit({ type: "title" }));
        this.insertInternalStoryUnit({ type: "title", title: "", subTitle: "" });
      }
    },
    clearCache() {
      this.story = [];
      this.internalStory = [];
      this.normalizeStoryUnit();
    },
    updateInternalIndex(newIndex: number, oldIndex: number) {
      const cache = this.internalStory.splice(oldIndex, 1);
      this.internalStory.splice(newIndex, 0, ...cache);
    },
  },
  persist: {
    key: "story",
    afterRestore(ctx) {
      const store = ctx.store as ReturnType<typeof useStoryStore>;
      store.normalizeStoryUnit();
    },
  },
});

type IExcelTableLoaderA<type extends ExcelTableType> = {
  load: () => Promise<ActualBaseExcelTable[type]>;
  loading?: boolean;
  loaded?: boolean;
  cbList?: ((data: ActualBaseExcelTable[type]) => unknown)[];
};

type IExcelTableLoader = {
  [type in ExcelTableType]: IExcelTableLoaderA<type>;
};

const ExcelTableLoader: IExcelTableLoader = {
  background: {
    load: () => StoryApi.fetchBackgroundNameExcelTable(),
  },
  character: {
    load: () => StoryApi.fetchCharacterNameExcelTable(),
  },
};

// @ts-ignore
export const ExcelTable: {
  [key in keyof ActualBaseExcelTable]: Promise<ActualBaseExcelTable[key]>;
} = new Proxy(
  {
    background: new Map<number, BGNameExcelTableItem>(),
    character: new Map<number, CharacterNameExcelTableItem>(),
  },
  {
    get(target, p) {
      const res = Reflect.get(target, p) as Map<unknown, unknown>;
      const state = Reflect.get(ExcelTableLoader, p) as IExcelTableLoaderA<never>;
      if (!state.loaded) {
        if (!state.loading) {
          state.loading = true;
          state.load().then((data) => {
            Reflect.set(target, p, data);
            state.loaded = true;
            (state.cbList || []).forEach((fn) => {
              fn(data);
            });
          });
        }
        return new Promise<unknown>((resolve) => {
          if (state.cbList) {
            state.cbList.push(resolve);
          } else {
            state.cbList = [resolve];
          }
        });
      }
      return Promise.resolve(res);
    },
  },
);

export default useStoryStore;
