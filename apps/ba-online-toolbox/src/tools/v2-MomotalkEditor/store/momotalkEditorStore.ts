import { defineStore } from "pinia";
import type { FileContent, Language, Title, Content } from "../types/Momotalks";
import { omit } from "radashi";

// composition API 会导致 persistedstate 不能持久化存储
export const momotalkEditorStore = defineStore("momotalk-editor", {
  state: () => ({
    momotalkFileData: null as FileContent | null,
    filename: "",
    defaultTranslator: "",
    defaultProofreader: "",
    selectedTranslation: "Jp" as Language,
    targetTranslation: "Cn" as Language,
    isProofreaderMode: false,
    isDownloaded: false,
  }),

  getters: {
    getMomotalkFileData: state => state.momotalkFileData,
    getFilename: state => state.filename,
    getTranslator: state =>
      state.momotalkFileData?.translator || state.defaultTranslator,
    getProofreader: state =>
      state.momotalkFileData?.proofreader || state.defaultProofreader,
    getMomotalkTitle: state => state.momotalkFileData?.title ?? [],
    getSplittedMomotalk: state => state,
    getSelectedTranslation: state => state.selectedTranslation,
    getTargetTranslation: state => state.targetTranslation,
    getProofreaderMode: state => state.isProofreaderMode,

    getMomotalkFromScheduleId: state => (scheduleId: string | number) => {
      const msgList = state.momotalkFileData?.content || [];
      const favorSchedule = parseInt((scheduleId + "").slice(5));
      if (!favorSchedule) return [];
      const scheduleIndex = msgList.findIndex(
        el => el.ConditionValue == favorSchedule
      );
      let i = scheduleIndex + 1;
      while (i < msgList.length) {
        if (msgList[i].ConditionValue != 0) {
          break;
        }
        i++;
      }
      return msgList.slice(scheduleIndex, i);
    },

    getDownloadReadyFileData: state => (isProofreaded: boolean) => {
      const { momotalkFileData: preparedData } = state;
      if (isProofreaded) {
        // 过滤掉 unsure flag
        preparedData!.title = preparedData!.title.map(el =>
          omit(el, ["unsure"])
        );
        preparedData!.content = preparedData!.content.map(el =>
          omit(el, ["unsure"])
        );
      }
      return preparedData;
    },
    getIsDownloaded: state => state.isDownloaded,
  },

  actions: {
    setMomotalkFileData(data: FileContent) {
      this.momotalkFileData = data;
    },
    setFilename(filename: string) {
      this.filename = filename;
    },
    setTranslator(translator: string) {
      this.defaultTranslator = translator;
      this.momotalkFileData!.translator = translator;
    },
    setProofreader(proofreader: string) {
      this.defaultProofreader = proofreader;
      this.momotalkFileData!.proofreader = proofreader;
    },
    setSelectedTranslation(translation: Language) {
      this.selectedTranslation = translation;
    },
    setTargetTranslation(translation: Language) {
      this.targetTranslation = translation;
    },
    setProofreaderMode(mode: boolean) {
      this.isProofreaderMode = mode;
    },
    setMessage(messageUnit: Content) {
      const msgIdx =
        this.momotalkFileData?.content.findIndex(
          el => el.Id == messageUnit.Id
        ) ?? -1;
      if (msgIdx > -1) {
        this.momotalkFileData!.content[msgIdx] = messageUnit;
      }
    },
    reset() {
      this.momotalkFileData = null;
      this.filename = "";
      this.isProofreaderMode = false;
    },
    setIsDownloaded(isDownloaded: boolean) {
      this.isDownloaded = isDownloaded;
    },
  },
  persist: {
    storage: localStorage,
    pick: [
      "momotalkFileData",
      "filename",
      "defaultTranslator",
      "defaultProofreader",
      "selectedTranslation",
      "targetTranslation",
      "isProofreaderMode",
    ],
  },
});
