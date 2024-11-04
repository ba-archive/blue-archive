import { defineStore } from "pinia";
import { Language } from "../types/content";
import { Student } from "../../../../../blue-archive-story-viewer/src/types/Student";

export const useGlobalConfig = defineStore({
  id: "globalConfig",
  persist: true,
  state: () => ({
    proofread: false,
    selectLine: 0,
    language: "TextJp" as Language,
    targetLang: "TextCn" as Language,
    tmpMachineTranslate: {} as { [key: string]: string },
    switchLanguage: 0b11,
    showAllLanguage: true,
    selectTag: "[wa:]",
    previewMode: false,
    students: [] as Student[],
    preferSemanticsView: true,
    modelStability: 0.6,
    systemPromptDelta: "",
  }),
  getters: {
    isProofread: state => state.proofread,
    getSelectLine: state => state.selectLine,
    getLanguage: state => state.language,
    getTargetLang: state => state.targetLang,
    /* eslint-disable indent */
    getTmpMachineTranslate:
      state =>
      (query = "") => {
        const objectType = Object.prototype.toString.call(
          state.tmpMachineTranslate
        );
        switch (objectType) {
          case "[object Object]":
            return state.tmpMachineTranslate?.[query] || "";
          case "[object String]":
            return state.tmpMachineTranslate as unknown as string;
          default:
            return "";
        }
      },
    /* eslint-enable indent */
    isSwitchLanguage: state => state.switchLanguage,
    getSelectTag: state => state.selectTag,
    getShowAllLanguage: state => state.showAllLanguage,
    getPreviewMode: state => state.previewMode,
    getStudentList: state => state.students,
    getSemanticPreference: state => state.preferSemanticsView ?? false,
    getModelStability: state => state.modelStability ?? 0.6,
    getSystemPromptDelta: state => state.systemPromptDelta ?? "",
  },
  actions: {
    startProofread() {
      this.proofread = true;
    },
    stopProofread() {
      this.proofread = false;
    },
    changeLanguage() {
      if (this.switchLanguage === 0b11) {
        this.switchLanguage = 0b01;
      } else {
        this.switchLanguage++;
      }
    },
    setSelectTag(tag: string) {
      this.selectTag = tag;
    },
    setProofread(proofread: boolean) {
      this.proofread = proofread;
    },
    setSelectLine(line: number) {
      this.selectLine = line;
    },
    setTmpMachineTranslate(origin: string, text: string) {
      const mapType = Object.prototype.toString.call(this.tmpMachineTranslate);
      if (mapType !== "[object Object]") {
        this.tmpMachineTranslate = {};
      }
      this.tmpMachineTranslate[origin] = text;
    },
    setLanguage(language: Language) {
      this.language = language;
    },
    setTargetLang(targetLang: Language) {
      this.targetLang = targetLang;
    },
    initialize_state() {
      this.proofread = false;
      this.selectLine = -1;
      this.previewMode = false;
    },
    initialize_config() {
      this.language = "TextJp";
      this.targetLang = "TextCn";
    },
    setShowAllLanguage(showAllLanguage: boolean) {
      this.showAllLanguage = showAllLanguage;
    },
    setPreviewMode(previewMode: boolean) {
      this.previewMode = previewMode;
    },
    resetConfigState() {
      this.initialize_config();
      this.initialize_state();
    },
    resetTmpTranslation() {
      this.tmpMachineTranslate = {};
    },
    setStudents(students: Student[]) {
      this.students = students;
    },
    setSemanticPreference(preference: boolean) {
      this.preferSemanticsView = preference;
    },
    setModelStability(modelStability: number) {
      this.modelStability = modelStability;
    },
    setSystemPromptDelta(systemPromptDelta: string) {
      this.systemPromptDelta = systemPromptDelta;
    },
  },
});
